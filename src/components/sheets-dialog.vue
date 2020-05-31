<template>
<el-dialog title="Paftalar" :visible.sync="show">
  <span v-if="sheetLayers.length > 0">
    <el-table :data="sheetLayers" style="width: 100%">
      <el-table-column prop="sheet.name" label="Pafta Adı"></el-table-column>      
      <el-table-column prop="sheet.scale" label="Ölçek" width="150">
        <template slot-scope="scope">
          {{'1:' + scope.row.sheet.scale + '.000' }}
        </template>
      </el-table-column>
      <el-table-column width="70">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Sil</el-button>
        </template>
    </el-table-column>
    </el-table>
  </span>  
  <span class="mx-auto" v-else>
    Henüz sorgulanmış bir pafta veya açılmış bir proje yok.
  </span>
  <span slot="footer" class="dialog-footer">
    <span v-if="project.projectId" class="mr-3">
      Proje Adı: {{project.name}}
    </span>
    <el-button icon="el-icon-edit" v-if="project.projectId" @click="handleSaveWithNewName" class="mr-2"></el-button>
    <el-dropdown v-if="sheetLayers.length > 0" split-button @command="handleExport" class="mr-2">
      Dışarı Aktar
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="kml">KML</el-dropdown-item>
        <el-dropdown-item command="geojson">GeoJSON</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button v-if="sheetLayers.length > 0" @click="handleSave">Kaydet</el-button>
  </span>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Dialog, Button, Table, TableColumn, Dropdown, DropdownMenu, DropdownItem, MessageBox } from 'element-ui';
import Project from '@/models/project';
import SheetLayer from '../models/sheet-layer';
import { MessageBoxInputData } from 'element-ui/types/message-box';
import tokml from 'tokml';

@Component({
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
  },
})
export default class SheetsDialog extends Vue {
  @PropSync('showDialog', { type: Boolean, default: false }) private show!: boolean;
  @Prop({default: []}) private sheetLayers!: SheetLayer[];
  @Prop() private project!: Project;

  private handleDelete(sheetLayer: SheetLayer): void {
    this.$emit('delete', sheetLayer);
  }

  private handleExport(type: string): void {
    const sheetsGeoJson: any = this.sheetLayers[0].layerGroup.toGeoJSON();
    this.findAndSetPolygonName(sheetsGeoJson.features, this.sheetLayers[0].sheet.name);
    for (let i = 1; i < this.sheetLayers.length; i++) {
      const geojsonSheet: any = this.sheetLayers[i].layerGroup.toGeoJSON();
      this.findAndSetPolygonName(geojsonSheet.features, this.sheetLayers[i].sheet.name);
      sheetsGeoJson.features.push(...geojsonSheet.features);
    }
    if (type === 'geojson') {
      this.download('GU-PaftaBulucu.json', JSON.stringify(sheetsGeoJson));
    } else {
      this.download('GU-PaftaBulucu.kml', tokml(sheetsGeoJson));
    }
  }

  private findAndSetPolygonName(features: any, name: string): void {
    const polygon = features.find((f: any) => f.geometry.type === 'Polygon');
    if (polygon) {
      polygon.properties.Name = name;
    }
  }

  private download(filename: string, content: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  private handleSave(): void {
    if (this.project.projectId) {
      this.$emit('save');
    } else {
      MessageBox.prompt('Proje ismi girin', 'Yeni Proje Kaydet', {
          confirmButtonText: 'Kaydet',
          cancelButtonText: 'İptal',
        }).then((data) => this.$emit('save', (data as MessageBoxInputData).value)).catch((_) => _);
    }
  }

  private handleSaveWithNewName(): void {
    MessageBox.prompt('Yeni proje ismi girin', 'Proje İsmi Değiştir', {
          confirmButtonText: 'Kaydet',
          cancelButtonText: 'İptal',
        }).then((data) => this.$emit('save', (data as MessageBoxInputData).value)).catch((_) => _);
  }
}
</script>
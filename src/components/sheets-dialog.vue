<template>
<el-dialog title="Paftalar" :visible.sync="show" width="30%">
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
    <el-button v-if="project.projectId" @click="handleSaveWithNewName">Yeni İsimle Kaydet</el-button>
    <el-button v-if="sheetLayers.length > 0" @click="handleSave">Kaydet</el-button>
  </span>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Dialog, Button, Table, TableColumn, MessageBox } from 'element-ui';
import Project from '@/models/project';
import SheetLayer from '../models/sheet-layer';
import { MessageBoxInputData } from 'element-ui/types/message-box';

@Component({
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
})
export default class SheetsDialog extends Vue {
  @PropSync('showDialog', { type: Boolean, default: false }) private show!: boolean;
  @Prop({default: []}) private sheetLayers!: SheetLayer[];
  @Prop() private project!: Project;

  private handleDelete(sheetLayer: SheetLayer) {
    this.$emit('delete', sheetLayer);
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
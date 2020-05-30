<template>
<el-dialog title="Ayarlar" :visible.sync="show">
  <span>
    <span class="h6 border-bottom d-block w-75 pb-1">Pafta Köşe Koordinatları Gösterimi:</span>
    <el-form class="mt-4" label-position="left" label-width="130px">
      <el-form-item label="Koordinat Sistemi: ">
        <el-radio-group v-model="settings.sheetCorner.coordinateSystem">
          <el-radio-button label="wgs84">WGS-84</el-radio-button>
          <el-radio-button label="utm">UTM</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Dilim Genişliği: " v-show="settings.sheetCorner.coordinateSystem == 'utm'">
        <el-radio-group v-model="settings.sheetCorner.utmSpan">
          <el-radio-button :label="6">6°</el-radio-button>
          <el-radio-button :label="3">3°</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleSave">Kaydet</el-button>
  </span>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';
import { Dialog, Button, Form, FormItem, RadioButton, RadioGroup } from 'element-ui';
import Project from '@/models/project';
import SheetLayer from '../models/sheet-layer';
import { MessageBoxInputData } from 'element-ui/types/message-box';

@Component({
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
})
export default class SettingsDialog extends Vue {
  @PropSync('showDialog', { type: Boolean, default: false }) private show!: boolean;
  private settings: any = {
    sheetCorner: {
      coordinateSystem: 'wgs84',
      utmSpan: 6,
    },
  };

  private handleSave(): void {
    localStorage.setItem('settings', JSON.stringify(this.settings));
    this.show = false;
  }

  @Watch('show')
  private loadSettings(): void {
    const savedSetttings = localStorage.getItem('settings');
    if (savedSetttings) {
      this.settings = JSON.parse(savedSetttings);
    }
  }
}
</script>
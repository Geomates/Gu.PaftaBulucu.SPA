<template>
<el-dialog title="Haberdar Olun" :visible.sync="show">
  <span>
    <p>Uygulamamızla ilgili gelişmeleri e-posta adresinize bildirmemiz için listemize kayıt olun.</p>
    <el-form class="mt-4" label-position="left" label-width="130px">
      <el-form-item label="E-Posta Adresiniz: ">
        <el-input v-model="email"></el-input>
      </el-form-item>
    </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleSubmit">Gönder</el-button>
  </span>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';
import { Dialog, Button, Form, FormItem, Input, Notification } from 'element-ui';
import GuApiRestClient from '@/libraries/gu-api-client';

@Component({
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
  },
})
export default class SettingsDialog extends Vue {
  @PropSync('showDialog', { type: Boolean, default: false }) private show!: boolean;
  private email: string = '';
  private apiClient = new GuApiRestClient();

  private async handleSubmit(): Promise<void> {
    if (this.email.trim().length === 0) {
      Notification.error({
        title: 'Başarısız',
        message: 'Eksik e-posta adresi girdiniz!',
      });
      return;
    }
    try {
      const response = await this.apiClient.addSubscriber(this.email);
      this.show = false;
      Notification.info({
        title: 'Başarılı',
        message: 'Kaydınız başarıyla yapıldı.',
      });
    } catch (exception) {
      if (exception && exception.response && exception.response.data) {
        Notification.error({
          title: 'Başarısız',
          message: exception.response.data,
        });
      }
    }
  }

  @Watch('show')
  private reset(): void {
    this.email = '';
  }
}
</script>
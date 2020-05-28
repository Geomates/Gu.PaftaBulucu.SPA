<template>
<el-dialog title="Hakkında" :visible.sync="show">
  <span>
    <img class="d-block mx-auto mb-3" src="@/assets/logo.png"/>
    Bu uygulama Geomates ekibi tarafından Geomatik Uygulamalar'ın bir bileşeni olarak yeni nesil teknolojiler kullanılarak açık kaynak kodlu geliştirilmiştir.
    <br/><br/>
    <b>Özellikleri:</b>
    <br/>Pafta adına göre arama
    <br/>Koordinata göre arama
    <br/>Sonuçları harita üzerinde görebilme
    <br/>Birden fazla arama sonucunu aynı anda görebilme
    <br/>Aramaları proje olarak kaydedebilme
    <br/>ve her zaman ücretsiz!
    <br/><br/>
    <a href="http://geomatikuygulamalar.com/contact" target="blank">İletişim Formu</a>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">Kapat</el-button>
  </span>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Dialog, Button } from 'element-ui';

@Component({
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
  },
})
export default class AboutDialog extends Vue {
  @PropSync('showDialog', { type: Boolean, default: false }) private show!: boolean;
}
</script>
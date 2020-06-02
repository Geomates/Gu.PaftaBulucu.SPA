<template>
  <div class="container-fluid h-100">
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
      <img src="@/assets/small-logo.png" class="d-block mr-2"/>
      <router-link class="navbar-brand" to="/">Pafta Bulucu</router-link>
      <div class="navbar-nav">
        <a href="#" class="nav-link" @click="showAbout = true">Hakkında</a>
        <a href="#" class="nav-link" @click="showSettings = true" v-if="isAuthenticated">Ayarlar</a>
      </div>
      <div class="navbar-nav ml-auto">
        <a href="#" class="nav-link" @click="showProjects = true" v-if="isAuthenticated">Projeler</a>
        <a href="#" class="nav-link" @click="authProvider.logout()" v-if="isAuthenticated">Çıkış</a>
        <a href="#" class="nav-link" @click="login" v-if="!isAuthenticated && !isMobile">Oturum Aç</a>
      </div>
    </nav>
    <div class="row justify-content-center h-100 pt-5" v-if="!isMobile">
      <div class="col pt-2 pl-0 pr-0">
        <router-view/>
      </div>
    </div>
    <div class="row h-100" v-else>
      <div class="col-sm-12 my-auto text-center">
        Malesef uygulamamız mobil tarayıcılar ile uyumlu değil.<br/>
        Uygulamamızı <b>masaüstü tarayıcılar</b> ile kullanabilirsiniz.
        Mobil cihazlarda pafta sorgulamak için Pafta Bulucu'nun Telegram sohbet botunu kullanabilirsiniz; <a href="https://t.me/paftabulucubot">https://t.me/paftabulucubot</a>
      </div>
    </div>
    <ProjectsDialog :showDialog.sync="showProjects"/>
    <AboutDialog :showDialog.sync="showAbout"/>
    <SettingsDialog :showDialog.sync="showSettings"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProjectsDialog from './components/projects-dialog.vue';
import AboutDialog from './components/about-dialog.vue';
import SettingsDialog from './components/settings-dialog.vue';
import { eventHub } from '@/libraries/event-hub';
import AuthProvider from '@/libraries/auth-provider';
import { Notification } from 'element-ui';

@Component({
  components: { ProjectsDialog, AboutDialog, SettingsDialog },
})
export default class App extends Vue {
  private showProjects: boolean = false;
  private showAbout: boolean = false;
  private showSettings: boolean = false;
  private authProvider: AuthProvider = new AuthProvider();
  private user: any;
  private isAuthenticated: boolean = false;

  private created(): void {
    this.updateUser();
    eventHub.$on('login', this.updateUser);
  }

  private async login(): Promise<void> {
    try {
      await this.authProvider.login();
    } catch (exception) {
      if (exception && exception.error === 'unauthorized' && exception.error_description) {
        Notification.error({
          title: 'Başarısız',
          message: exception.error_description,
        });
      }
    }
  }

  private async updateUser(): Promise<void> {
    this.user = await this.authProvider.getUser();
    if (this.user) {
      this.isAuthenticated = true;
    }
  }

  private beforeDestroy(): void {
    eventHub.$off('login', this.updateUser);
  }

  get isMobile(): boolean {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
  }
}
</script>

<style lang="scss">
   @import 'style.scss';
</style>
<template>
<el-dialog title="Projeler" :visible.sync="show">
  <span v-if="projects.length > 0 && !this.isLoading">
    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="name" label="Proje Adı"></el-table-column>      
      <el-table-column prop="created" label="Kaydetme Tarihi" width="150">
        <template slot-scope="scope">
          {{scope.row.created | formatUnixDate }}
        </template>
      </el-table-column>
      <el-table-column width="130">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleOpen(scope.row)">Aç</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Sil</el-button>
        </template>
    </el-table-column>
    </el-table>
  </span>
  <span v-else-if="isLoading">
    Yükleniyor...
  </span>
  <span v-else>
    Henüz kaydedilmiş bir proje yok.
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addProject">Yeni Proje</el-button>
    <el-button @click="show = false">Kapat</el-button>
  </span>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from 'vue-property-decorator';
import { Dialog, Button, Table, TableColumn, MessageBox } from 'element-ui';
import { eventHub } from '@/libraries/event-hub';
import GuApiRestClient from '@/libraries/gu-api-client';
import Project from '@/models/project';
import { MessageBoxInputData } from 'element-ui/types/message-box';

@Component({
  components: {
    'el-dialog': Dialog,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
})
export default class ProjectsDialog extends Vue {
  @PropSync('showDialog', { type: Boolean, default: false }) private show!: boolean;

  private projects?: Project[] = [];
  private isLoading: boolean = false;
  private apiClient = new GuApiRestClient();

  @Watch('show')
  private async onShowChanged(newVal: boolean) {
    this.projects = [];
    if (newVal) {
      this.isLoading = true;
      await this.loadProjects();
      this.isLoading = false;
    }
  }

  private async loadProjects(): Promise<void> {
    const response = await this.apiClient.getProjects();
    this.projects = response.data.sort((a: Project, b: Project) => a.created! - b.created!).reverse();
  }

  private handleOpen(project: Project) {
    eventHub.$emit('open-project', project);
    this.show = false;
  }

  private addProject(): void {
      MessageBox.prompt('Proje ismi girin', 'Proje İsmi', {
          confirmButtonText: 'Kaydet',
          cancelButtonText: 'İptal',
        }).then(async (input) => {
          let project = new Project();
          project.name = (input as MessageBoxInputData).value;
          const response = await this.apiClient.addProject(project);
          project = response.data;
          if (this.projects) {
            this.projects.push(project);
          }
        }).catch((_) => _);
  }

  private handleDelete(project: Project) {
    MessageBox.confirm(
      'Bu işlem projeyi tamamen silecek. Onaylıyor musunuz?',
      'Uyarı',
      {
          confirmButtonText: 'Onayla',
          cancelButtonText: 'İptal',
          type: 'warning',
      }).then(async () => {
        if (project.projectId) {
          await this.apiClient.deleteProject(project.projectId);
          await this.loadProjects();
        }
      }).catch((_) => _);
  }
}
</script>
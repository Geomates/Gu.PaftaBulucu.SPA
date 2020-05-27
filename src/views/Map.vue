<template>
  <div class="w-100 h-100">
    <div class="w-100 h-100" id="map"></div>
    <div class="map-overlay-menu">
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header py-0 px-1 font-weight-light" style="height:25px">
              <small class="text-muted">Pafta Ölçeği</small>
            </div>
            <div class="card-body p-1">
              <select class="form-control" v-model.number="scale">
                <option value="100">1:100.000</option>
                <option value="50">1:50.000</option>
                <option value="25">1:25.000</option>
                <option value="10">1:10.000</option>
                <option value="5">1:5.000</option>
                <option value="2">1:2.000</option>
                <option value="1">1:1.000</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-8">
          <div class="card">
            <div class="card-header py-0 px-1 font-weight-light" style="height:25px">
              <small class="text-muted" v-show="isCoordinateMode">
                Koordinata Göre Bul | <a href="#" @click="isCoordinateMode=!isCoordinateMode">Pafta Adına Göre Bul</a>
              </small>
              <small class="text-muted" v-show="!isCoordinateMode">
                Pafta Adına Göre Bul | <a href="#" @click="isCoordinateMode=!isCoordinateMode">Koordinata Göre Bul </a>
              </small>
            </div>
            <div class="card-body p-1">
              <FindByCoordinateWidget @onFind="querySheetByCoordinate" :scale="scale" v-show="isCoordinateMode"/>
              <FindByNameWidget @onFind="querySheetByName" v-show="!isCoordinateMode" :scale="scale"/>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mt-4">
            <div class="card-body p-1">
              <button type="button" class="btn btn-secondary btn-block" @click="showSheets">Paftalar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card map-overlay-coordinates">
      <div class="card-body p-0">{{coordinates}}</div>
    </div>
    <SheetsDialog :showDialog.sync="showSheetsDialog" :sheetLayers="sheetLayers" :project="currentProject" @delete="deleteSheetLayer" @save="saveProject"/>
  </div>
</template>

<script lang="ts">
import { Notification } from 'element-ui';
import FindByCoordinateWidget from '@/components/find-by-coordinate-widget.vue';
import FindByNameWidget from '@/components/find-by-name-widget.vue';
import SheetsDialog from '@/components/sheets-dialog.vue';
import GuApiRestClient from '@/libraries/gu-api-client';
import { eventHub } from '@/libraries/event-hub';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { Component, Vue } from 'vue-property-decorator';
import '@/leaflet-components/query-coordinates-control';
import 'leaflet-spin';
import Coordinate from '@/models/coordinate';
import SheetLayer from '@/models/sheet-layer';
import Project from '@/models/project';
import SheetEntry from '../models/sheet-entry';
import AuthProvider from '@/libraries/auth-provider';

@Component({
  components: { FindByCoordinateWidget, FindByNameWidget, SheetsDialog },
})
export default class Map extends Vue {
  public coordinates: string = '';
  public scale: number = 100;
  private map?: L.Map;
  private isCoordinateMode: boolean = true;
  private tileLayer?: L.TileLayer;
  private guRestApiClient = new GuApiRestClient();
  private cornerMarkerIcon: L.Icon = L.icon({
    iconUrl: 'plus.gif',
    iconSize: [10, 10],
  });
  private sheetLayers: SheetLayer[] = [];
  private showSheetsDialog: boolean = false;
  private currentProject: Project = new Project();
  private authProvider: AuthProvider = new AuthProvider();

  private mounted(): void {
    this.map = L.map('map').setView([38.8, 35.13], 6);
    L.Control.queryCoordinatesTool({
      position: 'topleft',
      handleClick: async (e: L.LeafletMouseEvent) => {
        if (!await this.authProvider.isAuthenticated()) {
          this.showLoginAlert();
          return;
        }
        this.querySheetByCoordinate(e.latlng.lat, e.latlng.lng, this.scale);
      },
    }).addTo(this.map);
    this.tileLayer = L.tileLayer(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
      },
    );
    this.tileLayer.addTo(this.map);
    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      this.coordinates = `${this.formatCoordinate(e.latlng.lat)}N ${this.formatCoordinate(e.latlng.lng)}E`;
    });
  }

  private showSpinner(): void {
    if (this.map) {
      this.map.spin(true);
    }
  }

  private showLoginAlert() {
    Notification.warning({
        title: 'Lütfen oturum açın',
        message: 'Lütfen önce oturum açın.',
      });
  }

  private hideSpinner(): void {
    if (this.map) {
      this.map.spin(false);
    }
  }

  private created(): void {
    eventHub.$on('before-request', this.showSpinner);
    eventHub.$on('request-error', this.hideSpinner);
    eventHub.$on('after-response', this.hideSpinner);
    eventHub.$on('response-error', this.hideSpinner);
    eventHub.$on('open-project', this.openProject);
  }

  private beforeDestroy(): void {
    eventHub.$off('before-request', this.showSpinner);
    eventHub.$off('request-error', this.hideSpinner);
    eventHub.$off('after-response', this.hideSpinner);
    eventHub.$off('response-error', this.hideSpinner);
    eventHub.$off('open-project', this.openProject);
  }

  private getScaleRange(scale: number): number {
    switch (scale) {
      default:
      case 100:
        return 0.5;
      case 50:
        return 0.25;
      case 25:
        return 0.125;
      case 10:
        return 0.05;
      case 5:
        return 0.025;
      case 2:
        return 0.0125;
      case 1:
        return 0.00625;
    }
  }

  private formatCoordinate(s: number): string {
    s = s * 3600;
    const degree = Math.floor(s / 3600);
    const minute = Math.floor((s % 3600) / 60);
    const second = (s % 3600) % 60;
    return `${degree}° ${(minute < 10 ? '0' : '') + minute}' ${second.toFixed(4)}''`;
  }

  private async querySheetByCoordinate(latitude: number, longitude: number, scale: number): Promise<void> {
    if (!await this.authProvider.isAuthenticated()) {
      this.showLoginAlert();
      return;
    }
    const response = await this.guRestApiClient.findSheetByCoordinate(latitude, longitude, scale);
    this.drawSheets(response.data, scale);
  }

  private async querySheetByName(name: string): Promise<void> {
    if (!await this.authProvider.isAuthenticated()) {
      this.showLoginAlert();
      return;
    }
    const response = await this.guRestApiClient.findSheetByName(name, this.scale);
    this.drawSheets([response.data], this.scale);
  }

  private async openProject(project: Project) {
    this.clearAllSheets();
    this.currentProject = project;
    for (const entry of project.entries) {
      if (entry.lat && entry.lng && entry.scale) {
        await this.querySheetByCoordinate(entry.lat, entry.lng, entry.scale);
      }
    }
  }

  private async saveProject(name?: string) {
    try {
      this.currentProject.entries = this.sheetLayers.map((sl) => sl.sheet);
      if (name) {
        this.currentProject.name = name;
      }
      if (this.currentProject.projectId) {
        await this.guRestApiClient.updateProject(this.currentProject);
      } else {
        const response = await this.guRestApiClient.addProject(this.currentProject);
        this.currentProject = response.data;
      }
      Notification({
        title: 'Başarılı',
        message: 'Proje başarıyla kaydedildi.',
        type: 'success',
      });
    } catch (error) {
      Notification.error({
        title: 'Başarısız',
        message: 'Proje kaydedilirken bir hata oluştu.',
      });
    }
  }

  private clearAllSheets(): void {
    for (const sheetLayer of this.sheetLayers) {
      sheetLayer.layerGroup.remove();
    }
    this.sheetLayers = [];
  }

  private deleteSheetLayer(sheetLayer: SheetLayer) {
    sheetLayer.layerGroup.remove();
    this.sheetLayers.splice(this.sheetLayers.indexOf(sheetLayer), 1);
  }

  private showSheets(): void {
    this.showSheetsDialog = true;
  }

  private drawSheets(sheets: any[], scale: number) {
    for (const sheet of sheets) {
      if (this.sheetLayers.findIndex((s) => s.sheet.name === sheet.name) > -1) {
        continue;
      }
      const layerGroup = new L.LayerGroup();
      const lbLat = parseFloat(sheet.lat);
      const lbLng = parseFloat(sheet.lon);
      const scaleRange = this.getScaleRange(scale);
      const corners: Array<[number, number]> = [
        [lbLat, lbLng],
        [lbLat + scaleRange, lbLng],
        [lbLat + scaleRange, lbLng + scaleRange],
        [lbLat, lbLng + scaleRange],
        [lbLat, lbLng],
      ];
      L.polygon(corners)
        .bindTooltip(sheet.name, {
          permanent: true,
          direction: 'center',
          interactive: true,
        })
        .openTooltip()
        .addTo(layerGroup);
      L.marker([lbLat, lbLng], {
        icon: this.cornerMarkerIcon,
        title: `${this.formatCoordinate(lbLat)}N ${this.formatCoordinate(lbLng)}E`,
      }).addTo(layerGroup);
      L.marker([lbLat + scaleRange, lbLng], {
        icon: this.cornerMarkerIcon,
        title: `${this.formatCoordinate(lbLat + scaleRange)}N ${this.formatCoordinate(lbLng)}E`,
      }).addTo(layerGroup);
      L.marker([lbLat + scaleRange, lbLng + scaleRange], {
        icon: this.cornerMarkerIcon,
        title: `${this.formatCoordinate(lbLat + scaleRange)}N ${this.formatCoordinate(lbLng + scaleRange)}E`,
      }).addTo(layerGroup);
      L.marker([lbLat, lbLng + scaleRange], {
        icon: this.cornerMarkerIcon,
        title: `${this.formatCoordinate(lbLat)}N ${this.formatCoordinate(lbLng + scaleRange)}E`,
      }).addTo(layerGroup);
      layerGroup.addTo(this.map!);
      const sheetLayer = new SheetLayer();
      sheetLayer.sheet.name = sheet.name;
      sheetLayer.sheet.lat = lbLat + scaleRange / 2;
      sheetLayer.sheet.lng = lbLng + scaleRange / 2;
      sheetLayer.sheet.scale = this.scale;
      sheetLayer.layerGroup = layerGroup;
      this.sheetLayers.push(sheetLayer);
    }
  }
}
</script>

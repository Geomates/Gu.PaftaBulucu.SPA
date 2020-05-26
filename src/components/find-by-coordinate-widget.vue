<template>
  <div class="row">
    <div class="col-auto font-weight-bold pr-1 my-auto text-right">Boylam:</div>
    <div class="col-1 p-0">
      <div class="input-group">
        <input class="form-control p-0" type="text" v-model.number="longitude.degree" />
        <div class="input-group-append">
          <span class="input-group-text p-1">
            <sup>o</sup>
          </span>
        </div>
      </div>
    </div>
    <div class="col-1 py-0 px-1">
      <div class="input-group">
        <input class="form-control p-0" type="text" v-model.number="longitude.minute" />
        <div class="input-group-append">
          <span class="input-group-text p-1">
            <sup>ı</sup>
          </span>
        </div>
      </div>
    </div>
    <div class="col-2 py-0 px-1">
      <div class="input-group">
        <input class="form-control p-0" type="text" v-model.number="longitude.second" />
        <div class="input-group-append">
          <span class="input-group-text p-1">
            <sup>ıı</sup>
          </span>
        </div>
      </div>
    </div>
    <div class="col-auto font-weight-bold my-auto px-1 text-right">Enlem:</div>
    <div class="col-1 p-0">
      <div class="input-group">
        <input class="form-control p-0" type="text" v-model.number="latitude.degree" />
        <div class="input-group-append">
          <span class="input-group-text p-1">
            <sup>o</sup>
          </span>
        </div>
      </div>
    </div>
    <div class="col-1 py-0 px-1">
      <div class="input-group">
        <input class="form-control p-0" type="text" v-model.number="latitude.minute" />
        <div class="input-group-append">
          <span class="input-group-text p-1">
            <sup>ı</sup>
          </span>
        </div>
      </div>
    </div>
    <div class="col-2 py-0 px-1">
      <div class="input-group">
        <input class="form-control p-0" type="text" v-model.number="latitude.second" />
        <div class="input-group-append">
          <span class="input-group-text p-1">
            <sup>ıı</sup>
          </span>
        </div>
      </div>
    </div>
    <div class="col pl-0 mr-1 py-0">
      <button type="button" class="ml-1 btn btn-primary btn-block" @click="find">Bul</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Coordinate from '@/models/coordinate';

@Component({})
export default class FindByCoordinateWidget extends Vue {
    public latitude: Coordinate = new Coordinate();
    public longitude: Coordinate = new Coordinate();

    private find(): void {
        const latitude = (this.latitude.degree ?? 0) +
                        (this.latitude.minute ?? 0) / 60 +
                        (this.latitude.second ?? 0) / 3600;
        const longitude = (this.longitude.degree ?? 0) +
                        (this.longitude.minute ?? 0) / 60 +
                        (this.longitude.second ?? 0) / 3600;
        if (latitude > 0 && longitude > 0) {
            this.$emit('onFind', latitude, longitude);
        }
    }
}
</script>
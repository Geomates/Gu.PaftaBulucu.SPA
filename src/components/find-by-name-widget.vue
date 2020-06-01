<template>
  <div class="row">
    <div class="form-group col pr-1 mr-1 py-0 mb-0" style="min-width:150px;">
        <label for="s250" class="mb-0">1:250.000</label>
        <el-autocomplete class="inline-input" id="s250" size="small" v-model="sheet.s250" @select="handleSelect250" :fetch-suggestions="searchS250" :trigger-on-focus="false"></el-autocomplete>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left" style="min-width:80px;">
        <label for="s100" class="mb-0">1:100.000</label>
        <select id="s100" class="form-control form-control-sm" v-model="sheet.s100" :disabled="scale > 100">
          <option v-for="option in s100values" :value="option" :key="option">
            {{ option }}
          </option>
        </select>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left">
        <label for="s50" class="mb-0">1:50.000</label>
        <select id="s50" class="form-control form-control-sm" v-model="sheet.s50" :disabled="scale > 50">
            <option>a</option>
            <option>b</option>
            <option>c</option>
            <option>d</option>
        </select>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left">
        <label for="s25" class="mb-0">1:25.000</label>
        <select id="s25" class="form-control form-control-sm" v-model="sheet.s25" :disabled="scale != 25">
          <option v-for="option in s25values" :value="option" :key="option">
            {{ option }}
          </option>
        </select>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left">
        <label for="s10" class="mb-0">1:10.000</label>
        <select id="s10" class="form-control form-control-sm" v-model="sheet.s10" :disabled="scale > 10">
          <option v-for="option in s10values" :value="option" :key="option">
            {{ option }}
          </option>
        </select>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left">
        <label for="s5" class="mb-0">1:5.000</label>
        <select id="s5" class="form-control form-control-sm" v-model="sheet.s5" :disabled="scale > 5">
            <option>a</option>
            <option>b</option>
            <option>c</option>
            <option>d</option>
        </select>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left">
        <label for="s2" class="mb-0">1:2.000</label>
         <select id="s2" class="form-control form-control-sm" v-model="sheet.s2" :disabled="scale > 2">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
        </select>
    </div>
    <div class="form-group col px-1 mb-0 py-0 border-left">
        <label for="s1" class="mb-0">1:1.000</label>
         <select id="s1" class="form-control form-control-sm" v-model="sheet.s1" :disabled="scale > 1">
            <option>a</option>
            <option>b</option>
            <option>c</option>
            <option>d</option>
        </select>
    </div>
    <div class="col d-flex flex-column pl-1 mx-1">
      <button type="button" class="btn btn-sm btn-primary btn-block mt-auto align-self-end" @click="find">Bul</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Autocomplete } from 'element-ui';
import sheets from '../../sheets.json';

@Component({
  components: {
    'el-autocomplete': Autocomplete,
  },
})
export default class FindByNameWidget extends Vue {
    @Prop() private scale!: number;

    private s100values: string[] = [];

    private sheet: any = {
      s250: '',
      s100: '',
      s50: '',
      s25: '',
      s10: '',
      s5: '',
      s2: '',
      s1: '',
    };

    private searchS250(queryString: string, cb: any): void {
      if (queryString) {
          const result = sheets
                            .filter((s) =>
                                          s.name.toLocaleLowerCase('tr')
                                          .indexOf(queryString.toLocaleLowerCase('tr')) > -1)
                            .map((s) => ({value: s.name, s100s: s.s100s}));
          cb(result);
      }
    }

    private handleSelect250(selection: any) {
      this.s100values = selection.s100s;
    }

    get s25values() {
      const result = [];
      for (let i = 1; i <= 4; i++) {
        result.push(`${this.sheet.s50}${i}`);
      }
      return result;
    }

    get s10values() {
      const result = [];
      for (let i = 1; i <= 25; i++) {
        result.push((i < 10) ? '0' + i : i);
      }
      return result;
    }

    private find(): void {
      const sheet = Object.keys(this.sheet)
                        .filter((k) => (Number(k.substring(1)) === 25 && this.scale === 25) ||
                                       (Number(k.substring(1)) === 50 && this.scale !== 25) ||
                                       (Number(k.substring(1)) >= this.scale &&
                                        Number(k.substring(1)) !== 25 &&
                                        Number(k.substring(1)) !== 50))
                        .filter((k) => this.sheet[k].toString().length > 0).map((k) => this.sheet[k]).join('-');
      this.$emit('onFind', sheet);
    }
}
</script>
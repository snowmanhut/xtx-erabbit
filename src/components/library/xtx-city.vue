<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{active}">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span v-else class="value">{{fullLocation}} </span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="item in currList" :key="item.code" @click="changeArea(item)">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 控制展开收起,默认收起
    const active = ref(false)
    const cityData = ref([])
    const loading = ref(false)
    const openDialog = () => {
      active.value = true
      // 获取城市数据
      loading.value = true
      getCityData().then(data => {
        cityData.value = data
        loading.value = false
      })
      for (const key in locationInfo) {
        locationInfo[key] = ''
      }
    }
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })
    const getCityData = () => {
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          resolve(window.cityData)
        } else {
          axios.get('https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json').then(res => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }
    const locationInfo = reactive({
      provinceName: '',
      provinceCode: '',
      cityName: '',
      cityCode: '',
      countyName: '',
      countyCode: '',
      fullLocation: ''
    })
    const changeArea = (area) => {
      if (area.level === 0) {
        locationInfo.provinceName = area.name
        locationInfo.provinceCode = area.code
      }
      if (area.level === 1) {
        locationInfo.cityName = area.name
        locationInfo.cityCode = area.code
      }
      if (area.level === 2) {
        locationInfo.countyName = area.name
        locationInfo.countyCode = area.code
        locationInfo.fullLocation = `${locationInfo.provinceName}${locationInfo.cityName}${locationInfo.countyName}`
        closeDialog()
        emit('change', locationInfo)
      }
    }
    const currList = computed(() => {
      let list = cityData.value
      if (locationInfo.provinceCode && locationInfo.provinceName) {
        list = list.find(p => p.code === locationInfo.provinceCode).areaList
      }
      if (locationInfo.cityCode && locationInfo.cityName) {
        list = list.find(p => p.code === locationInfo.cityCode).areaList
      }
      return list
    })
    return { active, toggleDialog, target, currList, loading, changeArea }
  }
}

</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>

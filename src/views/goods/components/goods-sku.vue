<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.id">
          <img :class="{selected:val.selected,disabled:val.disabled}" @click="changeSku(item,val)" v-if="val.picture" :src="val.picture" alt="" :title="val.name">
          <span :class="{selected:val.selected,disabled:val.disabled}" @click="changeSku(item,val)" v-else >{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import bwPowerSet from '@/vender/power-set'
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const pathMap = getPathMap(props.goods.skus)
    changeStatus(props.goods.specs, pathMap)
    if (props.skuId) {
      isSelected(props.goods, props.skuId)
    }
    console.log(props.goods, props.skuId)
    const changeSku = (item, val) => {
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(item => {
          item.selected = false
          val.selected = true
        })
      }
      console.log(getSelected(props.goods.specs))
    }
    return { changeSku }
  }
}
// 默认选中
const isSelected = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  console.log(sku)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
// 选中的规格
const getSelected = specs => {
  const arr = []
  specs.forEach(item => {
    item.values.forEach(val => {
      if (val.selected) arr.push(val.name || undefined)
    })
  })
  return arr
}
// 改变禁用状态
const changeStatus = (specs, pathMap) => {
  const arr = []
  specs.forEach((item, i) => {
    const selectedValue = item.values.find(val => val.selected)
    arr.push(selectedValue || undefined)
    item.values.forEach(val => {
      if (val.selected) return
      arr[i] = val.name
      const key = arr.filter(x => x).join('☆')
      val.disabled = !pathMap[key]
    })
  })
}
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory) {
      const values = sku.specs.map(spec => spec.valueName)
      const powerSet = bwPowerSet(values)
      powerSet.forEach(arr => {
        const key = arr.join('☆')
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>

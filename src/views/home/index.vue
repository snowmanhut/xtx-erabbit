<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner />
        <home-new/>
        <home-hot/>
        <home-brand/>
        <home-product/>
        <home-special/>
      </div>
    </div>
  </div>
</template>
<script>
import HomeBanner from './components/home-banner.vue'
import HomeBrand from './components/home-brand.vue'
import HomeCategory from './components/home-category'
import HomeHot from './components/home-hot.vue'
import HomeNew from './components/home-new.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'PageHome',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot, HomeBrand, HomeProduct, HomeSpecial }
}
</script>
<style scoped lang="less"></style>

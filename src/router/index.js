import { createRouter, createWebHashHistory } from 'vue-router'

import TopCategory from '@/views/category'
import SubCategory from '@/views/category/sub'
const Home = () => import('@/views/home')
const Layout = () => import('@/views/Layout.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 })
})

export default router

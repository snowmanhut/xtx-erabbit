import router from '@/router'
import store from '@/store'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/',
  timeout: 5000
})

instance.interceptors.request.use(
  config => {
    const { profile } = store.state.user
    config.headers.Authorization = `Bearer ${profile.token}`
    return config
  },
  error => {
    return new Promise(error)
  }
)

instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response && error.response.status === '401') {
      store.commit('user/setUser', {})
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl' + fullPath)
    }
    return new Promise(error)
  }
)

export default (url, method, reqData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: reqData
  })
}

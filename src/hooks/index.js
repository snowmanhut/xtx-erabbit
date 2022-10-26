import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

export const lazyLoader = (api) => {
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      stop()
      api().then(data => {
        result.value = data.result
      })
    }
  }, { threshold: 0 })
  return { target, result }
}

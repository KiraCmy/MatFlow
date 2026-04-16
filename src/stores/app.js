import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const user = ref({ name: '张设计', role: '设计师/PM', avatar: '' })
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setUser(u) {
    user.value = u
  }

  return { user, sidebarCollapsed, toggleSidebar, setUser }
})

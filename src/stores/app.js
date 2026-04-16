import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const user = ref({ name: '', role: '', roleLabel: '', avatar: '' })
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setUser(u) {
    user.value = u
  }

  // Role permission helpers
  const role = computed(() => user.value.role)

  function hasPermission(module) {
    const perms = ROLE_PERMISSIONS[user.value.role]
    if (!perms) return false
    const level = perms[module]
    // full > readonly > none
    return level === 'full' || level === 'readonly'
  }

  function canOperate(module) {
    const perms = ROLE_PERMISSIONS[user.value.role]
    if (!perms) return false
    return perms[module] === 'full'
  }

  function getModuleLevel(module) {
    const perms = ROLE_PERMISSIONS[user.value.role]
    return perms ? (perms[module] || 'none') : 'none'
  }

  // Get filtered menu items based on role
  function getVisibleMenus() {
    return MENU_ITEMS.filter(item => {
      const checkModules = item.module ? [item.module] : (item.modules || [])
      if (!checkModules.length) return true
      return checkModules.some(m => {
        const level = getModuleLevel(m)
        return level === 'full' || level === 'readonly'
      })
    }).map(item => {
      if (!item.children) {
        // Single menu item
        const level = item.module ? getModuleLevel(item.module) : 'full'
        return { ...item, readonlyHint: level === 'readonly' }
      }
      // Sub-menu
      const filteredChildren = item.children.filter(child => {
        if (!child.module) return true
        return hasPermission(child.module)
      }).map(child => {
        const level = child.module ? getModuleLevel(child.module) : 'full'
        return { ...child, readonlyHint: level === 'readonly' }
      })
      // Check if all children are readonly
      const allReadonly = filteredChildren.length > 0 && filteredChildren.every(c => c.readonlyHint)
      const anyFull = filteredChildren.some(c => !c.readonlyHint)
      return { ...item, children: filteredChildren, readonlyHint: allReadonly && !anyFull }
    })
  }

  return { user, sidebarCollapsed, role, toggleSidebar, setUser, hasPermission, canOperate, getModuleLevel, getVisibleMenus }
})

// Permission levels: 'full' | 'readonly' | 'none'
const ROLE_PERMISSIONS = {
  designer: {
    dashboard: 'full',
    aiSelection: 'full',
    project: 'full',
    bom: 'full',
    supplier: 'readonly',
    purchaseOrder: 'readonly',
    contract: 'none',
    sampling: 'full',
    receiving: 'readonly',
    warehouse: 'none',
    construction: 'full',
    finance: 'none',
    decision: 'none',
  },
  purchaser: {
    dashboard: 'full',
    aiSelection: 'none',
    project: 'readonly',
    bom: 'full',
    supplier: 'full',
    purchaseOrder: 'full',
    contract: 'full',
    sampling: 'full',
    receiving: 'full',
    warehouse: 'none',
    construction: 'none',
    finance: 'none',
    decision: 'none',
  },
  warehouse: {
    dashboard: 'full',
    aiSelection: 'none',
    project: 'none',
    bom: 'none',
    supplier: 'none',
    purchaseOrder: 'readonly',
    contract: 'none',
    sampling: 'none',
    receiving: 'full',
    warehouse: 'full',
    construction: 'none',
    finance: 'none',
    decision: 'none',
  },
  finance: {
    dashboard: 'full',
    aiSelection: 'none',
    project: 'readonly',
    bom: 'readonly',
    supplier: 'readonly',
    purchaseOrder: 'readonly',
    contract: 'full',
    sampling: 'none',
    receiving: 'none',
    warehouse: 'none',
    construction: 'none',
    finance: 'full',
    decision: 'readonly',
  },
  boss: {
    dashboard: 'full',
    aiSelection: 'none',
    project: 'full',
    bom: 'readonly',
    supplier: 'readonly',
    purchaseOrder: 'readonly',
    contract: 'readonly',
    sampling: 'readonly',
    receiving: 'readonly',
    warehouse: 'readonly',
    construction: 'readonly',
    finance: 'full',
    decision: 'full',
  },
}

// Menu structure with module mapping
export const MENU_ITEMS = [
  { index: '/dashboard', icon: 'Odometer', title: '工作台' },
  {
    index: 'ai', icon: 'MagicStick', title: 'AI智能选材', badge: 'AI',
    modules: ['aiSelection'],
    children: [
      { index: '/ai-selection/image-search', icon: 'Picture', title: '图搜图', module: 'aiSelection' },
      { index: '/ai-selection/text-search', icon: 'Search', title: '语意搜材', module: 'aiSelection' },
      { index: '/ai-selection/alternative', icon: 'Refresh', title: '平替推荐', module: 'aiSelection' },
    ]
  },
  {
    index: 'project', icon: 'Folder', title: '项目管理',
    modules: ['project'],
    children: [
      { index: '/projects', icon: 'List', title: '项目列表', module: 'project' },
    ]
  },
  { index: '/bom', icon: 'Document', title: 'BOM管理', module: 'bom' },
  {
    index: 'purchase', icon: 'ShoppingCart', title: '采购执行',
    modules: ['supplier', 'purchaseOrder', 'contract'],
    children: [
      { index: '/suppliers', icon: 'OfficeBuilding', title: '供应商管理', module: 'supplier' },
      { index: '/purchase-orders', icon: 'Tickets', title: '采购订单', module: 'purchaseOrder' },
      { index: '/contracts', icon: 'Notebook', title: '合同管理', module: 'contract' },
    ]
  },
  { index: '/sampling', icon: 'Stamp', title: '打样管理', module: 'sampling' },
  { index: '/receiving', icon: 'Box', title: '收货验收', module: 'receiving' },
  { index: '/warehouse', icon: 'House', title: '仓库管理', module: 'warehouse' },
  { index: '/construction', icon: 'SetUp', title: '施工反馈', module: 'construction' },
  { index: '/finance', icon: 'Money', title: '财务结算', module: 'finance' },
  { index: '/decision', icon: 'DataAnalysis', title: '经营决策', module: 'decision' },
]

// Route-to-module mapping for guard
export const ROUTE_MODULE_MAP = {
  '/dashboard': 'dashboard',
  '/ai-selection': 'aiSelection',
  '/ai-selection/image-search': 'aiSelection',
  '/ai-selection/text-search': 'aiSelection',
  '/ai-selection/alternative': 'aiSelection',
  '/projects': 'project',
  '/bom': 'bom',
  '/suppliers': 'supplier',
  '/purchase-orders': 'purchaseOrder',
  '/contracts': 'contract',
  '/sampling': 'sampling',
  '/receiving': 'receiving',
  '/warehouse': 'warehouse',
  '/construction': 'construction',
  '/finance': 'finance',
  '/decision': 'decision',
}

import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '../stores/app'
import { ROUTE_MODULE_MAP } from '../stores/app'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
  {
    path: '/',
    component: () => import('../components/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '工作台', icon: 'Odometer' } },
      // M2 AI智能选材
      { path: 'ai-selection', name: 'AISelection', component: () => import('../views/ai-selection/AISelection.vue'), meta: { title: 'AI智能选材', icon: 'MagicStick' } },
      { path: 'ai-selection/image-search', name: 'ImageSearch', component: () => import('../views/ai-selection/ImageSearch.vue'), meta: { title: '图搜图', icon: 'Picture' } },
      { path: 'ai-selection/text-search', name: 'TextSearch', component: () => import('../views/ai-selection/TextSearch.vue'), meta: { title: '语意搜材', icon: 'Search' } },
      { path: 'ai-selection/alternative', name: 'Alternative', component: () => import('../views/ai-selection/Alternative.vue'), meta: { title: '平替推荐', icon: 'Refresh' } },
      // M1 项目管理
      { path: 'projects', name: 'Projects', component: () => import('../views/project/ProjectList.vue'), meta: { title: '项目列表', icon: 'Folder' } },
      { path: 'projects/:id', name: 'ProjectDetail', component: () => import('../views/project/ProjectDetail.vue'), meta: { title: '项目详情' } },
      { path: 'bom', name: 'BOM', component: () => import('../views/project/BOMManage.vue'), meta: { title: 'BOM管理', icon: 'Document' } },
      // M3 采购执行
      { path: 'suppliers', name: 'Suppliers', component: () => import('../views/purchase/SupplierList.vue'), meta: { title: '供应商管理', icon: 'OfficeBuilding' } },
      { path: 'purchase-orders', name: 'PurchaseOrders', component: () => import('../views/purchase/PurchaseOrders.vue'), meta: { title: '采购订单', icon: 'Tickets' } },
      { path: 'contracts', name: 'Contracts', component: () => import('../views/purchase/ContractList.vue'), meta: { title: '合同管理', icon: 'Notebook' } },
      // M4 打样管理
      { path: 'sampling', name: 'Sampling', component: () => import('../views/sampling/SamplingList.vue'), meta: { title: '打样管理', icon: 'Stamp' } },
      // M5 收货验收
      { path: 'receiving', name: 'Receiving', component: () => import('../views/receiving/ReceivingList.vue'), meta: { title: '收货验收', icon: 'Box' } },
      // M6 仓库管理
      { path: 'warehouse', name: 'Warehouse', component: () => import('../views/warehouse/Warehouse.vue'), meta: { title: '仓库管理', icon: 'House' } },
      // M7 施工反馈
      { path: 'construction', name: 'Construction', component: () => import('../views/construction/Construction.vue'), meta: { title: '施工反馈', icon: 'SetUp' } },
      // M8 财务结算
      { path: 'finance', name: 'Finance', component: () => import('../views/finance/Finance.vue'), meta: { title: '财务结算', icon: 'Money' } },
      // M9 经营决策
      { path: 'decision', name: 'Decision', component: () => import('../views/decision/Decision.vue'), meta: { title: '经营决策', icon: 'DataAnalysis' } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Permission guard
router.beforeEach((to, from, next) => {
  // Allow login page
  if (to.path === '/login') return next()

  // Check if user is logged in
  const appStore = useAppStore()
  if (!appStore.user.role) {
    return next('/login')
  }

  // Check module permission
  const moduleName = ROUTE_MODULE_MAP[to.path]

  if (moduleName) {
    const level = appStore.getModuleLevel(moduleName)
    if (level === 'none') {
      return next('/dashboard')
    }
  }

  next()
})

export default router

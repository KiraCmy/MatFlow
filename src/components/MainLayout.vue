<template>
  <el-container class="main-layout">
    <!-- Sidebar -->
    <el-aside :width="collapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">M</div>
        <transition name="fade">
          <span v-if="!collapsed" class="logo-text">MatEx · 智能材料系统</span>
        </transition>
      </div>

      <el-menu :default-active="activeMenu" :collapse="collapsed" :collapse-transition="false"
        router class="sidebar-menu" background-color="#1a1f36" text-color="#a0aec0" active-text-color="#fff">
        
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>

        <el-sub-menu index="ai">
          <template #title>
            <el-icon><MagicStick /></el-icon>
            <span>AI智能选材</span>
            <span class="ai-badge" style="margin-left:auto;font-size:10px;">AI</span>
          </template>
          <el-menu-item index="/ai-selection/image-search"><el-icon><Picture /></el-icon>图搜图</el-menu-item>
          <el-menu-item index="/ai-selection/text-search"><el-icon><Search /></el-icon>语意搜材</el-menu-item>
          <el-menu-item index="/ai-selection/alternative"><el-icon><Refresh /></el-icon>平替推荐</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="project">
          <template #title>
            <el-icon><Folder /></el-icon>
            <span>项目管理</span>
          </template>
          <el-menu-item index="/projects"><el-icon><List /></el-icon>项目列表</el-menu-item>
          <el-menu-item index="/bom"><el-icon><Document /></el-icon>BOM管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="purchase">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>采购执行</span>
          </template>
          <el-menu-item index="/suppliers"><el-icon><OfficeBuilding /></el-icon>供应商管理</el-menu-item>
          <el-menu-item index="/purchase-orders"><el-icon><Tickets /></el-icon>采购订单</el-menu-item>
          <el-menu-item index="/contracts"><el-icon><Notebook /></el-icon>合同管理</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/sampling">
          <el-icon><Stamp /></el-icon>
          <template #title>打样管理</template>
        </el-menu-item>

        <el-menu-item index="/receiving">
          <el-icon><Box /></el-icon>
          <template #title>收货验收</template>
        </el-menu-item>

        <el-menu-item index="/warehouse">
          <el-icon><House /></el-icon>
          <template #title>仓库管理</template>
        </el-menu-item>

        <el-menu-item index="/construction">
          <el-icon><SetUp /></el-icon>
          <template #title>施工反馈</template>
        </el-menu-item>

        <el-menu-item index="/finance">
          <el-icon><Money /></el-icon>
          <template #title>财务结算</template>
        </el-menu-item>

        <el-menu-item index="/decision">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>经营决策</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main content -->
    <el-container class="main-container">
      <el-header class="topbar">
        <div class="topbar-left">
          <el-icon class="collapse-btn" @click="toggle"><Fold v-if="!collapsed" /><Expand v-else /></el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="topbar-right">
          <el-badge :value="3" :max="99">
            <el-icon :size="20" style="cursor:pointer"><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" style="background:#5b9bd5">张</el-avatar>
              <span class="user-name">{{ userStore.user.name }}</span>
              <span class="user-role">{{ userStore.user.role }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'

const route = useRoute()
const router = useRouter()
const userStore = useAppStore()

const collapsed = computed(() => userStore.sidebarCollapsed)
const activeMenu = computed(() => route.path)

function toggle() { userStore.toggleSidebar() }
function handleCommand(cmd) {
  if (cmd === 'logout') router.push('/login')
}
</script>

<style scoped>
.main-layout { height: 100vh; }

.sidebar {
  background: #1a1f36;
  overflow: hidden;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}
.logo-area {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 16px; height: 60px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.logo-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 18px; flex-shrink: 0;
}
.logo-text { color: #fff; font-size: 15px; font-weight: 600; white-space: nowrap; }

.sidebar-menu {
  border-right: none !important;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
.sidebar-menu:not(.el-menu--collapse) { width: 220px; }
.sidebar-menu .el-menu-item.is-active { background: rgba(102, 126, 234, 0.2) !important; border-left: 3px solid #667eea; }
.sidebar-menu .el-sub-menu .el-menu-item { padding-left: 50px !important; min-width: 0; }
.sidebar-menu .el-sub-menu__title:hover, .sidebar-menu .el-menu-item:hover { background: rgba(255,255,255,0.06) !important; }

.main-container { background: #f0f2f5; }

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; padding: 0 24px; height: 56px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06); z-index: 10;
}
.topbar-left { display: flex; align-items: center; gap: 16px; }
.collapse-btn { font-size: 20px; cursor: pointer; color: #606266; }
.collapse-btn:hover { color: #409eff; }
.topbar-right { display: flex; align-items: center; gap: 20px; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.user-name { font-size: 14px; color: #303133; font-weight: 500; }
.user-role { font-size: 11px; color: #909399; background: #f0f2f5; padding: 1px 6px; border-radius: 3px; }

.content-area { padding: 20px; overflow-y: auto; height: calc(100vh - 56px); }
</style>

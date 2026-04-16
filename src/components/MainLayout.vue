<template>
  <el-container class="main-layout">
    <!-- Sidebar -->
    <el-aside :width="collapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">M</div>
        <transition name="fade">
          <span v-if="!collapsed" class="logo-text">MatFlow</span>
        </transition>
      </div>

      <el-menu :default-active="activeMenu" :collapse="collapsed" :collapse-transition="false"
        router class="sidebar-menu" background-color="#1a1f36" text-color="#a0aec0" active-text-color="#fff">
        
        <el-menu-item v-for="item in visibleMenus" :key="item.index"
          :index="item.index"
          :class="{'is-readonly': item.readonlyHint}">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
          <span v-if="item.badge" class="ai-badge" style="margin-left:auto;font-size:10px;">{{ item.badge }}</span>
          <el-icon v-if="item.readonlyHint" class="readonly-icon"><View /></el-icon>
        </el-menu-item>

        <template v-for="item in visibleSubMenus" :key="item.index">
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
              <span v-if="item.badge" class="ai-badge" style="margin-left:auto;font-size:10px;">{{ item.badge }}</span>
              <el-icon v-if="item.readonlyHint" class="readonly-icon"><View /></el-icon>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.index"
              :index="child.index"
              :class="{'is-readonly': child.readonlyHint}">
              <el-icon><component :is="child.icon" /></el-icon>
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
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
          <el-popover placement="bottom-end" :width="360" trigger="click" v-model:visible="showNotifications">
            <template #reference>
              <el-badge :value="notifications.filter(n => !n.read).length" :max="99" style="cursor:pointer;">
                <el-icon :size="20"><Bell /></el-icon>
              </el-badge>
            </template>
            <div class="notification-panel">
              <div class="np-header">
                <span style="font-weight:600;font-size:15px;">消息中心</span>
                <el-button text size="small" type="primary" @click="markAllRead">全部已读</el-button>
              </div>
              <div class="np-tabs">
                <el-radio-group v-model="notifFilter" size="small">
                  <el-radio-button value="all">全部 ({{ notifications.length }})</el-radio-button>
                  <el-radio-button value="unread">未读 ({{ notifications.filter(n => !n.read).length }})</el-radio-button>
                </el-radio-group>
              </div>
              <div class="np-list">
                <div v-for="n in filteredNotifications" :key="n.id" class="np-item" :class="{unread: !n.read}" @click="readNotif(n)">
                  <div class="np-dot" v-if="!n.read"></div>
                  <div class="np-content">
                    <div class="np-title">{{ n.title }}</div>
                    <div class="np-desc">{{ n.desc }}</div>
                    <div class="np-time">{{ n.time }}</div>
                  </div>
                  <el-tag :type="n.tagType" size="small" effect="plain">{{ n.tag }}</el-tag>
                </div>
                <div v-if="!filteredNotifications.length" class="np-empty">暂无消息</div>
              </div>
            </div>
          </el-popover>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" style="background:#5b9bd5">张</el-avatar>
              <span class="user-name">{{ userStore.user.name }}</span>
              <span class="user-role">{{ userStore.user.roleLabel || userStore.user.role }}</span>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'

const route = useRoute()
const router = useRouter()
const userStore = useAppStore()

const collapsed = computed(() => userStore.sidebarCollapsed)
const activeMenu = computed(() => route.path)

const showNotifications = ref(false)
const notifFilter = ref('all')

const notifications = ref([
  { id: 1, title: '打样确认提醒', desc: '蓝山咖啡-黄铜踢脚线样品已到，请尽快确认封样', time: '10分钟前', tag: '打样', tagType: 'warning', read: false },
  { id: 2, title: '采购订单状态更新', desc: 'PO-2026-005 光语照明灯具已发货，预计4/15到达', time: '30分钟前', tag: '采购', tagType: '', read: false },
  { id: 3, title: '付款到期提醒', desc: '石材源供应链尾款¥4.08万将于4/18到期', time: '1小时前', tag: '财务', tagType: 'danger', read: false },
  { id: 4, title: '库存预警', desc: '卡拉拉白大理石当前库存12㎡，低于安全库存50㎡', time: '2小时前', tag: '仓库', tagType: 'warning', read: true },
  { id: 5, title: '项目审批通知', desc: 'MASHUP潮牌店预算¥48万已提交，待老板审批', time: '3小时前', tag: '审批', tagType: '', read: true },
  { id: 6, title: '施工反馈', desc: '蓝山咖啡项目-大堂地面石材色差问题反馈', time: '昨天 16:30', tag: '施工', tagType: 'warning', read: true },
])

const filteredNotifications = computed(() => {
  if (notifFilter.value === 'unread') return notifications.value.filter(n => !n.read)
  return notifications.value
})

function readNotif(n) {
  n.read = true
}
function markAllRead() {
  notifications.value.forEach(n => { n.read = true })
}

// Build visible menus with readonly hints
const visibleMenus = computed(() => {
  return userStore.getVisibleMenus().filter(item => !item.children)
})

const visibleSubMenus = computed(() => {
  return userStore.getVisibleMenus().filter(item => item.children)
})

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
.sidebar-menu .el-menu-item.is-readonly:not(.is-active) { opacity: 0.7; }
.sidebar-menu .el-sub-menu .el-menu-item { padding-left: 50px !important; min-width: 0; }
.sidebar-menu .el-sub-menu__title:hover, .sidebar-menu .el-menu-item:hover { background: rgba(255,255,255,0.06) !important; }
.readonly-icon { color: #a0aec0; font-size: 14px; margin-left: auto; opacity: 0.7; }

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

/* Notification Panel */
.notification-panel { }
.np-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.np-tabs { margin-bottom: 12px; }
.np-list { max-height: 360px; overflow-y: auto; }
.np-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; position: relative; }
.np-item:hover { background: #f5f7fa; }
.np-item.unread { background: #f0f5ff; }
.np-item.unread:hover { background: #e8eeff; }
.np-dot { width: 8px; height: 8px; border-radius: 50%; background: #409eff; flex-shrink: 0; margin-top: 6px; }
.np-content { flex: 1; min-width: 0; }
.np-title { font-size: 13px; font-weight: 600; color: #303133; margin-bottom: 4px; }
.np-desc { font-size: 12px; color: #606266; line-height: 1.5; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.np-time { font-size: 11px; color: #c0c4cc; margin-top: 4px; }
.np-empty { text-align: center; color: #c0c4cc; padding: 40px 0; font-size: 14px; }
</style>

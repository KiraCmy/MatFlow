<template>
  <div class="dashboard">
    <!-- Welcome -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>欢迎回来，{{ userStore.user.name }} <span class="ai-badge">AI赋能</span></h2>
        <p>今日待处理：{{ todoCount }} 项任务 · AI已为您节省 ¥{{ (285000).toLocaleString() }} 材料成本</p>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" @click="$router.push('/ai-selection/image-search')">
          <el-icon><MagicStick /></el-icon> 开始AI选材
        </el-button>
        <el-button @click="$router.push('/projects')">
          <el-icon><Folder /></el-icon> 项目列表
        </el-button>
      </div>
    </div>

    <!-- Stats Row -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6" v-for="s in statCards" :key="s.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{background: s.bg}"><el-icon :size="24" :color="s.color"><component :is="s.icon" /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value" :style="{color: s.color}">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
          <div class="stat-trend" :class="s.trend > 0 ? 'up' : 'down'">
            <el-icon><component :is="s.trend > 0 ? 'Top' : 'Bottom'" /></el-icon>
            {{ Math.abs(s.trend) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <!-- Left column -->
      <el-col :span="16">
        <!-- Active Projects -->
        <el-card shadow="hover" class="card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">进行中的项目</span>
              <el-button text type="primary" @click="$router.push('/projects')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="activeProjects" stripe style="width:100%">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="name" label="项目名称" min-width="160">
              <template #default="{row}">
                <div style="font-weight:500;">{{ row.name }}</div>
                <div style="font-size:12px;color:#909399;">{{ row.style }} · {{ row.area }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="designer" label="设计师" width="90" />
            <el-table-column prop="progress" label="进度" width="160">
              <template #default="{row}">
                <el-progress :percentage="row.progress" :stroke-width="10" :color="getProgressColor(row.progress)" />
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止日期" width="110" />
            <el-table-column prop="materialCost" label="材料成本" width="110">
              <template #default="{row}">
                <span v-if="row.materialCost">¥{{ row.materialCost.toLocaleString() }}</span>
                <span v-else style="color:#c0c4cc;">-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- AI Selection Summary -->
        <el-card shadow="hover" class="card" style="margin-top:16px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">✦ AI选材动态</span>
              <span class="ai-badge">实时</span>
            </div>
          </template>
          <el-row :gutter="16">
            <el-col :span="8" v-for="ai in aiStats" :key="ai.title">
              <div class="ai-stat-item" :style="{borderColor: ai.color}">
                <div class="ai-stat-num" :style="{color: ai.color}">{{ ai.value }}</div>
                <div class="ai-stat-title">{{ ai.title }}</div>
                <div class="ai-stat-desc">{{ ai.desc }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- Right column -->
      <el-col :span="8">
        <!-- Quick Actions -->
        <el-card shadow="hover" class="card">
          <template #header><span style="font-weight:600;">快捷操作</span></template>
          <div class="quick-actions">
            <div class="quick-action-item" v-for="a in quickActions" :key="a.label" @click="$router.push(a.route)">
              <div class="qa-icon" :style="{background: a.bg}"><el-icon :size="20" :color="a.color"><component :is="a.icon" /></el-icon></div>
              <div>
                <div class="qa-label">{{ a.label }}</div>
                <div class="qa-desc">{{ a.desc }}</div>
              </div>
              <el-icon style="color:#c0c4cc;"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>

        <!-- Pending Tasks -->
        <el-card shadow="hover" class="card" style="margin-top:16px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">待处理事项</span>
              <el-badge :value="todoCount" type="danger" />
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item" v-for="t in todos" :key="t.text">
              <el-tag :type="t.type" size="small" effect="dark">{{ t.tag }}</el-tag>
              <span class="todo-text">{{ t.text }}</span>
            </div>
          </div>
        </el-card>

        <!-- Material Cost Chart -->
        <el-card shadow="hover" class="card" style="margin-top:16px;">
          <template #header><span style="font-weight:600;">材料成本分布</span></template>
          <div style="padding:10px 0;">
            <div class="cost-bar-item" v-for="c in costDistribution" :key="c.name">
              <div class="cost-bar-label">{{ c.name }}</div>
              <div class="cost-bar-track">
                <div class="cost-bar-fill" :style="{width: c.pct+'%', background: c.color}"></div>
              </div>
              <div class="cost-bar-value">{{ c.pct }}%</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/app'
import { mockProjects } from '../assets/mock/data'

const userStore = useAppStore()
const activeProjects = computed(() => mockProjects.filter(p => p.status === '进行中').slice(0, 4))
const todoCount = 5

const statCards = [
  { label: '进行中项目', value: 4, icon: 'Folder', color: '#409eff', bg: '#ecf5ff', trend: 15 },
  { label: 'AI选材次数', value: 156, icon: 'MagicStick', color: '#764ba2', bg: '#f3e5f5', trend: 28 },
  { label: '材料总成本', value: '¥181万', icon: 'Money', color: '#e6a23c', bg: '#fdf6ec', trend: -5 },
  { label: 'AI成本节省', value: '¥28.5万', icon: 'TrendCharts', color: '#67c23a', bg: '#f0f9eb', trend: 12 },
]

const aiStats = [
  { title: '图搜图', value: '89次', desc: '本月图片搜索次数', color: '#667eea' },
  { title: '语意搜材', value: '45次', desc: '本月文本搜索次数', color: '#764ba2' },
  { title: '平替推荐', value: '22次', desc: '节省成本¥28.5万', color: '#f093fb' },
]

const quickActions = [
  { label: '图搜图', desc: '上传图片搜索材料', icon: 'Picture', route: '/ai-selection/image-search', bg: '#ecf5ff', color: '#409eff' },
  { label: '语意搜材', desc: '描述需求AI匹配', icon: 'Search', route: '/ai-selection/text-search', bg: '#f3e5f5', color: '#764ba2' },
  { label: '平替推荐', desc: '智能替代方案', icon: 'Refresh', route: '/ai-selection/alternative', bg: '#fef0f0', color: '#f56c6c' },
  { label: '创建项目', desc: '新建空间项目', icon: 'Plus', route: '/projects', bg: '#f0f9eb', color: '#67c23a' },
  { label: '采购订单', desc: '管理采购流程', icon: 'Tickets', route: '/purchase-orders', bg: '#fdf6ec', color: '#e6a23c' },
]

const todos = [
  { tag: '紧急', text: '蓝山咖啡-黄铜踢脚线封样待确认', type: 'danger' },
  { tag: '审批', text: 'MASHUP潮牌店预算待老板审批', type: 'warning' },
  { tag: '采购', text: '黑胡桃木饰面板-待下单', type: '' },
  { tag: '收货', text: '光语照明灯具-生产中预计4/15发货', type: 'info' },
  { tag: '财务', text: '石材源供应链尾款¥4.08万待支付', type: 'warning' },
]

const costDistribution = [
  { name: '石材/岩板', pct: 38, color: '#409eff' },
  { name: '涂料/辅材', pct: 22, color: '#67c23a' },
  { name: '木材/饰面', pct: 18, color: '#e6a23c' },
  { name: '金属装饰', pct: 12, color: '#f56c6c' },
  { name: '其他', pct: 10, color: '#909399' },
]

function getProgressColor(p) { return p > 80 ? '#67c23a' : p > 40 ? '#e6a23c' : '#409eff' }
</script>

<style scoped>
.dashboard { max-width: 1400px; }

.welcome-banner {
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px; padding: 28px 32px; margin-bottom: 20px; color: #fff;
}
.welcome-text h2 { font-size: 22px; margin-bottom: 8px; }
.welcome-text p { font-size: 14px; opacity: 0.85; }
.welcome-actions .el-button--primary { background: #fff; color: #764ba2; border-color: #fff; font-weight: 600; }
.welcome-actions .el-button:not(.el-button--primary) { background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3); }
.welcome-actions .el-button:hover { opacity: 0.9; }

.stat-card { display: flex; align-items: center; gap: 14px; padding: 20px; }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-info { flex: 1; }
.stat-value { font-size: 24px; font-weight: 700; }
.stat-label { font-size: 13px; color: #909399; margin-top: 2px; }
.stat-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 2px; }

.card { border-radius: 10px; }

.ai-stat-item {
  text-align: center; padding: 20px 12px; border-radius: 10px;
  border: 1px solid #ebeef5; transition: all 0.3s;
}
.ai-stat-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
.ai-stat-num { font-size: 32px; font-weight: 700; }
.ai-stat-title { font-size: 14px; font-weight: 600; color: #303133; margin-top: 8px; }
.ai-stat-desc { font-size: 12px; color: #909399; margin-top: 4px; }

.quick-actions { display: flex; flex-direction: column; gap: 8px; }
.quick-action-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: 8px; cursor: pointer; transition: background 0.2s;
}
.quick-action-item:hover { background: #f5f7fa; }
.qa-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qa-label { font-size: 14px; font-weight: 500; color: #303133; }
.qa-desc { font-size: 12px; color: #909399; }

.todo-list { display: flex; flex-direction: column; gap: 10px; }
.todo-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #f5f7fa; }
.todo-item:last-child { border-bottom: none; }
.todo-text { font-size: 13px; color: #606266; flex: 1; }

.cost-bar-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cost-bar-label { width: 70px; font-size: 12px; color: #606266; text-align: right; flex-shrink: 0; }
.cost-bar-track { flex: 1; height: 18px; background: #f5f7fa; border-radius: 9px; overflow: hidden; }
.cost-bar-fill { height: 100%; border-radius: 9px; transition: width 0.6s ease; }
.cost-bar-value { width: 40px; font-size: 12px; color: #909399; font-weight: 600; }
</style>

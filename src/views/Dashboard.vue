<template>
  <div class="dashboard">
    <!-- Welcome -->
    <div class="welcome-banner" :style="{background: roleConfig.bannerBg}">
      <div class="welcome-text">
        <h2>欢迎回来，{{ userStore.user.name }} <span class="ai-badge">{{ roleConfig.badgeText }}</span></h2>
        <p>{{ roleConfig.welcomeDesc }}</p>
      </div>
      <div class="welcome-actions">
        <el-button v-for="a in roleConfig.quickBtns" :key="a.label" :type="a.type || 'primary'"
          @click="$router.push(a.route)">
          <el-icon><component :is="a.icon" /></el-icon> {{ a.label }}
        </el-button>
      </div>
    </div>

    <!-- Stats Row -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="s in roleConfig.stats" :key="s.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{background: s.bg}"><el-icon :size="24" :color="s.color"><component :is="s.icon" /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value" :style="{color: s.color}">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
          <div class="stat-trend" :class="s.trend > 0 ? 'up' : 'down'" v-if="s.trend !== undefined">
            <el-icon><component :is="s.trend > 0 ? 'Top' : 'Bottom'" /></el-icon>
            {{ Math.abs(s.trend) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <!-- Left column -->
      <el-col :xs="24" :sm="24" :md="16">
        <!-- Main content card: role-specific -->
        <el-card shadow="hover" class="card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">{{ roleConfig.mainCardTitle }}</span>
              <el-button v-if="roleConfig.mainCardLink" text type="primary" @click="$router.push(roleConfig.mainCardLink.route)">{{ roleConfig.mainCardLink.text }}</el-button>
            </div>
          </template>

          <!-- Designer: Active Projects Table -->
          <el-table v-if="currentRole === 'designer'" :data="activeProjects" stripe style="width:100%">
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

          <!-- Purchaser: Pending Orders -->
          <el-table v-if="currentRole === 'purchaser'" :data="purchaserOrders" stripe style="width:100%">
            <el-table-column prop="id" label="订单号" width="120" />
            <el-table-column prop="supplier" label="供应商" width="140" />
            <el-table-column prop="items" label="物料数" width="80" />
            <el-table-column prop="totalAmount" label="金额" width="120">
              <template #default="{row}"><span style="font-weight:600;color:#f56c6c;">¥{{ row.totalAmount.toLocaleString() }}</span></template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{row}"><el-tag size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期" width="110" />
          </el-table>

          <!-- Warehouse: Inventory Alerts -->
          <div v-if="currentRole === 'warehouse'">
            <el-table :data="warehouseAlerts" stripe style="width:100%">
              <el-table-column prop="material" label="材料名称" min-width="160">
                <template #default="{row}"><span style="font-weight:500;">{{ row.material }}</span></template>
              </el-table-column>
              <el-table-column prop="stock" label="当前库存" width="100" />
              <el-table-column prop="threshold" label="安全库存" width="100" />
              <el-table-column prop="alertType" label="预警类型" width="120">
                <template #default="{row}"><el-tag :type="row.alertType === '低库存' ? 'danger' : 'warning'" size="small">{{ row.alertType }}</el-tag></template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default><el-button size="small" type="primary" plain>查看详情</el-button></template>
              </el-table-column>
            </el-table>
          </div>

          <!-- Finance: Pending Payments -->
          <el-table v-if="currentRole === 'finance'" :data="financePayments" stripe style="width:100%">
            <el-table-column prop="orderId" label="订单号" width="120" />
            <el-table-column prop="supplier" label="供应商" width="140" />
            <el-table-column prop="amount" label="应付金额" width="120">
              <template #default="{row}"><span style="font-weight:600;color:#f56c6c;">¥{{ row.amount }}</span></template>
            </el-table-column>
            <el-table-column prop="payType" label="类型" width="100">
              <template #default="{row}"><el-tag size="small" :type="row.payType === '尾款' ? 'warning' : ''">{{ row.payType }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="dueDate" label="到期日" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{row}"><el-tag :type="row.status === '待付' ? 'danger' : 'success'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>

          <!-- Boss: Project Health -->
          <el-table v-if="currentRole === 'boss'" :data="bossProjects" stripe style="width:100%">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="name" label="项目名称" min-width="160">
              <template #default="{row}">
                <div style="font-weight:500;">{{ row.name }}</div>
                <div style="font-size:12px;color:#909399;">{{ row.designer }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="进度" width="140">
              <template #default="{row}">
                <el-progress :percentage="row.progress" :stroke-width="10" :color="getProgressColor(row.progress)" />
              </template>
            </el-table-column>
            <el-table-column prop="materialCost" label="材料成本" width="110">
              <template #default="{row}"><span>¥{{ row.materialCost.toLocaleString() }}</span></template>
            </el-table-column>
            <el-table-column prop="budget" label="预算" width="110">
              <template #default="{row}"><span>¥{{ row.budget.toLocaleString() }}</span></template>
            </el-table-column>
            <el-table-column label="预算执行" width="120">
              <template #default="{row}">
                <span :style="{color: row.materialCost/row.budget > 0.9 ? '#f56c6c' : '#67c23a', fontWeight: 600}">
                  {{ Math.round(row.materialCost/row.budget*100) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{row}"><el-tag :type="row.status === '进行中' ? '' : 'success'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- AI Selection Summary (Designer only) -->
        <el-card v-if="currentRole === 'designer'" shadow="hover" class="card" style="margin-top:16px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">✦ AI选材动态</span>
              <span class="ai-badge">实时</span>
            </div>
          </template>
          <el-row :gutter="12">
            <el-col :xs="24" :sm="8" v-for="ai in aiStats" :key="ai.title">
              <div class="ai-stat-item" :style="{borderColor: ai.color}">
                <div class="ai-stat-num" :style="{color: ai.color}">{{ ai.value }}</div>
                <div class="ai-stat-title">{{ ai.title }}</div>
                <div class="ai-stat-desc">{{ ai.desc }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- Supplier Dynamic (Purchaser only) -->
        <el-card v-if="currentRole === 'purchaser'" shadow="hover" class="card" style="margin-top:16px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">供应商动态</span>
            </div>
          </template>
          <el-row :gutter="12">
            <el-col :xs="24" :sm="8" v-for="s in supplierStats" :key="s.title">
              <div class="ai-stat-item" :style="{borderColor: s.color}">
                <div class="ai-stat-num" :style="{color: s.color}">{{ s.value }}</div>
                <div class="ai-stat-title">{{ s.title }}</div>
                <div class="ai-stat-desc">{{ s.desc }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- Cost Analysis (Finance only) -->
        <el-card v-if="currentRole === 'finance'" shadow="hover" class="card" style="margin-top:16px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">月度材料成本分析</span>
              <span class="ai-badge">4月</span>
            </div>
          </template>
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

        <!-- Profit Overview (Boss only) -->
        <el-card v-if="currentRole === 'boss'" shadow="hover" class="card" style="margin-top:16px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">利润分析概览</span>
              <span class="ai-badge">AI预测</span>
            </div>
          </template>
          <el-row :gutter="12">
            <el-col :xs="24" :sm="8" v-for="p in profitStats" :key="p.title">
              <div class="ai-stat-item" :style="{borderColor: p.color}">
                <div class="ai-stat-num" :style="{color: p.color}">{{ p.value }}</div>
                <div class="ai-stat-title">{{ p.title }}</div>
                <div class="ai-stat-desc">{{ p.desc }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- Right column -->
      <el-col :xs="24" :sm="24" :md="8">
        <!-- Quick Actions -->
        <el-card shadow="hover" class="card">
          <template #header><span style="font-weight:600;">快捷操作</span></template>
          <div class="quick-actions">
            <div class="quick-action-item" v-for="a in roleConfig.quickActions" :key="a.label" @click="$router.push(a.route)">
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
              <el-badge :value="roleConfig.todos?.length || 0" type="danger" />
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item" v-for="t in roleConfig.todos" :key="t.text">
              <el-tag :type="t.type" size="small" effect="dark">{{ t.tag }}</el-tag>
              <span class="todo-text">{{ t.text }}</span>
            </div>
          </div>
        </el-card>

        <!-- Budget Execution (Designer: replace cost distribution) -->
        <el-card v-if="currentRole === 'designer'" shadow="hover" class="card" style="margin-top:16px;">
          <template #header><span style="font-weight:600;">我的项目预算执行</span></template>
          <div class="budget-list">
            <div class="budget-item" v-for="b in myBudgets" :key="b.name">
              <div class="budget-header">
                <span class="budget-name">{{ b.name }}</span>
                <span class="budget-pct" :style="{color: b.pct > 90 ? '#f56c6c' : b.pct > 70 ? '#e6a23c' : '#67c23a'}">{{ b.pct }}%</span>
              </div>
              <el-progress :percentage="b.pct" :stroke-width="14" :color="b.pct > 90 ? '#f56c6c' : b.pct > 70 ? '#e6a23c' : '#67c23a'" :show-text="false" />
              <div class="budget-detail">¥{{ b.spent.toLocaleString() }} / ¥{{ b.total.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>

        <!-- Cost Distribution (Boss only) -->
        <el-card v-if="currentRole === 'boss'" shadow="hover" class="card" style="margin-top:16px;">
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
import { mockProjects, mockOrders } from '../assets/mock/data'

const userStore = useAppStore()
const currentRole = computed(() => userStore.user.role)

const activeProjects = computed(() => mockProjects.filter(p => p.status === '进行中').slice(0, 5))
const allProjects = computed(() => mockProjects)

const myBudgets = computed(() => {
  return activeProjects.value.map(p => ({
    name: p.name,
    total: p.budget,
    spent: p.materialCost || Math.floor(p.budget * (0.3 + Math.random() * 0.5)),
    pct: Math.round(((p.materialCost || Math.floor(p.budget * (0.3 + Math.random() * 0.5))) / p.budget) * 100),
  }))
})

const purchaserOrders = computed(() => mockOrders.filter(o => o.status === '待发货' || o.status === '生产中').slice(0, 5))

const warehouseAlerts = [
  { material: '卡拉拉白大理石', stock: '12㎡', threshold: '50㎡', alertType: '低库存' },
  { material: '黑胡桃木饰面板', stock: '8张', threshold: '20张', alertType: '低库存' },
  { material: '氟碳铝板（深灰）', stock: '156张', threshold: '100张', alertType: '呆滞' },
  { material: '微水泥（米白）', stock: '5桶', threshold: '15桶', alertType: '低库存' },
]

const financePayments = [
  { orderId: 'PO-2026-003', supplier: '石材源供应链', amount: '¥40,800', payType: '尾款', dueDate: '2026-04-18', status: '待付' },
  { orderId: 'PO-2026-005', supplier: '光语照明', amount: '¥15,600', payType: '全款', dueDate: '2026-04-20', status: '待付' },
  { orderId: 'PO-2026-001', supplier: '锦华木业', amount: '¥86,400', payType: '尾款', dueDate: '2026-04-25', status: '待付' },
  { orderId: 'PO-2026-002', supplier: '恒美建材', amount: '¥32,000', payType: '中期', dueDate: '2026-04-12', status: '已付' },
]

const bossProjects = computed(() => allProjects.value)

const aiStats = [
  { title: '图搜图', value: '89次', desc: '本月图片搜索次数', color: '#667eea' },
  { title: '语意搜材', value: '45次', desc: '本月文本搜索次数', color: '#764ba2' },
  { title: '平替推荐', value: '22次', desc: '节省成本¥28.5万', color: '#f093fb' },
]

const supplierStats = [
  { title: '合作供应商', value: '7家', desc: '活跃合作中', color: '#409eff' },
  { title: '待处理订单', value: '3单', desc: '需跟进交期', color: '#e6a23c' },
  { title: '本月采购额', value: '¥42万', desc: '环比增长8%', color: '#67c23a' },
]

const profitStats = [
  { title: '本月利润率', value: '18.5%', desc: '行业均值15%', color: '#67c23a' },
  { title: 'AI节省成本', value: '¥28.5万', desc: '累计本年度', color: '#764ba2' },
  { title: '在途项目', value: '6个', desc: '总预算¥520万', color: '#409eff' },
]

const costDistribution = [
  { name: '石材/岩板', pct: 38, color: '#409eff' },
  { name: '涂料/辅材', pct: 22, color: '#67c23a' },
  { name: '木材/饰面', pct: 18, color: '#e6a23c' },
  { name: '金属装饰', pct: 12, color: '#f56c6c' },
  { name: '其他', pct: 10, color: '#909399' },
]

// Role-specific dashboard configuration
const roleConfig = computed(() => {
  const role = currentRole.value
  if (role === 'designer') return {
    bannerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badgeText: 'AI赋能',
    welcomeDesc: '今日待处理：5 项任务 · AI已为您节省 ¥285,000 材料成本',
    stats: [
      { label: '进行中项目', value: 4, icon: 'Folder', color: '#409eff', bg: '#ecf5ff', trend: 15 },
      { label: 'AI选材次数', value: 156, icon: 'MagicStick', color: '#764ba2', bg: '#f3e5f5', trend: 28 },
      { label: '待确认打样', value: 3, icon: 'Stamp', color: '#e6a23c', bg: '#fdf6ec' },
      { label: 'AI成本节省', value: '¥28.5万', icon: 'TrendCharts', color: '#67c23a', bg: '#f0f9eb', trend: 12 },
    ],
    quickBtns: [
      { label: '开始AI选材', icon: 'MagicStick', route: '/ai-selection/image-search' },
      { label: '项目列表', icon: 'Folder', route: '/projects', type: '' },
    ],
    mainCardTitle: '进行中的项目',
    mainCardLink: { text: '查看全部', route: '/projects' },
    quickActions: [
      { label: '图搜图', desc: '上传图片搜索材料', icon: 'Picture', route: '/ai-selection/image-search', bg: '#ecf5ff', color: '#409eff' },
      { label: '语意搜材', desc: '描述需求AI匹配', icon: 'Search', route: '/ai-selection/text-search', bg: '#f3e5f5', color: '#764ba2' },
      { label: '平替推荐', desc: '智能替代方案', icon: 'Refresh', route: '/ai-selection/alternative', bg: '#fef0f0', color: '#f56c6c' },
      { label: '打样管理', desc: '查看打样进度', icon: 'Stamp', route: '/sampling', bg: '#fdf6ec', color: '#e6a23c' },
      { label: '施工反馈', desc: '查看现场反馈', icon: 'SetUp', route: '/construction', bg: '#f0f9eb', color: '#67c23a' },
    ],
    todos: [
      { tag: '紧急', text: '蓝山咖啡-黄铜踢脚线封样待确认', type: 'danger' },
      { tag: '审批', text: 'MASHUP潮牌店预算待老板审批', type: 'warning' },
      { tag: '采购', text: '黑胡桃木饰面板-待下单', type: '' },
      { tag: '收货', text: '光语照明灯具-生产中预计4/15发货', type: 'info' },
      { tag: '打样', text: '微水泥样品已到待确认', type: 'warning' },
    ],
  }
  if (role === 'purchaser') return {
    bannerBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    badgeText: '采购中心',
    welcomeDesc: '今日待处理：4 项采购任务 · 3 笔待付款',
    stats: [
      { label: '待处理订单', value: 3, icon: 'Tickets', color: '#f56c6c', bg: '#fef0f0' },
      { label: '本月采购额', value: '¥42万', icon: 'Money', color: '#e6a23c', bg: '#fdf6ec', trend: 8 },
      { label: '合作供应商', value: 7, icon: 'OfficeBuilding', color: '#409eff', bg: '#ecf5ff' },
      { label: '合同待签署', value: 2, icon: 'Notebook', color: '#764ba2', bg: '#f3e5f5' },
    ],
    quickBtns: [
      { label: '采购订单', icon: 'Tickets', route: '/purchase-orders' },
      { label: '供应商管理', icon: 'OfficeBuilding', route: '/suppliers', type: '' },
    ],
    mainCardTitle: '待处理采购订单',
    mainCardLink: { text: '查看全部', route: '/purchase-orders' },
    quickActions: [
      { label: 'BOM清单', desc: '查看材料需求', icon: 'Document', route: '/bom', bg: '#ecf5ff', color: '#409eff' },
      { label: '采购订单', desc: '管理采购流程', icon: 'Tickets', route: '/purchase-orders', bg: '#fef0f0', color: '#f56c6c' },
      { label: '供应商管理', desc: '评分与维护', icon: 'OfficeBuilding', route: '/suppliers', bg: '#fdf6ec', color: '#e6a23c' },
      { label: '合同管理', desc: '签署与审批', icon: 'Notebook', route: '/contracts', bg: '#f3e5f5', color: '#764ba2' },
      { label: '收货验收', desc: '到货跟踪', icon: 'Box', route: '/receiving', bg: '#f0f9eb', color: '#67c23a' },
    ],
    todos: [
      { tag: '紧急', text: '蓝山咖啡-大理石供应商报价待确认', type: 'danger' },
      { tag: '订单', text: '黑胡桃木饰面板-待下单', type: '' },
      { tag: '合同', text: '锦华木业框架合同待签署', type: 'warning' },
      { tag: '收货', text: '光语照明灯具预计4/15发货', type: 'info' },
    ],
  }
  if (role === 'warehouse') return {
    bannerBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    badgeText: '仓库中心',
    welcomeDesc: '今日待处理：3 项入库 · 1 项出库',
    stats: [
      { label: '库存预警', value: 4, icon: 'Warning', color: '#f56c6c', bg: '#fef0f0' },
      { label: '待入库', value: 3, icon: 'Box', color: '#409eff', bg: '#ecf5ff' },
      { label: '库存总额', value: '¥86万', icon: 'Money', color: '#e6a23c', bg: '#fdf6ec' },
      { label: '本月出库', value: '28次', icon: 'Upload', color: '#67c23a', bg: '#f0f9eb', trend: 5 },
    ],
    quickBtns: [
      { label: '库存管理', icon: 'House', route: '/warehouse' },
      { label: '收货验收', icon: 'Box', route: '/receiving', type: '' },
    ],
    mainCardTitle: '库存预警',
    mainCardLink: { text: '查看全部', route: '/warehouse' },
    quickActions: [
      { label: '库存管理', desc: '查看全部库存', icon: 'House', route: '/warehouse', bg: '#ecf5ff', color: '#409eff' },
      { label: '收货验收', desc: '登记到货材料', icon: 'Box', route: '/receiving', bg: '#fdf6ec', color: '#e6a23c' },
      { label: 'AI库存预警', desc: '低库存/呆滞提醒', icon: 'Warning', route: '/warehouse', bg: '#fef0f0', color: '#f56c6c' },
    ],
    todos: [
      { tag: '紧急', text: '卡拉拉白大理石库存不足，需补货', type: 'danger' },
      { tag: '入库', text: '微水泥（米白）5桶待入库登记', type: '' },
      { tag: '入库', text: '黄铜踢脚线待验收入库', type: '' },
      { tag: '出库', text: '蓝山咖啡项目材料出库申请', type: 'info' },
    ],
  }
  if (role === 'finance') return {
    bannerBg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    badgeText: '财务中心',
    welcomeDesc: '今日待处理：3 笔待付款 · 月度结算中',
    stats: [
      { label: '待付款', value: '¥14.3万', icon: 'Money', color: '#f56c6c', bg: '#fef0f0' },
      { label: '本月结算', value: '¥128万', icon: 'Wallet', color: '#e6a23c', bg: '#fdf6ec', trend: -3 },
      { label: '合同待审', value: 2, icon: 'Notebook', color: '#764ba2', bg: '#f3e5f5' },
      { label: '利润率', value: '18.5%', icon: 'TrendCharts', color: '#67c23a', bg: '#f0f9eb', trend: 2 },
    ],
    quickBtns: [
      { label: '付款管理', icon: 'Money', route: '/finance' },
      { label: '合同管理', icon: 'Notebook', route: '/contracts', type: '' },
    ],
    mainCardTitle: '待付款项',
    mainCardLink: { text: '查看全部', route: '/finance' },
    quickActions: [
      { label: '付款管理', desc: '处理付款申请', icon: 'Money', route: '/finance', bg: '#fef0f0', color: '#f56c6c' },
      { label: '成本核算', desc: '材料成本分析', icon: 'DataAnalysis', route: '/finance', bg: '#ecf5ff', color: '#409eff' },
      { label: '合同管理', desc: '合同审核付款', icon: 'Notebook', route: '/contracts', bg: '#f3e5f5', color: '#764ba2' },
    ],
    todos: [
      { tag: '紧急', text: '石材源供应链尾款¥4.08万到期', type: 'danger' },
      { tag: '付款', text: '光语照明灯具全款¥1.56万待付', type: 'warning' },
      { tag: '付款', text: '锦华木业尾款¥8.64万待付', type: 'warning' },
      { tag: '月结', text: '4月材料成本月度结算中', type: 'info' },
    ],
  }
  if (role === 'boss') return {
    bannerBg: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)',
    badgeText: '经营总览',
    welcomeDesc: '今日：6个在途项目 · 总预算¥520万 · 整体利润率18.5%',
    stats: [
      { label: '在途项目', value: 6, icon: 'Folder', color: '#409eff', bg: '#ecf5ff' },
      { label: '总预算', value: '¥520万', icon: 'Money', color: '#e6a23c', bg: '#fdf6ec' },
      { label: '本月利润', value: '¥42.8万', icon: 'TrendCharts', color: '#67c23a', bg: '#f0f9eb', trend: 12 },
      { label: 'AI节省', value: '¥28.5万', icon: 'MagicStick', color: '#764ba2', bg: '#f3e5f5', trend: 18 },
    ],
    quickBtns: [
      { label: '经营决策', icon: 'DataAnalysis', route: '/decision' },
      { label: '项目列表', icon: 'Folder', route: '/projects', type: '' },
    ],
    mainCardTitle: '全局项目看板',
    mainCardLink: { text: '查看全部', route: '/projects' },
    quickActions: [
      { label: '经营决策', desc: 'AI利润预测与分析', icon: 'DataAnalysis', route: '/decision', bg: '#ecf5ff', color: '#409eff' },
      { label: '财务结算', desc: '全局财务总览', icon: 'Money', route: '/finance', bg: '#fef0f0', color: '#f56c6c' },
      { label: '项目列表', desc: '所有项目进展', icon: 'Folder', route: '/projects', bg: '#fdf6ec', color: '#e6a23c' },
      { label: '合同管理', desc: '合同签署与付款', icon: 'Notebook', route: '/contracts', bg: '#f3e5f5', color: '#764ba2' },
      { label: '供应商', desc: '供应商评估', icon: 'OfficeBuilding', route: '/suppliers', bg: '#f0f9eb', color: '#67c23a' },
    ],
    todos: [
      { tag: '审批', text: 'MASHUP潮牌店预算¥48万待审批', type: 'danger' },
      { tag: '财务', text: '4月利润分析报告待生成', type: 'warning' },
      { tag: '项目', text: '蓝山咖啡进度延迟风险', type: 'warning' },
      { tag: '供应商', text: '锦华木业年度评分待审核', type: 'info' },
    ],
  }
  return {
    bannerBg: '#f0f2f5',
    badgeText: '',
    welcomeDesc: '请先登录',
    stats: [],
    quickBtns: [],
    mainCardTitle: '',
    mainCardLink: null,
    quickActions: [],
    todos: [],
  }
})

function getProgressColor(p) { return p > 80 ? '#67c23a' : p > 40 ? '#e6a23c' : '#409eff' }
</script>

<style scoped>
.dashboard { max-width: 1400px; }

.welcome-banner {
  display: flex; justify-content: space-between; align-items: center;
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
.stat-trend.up { color: #67c23a; }
.stat-trend.down { color: #f56c6c; }

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

.budget-list { display: flex; flex-direction: column; gap: 14px; }
.budget-item { }
.budget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.budget-name { font-size: 13px; color: #606266; }
.budget-pct { font-size: 14px; font-weight: 700; }
.budget-detail { font-size: 12px; color: #909399; margin-top: 4px; }

/* ===== Mobile Responsive ===== */
@media (max-width: 768px) {
  .dashboard { max-width: 100%; }
  .welcome-banner {
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px;
    text-align: center;
  }
  .welcome-text h2 { font-size: 18px; }
  .welcome-text p { font-size: 12px; }
  .welcome-actions { display: flex; gap: 8px; width: 100%; }
  .welcome-actions .el-button { flex: 1; font-size: 13px; }

  .stat-card { padding: 14px 12px; }
  .stat-icon { width: 40px; height: 40px; }
  .stat-value { font-size: 20px; }
  .stat-label { font-size: 12px; }

  .ai-stat-item { padding: 14px 8px; }
  .ai-stat-num { font-size: 24px; }

  .module-header { flex-direction: column; gap: 8px; align-items: flex-start; }

  /* Force tables to scroll horizontally on mobile */
  :deep(.el-table) { font-size: 13px; }
  :deep(.el-card__body) { padding: 14px; }
}
</style>

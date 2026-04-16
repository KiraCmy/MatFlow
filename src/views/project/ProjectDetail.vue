<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Folder /></el-icon> {{ project?.name || '项目详情' }}</h2>
        <p class="module-desc">{{ project?.type }} · {{ project?.area }} · {{ project?.style }}</p>
      </div>
      <el-button @click="$router.push('/projects')"><el-icon><ArrowLeft /></el-icon> 返回列表</el-button>
    </div>

    <!-- Project Info Bar -->
    <el-card shadow="hover" class="info-bar" v-if="project">
      <el-row :gutter="20">
        <el-col :span="4"><div class="ib-item"><div class="ib-label">项目编号</div><div class="ib-value">{{ project.id }}</div></div></el-col>
        <el-col :span="4"><div class="ib-item"><div class="ib-label">状态</div><div><el-tag :type="statusType(project.status)" size="small">{{ project.status }}</el-tag></div></div></el-col>
        <el-col :span="4"><div class="ib-item"><div class="ib-label">设计师</div><div class="ib-value">{{ project.designer }}</div></div></el-col>
        <el-col :span="4"><div class="ib-item"><div class="ib-label">进度</div><div class="ib-value">{{ project.progress }}%</div></div></el-col>
        <el-col :span="4"><div class="ib-item"><div class="ib-label">材料成本</div><div class="ib-value cost">¥{{ project.materialCost?.toLocaleString() }}</div></div></el-col>
        <el-col :span="4"><div class="ib-item"><div class="ib-label">预算</div><div class="ib-value">¥{{ project.budget.toLocaleString() }}</div></div></el-col>
      </el-row>
    </el-card>

    <!-- Construction Party Info -->
    <el-card shadow="hover" style="margin-top:12px;" v-if="constructionParty">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;">施工方信息</span>
          <el-button size="small" text type="primary">编辑</el-button>
        </div>
      </template>
      <el-row :gutter="24">
        <el-col :span="6"><div class="cp-item"><div class="cp-label">施工方</div><div class="cp-value">{{ constructionParty.company }}</div></div></el-col>
        <el-col :span="6"><div class="cp-item"><div class="cp-label">联系人</div><div class="cp-value">{{ constructionParty.contact }}</div></div></el-col>
        <el-col :span="6"><div class="cp-item"><div class="cp-label">电话</div><div class="cp-value">{{ constructionParty.phone }}</div></div></el-col>
        <el-col :span="6"><div class="cp-item"><div class="cp-label">施工范围</div><div class="cp-value">{{ constructionParty.scope }}</div></div></el-col>
      </el-row>
    </el-card>

    <!-- Tabs -->
    <el-tabs v-model="activeTab" style="margin-top:16px;">
      <el-tab-pane label="BOM清单" name="bom">
        <el-table :data="projectBOM" stripe>
          <el-table-column prop="id" label="编号" width="80" />
          <el-table-column prop="name" label="材料名称" min-width="160">
            <template #default="{row}"><span style="font-weight:500;">{{ row.name }}</span><div style="font-size:12px;color:#909399;">{{ row.spec }}</div></template>
          </el-table-column>
          <el-table-column prop="category" label="类别" width="80" />
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="unit" label="单位" width="50" />
          <el-table-column prop="unitPrice" label="单价" width="90">
            <template #default="{row}"><span style="color:#f56c6c;">¥{{ row.unitPrice }}</span></template>
          </el-table-column>
          <el-table-column label="小计" width="100">
            <template #default="{row}"><span style="font-weight:600;">¥{{ (row.quantity * row.unitPrice).toLocaleString() }}</span></template>
          </el-table-column>
          <el-table-column prop="supplier" label="供应商" width="120" />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{row}"><el-tag :type="bomStatusType(row.status)" size="small">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="selectedBy" label="选材方式" width="100">
            <template #default="{row}">
              <span v-if="row.selectedBy.startsWith('AI')" class="ai-badge" style="font-size:10px;">{{ row.selectedBy }}</span>
              <span v-else style="font-size:12px;color:#909399;">{{ row.selectedBy }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="采购订单" name="orders">
        <el-table :data="projectOrders" stripe>
          <el-table-column prop="id" label="订单号" width="100" />
          <el-table-column prop="supplier" label="供应商" width="140" />
          <el-table-column prop="items" label="物料数" width="70" />
          <el-table-column prop="totalAmount" label="金额" width="110">
            <template #default="{row}"><span style="font-weight:600;color:#f56c6c;">¥{{ row.totalAmount.toLocaleString() }}</span></template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{row}"><el-tag size="small">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="createDate" label="下单日期" width="110" />
          <el-table-column prop="deliveryDate" label="交货日期" width="110" />
          <el-table-column prop="payStatus" label="付款状态" width="100" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="成本预估" name="cost">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header><span style="font-weight:600;">AI成本预估 <span class="ai-badge">AI</span></span></template>
              <div class="cost-summary">
                <div class="cs-row"><span>材料预算</span><span>¥{{ project?.budget?.toLocaleString() }}</span></div>
                <div class="cs-row"><span>AI预估成本</span><span style="color:#67c23a;">¥{{ (project?.budget * 0.47).toLocaleString() }}</span></div>
                <div class="cs-row"><span>预估节省</span><span style="color:#67c23a;">12.5%</span></div>
                <el-divider />
                <div class="cs-row"><span>已发生成本</span><span>¥{{ project?.materialCost?.toLocaleString() }}</span></div>
                <div class="cs-row"><span>剩余预算</span><span>¥{{ ((project?.budget || 0) - (project?.materialCost || 0)).toLocaleString() }}</span></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header><span style="font-weight:600;">成本分类占比</span></template>
              <div v-for="c in costBreakdown" :key="c.name" class="cost-bar-item">
                <span class="cost-bar-label">{{ c.name }}</span>
                <div class="cost-bar-track"><div class="cost-bar-fill" :style="{width: c.pct+'%',background: c.color}"></div></div>
                <span class="cost-bar-val">{{ c.pct }}%</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockProjects, mockBOMItems, mockOrders } from '../../assets/mock/data'

const route = useRoute()
const activeTab = ref('bom')

const project = computed(() => mockProjects.find(p => p.id === route.params.id))
const projectBOM = computed(() => mockBOMItems.filter(b => b.projectId === route.params.id))
const projectOrders = computed(() => mockOrders.filter(o => o.projectId === route.params.id))

const costBreakdown = [
  { name: '石材', pct: 42, color: '#409eff' }, { name: '涂料', pct: 20, color: '#67c23a' },
  { name: '木材', pct: 18, color: '#e6a23c' }, { name: '金属', pct: 12, color: '#f56c6c' }, { name: '其他', pct: 8, color: '#909399' },
]

const constructionParties = {
  'P001': { company: '精工装饰工程有限公司', contact: '王建国', phone: '138-0000-1234', scope: '大堂地面、前台背景墙' },
  'P002': { company: '鸿宇空间装饰', contact: '李明辉', phone: '139-0000-5678', scope: '全区域施工' },
  'P003': { company: '盛世华庭装饰集团', contact: '张伟', phone: '136-0000-9012', scope: '全区域施工' },
  'P004': { company: '锐创建筑装饰', contact: '刘洋', phone: '137-0000-3456', scope: '外立面、大堂' },
  'P005': { company: '鸿宇空间装饰', contact: '李明辉', phone: '139-0000-5678', scope: '全区域施工' },
  'P006': { company: '精工装饰工程有限公司', contact: '王建国', phone: '138-0000-1234', scope: '全区域施工' },
}

const constructionParty = computed(() => constructionParties[route.params.id] || null)

function statusType(s) { return s === '进行中' ? '' : s === '已完工' ? 'success' : 'warning' }
function bomStatusType(s) { return s === '已到货' || s === '已采购' ? 'success' : s.startsWith('待') ? 'warning' : 'info' }
</script>

<style scoped>
.info-bar { border-radius: 10px; }
.ib-item { text-align: center; }
.ib-label { font-size: 12px; color: #909399; margin-bottom: 4px; }
.ib-value { font-size: 16px; font-weight: 600; color: #303133; }
.ib-value.cost { color: #f56c6c; }

.cost-summary { padding: 8px 0; }
.cs-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #606266; }
.cs-row span:last-child { font-weight: 600; color: #303133; }

.cost-bar-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.cost-bar-label { width: 50px; font-size: 13px; color: #606266; text-align: right; }
.cost-bar-track { flex: 1; height: 16px; background: #f5f7fa; border-radius: 8px; overflow: hidden; }
.cost-bar-fill { height: 100%; border-radius: 8px; transition: width 0.6s; }
.cost-bar-val { width: 40px; font-size: 12px; color: #909399; font-weight: 600; }

.cp-item { text-align: center; }
.cp-label { font-size: 12px; color: #909399; margin-bottom: 4px; }
.cp-value { font-size: 14px; font-weight: 600; color: #303133; }
</style>

<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><DataAnalysis /></el-icon> 经营决策 <span class="ai-badge">AI辅助</span></h2>
        <p class="module-desc">全局材料交付监控、材料利润贡献分析、AI利润预测</p>
      </div>
    </div>

    <!-- KPI Cards -->
    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="6" v-for="k in kpiCards" :key="k.label">
        <el-card shadow="hover" :body-style="{padding:'20px'}" class="kpi-card">
          <div class="kpi-icon" :style="{background:k.bg}"><el-icon :size="24" :color="k.color"><component :is="k.icon" /></el-icon></div>
          <div>
            <div class="kpi-value" :style="{color:k.color}">{{ k.value }}</div>
            <div class="kpi-label">{{ k.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="16">
        <!-- Project Delivery Dashboard -->
        <el-card shadow="hover" class="dash-card">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">全局交付状态看板</span>
              <el-radio-group v-model="viewRange" size="small"><el-radio-button value="all">全部</el-radio-button><el-radio-button value="risk">有风险</el-radio-button></el-radio-group>
            </div>
          </template>
          <el-table :data="deliveryData" stripe :row-class-name="rowClass">
            <el-table-column prop="project" label="项目" min-width="140">
              <template #default="{row}"><span style="font-weight:500;">{{ row.project }}</span></template>
            </el-table-column>
            <el-table-column prop="materialCount" label="材料项" width="70" />
            <el-table-column prop="purchased" label="已采购" width="70" />
            <el-table-column prop="inStock" label="已到货" width="70" />
            <el-table-column label="采购进度" width="150">
              <template #default="{row}">
                <el-progress :percentage="row.progress" :stroke-width="10" :color="row.progress>=80?'#67c23a':row.progress>=50?'#e6a23c':'#f56c6c'" />
              </template>
            </el-table-column>
            <el-table-column prop="risk" label="风险" width="70">
              <template #default="{row}">
                <el-tag v-if="row.risk" type="danger" size="small">{{ row.risk }}</el-tag>
                <el-tag v-else type="success" size="small">正常</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="aiPredict" label="AI交付预测" width="120">
              <template #default="{row}"><span :style="{color: row.aiPredict==='准时'?'#67c23a':'#f56c6c',fontWeight:600}">{{ row.aiPredict }}</span></template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- Material Profit Analysis -->
        <el-card shadow="hover" class="dash-card" style="margin-top:16px;">
          <template #header><span style="font-weight:600;">材料利润贡献分析</span></template>
          <el-table :data="profitData" stripe>
            <el-table-column prop="project" label="项目" min-width="140" />
            <el-table-column prop="budget" label="项目预算" width="110">
              <template #default="{row}"><span>¥{{ row.budget.toLocaleString() }}</span></template>
            </el-table-column>
            <el-table-column prop="materialCost" label="材料成本" width="110">
              <template #default="{row}"><span style="color:#f56c6c;font-weight:600;">¥{{ row.materialCost.toLocaleString() }}</span></template>
            </el-table-column>
            <el-table-column prop="costRatio" label="材料占比" width="90">
              <template #default="{row}"><span :style="{color:row.costRatio>50?'#f56c6c':'#67c23a',fontWeight:600}">{{ row.costRatio }}%</span></template>
            </el-table-column>
            <el-table-column prop="profitRate" label="材料利润率" width="100">
              <template #default="{row}"><span style="font-weight:600;color:#67c23a;">{{ row.profitRate }}%</span></template>
            </el-table-column>
            <el-table-column prop="aiSaving" label="AI节省" width="100">
              <template #default="{row}"><span style="color:#67c23a;font-weight:600;">¥{{ row.aiSaving.toLocaleString() }}</span></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- AI Profit Prediction -->
        <el-card shadow="hover" class="dash-card">
          <template #header><span style="font-weight:600;">✦ AI利润预测 <span class="ai-badge">AI</span></span></template>
          <div v-for="pred in predictions" :key="pred.project" class="pred-item">
            <div class="pred-project">{{ pred.project }}</div>
            <div class="pred-bar-wrap">
              <div class="pred-bar">
                <div class="pred-bar-fill" :style="{width: pred.materialPct+'%', background: pred.materialPct > 45 ? '#f56c6c' : '#67c23a'}"></div>
              </div>
            </div>
            <div class="pred-info">
              <span>材料占比 <strong>{{ pred.materialPct }}%</strong></span>
              <span>利润贡献 <strong style="color:#67c23a;">{{ pred.profitContrib }}%</strong></span>
            </div>
            <div class="pred-advice" :style="{borderLeftColor: pred.materialPct > 45 ? '#f56c6c' : '#67c23a'}">
              {{ pred.advice }}
            </div>
          </div>
        </el-card>

        <!-- Data Archive -->
        <el-card shadow="hover" class="dash-card" style="margin-top:16px;">
          <template #header><span style="font-weight:600;">AI全链路数据归档</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="选型决策数据">156条记录</el-descriptions-item>
            <el-descriptions-item label="采购执行数据">68条记录</el-descriptions-item>
            <el-descriptions-item label="施工反馈数据">42条记录</el-descriptions-item>
            <el-descriptions-item label="成本结算数据">18条记录</el-descriptions-item>
            <el-descriptions-item label="AI模型优化">
              <span style="color:#67c23a;font-weight:600;">选材准确率 89.2% ↑</span>
            </el-descriptions-item>
          </el-descriptions>
          <el-button type="primary" style="width:100%;margin-top:12px;">查看归档详情</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const viewRange = ref('all')

const kpiCards = [
  { label: 'AI成本节省', value: '¥28.5万', icon: 'TrendCharts', color: '#67c23a', bg: '#f0f9eb' },
  { label: '平均材料占比', value: '47.1%', icon: 'PieChart', color: '#409eff', bg: '#ecf5ff' },
  { label: '交付准时率', value: '92%', icon: 'Timer', color: '#e6a23c', bg: '#fdf6ec' },
  { label: 'AI选材准确率', value: '89.2%', icon: 'MagicStick', color: '#764ba2', bg: '#f3e5f5' },
]

const deliveryData = [
  { project: '蓝山咖啡旗舰店', materialCount: 8, purchased: 6, inStock: 3, progress: 75, risk: '2项逾期', aiPredict: '可能延期' },
  { project: '悦庭日料餐厅', materialCount: 12, purchased: 8, inStock: 4, progress: 67, risk: '', aiPredict: '准时' },
  { project: 'MASHUP潮牌店', materialCount: 5, purchased: 1, inStock: 0, progress: 20, risk: '预算待批', aiPredict: '准时' },
  { project: '光合办公空间', materialCount: 15, purchased: 10, inStock: 7, progress: 73, risk: '1项逾期', aiPredict: '准时' },
  { project: '花间堂民宿改造', materialCount: 10, purchased: 7, inStock: 5, progress: 70, risk: '', aiPredict: '准时' },
]

const profitData = [
  { project: '蓝山咖啡旗舰店', budget: 680000, materialCost: 320500, costRatio: 47, profitRate: 22, aiSaving: 48000 },
  { project: '悦庭日料餐厅', budget: 450000, materialCost: 210000, costRatio: 47, profitRate: 25, aiSaving: 35000 },
  { project: '光合办公空间', budget: 900000, materialCost: 420000, costRatio: 47, profitRate: 20, aiSaving: 52000 },
  { project: '花间堂民宿改造', budget: 550000, materialCost: 280000, costRatio: 51, profitRate: 18, aiSaving: 38000 },
  { project: '云栖精品酒店大堂', budget: 1200000, materialCost: 580000, costRatio: 48, profitRate: 24, aiSaving: 72000 },
]

const predictions = [
  { project: '蓝山咖啡旗舰店', materialPct: 47, profitContrib: 22, advice: '材料占比正常，AI平替已节省¥4.8万' },
  { project: '花间堂民宿改造', materialPct: 51, profitContrib: 18, advice: '⚠ 材料占比偏高，建议关注大理石替代方案' },
  { project: 'MASHUP潮牌店', materialPct: 38, profitContrib: 28, advice: '材料占比低，利润空间充足' },
]

function rowClass({row}) { return row.risk ? 'risk-row' : '' }
</script>

<style scoped>
.kpi-card { display: flex; align-items: center; gap: 14px; border-radius: 10px; }
.kpi-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-value { font-size: 22px; font-weight: 700; }
.kpi-label { font-size: 13px; color: #909399; margin-top: 2px; }
.dash-card { border-radius: 10px; }

.pred-item { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f2f5; }
.pred-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.pred-project { font-weight: 600; font-size: 14px; margin-bottom: 8px; }
.pred-bar-wrap { margin-bottom: 6px; }
.pred-bar { height: 8px; background: #f0f2f5; border-radius: 4px; overflow: hidden; }
.pred-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s; }
.pred-info { display: flex; justify-content: space-between; font-size: 12px; color: #606266; margin-bottom: 6px; }
.pred-advice { padding: 8px 12px; background: #fafbfc; border-radius: 6px; font-size: 12px; color: #606266; border-left: 3px solid; }

:deep(.risk-row) { background: #fef0f0 !important; }
</style>

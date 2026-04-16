<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><House /></el-icon> 仓库管理 <span class="ai-badge">AI辅助</span></h2>
        <p class="module-desc">材料入库出库管理，AI库存预警与补货建议</p>
      </div>
      <el-space>
        <el-button type="primary"><el-icon><Download /></el-icon> 入库登记</el-button>
        <el-button><el-icon><Upload /></el-icon> 出库登记</el-button>
      </el-space>
    </div>

    <!-- Inventory Stats -->
    <el-row :gutter="16" style="margin-bottom:16px;">
      <el-col :span="6" v-for="s in whStats" :key="s.label">
        <el-card shadow="hover" :body-style="{padding:'16px'}" style="border-radius:8px;">
          <div style="font-size:24px;font-weight:700;" :style="{color:s.color}">{{ s.value }}</div>
          <div style="font-size:13px;color:#909399;margin-top:4px;">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-form :inline="true" style="margin-bottom:16px;">
        <el-form-item><el-input placeholder="搜索材料名称" style="width:180px;" clearable /></el-form-item>
        <el-form-item><el-select placeholder="状态" clearable style="width:120px;"><el-option v-for="s in ['正常','已出库','未入库','生产中','低库存']" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>

      <el-table :data="mockInventory" stripe>
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="材料名称" min-width="140">
          <template #default="{row}"><span style="font-weight:500;">{{ row.name }}</span><div style="font-size:11px;color:#909399;">{{ row.spec }}</div></template>
        </el-table-column>
        <el-table-column prop="stock" label="库存量" width="80">
          <template #default="{row}"><span :style="{color: row.stock===0?'#f56c6c':row.stock<=20?'#e6a23c':'#303133',fontWeight:600}">{{ row.stock }}</span></template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="50" />
        <el-table-column prop="safetyStock" label="安全库存" width="80" />
        <el-table-column prop="location" label="库位" width="80" />
        <el-table-column prop="project" label="关联项目" width="80" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{row}">
            <el-tag :type="row.status==='正常'?'success':row.status==='已出库'?'info':row.status==='未入库'?'warning':'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{row}">
            <el-button size="small" link type="primary">详情</el-button>
            <el-button size="small" link>出入库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- AI Alert -->
    <el-card shadow="hover" style="margin-top:16px;border-left:4px solid #f56c6c;">
      <template #header><span style="font-weight:600;color:#f56c6c;"><el-icon><WarningFilled /></el-icon> AI库存预警</span></template>
      <el-alert v-for="a in alerts" :key="a.text" :title="a.text" :type="a.type" :closable="false" style="margin-bottom:8px;" show-icon />
    </el-card>
  </div>
</template>

<script setup>
import { mockInventory } from '../../assets/mock/data'
const whStats = [
  { label: '在库SKU', value: 128, color: '#409eff' }, { label: '低库存预警', value: 5, color: '#f56c6c' },
  { label: '本月入库', value: 34, color: '#67c23a' }, { label: '本月出库', value: 28, color: '#e6a23c' },
]
const alerts = [
  { text: '【低库存】黑胡桃木饰面板 当前库存 0 张，低于安全库存 20 张，建议补货', type: 'error' },
  { text: '【AI推荐】基于近3个月用量趋势，微水泥墙面漆建议在下月补货 50L', type: 'warning' },
  { text: '【呆滞预警】P004项目剩余意大利灰大理石 32㎡，已超过60天未动，建议调拨至其他项目', type: 'warning' },
]
</script>

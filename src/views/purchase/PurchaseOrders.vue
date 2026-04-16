<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Tickets /></el-icon> 采购订单</h2>
        <p class="module-desc">管理采购订单全生命周期，AI辅助生成订单草稿</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon> AI生成订单</el-button>
    </div>

    <!-- Stats -->
    <el-row :gutter="16" style="margin-bottom:16px;">
      <el-col :span="6" v-for="s in orderStats" :key="s.label">
        <el-card shadow="hover" class="mini-stat" :body-style="{padding:'16px'}">
          <div class="ms-value" :style="{color:s.color}">{{ s.value }}</div>
          <div class="ms-label">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-table :data="mockOrders" stripe>
        <el-table-column prop="id" label="订单号" width="100" />
        <el-table-column prop="projectId" label="项目" width="80" />
        <el-table-column prop="supplier" label="供应商" width="140" />
        <el-table-column prop="items" label="物料数" width="70" />
        <el-table-column prop="totalAmount" label="金额" width="110">
          <template #default="{row}"><span style="font-weight:600;color:#f56c6c;">¥{{ row.totalAmount.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}"><el-tag :type="orderStatusType(row.status)" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createDate" label="下单日期" width="110" />
        <el-table-column prop="deliveryDate" label="交货日期" width="110" />
        <el-table-column prop="payStatus" label="付款状态" width="110" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{row}">
            <el-button size="small" link type="primary">详情</el-button>
            <el-button size="small" link v-if="row.status==='待审批'">审批</el-button>
            <el-button size="small" link type="warning" v-if="row.status==='生产中'">催货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { mockOrders } from '../../assets/mock/data'
const orderStats = [
  { label: '全部订单', value: 6, color: '#409eff' }, { label: '待审批', value: 1, color: '#e6a23c' },
  { label: '生产中', value: 2, color: '#764ba2' }, { label: '已发货', value: 1, color: '#67c23a' },
]
function orderStatusType(s) { return s==='已到货'?'success':s==='已发货'?'':'warning' }
</script>

<style scoped>
.mini-stat { border-radius: 8px; }
.ms-value { font-size: 24px; font-weight: 700; }
.ms-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>

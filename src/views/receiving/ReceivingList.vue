<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Box /></el-icon> 收货验收</h2>
        <p class="module-desc">材料到货登记与质量检验，AI辅助封样比对确认</p>
      </div>
    </div>

    <el-row :gutter="16" style="margin-bottom:16px;">
      <el-col :span="6" v-for="s in recvStats" :key="s.label">
        <el-card shadow="hover" :body-style="{padding:'16px'}" style="border-radius:8px;">
          <div style="font-size:24px;font-weight:700;" :style="{color:s.color}">{{ s.value }}</div>
          <div style="font-size:13px;color:#909399;margin-top:4px;">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <template #header>
        <el-tabs v-model="recvTab" style="margin:-12px 0;">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="待收货" name="pending" />
          <el-tab-pane label="待质检" name="inspect" />
          <el-tab-pane label="待确认" name="confirm" />
        </el-tabs>
      </template>
      <el-table :data="mockOrders.filter(o=>o.status!=='待审批')" stripe>
        <el-table-column prop="id" label="订单号" width="100" />
        <el-table-column prop="projectId" label="项目" width="80" />
        <el-table-column prop="supplier" label="供应商" width="140" />
        <el-table-column prop="totalAmount" label="金额" width="100">
          <template #default="{row}"><span style="color:#f56c6c;">¥{{ row.totalAmount.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{row}"><el-tag size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="到货场景" width="100">
          <template #default="{row}">
            <el-tag size="small" :type="row.supplier==='晶艺玻璃'?'warning':'success'">{{ row.supplier==='晶艺玻璃'?'直送工地':'先入仓库' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="预计到货" width="110" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{row}">
            <el-button size="small" type="primary" link v-if="row.status==='已发货'">登记到货</el-button>
            <el-button size="small" type="success" link v-if="row.status==='已到货'">质检上传</el-button>
            <el-button size="small" type="warning" link>退换货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockOrders } from '../../assets/mock/data'
const recvTab = ref('all')
const recvStats = [
  { label: '待收货', value: 2, color: '#e6a23c' }, { label: '已到货', value: 1, color: '#67c23a' },
  { label: '待质检', value: 1, color: '#409eff' }, { label: '退换中', value: 0, color: '#f56c6c' },
]
</script>

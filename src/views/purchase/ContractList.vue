<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Notebook /></el-icon> 合同管理</h2>
        <p class="module-desc">采购合同在线签署与审批管理</p>
      </div>
    </div>
    <el-card shadow="hover">
      <el-table :data="mockContracts" stripe>
        <el-table-column prop="id" label="合同编号" width="100" />
        <el-table-column prop="orderId" label="关联订单" width="100" />
        <el-table-column prop="supplier" label="供应商" width="140" />
        <el-table-column prop="amount" label="合同金额" width="110">
          <template #default="{row}"><span style="font-weight:600;color:#f56c6c;">¥{{ row.amount.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="payTerms" label="付款条款" width="100" />
        <el-table-column prop="signDate" label="签署日期" width="110" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{row}"><el-tag :type="row.status==='已签署'?'success':row.status==='待审批'?'warning':''" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{row}">
            <el-button size="small" link type="primary">详情</el-button>
            <el-button size="small" link v-if="row.status==='待审批'" type="warning">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { mockContracts } from '../../assets/mock/data'
</script>

<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Stamp /></el-icon> 打样管理</h2>
        <p class="module-desc">新材料/新供应商打样流程管理，AI辅助封样比对</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon> 提交打样需求</el-button>
    </div>

    <el-card shadow="hover">
      <el-table :data="mockSampling" stripe>
        <el-table-column prop="id" label="编号" width="90" />
        <el-table-column prop="projectId" label="项目" width="80" />
        <el-table-column prop="material" label="打样材料" min-width="160">
          <template #default="{row}"><span style="font-weight:500;">{{ row.material }}</span><div style="font-size:11px;color:#909399;">{{ row.remark }}</div></template>
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" width="120" />
        <el-table-column prop="designer" label="设计师" width="80" />
        <el-table-column prop="requestDate" label="需求日期" width="110" />
        <el-table-column prop="expectDate" label="期望到样" width="110" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status==='已通过'?'success':row.status==='封样中'?'':'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{row}">
            <el-button size="small" link type="primary" v-if="row.status==='封样中'">封样确认</el-button>
            <el-button size="small" link v-if="row.status==='待提交'">编辑</el-button>
            <el-button size="small" link type="info">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Sampling Flow -->
    <el-card shadow="hover" style="margin-top:16px;">
      <template #header><span style="font-weight:600;">打样流程</span></template>
      <el-steps :active="2" align-center>
        <el-step title="提交打样需求" description="设计师发起" icon="EditPen" />
        <el-step title="创建打样订单" description="采购专员" icon="Tickets" />
        <el-step title="供应商打样寄样" description="供应商生产" icon="Box" />
        <el-step title="AI封样比对" description="AI辅助判定" icon="MagicStick" />
        <el-step title="封样确认" description="设计师判定" icon="Select" />
        <el-step title="签批量合同" description="封样通过后" icon="Notebook" />
      </el-steps>
    </el-card>
  </div>
</template>

<script setup>
import { mockSampling } from '../../assets/mock/data'
</script>

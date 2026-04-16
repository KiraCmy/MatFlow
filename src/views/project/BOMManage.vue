<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Document /></el-icon> BOM管理 <span class="ai-badge">AI辅助</span></h2>
        <p class="module-desc">项目材料清单管理，支持AI自动生成BOM、版本变更管理</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon> AI生成BOM</el-button>
    </div>

    <el-card shadow="hover">
      <el-form :inline="true" style="margin-bottom:16px;">
        <el-form-item label="所属项目">
          <el-select style="width:200px;" v-model="currentProject">
            <el-option v-for="p in mockProjects" :key="p.id" :label="`${p.id} ${p.name}`" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select style="width:120px;" clearable placeholder="全部"><el-option v-for="s in ['已采购','待采购','打样中','已到货','待确认']" :key="s" :label="s" :value="s" /></el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>导出</el-button></el-form-item>
      </el-form>

      <el-table :data="currentBOM" stripe border>
        <el-table-column type="selection" width="45" />
        <el-table-column prop="id" label="编号" width="70" />
        <el-table-column prop="name" label="材料名称" min-width="140">
          <template #default="{row}"><span style="font-weight:500;">{{ row.name }}</span><div style="font-size:11px;color:#909399;">{{ row.spec }}</div></template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="80" />
        <el-table-column prop="quantity" label="数量" width="70" />
        <el-table-column prop="unit" label="单位" width="50" />
        <el-table-column prop="unitPrice" label="单价" width="85">
          <template #default="{row}"><span style="color:#f56c6c;">¥{{ row.unitPrice }}</span></template>
        </el-table-column>
        <el-table-column label="小计" width="95">
          <template #default="{row}"><span style="font-weight:600;">¥{{ (row.quantity*row.unitPrice).toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{row}"><el-tag :type="row.status==='已到货'||row.status==='已采购'?'success':row.status.startsWith('待')?'warning':'info'" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="selectedBy" label="选材方式" width="100">
          <template #default="{row}"><span v-if="row.selectedBy.startsWith('AI')" class="ai-badge" style="font-size:10px;">{{ row.selectedBy }}</span><span v-else style="font-size:12px;color:#909399;">{{ row.selectedBy }}</span></template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button size="small" link type="primary">编辑</el-button>
            <el-button size="small" link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:#909399;">共 {{ currentBOM.length }} 项材料 · 总计 <strong style="color:#f56c6c;">¥{{ totalCost.toLocaleString() }}</strong></span>
        <el-pagination background layout="total, sizes, prev, pager, next" :total="currentBOM.length" :page-sizes="[10,20,50]" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockProjects, mockBOMItems } from '../../assets/mock/data'
const currentProject = ref('P001')
const currentBOM = computed(() => mockBOMItems.filter(b => b.projectId === currentProject.value))
const totalCost = computed(() => currentBOM.value.reduce((sum, b) => sum + b.quantity * b.unitPrice, 0))
</script>

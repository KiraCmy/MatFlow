<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><OfficeBuilding /></el-icon> 供应商管理</h2>
        <p class="module-desc">维护供应商信息库，AI智能推荐匹配供应商</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon> 新增供应商</el-button>
    </div>

    <el-card shadow="hover">
      <el-form :inline="true" style="margin-bottom:16px;">
        <el-form-item><el-input v-model="kw" placeholder="搜索供应商名称" style="width:200px;" clearable /></el-form-item>
        <el-form-item><el-select v-model="cat" clearable placeholder="材料类目" style="width:140px;"><el-option v-for="c in [...new Set(mockSuppliers.map(s=>s.category))]" :key="c" :label="c" :value="c" /></el-select></el-form-item>
        <el-form-item><el-button type="primary">搜索</el-button></el-form-item>
      </el-form>

      <el-table :data="mockSuppliers" stripe>
        <el-table-column prop="id" label="编号" width="70" />
        <el-table-column prop="name" label="供应商名称" min-width="140" />
        <el-table-column prop="category" label="主营类目" width="120" />
        <el-table-column prop="contact" label="联系人" width="80" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="region" label="地区" width="100" />
        <el-table-column prop="rating" label="评分" width="80">
          <template #default="{row}"><el-rate :model-value="row.rating" disabled :size="14" /></template>
        </el-table-column>
        <el-table-column prop="onTime" label="准时率" width="80">
          <template #default="{row}"><span :style="{color: parseInt(row.onTime)>=95?'#67c23a':'#e6a23c',fontWeight:600}">{{ row.onTime }}</span></template>
        </el-table-column>
        <el-table-column prop="quality" label="质量" width="60"><template #default="{row}"><el-tag :type="row.quality==='优'?'success':''" size="small">{{ row.quality }}</el-tag></template></el-table-column>
        <el-table-column prop="orders" label="合作次数" width="80" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default>
            <el-button size="small" link type="primary">详情</el-button>
            <el-button size="small" link>评价</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockSuppliers } from '../../assets/mock/data'
const kw = ref('')
const cat = ref('')
</script>

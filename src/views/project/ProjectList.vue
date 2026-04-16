<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Folder /></el-icon> 项目列表</h2>
        <p class="module-desc">管理所有品牌空间设计项目，查看项目进度和材料成本</p>
      </div>
      <el-button type="primary" @click="showCreate = true"><el-icon><Plus /></el-icon> 创建项目</el-button>
    </div>

    <!-- Filters -->
    <el-card shadow="hover" style="margin-bottom:16px;">
      <el-form :inline="true">
        <el-form-item label="状态">
          <el-select v-model="filter.status" clearable placeholder="全部" style="width:120px;">
            <el-option v-for="s in ['进行中','待审批','已完工']" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="设计师">
          <el-select v-model="filter.designer" clearable placeholder="全部" style="width:120px;">
            <el-option v-for="d in [...new Set(mockProjects.map(p=>p.designer))]" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="项目名称" style="width:180px;" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="()=>{}">搜索</el-button>
          <el-button @click="filter.status='';filter.designer='';filter.keyword=''">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Project Cards -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="p in mockProjects" :key="p.id">
        <el-card shadow="hover" class="project-card" @click="$router.push(`/projects/${p.id}`)" style="cursor:pointer;">
          <div class="pc-header">
            <el-tag :type="statusType(p.status)" size="small" effect="dark">{{ p.status }}</el-tag>
            <span class="pc-id">{{ p.id }}</span>
          </div>
          <h3 class="pc-name">{{ p.name }}</h3>
          <div class="pc-meta">
            <span><el-icon><Location /></el-icon>{{ p.type }} · {{ p.area }}</span>
            <span><el-icon><Brush /></el-icon>{{ p.style }}</span>
            <span><el-icon><User /></el-icon>{{ p.designer }}</span>
          </div>
          <el-progress :percentage="p.progress" :stroke-width="8" :color="progressColor(p.progress)" style="margin:12px 0;" />
          <div class="pc-footer">
            <div class="pc-cost">
              <div class="pc-cost-label">材料成本</div>
              <div class="pc-cost-value">¥{{ p.materialCost ? p.materialCost.toLocaleString() : '-' }}</div>
              <div class="pc-cost-budget">预算 ¥{{ p.budget.toLocaleString() }}</div>
            </div>
            <div class="pc-dates">
              <div>截止: {{ p.deadline }}</div>
              <div style="font-size:12px;color:#909399;">开始: {{ p.startDate }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showCreate" title="创建新项目" width="500px">
      <el-form label-width="80px">
        <el-form-item label="项目名称"><el-input /></el-form-item>
        <el-form-item label="项目类型"><el-select style="width:100%"><el-option v-for="t in ['商业空间','餐饮空间','零售空间','酒店空间','办公空间','民宿空间']" :key="t" :label="t" :value="t" /></el-select></el-form-item>
        <el-form-item label="面积"><el-input placeholder="如：520㎡" /></el-form-item>
        <el-form-item label="设计风格"><el-input /></el-form-item>
        <el-form-item label="预算金额"><el-input placeholder="如：500000" /></el-form-item>
        <el-form-item label="截止日期"><el-date-picker style="width:100%" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="showCreate=false">取消</el-button><el-button type="primary">创建</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { mockProjects } from '../../assets/mock/data'
const filter = reactive({ status: '', designer: '', keyword: '' })
const showCreate = ref(false)
function statusType(s) { return s === '进行中' ? '' : s === '已完工' ? 'success' : 'warning' }
function progressColor(p) { return p > 80 ? '#67c23a' : p > 40 ? '#e6a23c' : '#409eff' }
</script>

<style scoped>
.project-card { border-radius: 10px; transition: all 0.3s; margin-bottom: 16px; }
.project-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.pc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pc-id { font-size: 12px; color: #c0c4cc; }
.pc-name { font-size: 17px; font-weight: 600; color: #303133; margin-bottom: 8px; }
.pc-meta { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #606266; }
.pc-meta span { display: flex; align-items: center; gap: 4px; }
.pc-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f2f5; }
.pc-cost-label { font-size: 11px; color: #909399; }
.pc-cost-value { font-size: 18px; font-weight: 700; color: #f56c6c; }
.pc-cost-budget { font-size: 11px; color: #c0c4cc; }
.pc-dates { text-align: right; font-size: 13px; color: #606266; }
</style>

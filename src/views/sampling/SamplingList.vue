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
          <template #default="{row}">
            <div style="display:flex;align-items:center;gap:10px;">
              <img v-if="row.samplePhoto" :src="row.samplePhoto" style="width:48px;height:48px;border-radius:6px;object-fit:cover;cursor:pointer;" @click="previewSample(row)" />
              <div>
                <span style="font-weight:500;">{{ row.material }}</span>
                <div style="font-size:11px;color:#909399;">{{ row.remark }}</div>
              </div>
            </div>
          </template>
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
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{row}">
            <el-button size="small" link type="primary" @click="previewSample(row)">样板</el-button>
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

    <!-- Sample Preview Dialog -->
    <el-dialog v-model="sampleDialogVisible" :title="'样板详情 - ' + (currentSample?.material || '')" width="600px">
      <div v-if="currentSample" class="sample-detail">
        <!-- Main Sample Photo -->
        <div class="sample-photo-main">
          <img :src="currentSample.samplePhoto" class="sample-main-img" />
          <div class="sample-badge" v-if="currentSample.status === '已通过'">
            <el-icon><Select /></el-icon> 封样通过
          </div>
        </div>

        <!-- Sample Info -->
        <div class="sample-info-grid">
          <div class="si-item">
            <div class="si-label">材料名称</div>
            <div class="si-value">{{ currentSample.material }}</div>
          </div>
          <div class="si-item">
            <div class="si-label">供应商</div>
            <div class="si-value">{{ currentSample.supplier }}</div>
          </div>
          <div class="si-item">
            <div class="si-label">规格</div>
            <div class="si-value">{{ currentSample.spec || '标准样品' }}</div>
          </div>
          <div class="si-item">
            <div class="si-label">状态</div>
            <div class="si-value">
              <el-tag :type="currentSample.status==='已通过'?'success':currentSample.status==='封样中'?'':'warning'" size="small">{{ currentSample.status }}</el-tag>
            </div>
          </div>
          <div class="si-item">
            <div class="si-label">设计师</div>
            <div class="si-value">{{ currentSample.designer }}</div>
          </div>
          <div class="si-item">
            <div class="si-label">备注</div>
            <div class="si-value">{{ currentSample.remark }}</div>
          </div>
        </div>

        <!-- Multiple Sample Angles -->
        <div v-if="currentSample.samplePhotos && currentSample.samplePhotos.length" class="sample-angles">
          <div class="sa-title">样板照片（多角度）</div>
          <div class="sa-grid">
            <div v-for="(photo, idx) in currentSample.samplePhotos" :key="idx" class="sa-item">
              <img :src="photo.url" class="sa-img" />
              <div class="sa-label">{{ photo.label }}</div>
            </div>
          </div>
        </div>

        <!-- AI Seal Comparison -->
        <div class="ai-compare">
          <div class="sa-title">✦ AI封样比对 <span class="ai-badge">AI</span></div>
          <div class="compare-content">
            <div class="compare-side">
              <div class="compare-label">标准样品</div>
              <img :src="currentSample.samplePhoto" class="compare-img" />
            </div>
            <div class="compare-arrow">
              <el-icon :size="24" color="#909399"><Right /></el-icon>
              <div class="compare-result" :style="{color: currentSample.aiMatch >= 90 ? '#67c23a' : '#e6a23c'}">
                相似度 {{ currentSample.aiMatch || 87 }}%
              </div>
            </div>
            <div class="compare-side">
              <div class="compare-label">本次样品</div>
              <img :src="currentSample.samplePhotos?.[0]?.url || currentSample.samplePhoto" class="compare-img" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="sampleDialogVisible = false">关闭</el-button>
        <el-button type="primary" v-if="currentSample?.status === '封样中'">
          <el-icon><Check /></el-icon> 确认封样
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockSampling } from '../../assets/mock/data'

const sampleDialogVisible = ref(false)
const currentSample = ref(null)

// Enrich mock data with sample photos
const enrichedSampling = mockSampling.map(s => ({
  ...s,
  samplePhoto: s.samplePhoto || `https://picsum.photos/seed/${s.id}-sample/400/400`,
  spec: s.spec || '标准规格',
  aiMatch: s.aiMatch || Math.floor(Math.random() * 15 + 80),
  samplePhotos: s.samplePhotos || [
    { url: `https://picsum.photos/seed/${s.id}-angle1/200/200`, label: '正面' },
    { url: `https://picsum.photos/seed/${s.id}-angle2/200/200`, label: '侧面' },
    { url: `https://picsum.photos/seed/${s.id}-angle3/200/200`, label: '细节' },
  ],
}))

function previewSample(row) {
  const full = enrichedSampling.find(s => s.id === row.id) || row
  currentSample.value = full
  sampleDialogVisible.value = true
}
</script>

<style scoped>
.sample-detail { }
.sample-photo-main {
  position: relative; border-radius: 10px; overflow: hidden; margin-bottom: 20px;
}
.sample-main-img { width: 100%; height: 260px; object-fit: cover; display: block; }
.sample-badge {
  position: absolute; top: 12px; right: 12px;
  background: rgba(103, 194, 58, 0.9); color: #fff;
  padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;
  display: flex; align-items: center; gap: 4px;
}

.sample-info-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 20px;
}
.si-label { font-size: 12px; color: #909399; margin-bottom: 4px; }
.si-value { font-size: 14px; color: #303133; font-weight: 500; }

.sample-angles { margin-bottom: 20px; }
.sa-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.sa-grid { display: flex; gap: 12px; }
.sa-item { text-align: center; flex: 1; }
.sa-img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ebeef5; }
.sa-label { font-size: 12px; color: #909399; margin-top: 6px; }

.ai-compare {
  padding: 16px; background: #f9f5ff; border-radius: 8px;
}
.compare-content { display: flex; align-items: center; gap: 16px; }
.compare-side { flex: 1; text-align: center; }
.compare-label { font-size: 12px; color: #909399; margin-bottom: 8px; }
.compare-img { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; }
.compare-arrow { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
.compare-result { font-size: 13px; font-weight: 700; white-space: nowrap; }
</style>

<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><SetUp /></el-icon> 施工反馈</h2>
        <p class="module-desc">现场材料使用反馈，损耗上报与效果评价</p>
      </div>
    </div>

    <el-tabs v-model="tab">
      <el-tab-pane label="现场损耗上报" name="loss">
        <el-card shadow="hover">
          <el-table :data="lossData" stripe>
            <el-table-column prop="projectId" label="项目" width="80" />
            <el-table-column prop="material" label="材料名称" width="160" />
            <el-table-column prop="bomQty" label="BOM用量" width="90" />
            <el-table-column prop="actualQty" label="实际用量" width="90" />
            <el-table-column label="损耗率" width="90">
              <template #default="{row}">
                <span :style="{color: row.lossRate > 10 ? '#f56c6c' : row.lossRate > 5 ? '#e6a23c' : '#67c23a', fontWeight:600}">{{ row.lossRate }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="损耗原因" min-width="160" />
            <el-table-column prop="reporter" label="上报人" width="80" />
            <el-table-column prop="date" label="日期" width="110" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="效果反馈" name="feedback">
        <el-card shadow="hover">
          <div class="feedback-grid">
            <div class="fb-card" v-for="fb in feedbackData" :key="fb.material">
              <div class="fb-img"><img :src="fb.image" /></div>
              <div class="fb-body">
                <h4>{{ fb.material }}</h4>
                <div class="fb-project">{{ fb.project }}</div>
                <div class="fb-scores">
                  <div class="fb-score"><span>施工友好度</span><el-rate :model-value="fb.installScore" disabled :size="14" /></div>
                  <div class="fb-score"><span>效果满意度</span><el-rate :model-value="fb.effectScore" disabled :size="14" /></div>
                </div>
                <p class="fb-comment">{{ fb.comment }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="余料盘点" name="surplus">
        <el-card shadow="hover">
          <el-table :data="surplusData" stripe>
            <el-table-column prop="projectId" label="项目" width="80" />
            <el-table-column prop="material" label="材料名称" min-width="160" />
            <el-table-column prop="quantity" label="余料数量" width="100" />
            <el-table-column prop="unit" label="单位" width="50" />
            <el-table-column prop="condition" label="状况" width="80">
              <template #default="{row}"><el-tag :type="row.condition==='良好'?'success':'warning'" size="small">{{ row.condition }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="suggest" label="处理建议" width="120" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{row}"><el-tag :type="row.status==='已处理'?'success':'warning'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref('loss')

const lossData = [
  { projectId: 'P001', material: '意大利灰大理石', bomQty: '120㎡', actualQty: '132㎡', lossRate: 10, reason: '切割损耗+破损2块', reporter: '王工', date: '2026-04-12' },
  { projectId: 'P001', material: '微水泥墙面漆', bomQty: '380L', actualQty: '395L', lossRate: 3.9, reason: '正常施工损耗', reporter: '李工', date: '2026-04-10' },
  { projectId: 'P002', material: '黑胡桃木饰面板', bomQty: '85张', actualQty: '92张', lossRate: 8.2, reason: '裁切损耗+色差更换3张', reporter: '张工', date: '2026-04-08' },
]

const feedbackData = [
  { material: '微水泥墙面漆', project: '蓝山咖啡旗舰店', image: 'https://picsum.photos/seed/fb1/400/300', installScore: 4, effectScore: 5, comment: '效果非常好，无缝整体感强，但施工需要专业师傅' },
  { material: '环氧地坪漆', project: '蓝山咖啡旗舰店', image: 'https://picsum.photos/seed/fb2/400/300', installScore: 5, effectScore: 4, comment: '施工简单快捷，但颜色比色卡略深，建议现场先小面积试刷' },
]

const surplusData = [
  { projectId: 'P004', material: '意大利灰大理石', quantity: 32, unit: '㎡', condition: '良好', suggest: '调拨至P001', status: '已处理' },
  { projectId: 'P004', material: '环氧地坪漆', quantity: 8, unit: '桶', condition: '良好', suggest: '退库', status: '待处理' },
]
</script>

<style scoped>
.feedback-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.fb-card { border: 1px solid #ebeef5; border-radius: 10px; overflow: hidden; }
.fb-img img { width: 100%; height: 200px; object-fit: cover; }
.fb-body { padding: 14px; }
.fb-body h4 { font-size: 15px; margin-bottom: 4px; }
.fb-project { font-size: 12px; color: #909399; margin-bottom: 8px; }
.fb-scores { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.fb-score { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #606266; }
.fb-comment { font-size: 13px; color: #606266; line-height: 1.5; }
</style>

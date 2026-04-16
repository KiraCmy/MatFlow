<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Picture /></el-icon> AI图搜图 <span class="ai-badge">AI核心</span></h2>
        <p class="module-desc">上传材料参考图，AI自动匹配材料库中视觉相似的材料，返回相似度排序结果</p>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- Upload Area -->
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">上传参考图</span></template>
          <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
            <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
            <div v-else class="upload-placeholder">
              <el-icon :size="48" color="#c0c4cc"><Plus /></el-icon>
              <p>点击或拖拽上传参考图片</p>
              <p style="font-size:12px;color:#c0c4cc;">支持 JPG / PNG / WEBP</p>
            </div>
          </div>
          <input type="file" ref="fileInput" accept="image/*" style="display:none" @change="handleFileChange" />
          
          <div style="margin-top:16px;">
            <el-button type="primary" style="width:100%;" size="large" @click="doSearch" :loading="searching" :disabled="!previewUrl">
              <el-icon><MagicStick /></el-icon> AI识别匹配
            </el-button>
          </div>

          <div class="ai-tips">
            <div class="tip-title"><el-icon><InfoFilled /></el-icon> AI识别能力</div>
            <el-tag v-for="t in aiCapabilities" :key="t" size="small" style="margin:3px;">{{ t }}</el-tag>
          </div>
        </el-card>

        <!-- Example Images -->
        <el-card shadow="hover" style="margin-top:16px;">
          <template #header><span style="font-weight:600;">示例参考图</span></template>
          <div class="example-grid">
            <div class="example-item" v-for="ex in examples" :key="ex.label" @click="useExample(ex)">
              <img :src="ex.url" />
              <span>{{ ex.label }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Results -->
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">匹配结果 <span class="ai-badge" v-if="results.length">共{{ results.length }}条</span></span>
              <el-space>
                <el-select v-model="sortBy" size="small" style="width:120px;">
                  <el-option label="相似度排序" value="similarity" />
                  <el-option label="价格从低到高" value="price" />
                  <el-option label="价格从高到低" value="priceDesc" />
                </el-select>
              </el-space>
            </div>
          </template>

          <div v-if="!results.length && !searching" class="empty-results">
            <el-icon :size="64" color="#e4e7ed"><PictureFilled /></el-icon>
            <p>上传参考图后，AI将自动匹配相似材料</p>
          </div>

          <div v-if="searching" class="searching-state">
            <el-icon class="is-loading" :size="32" color="#667eea"><Loading /></el-icon>
            <p>AI正在分析图片特征并匹配材料库...</p>
            <el-steps :active="searchStep" simple style="margin-top:16px;">
              <el-step title="图片特征提取" />
              <el-step title="颜色纹理分析" />
              <el-step title="向量相似度匹配" />
              <el-step title="结果排序" />
            </el-steps>
          </div>

          <div class="results-list" v-if="results.length && !searching">
            <div class="result-card" v-for="(r, idx) in results" :key="r.id">
              <div class="result-rank" :class="idx < 3 ? 'top' : ''">{{ idx + 1 }}</div>
              <img :src="r.image" class="result-img" />
              <div class="result-info">
                <div class="result-name">{{ r.name }}</div>
                <div class="result-tags">
                  <el-tag size="small" type="info">{{ r.category }}</el-tag>
                  <el-tag size="small" v-for="s in r.style" :key="s">{{ s }}</el-tag>
                </div>
                <div class="result-meta">
                  <span>颜色: {{ r.color }}</span>
                  <span>质感: {{ r.texture }}</span>
                  <span>防火: {{ r.fireproof }}</span>
                  <span>环保: {{ r.envLevel }}</span>
                </div>
              </div>
              <div class="result-score">
                <div class="score-ring" :style="{background: getScoreColor(r.similarity)}">
                  <span>{{ r.similarity }}%</span>
                </div>
                <div>相似度</div>
              </div>
              <div class="result-price">
                <div class="price-range">¥{{ r.priceRange[0] }}-{{ r.priceRange[1] }}</div>
                <div>元/{{ r.unit }}</div>
              </div>
              <div class="result-actions">
                <el-button size="small" type="primary" plain>选入方案</el-button>
                <el-button size="small" @click="$router.push('/ai-selection/alternative')">找平替</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockMaterialDB } from '../../assets/mock/data'

const fileInput = ref(null)
const previewUrl = ref('')
const searching = ref(false)
const searchStep = ref(0)
const results = ref([])
const sortBy = ref('similarity')

const aiCapabilities = ['颜色识别', '纹理分析', '材质分类', '光泽度检测', '图案匹配', '风格推断']
const examples = [
  { label: '大理石纹理', url: 'https://picsum.photos/seed/ex1/200/200' },
  { label: '木质感', url: 'https://picsum.photos/seed/ex2/200/200' },
  { label: '微水泥墙面', url: 'https://picsum.photos/seed/ex3/200/200' },
  { label: '金属质感', url: 'https://picsum.photos/seed/ex4/200/200' },
]

function triggerUpload() { fileInput.value?.click() }
function handleFileChange(e) { const f = e.target.files[0]; if(f) loadFile(f) }
function handleDrop(e) { const f = e.dataTransfer.files[0]; if(f) loadFile(f) }
function loadFile(f) { previewUrl.value = URL.createObjectURL(f) }
function useExample(ex) { previewUrl.value = ex.url }

function doSearch() {
  searching.value = true; searchStep.value = 0
  const timer = setInterval(() => { searchStep.value++; if(searchStep.value > 3) clearInterval(timer) }, 400)
  setTimeout(() => {
    clearInterval(timer); searchStep.value = 4; searching.value = false
    results.value = mockMaterialDB.map(m => ({...m, similarity: Math.floor(Math.random()*20+75)})).sort((a,b) => b.similarity - a.similarity)
  }, 2000)
}

function getScoreColor(s) {
  return s >= 90 ? 'linear-gradient(135deg, #67c23a, #85ce61)' : s >= 80 ? 'linear-gradient(135deg, #e6a23c, #f0c040)' : 'linear-gradient(135deg, #909399, #c0c4cc)'
}
</script>

<style scoped>
.upload-area { width: 100%; height: 280px; border: 2px dashed #dcdfe6; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; transition: border-color 0.3s; }
.upload-area:hover { border-color: #667eea; }
.upload-placeholder { text-align: center; color: #909399; }
.preview-img { width: 100%; height: 100%; object-fit: cover; }
.ai-tips { margin-top: 16px; padding: 12px; background: #f9f5ff; border-radius: 8px; }
.tip-title { font-size: 13px; font-weight: 600; color: #764ba2; margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }
.example-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.example-item { text-align: center; cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid transparent; transition: all 0.3s; }
.example-item:hover { border-color: #667eea; }
.example-item img { width: 100%; height: 80px; object-fit: cover; }
.example-item span { display: block; font-size: 12px; padding: 4px; color: #606266; }

.empty-results { text-align: center; padding: 60px 0; color: #c0c4cc; }
.empty-results p { margin-top: 12px; }
.searching-state { text-align: center; padding: 40px 0; }
.searching-state p { color: #667eea; margin-top: 12px; font-size: 14px; }

.results-list { display: flex; flex-direction: column; gap: 12px; }
.result-card {
  display: flex; align-items: center; gap: 14px; padding: 14px;
  border: 1px solid #ebeef5; border-radius: 10px; transition: all 0.3s;
}
.result-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #667eea; }
.result-rank { width: 28px; height: 28px; border-radius: 50%; background: #f0f2f5; color: #909399; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.result-rank.top { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
.result-img { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.result-info { flex: 1; min-width: 0; }
.result-name { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 6px; }
.result-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px; }
.result-meta { display: flex; gap: 12px; font-size: 12px; color: #909399; }
.result-score { text-align: center; flex-shrink: 0; }
.score-ring { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; }
.result-score > div:last-child { font-size: 11px; color: #909399; margin-top: 2px; }
.result-price { text-align: right; flex-shrink: 0; min-width: 80px; }
.price-range { font-size: 16px; font-weight: 700; color: #f56c6c; }
.result-price > div:last-child { font-size: 11px; color: #909399; }
.result-actions { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
</style>

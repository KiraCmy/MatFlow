<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Search /></el-icon> AI语意搜材 <span class="ai-badge">AI核心</span></h2>
        <p class="module-desc">用自然语言描述材料需求，AI理解意图后智能匹配材料库，支持风格、性能、场景多条件组合</p>
      </div>
    </div>

    <!-- Search Input -->
    <el-card shadow="hover" class="search-card">
      <div class="search-box">
        <el-icon :size="24" color="#667eea"><MagicStick /></el-icon>
        <el-input v-model="query" placeholder="例如：温暖木质感、适合儿童空间、耐磨易清洁的现代地面材料" size="large"
          @keyup.enter="doSearch" class="search-input" />
        <el-button type="primary" size="large" @click="doSearch" :loading="searching">
          <el-icon><Search /></el-icon> 智能搜索
        </el-button>
      </div>

      <!-- AI Parse Tags -->
      <div v-if="parsedTags.length" class="parsed-tags">
        <span class="parse-label">✦ AI解析结果：</span>
        <el-tag v-for="t in parsedTags" :key="t.label" :type="t.type" effect="dark" size="small" style="margin:3px;">
          {{ t.label }}: {{ t.value }}
        </el-tag>
      </div>

      <!-- Quick Filters -->
      <div class="quick-filters">
        <span style="font-size:13px;color:#909399;">快捷筛选：</span>
        <el-tag v-for="f in quickFilters" :key="f" size="small" effect="plain" style="cursor:pointer;margin:3px;" @click="query=f; doSearch()">{{ f }}</el-tag>
      </div>
    </el-card>

    <!-- Search Results -->
    <div class="results-section">
      <div class="results-header">
        <span>搜索结果 <strong>{{ results.length }}</strong> 条</span>
        <el-space>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button value="grid"><el-icon><Grid /></el-icon></el-radio-button>
            <el-radio-button value="list"><el-icon><List /></el-icon></el-radio-button>
          </el-radio-group>
        </el-space>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="material-grid">
        <el-card v-for="m in results" :key="m.id" shadow="hover" class="material-card" :body-style="{padding: '0'}">
          <div class="mc-img-wrap">
            <img :src="m.image" class="mc-img" />
            <div class="mc-overlay">
              <el-button type="primary" size="small" circle><el-icon><Plus /></el-icon></el-button>
            </div>
            <div class="mc-match" v-if="m.relevance">{{ m.relevance }}% 匹配</div>
          </div>
          <div class="mc-body">
            <div class="mc-name">{{ m.name }}</div>
            <div class="mc-category">{{ m.category }}</div>
            <div class="mc-tags">
              <el-tag size="small" v-for="s in m.style.slice(0,2)" :key="s" type="info" effect="plain">{{ s }}</el-tag>
            </div>
            <div class="mc-bottom">
              <div class="mc-price">¥{{ m.priceRange[0] }}-{{ m.priceRange[1] }}<small>/{{ m.unit }}</small></div>
              <el-button size="small" type="primary" plain>选入</el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- List View -->
      <el-table v-if="viewMode === 'list'" :data="results" stripe>
        <el-table-column width="70"><template #default="{$index}">{{$index+1}}</template></el-table-column>
        <el-table-column label="材料" min-width="180">
          <template #default="{row}">
            <div style="display:flex;align-items:center;gap:10px;">
              <img :src="row.image" style="width:48px;height:48px;border-radius:6px;object-fit:cover;" />
              <div><div style="font-weight:600;">{{ row.name }}</div><div style="font-size:12px;color:#909399;">{{ row.category }}</div></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="风格" min-width="120">
          <template #default="{row}"><el-tag size="small" v-for="s in row.style" :key="s" type="info" style="margin:2px;">{{ s }}</el-tag></template>
        </el-table-column>
        <el-table-column label="颜色/质感" width="120">
          <template #default="{row}">{{ row.color }} · {{ row.texture }}</template>
        </el-table-column>
        <el-table-column label="价格" width="130">
          <template #default="{row}"><span style="color:#f56c6c;font-weight:600;">¥{{ row.priceRange[0] }}-{{ row.priceRange[1] }}</span>/{{ row.unit }}</template>
        </el-table-column>
        <el-table-column label="性能" width="160">
          <template #default="{row}">
            <div style="font-size:12px;color:#606266;">
              防火{{ row.fireproof }} · 耐磨{{ row.wearResist }} · {{ row.envLevel }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="匹配度" width="80" v-if="results[0]?.relevance">
          <template #default="{row}"><span style="font-weight:700;color:#667eea;">{{ row.relevance }}%</span></template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default>
            <el-button size="small" type="primary" plain>选入方案</el-button>
            <el-button size="small">找平替</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockMaterialDB } from '../../assets/mock/data'

const query = ref('')
const searching = ref(false)
const results = ref([])
const viewMode = ref('grid')
const parsedTags = ref([])

const quickFilters = [
  '现代简约风 地面材料', '温暖木质感 墙面', '工业风 耐磨 易清洁', '侘寂风 哑光 自然肌理',
  '轻奢 高档 大理石', '北欧 自然 环保', '酒店大堂 高级感 耐磨', '儿童空间 环保 无毒',
]

function doSearch() {
  if (!query.value) return
  searching.value = true
  parsedTags.value = [
    { label: '风格', value: '现代简约', type: '' },
    { label: '材质', value: '木质感', type: 'success' },
    { label: '性能', value: '耐磨易清洁', type: 'warning' },
    { label: '空间', value: '地面', type: 'info' },
  ]
  setTimeout(() => {
    searching.value = false
    results.value = mockMaterialDB.map(m => ({...m, relevance: Math.floor(Math.random()*25+70)}))
  }, 1200)
}
</script>

<style scoped>
.search-card { margin-bottom: 20px; }
.search-box { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
.search-input { font-size: 15px; }
.search-input :deep(.el-input__wrapper) { box-shadow: 0 0 0 1px #667eea inset; }
.parsed-tags { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 12px; padding: 10px 14px; background: #f9f5ff; border-radius: 8px; }
.parse-label { font-size: 13px; font-weight: 600; color: #764ba2; }
.quick-filters { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 12px; }

.results-section { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

.material-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.material-card { border-radius: 10px; overflow: hidden; transition: all 0.3s; cursor: pointer; }
.material-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.mc-img-wrap { position: relative; height: 180px; overflow: hidden; }
.mc-img { width: 100%; height: 100%; object-fit: cover; }
.mc-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.material-card:hover .mc-overlay { opacity: 1; }
.mc-match { position: absolute; top: 8px; right: 8px; background: rgba(102,126,234,0.9); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
.mc-body { padding: 12px; }
.mc-name { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 4px; }
.mc-category { font-size: 12px; color: #909399; margin-bottom: 8px; }
.mc-tags { display: flex; gap: 4px; margin-bottom: 10px; }
.mc-bottom { display: flex; justify-content: space-between; align-items: center; }
.mc-price { font-size: 15px; font-weight: 700; color: #f56c6c; }
.mc-price small { font-size: 11px; color: #909399; font-weight: 400; }
</style>

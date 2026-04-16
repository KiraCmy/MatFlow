<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><MagicStick /></el-icon> AI智能选材 <span class="ai-badge">AI核心</span></h2>
        <p class="module-desc">三大AI核心能力 + 公司材料库总览，智能选材一站搞定</p>
      </div>
    </div>

    <el-tabs v-model="activeTab" type="border-card" class="main-tabs">

      <!-- Tab 1: AI搜索 -->
      <el-tab-pane label="AI搜索" name="search">
        <el-row :gutter="20">
          <el-col :span="8" v-for="card in cards" :key="card.route">
            <el-card shadow="hover" class="feature-card" @click="$router.push(card.route)" style="cursor:pointer;">
              <div class="fc-icon" :style="{background: card.bg}">
                <el-icon :size="36" :color="card.color"><component :is="card.icon" /></el-icon>
              </div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.desc }}</p>
              <div class="fc-tags">
                <el-tag v-for="t in card.tags" :key="t" size="small" effect="plain" type="info">{{ t }}</el-tag>
              </div>
              <div class="fc-action">
                <el-button type="primary" plain>进入 <el-icon><ArrowRight /></el-icon></el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- Recent AI History -->
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">最近AI选材记录</span></template>
          <el-table :data="recentHistory" stripe>
            <el-table-column prop="time" label="时间" width="160" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{row}"><el-tag :type="row.tagType" size="small">{{ row.type }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="input" label="搜索内容" min-width="200" />
            <el-table-column prop="results" label="匹配数" width="80" />
            <el-table-column prop="selected" label="选入方案" width="100" />
            <el-table-column prop="project" label="所属项目" width="140" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Tab 2: 材料库总览 -->
      <el-tab-pane name="catalog">
        <template #label>
          <span>材料库总览 <el-tag size="small" effect="dark" style="margin-left:6px;background:#667eea;">{{ filteredMaterials.length }}种</el-tag></span>
        </template>

        <!-- Filters -->
        <div class="catalog-filters">
          <el-input v-model="catalogKw" placeholder="搜索材料名称/标签" style="width:200px;" clearable :prefix-icon="Search" />
          <el-radio-group v-model="catalogCat" size="small" @change="catalogCat = catalogCat || ''">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button v-for="c in categories" :key="c" :label="c">{{ c }}</el-radio-button>
          </el-radio-group>
          <el-select v-model="catalogSort" size="small" style="width:130px;">
            <el-option label="默认排序" value="" />
            <el-option label="价格从低到高" value="priceAsc" />
            <el-option label="价格从高到低" value="priceDesc" />
            <el-option label="耐火等级" value="fireproof" />
          </el-select>
        </div>

        <!-- Material Grid -->
        <div class="catalog-grid">
          <el-card v-for="m in filteredMaterials" :key="m.id" shadow="hover" class="mat-card">
            <div class="mat-card-img-wrap">
              <img :src="m.image" class="mat-card-img" />
              <div class="mat-card-overlay">
                <el-button type="primary" size="small" @click.stop="$router.push('/ai-selection/image-search')">AI搜相似</el-button>
                <el-button size="small" @click.stop="$router.push('/ai-selection/alternative')">找平替</el-button>
              </div>
            </div>
            <div class="mat-card-body">
              <div class="mat-card-top">
                <h4>{{ m.name }}</h4>
                <el-tag size="small" type="info">{{ m.category }}</el-tag>
              </div>
              <div class="mat-card-tags">
                <el-tag v-for="s in m.style.slice(0,2)" :key="s" size="small" effect="plain">{{ s }}</el-tag>
              </div>
              <div class="mat-card-props">
                <span>颜色: {{ m.color }}</span>
                <span>质感: {{ m.texture }}</span>
              </div>
              <div class="mat-card-props">
                <span>防火: {{ m.fireproof }}</span>
                <span>耐磨: {{ m.wearResist }}</span>
                <span>环保: {{ m.envLevel }}</span>
              </div>
              <div class="mat-card-bottom">
                <div class="mat-card-price">¥{{ m.priceRange[0] }}-{{ m.priceRange[1] }}<small>/{{ m.unit }}</small></div>
              </div>

              <!-- Project Photos -->
              <div v-if="m.projectPhotos && m.projectPhotos.length" class="mat-card-photos">
                <div class="photos-label">📸 项目实拍 ({{ m.projectPhotos.length }})</div>
                <div class="photos-grid">
                  <div v-for="photo in m.projectPhotos" :key="photo.projectId" class="photo-item">
                    <img :src="photo.image" class="photo-img" />
                    <div class="photo-info">
                      <div class="photo-project">{{ photo.projectName }}</div>
                      <div class="photo-scene">{{ photo.scene }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockMaterialDB } from '../../assets/mock/data'
import { Search } from '@element-plus/icons-vue'

const activeTab = ref('search')

// --- AI Search Tab ---
const cards = [
  { title: '图搜图', desc: '上传参考图片，AI自动识别材料特征，匹配视觉相似材料', icon: 'Picture', route: '/ai-selection/image-search', bg: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', tags: ['图像识别', '纹理分析', '颜色匹配'] },
  { title: '语意搜材', desc: '用自然语言描述材料需求，AI理解意图后智能推荐', icon: 'Search', route: '/ai-selection/text-search', bg: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', tags: ['LLM解析', 'RAG检索', '多条件组合'] },
  { title: '平替推荐', desc: '选定材料太贵或没货？AI自动推荐高性价比替代方案', icon: 'Refresh', route: '/ai-selection/alternative', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#fff', tags: ['性能对比', '成本分析', '交期评估'] },
]

const recentHistory = [
  { time: '2026-04-15 14:30', type: '图搜图', tagType: '', input: '上传大理石参考图', results: 8, selected: '鱼肚灰大理石', project: '蓝山咖啡旗舰店' },
  { time: '2026-04-15 11:20', type: '语意搜材', tagType: 'success', input: '温暖木质感、适合日式餐厅的墙面材料', results: 12, selected: '微水泥（米白）', project: '悦庭日料餐厅' },
  { time: '2026-04-14 16:45', type: '平替推荐', tagType: 'warning', input: '意大利灰大理石→平替', results: 5, selected: '岩板（灰色）', project: '蓝山咖啡旗舰店' },
  { time: '2026-04-14 10:10', type: '语意搜材', tagType: 'success', input: '工业风 耐磨 易清洁 地面材料', results: 9, selected: '水磨石（深灰）', project: 'MASHUP潮牌店' },
]

// --- Material Catalog Tab ---
const catalogKw = ref('')
const catalogCat = ref('')
const catalogSort = ref('')
const categories = [...new Set(mockMaterialDB.map(m => m.category))]

const filteredMaterials = computed(() => {
  let list = [...mockMaterialDB]
  if (catalogCat.value) list = list.filter(m => m.category === catalogCat.value)
  if (catalogKw.value) {
    const kw = catalogKw.value.toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(kw) || m.tags.some(t => t.includes(kw)) || m.category.includes(kw))
  }
  if (catalogSort.value === 'priceAsc') list.sort((a, b) => a.priceRange[0] - b.priceRange[0])
  else if (catalogSort.value === 'priceDesc') list.sort((a, b) => b.priceRange[0] - a.priceRange[0])
  else if (catalogSort.value === 'fireproof') list.sort((a, b) => a.fireproof.localeCompare(b.fireproof))
  return list
})
</script>

<style scoped>
.main-tabs { border-radius: 10px; overflow: hidden; }
.main-tabs :deep(.el-tabs__content) { padding: 20px; }

/* Feature Cards */
.feature-card { text-align: center; padding: 24px; transition: all 0.3s; border-radius: 12px; }
.feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
.fc-icon { width: 72px; height: 72px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.feature-card h3 { font-size: 20px; margin-bottom: 8px; }
.feature-card p { font-size: 13px; color: #909399; line-height: 1.6; }
.fc-tags { display: flex; justify-content: center; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
.fc-action { margin-top: 16px; }

/* Catalog Filters */
.catalog-filters { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }

/* Catalog Grid */
.catalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.mat-card { border-radius: 10px; overflow: hidden; transition: all 0.3s; }
.mat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.mat-card :deep(.el-card__body) { padding: 0; }
.mat-card-img-wrap { position: relative; height: 160px; overflow: hidden; }
.mat-card-img { width: 100%; height: 100%; object-fit: cover; }
.mat-card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; gap: 8px; opacity: 0; transition: opacity 0.3s; }
.mat-card:hover .mat-card-overlay { opacity: 1; }
.mat-card-body { padding: 14px; }
.mat-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.mat-card-top h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0; }
.mat-card-tags { display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap; }
.mat-card-props { display: flex; gap: 10px; font-size: 12px; color: #909399; margin-bottom: 4px; }
.mat-card-bottom { margin-top: 8px; padding-top: 8px; border-top: 1px solid #f0f2f5; }
.mat-card-price { font-size: 16px; font-weight: 700; color: #f56c6c; }
.mat-card-price small { font-size: 11px; color: #909399; font-weight: 400; }

/* Project Photos */
.mat-card-photos { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ebeef5; }
.photos-label { font-size: 12px; font-weight: 600; color: #606266; margin-bottom: 8px; }
.photos-grid { display: flex; flex-direction: column; gap: 8px; }
.photo-item { display: flex; gap: 10px; padding: 6px; background: #fafbfc; border-radius: 6px; }
.photo-img { width: 80px; height: 56px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
.photo-info { flex: 1; }
.photo-project { font-size: 12px; font-weight: 600; color: #303133; }
.photo-scene { font-size: 11px; color: #909399; margin-top: 2px; }
</style>

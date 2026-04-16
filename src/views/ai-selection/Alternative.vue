<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Refresh /></el-icon> AI智能平替推荐 <span class="ai-badge">AI核心</span></h2>
        <p class="module-desc">选定材料后，AI自动分析核心性能参数，推荐性能相近但价格更低、库存更足、交期更短的替代方案</p>
      </div>
    </div>

    <!-- Original Material -->
    <el-card shadow="hover" class="original-card">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;">原方案材料</span>
          <el-button type="primary" size="small" @click="showSelect = true">
            <el-icon><EditPen /></el-icon> 更换材料
          </el-button>
        </div>
      </template>
      <div class="original-material">
        <img :src="original.image" class="om-img" />
        <div class="om-info">
          <h3>{{ original.name }}</h3>
          <div class="om-meta">
            <el-tag type="info">{{ original.category }}</el-tag>
            <el-tag v-for="s in original.style" :key="s" size="small">{{ s }}</el-tag>
          </div>
          <div class="om-details">
            <div class="om-detail"><span>颜色:</span>{{ original.color }}</div>
            <div class="om-detail"><span>质感:</span>{{ original.texture }}</div>
            <div class="om-detail"><span>防火:</span>{{ original.fireproof }}</div>
            <div class="om-detail"><span>耐磨:</span>{{ original.wearResist }}</div>
            <div class="om-detail"><span>环保:</span>{{ original.envLevel }}</div>
          </div>
        </div>
        <div class="om-price">
          <div class="om-price-value">¥{{ original.unitPrice }}</div>
          <div>元/{{ original.unit }}</div>
        </div>
      </div>
    </el-card>

    <!-- AI Analysis -->
    <el-card shadow="hover" style="margin-top:16px;" v-if="alternatives.length">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;">✦ AI平替方案 <span class="ai-badge">{{ alternatives.length }}个替代方案</span></span>
        </div>
      </template>

      <!-- Compare Table -->
      <el-table :data="alternatives" stripe style="width:100%;" :row-class-name="tableRowClass">
        <el-table-column width="70"><template #default="{$index}">
          <div v-if="$index === 0" class="best-badge">最优</div>
          <div v-else class="rank-num">{{$index+1}}</div>
        </template></el-table-column>
        <el-table-column label="材料方案" min-width="200">
          <template #default="{row}">
            <div style="display:flex;align-items:center;gap:10px;">
              <img :src="row.image" style="width:48px;height:48px;border-radius:6px;object-fit:cover;" />
              <div>
                <div style="font-weight:600;">{{ row.name }}</div>
                <div style="font-size:12px;color:#909399;">{{ row.category }} · {{ row.supplier }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="相似度" width="100">
          <template #default="{row}">
            <div class="sim-badge" :class="row.similarity >= 90 ? 'high' : row.similarity >= 80 ? 'mid' : 'low'">{{ row.similarity }}%</div>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="110">
          <template #default="{row}">
            <div style="font-weight:600;color:#f56c6c;">¥{{ row.unitPrice }}<small>/{{ row.unit }}</small></div>
          </template>
        </el-table-column>
        <el-table-column label="成本节省" width="110">
          <template #default="{row}">
            <div :style="{color: row.saving > 0 ? '#67c23a' : '#f56c6c', fontWeight: 700}">
              {{ row.saving > 0 ? '-' : '+' }}{{ Math.abs(row.saving) }}%
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库存状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.stock === '现货' ? 'success' : row.stock === '库存充足' ? 'success' : 'warning'" size="small">{{ row.stock }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="交期" width="90">
          <template #default="{row}">
            <span :style="{color: row.delivery <= 7 ? '#67c23a' : row.delivery <= 15 ? '#e6a23c' : '#f56c6c'}">{{ row.delivery }}天</span>
          </template>
        </el-table-column>
        <el-table-column label="质感差异说明" min-width="150">
          <template #default="{row}">
            <div style="font-size:12px;color:#606266;">{{ row.difference }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="selectDialog.open(row)">采用方案</el-button>
            <el-button size="small" plain>对比详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Visual Comparison -->
      <div class="compare-visual">
        <div class="compare-item original">
          <div class="compare-label">原方案</div>
          <img :src="original.image" />
          <div class="compare-price">¥{{ original.unitPrice }}/{{ original.unit }}</div>
        </div>
        <el-icon :size="32" color="#909399"><Right /></el-icon>
        <div class="compare-item recommended" v-for="a in alternatives.slice(0,2)" :key="a.id">
          <div class="compare-label" style="color:#67c23a;">推荐方案</div>
          <img :src="a.image" />
          <div class="compare-price" style="color:#67c23a;">¥{{ a.unitPrice }}/{{ a.unit }}</div>
          <div class="saving-tag">节省 {{ a.saving }}%</div>
        </div>
      </div>
    </el-card>

    <!-- Select Dialog -->
    <el-dialog v-model="showSelect" title="选择原方案材料" width="700px">
      <el-table :data="mockMaterialDB" max-height="400" @row-click="selectOriginal">
        <el-table-column width="60"><template #default="{row}"><img :src="row.image" style="width:40px;height:40px;border-radius:4px;" /></template></el-table-column>
        <el-table-column prop="name" label="材料名称" />
        <el-table-column prop="category" label="类别" width="80" />
        <el-table-column label="价格" width="120"><template #default="{row}">¥{{ row.priceRange[0] }}-{{ row.priceRange[1] }}</template></el-table-column>
      </el-table>
    </el-dialog>

    <SelectMaterialDialog ref="selectDialog" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { mockMaterialDB } from '../../assets/mock/data'
import SelectMaterialDialog from '../../components/SelectMaterialDialog.vue'

const showSelect = ref(false)
const selectDialog = ref(null)
const mockMaterialDB_ref = mockMaterialDB

const original = reactive({
  id: 'M001', name: '意大利灰大理石', category: '石材', image: 'https://picsum.photos/seed/marble1/300/300',
  style: ['现代简约', '轻奢'], color: '白色/灰纹', texture: '抛光', fireproof: 'A1级', wearResist: '高', envLevel: 'E0',
  unitPrice: 680, unit: '㎡'
})

const alternatives = ref([
  { id: 'M012', name: '岩板（大板灰色）', category: '石材', image: 'https://picsum.photos/seed/sintered/300/300', supplier: '石材源供应链', similarity: 92, unitPrice: 350, unit: '㎡', saving: 49, stock: '现货', delivery: 3, difference: '纹理更均匀，无天然裂纹，重量更轻但效果接近' },
  { id: 'M005', name: '水磨石（灰色）', category: '石材', image: 'https://picsum.photos/seed/terrazzo/300/300', supplier: '好施建材', similarity: 85, unitPrice: 280, unit: '㎡', saving: 59, stock: '库存充足', delivery: 7, difference: '质感不同，带有碎石颗粒感，风格更偏复古/商业' },
  { id: 'M010', name: '木纹砖（浅灰）', category: '陶瓷', image: 'https://picsum.photos/seed/woodtile/300/300', supplier: '绿筑新材料', similarity: 68, unitPrice: 120, unit: '㎡', saving: 82, stock: '现货', delivery: 2, difference: '材质完全不同（陶瓷vs石材），但浅灰色调和哑光质感接近，适合预算紧张场景' },
])

function selectOriginal(row) {
  Object.assign(original, { id: row.id, name: row.name, category: row.category, image: row.image, style: row.style, color: row.color, texture: row.texture, fireproof: row.fireproof, wearResist: row.wearResist, envLevel: row.envLevel, unitPrice: row.priceRange[1], unit: row.unit })
  showSelect.value = false
}

function tableRowClass({rowIndex}) { return rowIndex === 0 ? 'best-row' : '' }
</script>

<style scoped>
.original-material { display: flex; align-items: center; gap: 20px; }
.om-img { width: 160px; height: 120px; border-radius: 10px; object-fit: cover; }
.om-info { flex: 1; }
.om-info h3 { font-size: 18px; margin-bottom: 8px; }
.om-meta { display: flex; gap: 6px; margin-bottom: 10px; }
.om-details { display: flex; gap: 16px; font-size: 13px; color: #606266; }
.om-detail span { color: #909399; }
.om-price { text-align: center; padding: 16px 24px; background: #fef0f0; border-radius: 10px; }
.om-price-value { font-size: 28px; font-weight: 700; color: #f56c6c; }
.om-price div { font-size: 12px; color: #909399; }

.sim-badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 13px; font-weight: 700; }
.sim-badge.high { background: #f0f9eb; color: #67c23a; }
.sim-badge.mid { background: #fdf6ec; color: #e6a23c; }
.sim-badge.low { background: #f4f4f5; color: #909399; }
.best-badge { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; width: 32px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.rank-num { width: 32px; height: 22px; border-radius: 4px; background: #f0f2f5; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #909399; font-weight: 700; }

.compare-visual { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 24px; padding: 20px; background: #fafbfc; border-radius: 10px; }
.compare-item { text-align: center; }
.compare-label { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.compare-item img { width: 140px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #ebeef5; }
.compare-price { margin-top: 8px; font-size: 16px; font-weight: 700; }
.saving-tag { display: inline-block; margin-top: 4px; background: #67c23a; color: #fff; font-size: 11px; padding: 1px 8px; border-radius: 10px; }

:deep(.best-row) { background: #f0f9ff !important; }
:deep(.best-row td) { font-weight: 600; }
</style>

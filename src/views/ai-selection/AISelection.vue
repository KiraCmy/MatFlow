<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><MagicStick /></el-icon> AI智能选材 <span class="ai-badge">AI核心</span></h2>
        <p class="module-desc">三大AI核心能力：图搜图、语意搜材、智能平替推荐</p>
      </div>
    </div>

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
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.feature-card { text-align: center; padding: 24px; transition: all 0.3s; border-radius: 12px; }
.feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
.fc-icon { width: 72px; height: 72px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.feature-card h3 { font-size: 20px; margin-bottom: 8px; }
.feature-card p { font-size: 13px; color: #909399; line-height: 1.6; }
.fc-tags { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
.fc-action { margin-top: 16px; }
</style>

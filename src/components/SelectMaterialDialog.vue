<template>
  <el-dialog v-model="visible" title="选入项目方案" width="520px" :close-on-click-modal="false">
    <div v-if="material" class="select-material-info">
      <img :src="material.image" class="smi-img" />
      <div class="smi-detail">
        <h4>{{ material.name }}</h4>
        <div class="smi-tags">
          <el-tag size="small" type="info">{{ material.category }}</el-tag>
          <span style="font-size:13px;color:#909399;">{{ material.color }} · {{ material.texture }}</span>
        </div>
        <div class="smi-price">¥{{ material.priceRange?.[0] || material.unitPrice }}-{{ material.priceRange?.[1] || material.unitPrice }}元/{{ material.unit || '㎡' }}</div>
      </div>
    </div>

    <el-form :model="form" label-width="80px" style="margin-top:16px;">
      <el-form-item label="所属项目" required>
        <el-select v-model="form.projectId" placeholder="选择项目" style="width:100%;" filterable>
          <el-option v-for="p in mockProjects" :key="p.id" :label="p.name" :value="p.id">
            <span>{{ p.name }}</span>
            <span style="float:right;color:#909399;font-size:12px;">{{ p.status }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用场景">
        <el-input v-model="form.scene" placeholder="如：大堂地面、包厢墙面" />
      </el-form-item>
      <el-form-item label="预估用量" required>
        <el-input-number v-model="form.quantity" :min="1" :max="99999" style="width:200px;" />
        <el-select v-model="form.unit" style="width:100px;margin-left:8px;">
          <el-option label="㎡" value="㎡" />
          <el-option label="张" value="张" />
          <el-option label="m" value="m" />
          <el-option label="套" value="套" />
          <el-option label="块" value="块" />
          <el-option label="桶" value="桶" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="可选，补充说明" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="confirmSelect" :disabled="!form.projectId || !form.quantity">
        <el-icon><Check /></el-icon> 确认选入
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { mockProjects, mockBOMItems } from '../assets/mock/data'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const material = ref(null)

const form = reactive({
  projectId: '',
  scene: '',
  quantity: 100,
  unit: '㎡',
  remark: '',
})

function open(mat) {
  material.value = mat
  form.projectId = ''
  form.scene = ''
  form.quantity = 100
  form.unit = mat.unit || '㎡'
  form.remark = ''
  visible.value = true
}

function confirmSelect() {
  const newBOM = {
    id: 'B' + String(mockBOMItems.length + 1).padStart(3, '0'),
    projectId: form.projectId,
    name: material.value.name,
    spec: material.value.texture || '-',
    category: material.value.category,
    quantity: form.quantity,
    unit: form.unit,
    unitPrice: material.value.priceRange ? material.value.priceRange[1] : material.value.unitPrice,
    supplier: '-',
    status: '待确认',
    selectedBy: 'AI选入',
    scene: form.scene,
    remark: form.remark,
  }
  mockBOMItems.push(newBOM)

  const project = mockProjects.find(p => p.id === form.projectId)
  visible.value = false
  ElMessage.success({
    message: `已选入「${project ? project.name : ''}」的方案清单`,
    duration: 2500,
  })
}

defineExpose({ open })
</script>

<style scoped>
.select-material-info { display: flex; gap: 14px; padding: 14px; background: #f9f5ff; border-radius: 8px; }
.smi-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.smi-detail { flex: 1; }
.smi-detail h4 { font-size: 15px; margin: 0 0 6px; }
.smi-tags { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.smi-price { font-size: 16px; font-weight: 700; color: #f56c6c; }
</style>

<template>
  <div class="page">
    <div class="module-header">
      <div>
        <h2><el-icon><Money /></el-icon> 财务结算</h2>
        <p class="module-desc">材料预算审批、付款管理、发票管理、材料成本核算</p>
      </div>
    </div>

    <el-tabs v-model="tab">
      <el-tab-pane label="付款管理" name="payment">
        <el-card shadow="hover">
          <el-table :data="mockFinanceRecords" stripe>
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="projectId" label="项目" width="80" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{row}"><el-tag :type="row.type==='预付款'?'':row.type==='尾款'?'success':'info'" size="small">{{ row.type }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="supplier" label="供应商" width="130" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{row}"><span style="font-weight:600;color:#f56c6c;">¥{{ row.amount.toLocaleString() }}</span></template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="110" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{row}"><el-tag :type="row.status==='已支付'?'success':'warning'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="invoice" label="发票" width="80">
              <template #default="{row}"><el-tag :type="row.invoice==='已收票'?'success':'danger'" size="small" effect="plain">{{ row.invoice }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{row}">
                <el-button size="small" link type="primary" v-if="row.status==='已支付'">查看凭证</el-button>
                <el-button size="small" link type="warning" v-if="row.invoice==='未收票'">催票</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="成本核算" name="cost">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header><span style="font-weight:600;">材料成本核算 <span class="ai-badge">AI辅助</span></span></template>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="项目">蓝山咖啡旗舰店</el-descriptions-item>
                <el-descriptions-item label="材料预算">¥680,000</el-descriptions-item>
                <el-descriptions-item label="采购发票合计"><span style="color:#f56c6c;font-weight:600;">¥295,200</span></el-descriptions-item>
                <el-descriptions-item label="物流费用">¥8,500</el-descriptions-item>
                <el-descriptions-item label="损耗成本">¥16,800</el-descriptions-item>
                <el-descriptions-item label="退换货成本">¥0</el-descriptions-item>
                <el-descriptions-item label="实际总成本"><span style="color:#f56c6c;font-weight:700;font-size:16px;">¥320,500</span></el-descriptions-item>
                <el-descriptions-item label="预算偏差"><span style="color:#67c23a;font-weight:700;">节省 -52.9%</span></el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header><span style="font-weight:600;">材料成本分布</span></template>
              <div v-for="c in costItems" :key="c.name" style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
                <span style="width:80px;font-size:13px;color:#606266;text-align:right;">{{ c.name }}</span>
                <div style="flex:1;height:24px;background:#f5f7fa;border-radius:12px;overflow:hidden;">
                  <div :style="{width:c.pct+'%',background:c.color,height:'100%',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:'8px',color:'#fff',fontSize:'11px',fontWeight:600,transition:'width 0.6s'}">
                    {{ c.pct > 8 ? c.pct+'%' : '' }}
                  </div>
                </div>
                <span style="width:40px;font-size:12px;color:#909399;">{{ c.pct }}%</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="BOM核销" name="bomWriteoff">
        <el-card shadow="hover">
          <el-table :data="writeoffData" stripe>
            <el-table-column prop="material" label="材料名称" width="160" />
            <el-table-column prop="bomQty" label="BOM数量" width="90" />
            <el-table-column prop="purchaseQty" label="采购数量" width="90" />
            <el-table-column prop="usedQty" label="实际使用" width="90" />
            <el-table-column label="核销状态" width="100">
              <template #default="{row}"><el-tag :type="row.status==='已核销'?'success':'warning'" size="small">{{ row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="confirmer" label="设计师确认" width="100" />
            <el-table-column label="操作" width="80"><template #default="{row}"><el-button size="small" link type="primary" v-if="row.status!=='已核销'">核销</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockFinanceRecords } from '../../assets/mock/data'
const tab = ref('payment')

const costItems = [
  { name: '石材/岩板', pct: 42, color: '#409eff' }, { name: '涂料/辅材', pct: 20, color: '#67c23a' },
  { name: '木材/饰面', pct: 18, color: '#e6a23c' }, { name: '金属装饰', pct: 12, color: '#f56c6c' },
  { name: '灯具/其他', pct: 8, color: '#909399' },
]

const writeoffData = [
  { material: '意大利灰大理石', bomQty: '120㎡', purchaseQty: '132㎡', usedQty: '130㎡', status: '已核销', confirmer: '张设计' },
  { material: '微水泥墙面漆', bomQty: '380L', purchaseQty: '400L', usedQty: '395L', status: '已核销', confirmer: '张设计' },
  { material: '环氧地坪漆', bomQty: '280L', purchaseQty: '288L', usedQty: '280L', status: '待核销', confirmer: '-' },
  { material: '定制灯具-主灯', bomQty: '8套', purchaseQty: '8套', usedQty: '0套', status: '未到货', confirmer: '-' },
]
</script>

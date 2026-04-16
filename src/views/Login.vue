<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-bg-circle c1"></div>
      <div class="login-bg-circle c2"></div>
      <div class="login-bg-circle c3"></div>
    </div>
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">M</div>
        <h1>MatEx · 智能材料系统</h1>
        <p>品牌空间设计公司 · 材料与供应链智能决策平台</p>
      </div>
      <el-form :model="form" @submit.prevent="handleLogin" class="login-form">
        <el-form-item>
          <el-input v-model="form.username" prefix-icon="User" placeholder="请输入用户名" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" prefix-icon="Lock" type="password" placeholder="请输入密码" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.role" size="large" style="width:100%">
            <el-option label="设计师/PM" value="designer" />
            <el-option label="采购专员" value="purchaser" />
            <el-option label="仓库管理员" value="warehouse" />
            <el-option label="财务" value="finance" />
            <el-option label="公司老板" value="boss" />
          </el-select>
        </el-form-item>
        <el-button type="primary" size="large" style="width:100%;height:44px;font-size:15px;" @click="handleLogin" :loading="loading">
          登 录
        </el-button>
      </el-form>
      <div class="login-footer">
        <span>AI图搜图 · 语意搜材 · 智能平替</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { ElMessage } from 'element-plus'

const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)
const form = reactive({ username: 'admin', password: '123456', role: 'designer' })

function handleLogin() {
  loading.value = true
  setTimeout(() => {
    const roleMap = { designer: '设计师/PM', purchaser: '采购专员', warehouse: '仓库管理员', finance: '财务', boss: '公司老板' }
    appStore.setUser({ name: form.username || '管理员', role: roleMap[form.role] || '设计师/PM' })
    loading.value = false
    ElMessage.success('登录成功')
    router.push('/dashboard')
  }, 800)
}
</script>

<style scoped>
.login-page { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); position: relative; overflow: hidden; }

.login-bg { position: absolute; inset: 0; }
.login-bg-circle { position: absolute; border-radius: 50%; opacity: 0.15; }
.login-bg-circle.c1 { width: 400px; height: 400px; background: #667eea; top: -100px; right: -100px; }
.login-bg-circle.c2 { width: 300px; height: 300px; background: #764ba2; bottom: -50px; left: -50px; }
.login-bg-circle.c3 { width: 200px; height: 200px; background: #f093fb; top: 50%; left: 50%; transform: translate(-50%,-50%); }

.login-card {
  width: 420px; padding: 48px 40px; background: rgba(255,255,255,0.95);
  border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative; z-index: 1; backdrop-filter: blur(10px);
}
.login-header { text-align: center; margin-bottom: 36px; }
.login-logo {
  width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 24px;
  box-shadow: 0 4px 15px rgba(102,126,234,0.4);
}
.login-header h1 { font-size: 22px; color: #1a1f36; font-weight: 700; margin-bottom: 8px; }
.login-header p { font-size: 13px; color: #909399; }

.login-form { margin-bottom: 20px; }
.login-footer { text-align: center; font-size: 12px; color: #b0b5c3; }
</style>

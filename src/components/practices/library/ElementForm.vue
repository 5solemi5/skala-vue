<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}
</script>

<template>
  <div class="practice-section">
    <h2>🧪 Element Plus - Form &amp; 유효성 검사</h2>

    <el-card class="box-card">
      <template #header><strong>📝 회원가입 Form &amp; 인풋 제어</strong></template>
      <div class="card-body">
        <div class="input-group">
          <span>이메일 주소:</span>
          <el-input v-model="userForm.email" placeholder="example@email.com" clearable style="width: 300px" />
        </div>

        <div class="input-group">
          <el-switch v-model="userForm.agree" active-text="개인정보 수집 및 필수 이용약관에 동의합니다." />
        </div>

        <el-button type="success" @click="handleRegister">🚀 회원가입하기</el-button>
      </div>
    </el-card>

    <div class="monitor">
      <small style="color: gray">
        ※ 이메일에 @ 가 없으면 error, 약관 미동의면 warning, 둘 다 통과하면 success 메시지가 뜬다.
      </small>
    </div>
  </div>
</template>

<style scoped>
.box-card {
  border-radius: 8px;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

<script setup>
import { ref, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const downloadProgress = ref(0)
const isDownloading = ref(false)
let intervalId = null

// 파일 삭제 확인창 (ElMessageBox)
const confirmDelete = () => {
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?', '🔥 최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.')
    })
    .catch(() => {
      ElMessage.info('❌ 삭제 작업이 취소되었습니다.')
    })
}

// 게이지 바 애니메이션
const startDownload = () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadProgress.value = 0

  intervalId = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
      clearInterval(intervalId)
      intervalId = null
      isDownloading.value = false
      ElMessage.success('💾 대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}

// 진행 중에 화면을 벗어나면 타이머가 남으므로 정리한다 (Code Challenge 7 에서 배운 내용)
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="practice-section">
    <h2>🧪 Element Plus - 확인창 &amp; 진행률</h2>

    <el-card class="box-card">
      <template #header><strong>⚙️ 시스템 피드백 &amp; 프로그레스 인터랙션</strong></template>
      <div class="card-body">
        <div class="btn-zone">
          <el-button type="danger" plain @click="confirmDelete">🗑️ 서버 파일 삭제 테스트</el-button>

          <el-button type="primary" :loading="isDownloading" @click="startDownload">
            {{ isDownloading ? '동기화 중...' : '💾 데이터 동기화 시작' }}
          </el-button>
        </div>

        <div class="progress-zone">
          <el-progress
            :percentage="downloadProgress"
            :status="downloadProgress === 100 ? 'success' : ''"
          />
        </div>
      </div>
    </el-card>

    <div class="monitor">
      <small style="color: gray">
        ※ ElMessageBox.confirm 은 Promise 를 돌려준다. 확인은 .then, 취소는 .catch 로 갈라진다.
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
  gap: 18px;
}
.btn-zone {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>

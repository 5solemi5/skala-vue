<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found">
    <div class="icon">🌫️</div>
    <h2>페이지를 찾을 수 없습니다</h2>
    <p>요청하신 주소가 존재하지 않거나,<br />아직 만들어지지 않았습니다.</p>
    <button class="home-btn" @click="goHome">날씨 메인으로 이동</button>
  </div>
</template>

<style scoped>
.not-found {
  padding: 70px 20px;
  text-align: center;
}
.icon {
  font-size: 4.5rem;
  margin-bottom: 18px;
}
h2 {
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #343a40;
}
p {
  margin: 0 0 30px;
  font-size: 1rem;
  color: #868e96;
  line-height: 1.7;
}
.home-btn {
  padding: 11px 28px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #42b883;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}
.home-btn:hover {
  background-color: #33a06f;
}
</style>

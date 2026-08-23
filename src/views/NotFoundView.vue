<script setup>
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const router = useRouter()
const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found">
    <h2>{{ configStore.t('notFound.title') }}</h2>
    <!-- eslint-disable-next-line vue/no-v-html -- 줄바꿈 한 곳뿐이고 문구는 코드 안에 있다 -->
    <p v-html="configStore.t('notFound.body')"></p>
    <button class="home-btn" @click="goHome">{{ configStore.t('notFound.home') }}</button>
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

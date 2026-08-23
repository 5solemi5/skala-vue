<script setup>
import { RouterLink, RouterView } from 'vue-router'

const navList = [
  { to: '/', label: '오늘의 채비', icon: '⛅' },
  { to: '/about', label: '서비스 소개', icon: 'ℹ️' },
  { to: '/lab', label: '문법 실습실', icon: '📚' },
  { to: '/archive', label: '과제 아카이브', icon: '🗂️' },
  { to: '/dev-log', label: '개발 기록', icon: '🛠️' },
]
</script>

<template>
  <div class="site">
    <!-- Navigation Bar -->
    <header class="site-header">
      <div class="inner">
        <RouterLink to="/" class="brand">
          <span class="brand-mark">⛅</span>
          <span class="brand-text">
            <b>SKALA 오늘의 채비</b>
            <small>날씨를 할 일로 번역해 드립니다</small>
          </span>
        </RouterLink>

        <nav class="nav">
          <RouterLink v-for="item in navList" :key="item.to" :to="item.to" class="nav-item">
            <span aria-hidden="true">{{ item.icon }}</span> {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- 라우팅된 화면이 그려지는 자리 -->
    <main class="site-main">
      <div class="app-container">
        <RouterView />
      </div>
    </main>

    <footer class="site-footer">
      SKALA Full-Stack Engineering · Frontend framework: Vue.js
    </footer>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
@import '@/assets/practice.css';
</style>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e9ecef;
}
.inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}
.brand-mark {
  font-size: 24px;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.brand-text b {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
}
.brand-text small {
  font-size: 11.5px;
  color: #adb5bd;
}
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.nav-item {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #6c757d;
  text-decoration: none;
  border-radius: 999px;
  transition: all 0.15s ease;
}
.nav-item:hover {
  color: #2c3e50;
  background-color: #f1f3f5;
}
.nav-item.router-link-exact-active {
  color: #ffffff;
  background-color: #35495e;
}
.site-main {
  flex: 1;
  padding: 0 20px;
}
.site-footer {
  padding: 28px 20px 40px;
  text-align: center;
  font-size: 12px;
  color: #adb5bd;
}
</style>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

// 상단은 서비스 화면만. 수업 산출물은 푸터로 내렸다.
const navList = [
  { to: '/', label: '오늘의 채비' },
  { to: '/about', label: '서비스 소개' },
]

const courseLinks = [
  { to: '/lab', label: '문법 실습실' },
  { to: '/archive', label: '과제 아카이브' },
  { to: '/dev-log', label: '개발 기록' },
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
            {{ item.label }}
          </RouterLink>
          <UnitToggler />
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
      <div class="foot-inner">
        <p class="foot-left">
          SKALA Full-Stack Engineering<br />
          Frontend framework: Vue.js
        </p>
        <nav class="foot-links" aria-label="만든 과정">
          <span class="foot-label">만든 과정</span>
          <RouterLink v-for="item in courseLinks" :key="item.to" :to="item.to" class="foot-link">
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
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
  align-items: center;
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
@media (max-width: 640px) {
  .inner {
    padding: 10px 14px;
    gap: 10px;
  }
  .site-main {
    padding: 0 12px;
  }
  .brand-text b {
    font-size: 14px;
  }
  .nav-item {
    padding: 5px 10px;
    font-size: 12.5px;
  }
}
.site-footer {
  margin-top: 40px;
  padding: 26px 20px 44px;
  border-top: 1px solid #e9ecef;
}
.foot-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}
.foot-left {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.7;
  color: #adb5bd;
}
.foot-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.foot-label {
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: #ced4da;
}
.foot-link {
  font-size: 12px;
  color: #868e96;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.foot-link:hover {
  color: #35495e;
  border-bottom-color: #adb5bd;
}
.foot-link.router-link-exact-active {
  color: #35495e;
  border-bottom-color: #42b883;
}
</style>

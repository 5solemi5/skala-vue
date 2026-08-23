<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const navList = [
  { to: '/', label: '오늘의 채비' },
  { to: '/about', label: '서비스 소개' },
]

// 수업 산출물. 서비스 메뉴와 급을 나눠 구분선 뒤에 둔다.
const courseLinks = [
  { to: '/lab', label: '문법 실습실' },
  { to: '/archive', label: '과제 아카이브' },
  { to: '/dev-log', label: '개발 기록' },
]
</script>

<template>
  <div class="site">
    <header class="site-header">
      <div class="inner">
        <RouterLink to="/" class="brand">
          <span class="brand-name">오늘의 채비</span>
          <span class="brand-sub">날씨를 할 일로 옮겨 드립니다</span>
        </RouterLink>

        <nav class="nav" aria-label="주요 메뉴">
          <RouterLink v-for="item in navList" :key="item.to" :to="item.to" class="nav-item">
            {{ item.label }}
          </RouterLink>

          <span class="divider" aria-hidden="true"></span>

          <RouterLink v-for="item in courseLinks" :key="item.to" :to="item.to" class="sub-item">
            {{ item.label }}
          </RouterLink>

          <UnitToggler class="unit" />
        </nav>
      </div>
    </header>

    <main class="site-main">
      <div class="shell">
        <RouterView />
      </div>
    </main>

    <footer class="site-footer">
      <div class="foot-inner">
        <p class="foot-left">SKALA Full-Stack Engineering &middot; Frontend framework: Vue.js</p>
        <nav class="foot-links" aria-label="만든 과정">
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
  background: color-mix(in srgb, var(--color-paper) 92%, transparent);
  backdrop-filter: blur(10px) saturate(120%);
  border-bottom: 1px solid var(--color-line);
}
.inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  flex-direction: column;
  gap: 1px;
  text-decoration: none;
  color: inherit;
}
.brand-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.015em;
}
.brand-sub {
  font-size: 11px;
  color: var(--color-ink-3);
}

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.nav-item {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-ink-2);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 1.5px solid transparent;
}
.nav-item:hover {
  color: var(--color-ink);
}
.nav-item.router-link-exact-active {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink);
}

.divider {
  width: 1px;
  height: 13px;
  background: var(--color-line-2);
}

/* 수업 산출물 링크는 한 급 낮게 */
.sub-item {
  font-size: 12px;
  color: var(--color-ink-3);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
}
.sub-item:hover {
  color: var(--color-ink-2);
  border-bottom-color: var(--color-line-2);
}
.sub-item.router-link-exact-active {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink-3);
}

.unit {
  margin-left: 4px;
}

.site-main {
  flex: 1;
  padding: 0 20px;
}
.shell {
  max-width: 860px;
  margin: 34px auto 0;
}

.site-footer {
  margin-top: 56px;
  padding: 22px 20px 40px;
  border-top: 1px solid var(--color-line);
}
.foot-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.foot-left {
  margin: 0;
  font-size: 11.5px;
  color: var(--color-ink-4);
}
.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.foot-link {
  font-size: 11.5px;
  color: var(--color-ink-3);
  text-decoration: none;
}
.foot-link:hover {
  color: var(--color-ink);
}

@media (max-width: 700px) {
  .inner {
    padding: 12px 14px;
    gap: 12px;
  }
  .nav {
    width: 100%;
    gap: 12px;
  }
  .site-main {
    padding: 0 14px;
  }
  .shell {
    margin-top: 22px;
  }
  .unit {
    margin-left: auto;
  }
}
</style>

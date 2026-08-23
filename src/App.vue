<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import UnitToggler from './components/exercise/UnitToggler.vue'
import LangToggler from './components/service/LangToggler.vue'
import BrandMark from './components/service/BrandMark.vue'

const configStore = useConfigStore()

// 이름은 언어를 타므로 경로와 키만 두고 표시용 이름은 그때그때 만든다
const navList = computed(() => [
  { to: '/', label: configStore.t('nav.home') },
  { to: '/about', label: configStore.t('nav.about') },
])

// 수업 산출물. 서비스 메뉴와 급을 나눠 구분선 뒤에 둔다.
const courseLinks = computed(() => [
  { to: '/lab', label: configStore.t('nav.lab') },
  { to: '/archive', label: configStore.t('nav.archive') },
  { to: '/dev-log', label: configStore.t('nav.devlog') },
])
</script>

<template>
  <div class="site">
    <header class="site-header">
      <div class="inner">
        <RouterLink to="/" class="brand">
          <BrandMark :size="30" />
          <span class="brand-text">
            <span class="brand-name">{{ configStore.t('brand.name') }}</span>
            <span class="brand-sub">{{ configStore.t('brand.tagline') }}</span>
          </span>
        </RouterLink>

        <nav class="nav" :aria-label="configStore.t('nav.mainAria')">
          <RouterLink v-for="item in navList" :key="item.to" :to="item.to" class="nav-item">
            {{ item.label }}
          </RouterLink>

          <span class="divider" aria-hidden="true"></span>

          <RouterLink v-for="item in courseLinks" :key="item.to" :to="item.to" class="sub-item">
            {{ item.label }}
          </RouterLink>

          <div class="switches">
            <LangToggler />
            <UnitToggler />
          </div>
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
        <p class="foot-left">{{ configStore.t('foot.credit') }}</p>
        <nav class="foot-links" :aria-label="configStore.t('nav.courseAria')">
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
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}
.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
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

/*
 * 언어와 단위. 둘 다 보는 방식을 바꾸는 것이지만 생김새를 다르게 뒀다.
 * 사이를 조금 띄워서 서로 다른 스위치라는 게 먼저 읽히게 한다.
 */
.switches {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: 8px;
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
  .switches {
    margin-left: auto;
  }
}
</style>

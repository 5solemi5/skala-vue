<script setup>
import { useConfigStore } from '@/stores/configStore'
import { LANGS } from '@/locales'

const configStore = useConfigStore()
</script>

<template>
  <!--
    단위 토글과 같은 모양으로 맞췄다.
    헤더에 생김새가 다른 스위치가 둘 나란히 있으면 하나는 설정, 하나는 기능처럼 보인다.
    둘 다 '보는 방식을 바꾸는 것' 이라 같은 모양이어야 한다.
  -->
  <div class="lang" role="group" :aria-label="configStore.t('lang.aria')">
    <button
      v-for="item in LANGS"
      :key="item.id"
      type="button"
      :class="{ on: configStore.lang === item.id }"
      :aria-pressed="configStore.lang === item.id"
      :title="item.label"
      @click="configStore.setLang(item.id)"
    >
      {{ item.short }}
    </button>
  </div>
</template>

<style scoped>
.lang {
  display: inline-flex;
  padding: 2px;
  background: var(--color-paper-3);
  border-radius: 3px;
}
.lang button {
  padding: 3px 8px;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--color-ink-3);
  background: none;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.12s ease;
}
.lang button.on {
  color: var(--color-ink);
  background: var(--color-paper);
  box-shadow: 0 1px 2px rgba(16, 28, 38, 0.08);
}
</style>

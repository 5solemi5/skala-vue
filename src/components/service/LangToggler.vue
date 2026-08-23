<script setup>
import { useConfigStore } from '@/stores/configStore'
import { LANGS } from '@/locales'

const configStore = useConfigStore()
</script>

<template>
  <!--
    처음에는 단위 토글과 똑같은 모양으로 맞췄다.
    그랬더니 회색 알약 두 개가 나란히 붙어서 하나의 네 칸짜리 스위치처럼 보였다.
    무엇을 누르는 건지 알 수 없어서 형태를 갈랐다.

    단위는 값을 바꾸는 것이라 눌리는 스위치로 두고,
    언어는 무엇을 보고 있는지 고르는 것이라 위 메뉴와 같은 밑줄로 표시한다.
    색을 더하지 않고 모양만으로 나눴다. 색은 판정에만 쓰기로 했다.
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
  align-items: center;
  gap: 9px;
}
.lang button {
  padding: 0 0 3px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-ink-4);
  background: none;
  border: 0;
  border-bottom: 1.5px solid transparent;
  cursor: pointer;
  transition:
    color 0.12s ease,
    border-color 0.12s ease;
}
.lang button:hover {
  color: var(--color-ink-2);
}
.lang button.on {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink);
}
</style>

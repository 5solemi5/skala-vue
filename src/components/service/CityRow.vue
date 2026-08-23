<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import VerdictMark from './VerdictMark.vue'

const configStore = useConfigStore()

const props = defineProps({
  city: { type: Object, required: true },
  adviceList: { type: Array, default: () => [] },
  selected: { type: Boolean, default: false },
})

defineEmits(['select', 'open-detail'])

const displayTemp = computed(() => configStore.convertTemp(props.city.temp))

const order = { stop: 0, warn: 1, info: 2, good: 3 }
const lead = computed(
  () => [...props.adviceList].sort((a, b) => order[a.level] - order[b.level])[0],
)
</script>

<template>
  <li class="row" :class="[lead?.level, { on: selected }]">
    <button type="button" class="main" :aria-pressed="selected" @click="$emit('select', city)">
      <span class="name">{{ city.name }}</span>
      <span class="deg tnum"
        >{{ displayTemp }}<i>{{ configStore.unitSymbol }}</i></span
      >
      <VerdictMark v-if="lead" :level="lead.level" />
      <span class="headline">{{ lead?.title }}</span>
    </button>

    <button
      type="button"
      class="detail"
      :aria-label="`${city.name} 상세보기`"
      @click.stop="$emit('open-detail', city)"
    >
      상세
    </button>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--color-line);
  transition: background 0.12s ease;
}
.row:last-child {
  border-bottom: 0;
}
.row:hover {
  background: var(--color-paper-2);
}
.row.on {
  background: var(--color-paper-2);
}
/* 선택된 행만 왼쪽에 표시 */
.row.on .main::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-ink);
}

.main {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 5.5rem 4.5rem auto 1fr;
  align-items: center;
  gap: 14px;
  padding: 14px 8px 14px 14px;
  font-family: inherit;
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
}
.name {
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.deg {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.deg i {
  font-size: 11px;
  font-weight: 500;
  font-style: normal;
  color: var(--color-ink-3);
  margin-left: 1px;
}
.headline {
  font-size: 13px;
  color: var(--color-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail {
  flex: none;
  padding: 0 16px;
  font-family: inherit;
  font-size: 12px;
  color: var(--color-ink-3);
  background: none;
  border: 0;
  border-left: 1px solid var(--color-line);
  cursor: pointer;
}
.detail:hover {
  color: var(--color-ink);
  background: var(--color-paper-3);
}

@media (max-width: 640px) {
  .main {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'name deg'
      'mark mark'
      'head head';
    gap: 4px 10px;
    padding: 12px 8px 12px 12px;
  }
  .name {
    grid-area: name;
  }
  .deg {
    grid-area: deg;
  }
  .main :deep(.mark) {
    grid-area: mark;
    justify-self: start;
    margin-top: 4px;
  }
  .headline {
    grid-area: head;
    white-space: normal;
  }
}
</style>

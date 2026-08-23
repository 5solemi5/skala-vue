<script setup>
import PersonCard from './PersonCard.vue'

defineProps({
  people: { type: Array, required: true },
  isSample: { type: Boolean, default: false },
  weatherById: { type: Object, required: true },
  adviceById: { type: Object, required: true },
  labelById: { type: Object, required: true },
  selectedId: { type: String, default: '' },
})

defineEmits(['select', 'setup'])
</script>

<template>
  <section class="board">
    <div class="head">
      <p class="eyebrow">오늘, 내 사람들</p>
      <button v-if="isSample" type="button" class="setup" @click="$emit('setup')">
        내 사람들로 바꾸기
      </button>
    </div>

    <p v-if="isSample" class="sample">
      아래는 만든 사람의 예시입니다. 챙기고 싶은 사람과 그 사람이 있는 지역을 직접 넣어 보세요.
    </p>
    <div class="grid">
      <PersonCard
        v-for="person in people"
        :key="person.id"
        :person="person"
        :weather="weatherById[person.id]"
        :advice-list="adviceById[person.id] ?? []"
        :mode-label="labelById[person.modeId] ?? ''"
        :selected="person.id === selectedId"
        @select="$emit('select', person)"
      />
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.setup {
  font-family: inherit;
  font-size: 12px;
  color: var(--color-ink);
  background: none;
  border: 0;
  border-bottom: 1px solid var(--color-line-2);
  padding: 0 0 2px;
  cursor: pointer;
}
.setup:hover {
  border-bottom-color: var(--color-ink);
}
.sample {
  margin: 0 0 12px;
  max-width: 52ch;
  font-size: 12px;
  line-height: 1.65;
  color: var(--color-ink-3);
}
.eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--color-ink-3);
}
.board {
  margin-bottom: 4px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 1px;
  background: var(--color-line);
  border: 1px solid var(--color-line);
  border-radius: 6px;
  overflow: hidden;
}
</style>

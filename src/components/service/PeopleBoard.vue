<script setup>
import PersonCard from './PersonCard.vue'

defineProps({
  people: { type: Array, required: true },
  weatherById: { type: Object, required: true },
  adviceById: { type: Object, required: true },
  labelById: { type: Object, required: true },
  selectedId: { type: String, default: '' },
})

defineEmits(['select'])
</script>

<template>
  <section class="board">
    <p class="eyebrow">오늘, 내 사람들</p>
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
.eyebrow {
  margin: 0 0 10px;
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

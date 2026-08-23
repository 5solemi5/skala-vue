<script setup>
// 판정 등급을 글자로 보여준다. 아이콘 대신 글자를 쓴 이유는
// '중지'와 '주의'가 아이콘만으로는 구분이 안 되기 때문이다.
defineProps({
  level: { type: String, required: true },
  size: { type: String, default: 'md' },
})

// '작업 중지' 로 두었더니 자전거나 야구에는 안 맞았다.
// 네 가지 모두에 통하는 말로 바꿨다.
const text = {
  stop: '오늘은 아니에요',
  warn: '조심하세요',
  good: '괜찮아요',
  info: '알아두세요',
}
</script>

<template>
  <span class="mark" :class="[level, size]">{{ text[level] }}</span>
</template>

<style scoped>
.mark {
  display: inline-block;
  padding: 2px 7px 3px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  border: 1px solid currentColor;
  border-radius: 2px;
}
.mark.lg {
  padding: 4px 10px 5px;
  font-size: 12.5px;
}
.stop {
  color: var(--color-stop);
  background: var(--color-stop-soft);
}
.warn {
  color: var(--color-warn);
  background: var(--color-warn-soft);
}
.good {
  color: var(--color-good);
  background: var(--color-good-soft);
}
.info {
  color: var(--color-ink-2);
  background: var(--color-paper-2);
}
</style>

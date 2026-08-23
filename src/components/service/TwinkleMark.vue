<script setup>
// 제목과 고른 칸에서 같이 쓰는 반짝임.
// 두 곳에 같은 모양을 두 번 그려 두었더니 한쪽만 고치는 일이 생겨서 컴포넌트로 뺐다.
defineProps({
  size: { type: Number, default: 22 },
  delay: { type: Number, default: 0 },
})
</script>

<template>
  <svg
    class="twinkle"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :style="{ '--delay': `${delay}s` }"
    aria-hidden="true"
  >
    <path
      class="big"
      d="M12 1.5c.6 4.6 1.9 5.9 6.5 6.5-4.6.6-5.9 1.9-6.5 6.5-.6-4.6-1.9-5.9-6.5-6.5 4.6-.6 5.9-1.9 6.5-6.5Z"
    />
    <path
      class="small"
      d="M19 13.5c.3 2.4 1 3.1 3.4 3.4-2.4.3-3.1 1-3.4 3.4-.3-2.4-1-3.1-3.4-3.4 2.4-.3 3.1-1 3.4-3.4Z"
    />
  </svg>
</template>

<style scoped>
.twinkle {
  fill: currentColor;
  overflow: visible;
}
/* 두 별의 박자를 어긋나게 해서 규칙적으로 깜빡이지 않게 했다 */
.big {
  transform-origin: 12px 8px;
  animation: twinkle 3.4s ease-in-out infinite var(--delay, 0s);
}
.small {
  transform-origin: 19px 17px;
  animation: twinkle 3.4s ease-in-out infinite calc(var(--delay, 0s) + 1.1s);
}
@keyframes twinkle {
  0%,
  70%,
  100% {
    opacity: 0.26;
    transform: scale(0.8);
  }
  35% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

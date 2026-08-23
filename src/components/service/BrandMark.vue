<script setup>
// 세 획이 같은 높이에서 시작하고 아래쪽 색이 차오른 만큼이 판정의 무게다.
// 서비스가 하는 말("같은 하늘, 다른 판단")을 그대로 형태로 옮겼다.
defineProps({
  size: { type: Number, default: 28 },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    role="img"
    aria-label="오늘의 채비"
    class="mark"
  >
    <rect width="32" height="32" rx="7" fill="#101C26" />
    <rect x="5.5" y="6" width="6" height="20" rx="2" fill="#8C99A6" />
    <rect x="5.5" y="20" width="6" height="6" rx="2" fill="#3E9B7C" />
    <rect x="13" y="6" width="6" height="20" rx="2" fill="#8C99A6" />
    <rect x="13" y="15" width="6" height="11" rx="2" fill="#D9922C" />
    <rect x="20.5" y="6" width="6" height="20" rx="2" fill="#8C99A6" />
    <rect x="20.5" y="10" width="6" height="16" rx="2" fill="#D14A41" />
  </svg>
</template>

<style scoped>
.mark {
  display: block;
  flex: none;
}
</style>

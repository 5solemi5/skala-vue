<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHereStore } from '@/stores/hereStore'
import { groupOf } from '@/utils/weatherCondition'

const hereStore = useHereStore()

/*
 * 지금 시각.
 * 한 번 읽고 두면 자정을 넘겨도 낮으로 남는다. 1분마다 다시 본다.
 */
const now = ref(new Date().getHours())
let timer = null
onMounted(() => {
  timer = setInterval(() => (now.value = new Date().getHours()), 60 * 1000)
})
onUnmounted(() => clearInterval(timer))

/*
 * 하루를 다섯 때로 나눈다.
 *
 * 밤이라고 배경을 어둡게 깔 수는 없었다.
 * 메뉴 글자가 짙은 잉크색이라 바탕이 어두워지면 읽히지 않는다.
 * 그래서 밤은 어두움이 아니라 '차가움' 으로 표현했다.
 */
const timeOfDay = computed(() => {
  const h = now.value
  if (h >= 5 && h < 8) return 'dawn'
  if (h >= 8 && h < 11) return 'morning'
  if (h >= 11 && h < 16) return 'midday'
  if (h >= 16 && h < 19) return 'dusk'
  return 'night'
})

// 위치를 아직 모르면 날씨는 빼고 시간만 반영한다
const sky = computed(() => (hereStore.weather ? groupOf(hereStore.weather.condition) : null))

const isDark = computed(() => timeOfDay.value === 'night' || timeOfDay.value === 'dusk')

/*
 * 마우스를 따라 아주 조금 움직인다.
 * 배경이 손끝에 반응하면 살아 있는 것처럼 보인다. 다만 몇 px 이면 충분하다.
 * 크게 움직이면 글자를 읽는 데 방해가 된다.
 */
const px = ref(0)
const py = ref(0)
const onMove = (e) => {
  const box = e.currentTarget.getBoundingClientRect()
  px.value = ((e.clientX - box.left) / box.width - 0.5) * 2
  py.value = ((e.clientY - box.top) / box.height - 0.5) * 2
}
const onLeave = () => {
  px.value = 0
  py.value = 0
}
defineExpose({ onMove, onLeave })
</script>

<template>
  <div
    class="sky"
    :class="[timeOfDay, sky]"
    :style="{ '--px': px, '--py': py }"
    aria-hidden="true"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <!-- 시간대에 따라 물드는 바탕 -->
    <span class="tint"></span>

    <!-- 해와 달. 맑을 때만 뜬다 -->
    <span v-if="sky === 'clear'" class="orb" :class="{ moon: isDark }"></span>

    <!-- 구름 -->
    <template v-if="sky === 'clouds' || sky === 'haze'">
      <span class="puff a"></span>
      <span class="puff b"></span>
      <span class="puff c"></span>
    </template>

    <!-- 비 -->
    <template v-if="sky === 'rain'">
      <span v-for="n in 14" :key="`r${n}`" class="drop" :class="`d${n}`"></span>
    </template>

    <!-- 눈 -->
    <template v-if="sky === 'snow'">
      <span v-for="n in 12" :key="`s${n}`" class="snow" :class="`s${n}`"></span>
    </template>

    <!-- 밤에 맑으면 별 몇 개 -->
    <template v-if="sky === 'clear' && timeOfDay === 'night'">
      <span v-for="n in 7" :key="`t${n}`" class="star" :class="`t${n}`"></span>
    </template>
  </div>
</template>

<style scoped>
.sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: auto;
  z-index: 0;
}

/*
 * 시간대별 색.
 * 어느 때든 옅게만 깐다. 헤더는 메뉴를 읽는 자리이지 보는 자리가 아니다.
 */
.tint {
  position: absolute;
  inset: -20%;
  /*
   * 색을 반쯤 눌러 둔다.
   * 처음엔 그대로 깔았더니 가장 옅은 메뉴 글자의 명암비가
   * 흰 바탕일 때 3.5 에서 2.8 까지 떨어졌다.
   * 배경 때문에 원래보다 읽기 어려워지면 안 된다.
   */
  opacity: 0.5;
  transform: translate(calc(var(--px) * -5px), calc(var(--py) * -3px));
  transition: transform 0.5s ease-out;
}
.dawn .tint {
  background: linear-gradient(105deg, #fbe8dd 0%, #f6e6ee 45%, transparent 78%);
}
.morning .tint {
  background: linear-gradient(105deg, #e2eff7 0%, #eef5f8 48%, transparent 80%);
}
.midday .tint {
  background: linear-gradient(105deg, #e4f0f6 0%, #f2f8fa 50%, transparent 82%);
}
.dusk .tint {
  background: linear-gradient(105deg, #f9e3d5 0%, #f2e2e6 46%, transparent 78%);
}
.night .tint {
  background: linear-gradient(105deg, #dfe6f2 0%, #e9edf5 48%, transparent 80%);
}

/* ── 해와 달 ── */
.orb {
  position: absolute;
  top: 12px;
  right: 8%;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(246, 214, 150, 0.75) 0%, rgba(246, 214, 150, 0) 70%);
  transform: translate(calc(var(--px) * 9px), calc(var(--py) * 5px));
  transition: transform 0.5s ease-out;
}
.orb.moon {
  background: radial-gradient(circle, rgba(206, 216, 238, 0.85) 0%, rgba(206, 216, 238, 0) 70%);
}

/* ── 구름 ── */
.puff {
  position: absolute;
  height: 14px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  box-shadow: 0 0 14px 8px rgba(255, 255, 255, 0.6);
}
.puff.a {
  top: 14px;
  width: 66px;
  animation: sail 96s linear infinite;
}
.puff.b {
  top: 38px;
  width: 46px;
  opacity: 0.75;
  animation: sail 132s linear -40s infinite;
}
.puff.c {
  top: 6px;
  width: 88px;
  opacity: 0.55;
  animation: sail 168s linear -100s infinite;
}
@keyframes sail {
  from {
    transform: translateX(-110px);
  }
  to {
    transform: translateX(calc(100vw + 110px));
  }
}
/* 안개는 구름을 더 옅고 낮게 깐다 */
.haze .puff {
  height: 20px;
  filter: blur(4px);
  opacity: 0.5;
}

/* ── 비 ── */
.drop {
  position: absolute;
  top: -14px;
  width: 1px;
  height: 12px;
  background: linear-gradient(180deg, rgba(122, 152, 176, 0) 0%, rgba(122, 152, 176, 0.5) 100%);
  animation: pour 1.1s linear infinite;
}
.drop.d1 { left: 5%; }
.drop.d2 { left: 12%; animation-delay: -0.4s; }
.drop.d3 { left: 19%; animation-delay: -0.8s; }
.drop.d4 { left: 26%; animation-delay: -0.2s; }
.drop.d5 { left: 33%; animation-delay: -0.6s; }
.drop.d6 { left: 41%; animation-delay: -1s; }
.drop.d7 { left: 48%; animation-delay: -0.3s; }
.drop.d8 { left: 56%; animation-delay: -0.7s; }
.drop.d9 { left: 63%; animation-delay: -0.1s; }
.drop.d10 { left: 71%; animation-delay: -0.9s; }
.drop.d11 { left: 78%; animation-delay: -0.5s; }
.drop.d12 { left: 85%; animation-delay: -0.25s; }
.drop.d13 { left: 92%; animation-delay: -0.75s; }
.drop.d14 { left: 97%; animation-delay: -0.45s; }
@keyframes pour {
  to {
    transform: translate(6px, 92px);
  }
}

/* ── 눈 ── */
.snow {
  position: absolute;
  top: -6px;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(160, 180, 200, 0.5);
  animation: settle 9s linear infinite;
}
.snow.s1 { left: 7%; }
.snow.s2 { left: 15%; animation-delay: -2s; animation-duration: 11s; }
.snow.s3 { left: 24%; animation-delay: -5s; }
.snow.s4 { left: 32%; animation-delay: -7s; animation-duration: 12s; }
.snow.s5 { left: 41%; animation-delay: -3s; }
.snow.s6 { left: 50%; animation-delay: -8s; animation-duration: 10s; }
.snow.s7 { left: 58%; animation-delay: -1s; }
.snow.s8 { left: 67%; animation-delay: -6s; animation-duration: 13s; }
.snow.s9 { left: 75%; animation-delay: -4s; }
.snow.s10 { left: 83%; animation-delay: -9s; animation-duration: 11s; }
.snow.s11 { left: 91%; animation-delay: -2.5s; }
.snow.s12 { left: 96%; animation-delay: -6.5s; }
@keyframes settle {
  to {
    transform: translate(10px, 96px);
  }
}

/* ── 별 ── */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(146, 165, 200, 0.9);
  border-radius: 50%;
  animation: blink 4.5s ease-in-out infinite;
}
.star.t1 { top: 12px; left: 14%; }
.star.t2 { top: 30px; left: 25%; animation-delay: -1.2s; }
.star.t3 { top: 9px; left: 38%; animation-delay: -2.6s; }
.star.t4 { top: 34px; left: 52%; animation-delay: -0.7s; }
.star.t5 { top: 16px; left: 66%; animation-delay: -3.3s; }
.star.t6 { top: 28px; left: 79%; animation-delay: -1.9s; }
.star.t7 { top: 11px; left: 90%; animation-delay: -2.9s; }
@keyframes blink {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tint,
  .orb,
  .puff,
  .drop,
  .snow,
  .star {
    animation: none;
    transition: none;
    transform: none;
  }
  /* 떨어지는 것들은 멈춰 세우면 화면 밖에 있으니 아예 감춘다 */
  .drop,
  .snow {
    display: none;
  }
}
</style>

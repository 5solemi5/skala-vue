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

// 숫자보다 우리말이 따뜻하게 읽힌다
const koCount = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟']
const countLabel = (n) => `${koCount[n] ?? n} 곳의 하루를 보고 있어요`
</script>

<template>
  <section class="board">
    <div class="head">
      <div class="title">
        <h2>
          오늘,
          <span class="mark">
            내 사람들
            <svg class="twinkle" viewBox="0 0 24 24" aria-hidden="true">
              <path
                class="big"
                d="M12 1.5c.6 4.6 1.9 5.9 6.5 6.5-4.6.6-5.9 1.9-6.5 6.5-.6-4.6-1.9-5.9-6.5-6.5 4.6-.6 5.9-1.9 6.5-6.5Z"
              />
              <path
                class="small"
                d="M19 13.5c.3 2.4 1 3.1 3.4 3.4-2.4.3-3.1 1-3.4 3.4-.3-2.4-1-3.1-3.4-3.4 2.4-.3 3.1-1 3.4-3.4Z"
              />
            </svg>
          </span>
        </h2>
        <p class="sub">{{ countLabel(people.length) }}</p>
      </div>
      <button type="button" class="setup" @click="$emit('setup')">
        {{ isSample ? '내 사람들 챙기기' : '내 사람들 더 챙기기' }}
      </button>
    </div>

    <!--
      흩어 놓지 않고 한 판에 담는다.
      각자 다른 곳에 있어도 아침에 한 번은 같이 보는 사람들이라
      카드가 따로 노는 것보다 한 액자에 들어가 있는 편이 맞다.
    -->
    <div class="frame">
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
    </div>
  </section>
</template>

<style scoped>
.board {
  margin-bottom: 4px;
}
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.3;
}

/*
 * 이름 옆에 작은 반짝임 하나.
 * 밑줄을 그어봤더니 자로 잰 선처럼 뻣뻣해서, 아껴 두는 것에 표시를 남기듯 바꿨다.
 * 두 별의 박자를 어긋나게 해서 규칙적으로 깜빡이지 않게 했다.
 */
.mark {
  position: relative;
  white-space: nowrap;
  padding-right: 20px;
}
.twinkle {
  position: absolute;
  right: -2px;
  top: -8px;
  width: 22px;
  height: 22px;
  fill: var(--color-ink);
  overflow: visible;
}
.twinkle .big {
  opacity: 0.9;
  transform-origin: 12px 8px;
  animation: twinkle 3.4s ease-in-out infinite;
}
.twinkle .small {
  opacity: 0.55;
  transform-origin: 19px 17px;
  animation: twinkle 3.4s ease-in-out infinite 1.1s;
}
@keyframes twinkle {
  0%,
  70%,
  100% {
    opacity: 0.28;
    transform: scale(0.82);
  }
  35% {
    opacity: 1;
    transform: scale(1);
  }
}

.sub {
  margin: 14px 0 0;
  font-size: 12.5px;
  color: var(--color-ink-3);
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
  white-space: nowrap;
}
.setup:hover {
  border-bottom-color: var(--color-ink);
}

/*
 * 테두리를 1px 그라디언트로 깔아 유리 액자처럼 한쪽에서 빛을 받게 했다.
 * 그 빛이 아주 느리게 테두리를 한 바퀴 도는데,
 * 눈에 띄려고 넣은 게 아니라 가만히 보고 있을 때만 알아채는 정도로 뒀다.
 */
.frame {
  position: relative;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--color-line) 0%,
    var(--color-line-2) 22%,
    #ffffff 38%,
    var(--color-line-2) 52%,
    var(--color-line) 74%,
    var(--color-line-2) 100%
  );
  background-size: 260% 260%;
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgba(16, 28, 38, 0.04),
    0 10px 28px -14px rgba(16, 28, 38, 0.16);
  animation: sheen 14s ease-in-out infinite;
}
@keyframes sheen {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 판 안쪽 맨 위에 얇은 흰 선을 둬서 유리가 얹힌 것처럼 보이게 한다 */
.frame::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  top: 1px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.9) 30%,
    rgba(255, 255, 255, 0.9) 70%,
    transparent
  );
  pointer-events: none;
  z-index: 1;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr));
  gap: 1px;
  background: var(--color-line);
  border-radius: 11px;
  overflow: hidden;
}
</style>

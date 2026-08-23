<script setup>
import { useConfigStore } from '@/stores/configStore'
import PersonCard from './PersonCard.vue'
import TwinkleMark from './TwinkleMark.vue'

const configStore = useConfigStore()

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
      <div class="title">
        <h2>
          {{ configStore.t('people.today') }}
          <span class="mark">
            {{ configStore.t('people.mine') }}
            <TwinkleMark class="spark" :size="22" />
          </span>
        </h2>
        <p class="sub">{{ configStore.t('people.count', { n: people.length }) }}</p>
      </div>
      <button type="button" class="setup" @click="$emit('setup')">
        {{ configStore.t(isSample ? 'people.setup' : 'people.setupMore') }}
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
.spark {
  position: absolute;
  right: -2px;
  top: -8px;
  color: var(--color-ink);
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
 * 액자 테두리.
 * 1px 그라디언트를 깔고 각도를 돌려서 빛이 테두리를 한 바퀴 도는 것처럼 보이게 했다.
 * 밝은 지점을 두 곳에 둬서 한쪽이 사라질 때 반대쪽이 들어온다.
 * 속도는 일부러 느리게 뒀다. 눈에 띄려고 넣은 게 아니라
 * 가만히 보고 있을 때 알아채는 정도가 맞다고 봤다.
 */
@property --sheen {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.frame {
  position: relative;
  padding: 1.5px;
  border-radius: 13px;
  background: conic-gradient(
    from var(--sheen),
    var(--color-line) 0deg,
    var(--color-line-2) 40deg,
    #ffffff 68deg,
    var(--color-line-2) 96deg,
    var(--color-line) 150deg,
    var(--color-line) 210deg,
    var(--color-line-2) 244deg,
    #ffffff 272deg,
    var(--color-line-2) 300deg,
    var(--color-line) 360deg
  );
  box-shadow:
    0 1px 2px rgba(16, 28, 38, 0.04),
    0 10px 28px -14px rgba(16, 28, 38, 0.16);
  animation: sheen 9s linear infinite;
}
@keyframes sheen {
  to {
    --sheen: 360deg;
  }
}

/* 판 안쪽 맨 위에 얇은 흰 선을 둬서 유리가 얹힌 것처럼 보이게 한다 */
.frame::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  top: 1.5px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.9) 30%,
    rgba(255, 255, 255, 0.9) 70%,
    transparent
  );
  pointer-events: none;
  z-index: 2;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr));
  gap: 1px;
  background: var(--color-line);
  border-radius: 11.5px;
  overflow: hidden;
}

/* 폭이 좁아도 한 줄에 하나씩 쌓이면 열두 칸이 너무 길어진다. 두 칸씩 붙인다 */
@media (max-width: 520px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

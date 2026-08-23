<script setup>
import { ref } from 'vue'
import WeatherMockup from '../components/exercise/WeatherMockup.vue'
import WeatherComposition from '../components/exercise/WeatherComposition.vue'
import WeatherParent from '../components/exercise/WeatherParent.vue'

const stageList = ref([
  {
    id: 1,
    title: 'Hands on 2 · Weather Mockup',
    page: 'p.116',
    day: '1일차 · Vue Syntax',
    learned: 'v-for · v-if · :value/@input · 이벤트 수식어',
    point: '판정을 템플릿에서 함수로 불렀다. 나중에 보니 리렌더링마다 6번씩 돌고 있었음.',
    component: WeatherMockup,
  },
  {
    id: 2,
    title: 'Hands on 3 · Weather Composition',
    page: 'p.145',
    day: '2일차 · Composition API',
    learned: 'computed · watch · watchEffect',
    point: '위의 함수 호출을 computed 로 교체. 검색 필터링과 모드 전환 감시 추가.',
    component: WeatherComposition,
  },
  {
    id: 3,
    title: 'Hands on 4 · Weather Component',
    page: 'p.178',
    day: '3일차 · Vue Components',
    learned: 'props · emits · slot',
    point: '한 덩어리였던 화면을 6개로 분리. 상태는 부모, 화면은 자식.',
    component: WeatherParent,
  },
])

const currentStageId = ref(3)
</script>

<template>
  <div class="archive">
    <h2>🗂️ 과제 진행 아카이브</h2>
    <p class="lead">과제가 단원마다 어떻게 바뀌었는지. 단계를 누르면 그때 결과물이 아래에 뜬다.</p>

    <ol class="timeline">
      <li
        v-for="stage in stageList"
        :key="stage.id"
        class="stage"
        :class="{ on: currentStageId === stage.id }"
        @click="currentStageId = stage.id"
      >
        <div class="stage-head">
          <span class="dot"></span>
          <div>
            <p class="day">{{ stage.day }}</p>
            <p class="title">
              {{ stage.title }} <span class="page">{{ stage.page }}</span>
            </p>
          </div>
        </div>
        <div class="stage-body">
          <p><b>배운 것</b> {{ stage.learned }}</p>
          <p><b>메모</b> {{ stage.point }}</p>
        </div>
      </li>
    </ol>

    <div v-for="stage in stageList" :key="stage.id">
      <div v-if="currentStageId === stage.id" class="preview">
        <p class="preview-label">{{ stage.title }} 결과물</p>
        <component :is="stage.component" />
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 700;
}
.lead {
  margin: 0 0 24px;
  font-size: 14.5px;
  color: #495057;
  line-height: 1.75;
}
.timeline {
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 12px;
}
.stage {
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.stage:hover {
  border-color: #adb5bd;
}
.stage.on {
  border-color: #42b883;
  background: #f4fbf8;
}
.stage-head {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.dot {
  width: 9px;
  height: 9px;
  margin-top: 7px;
  border-radius: 50%;
  background: #ced4da;
  flex: none;
}
.stage.on .dot {
  background: #42b883;
}
.day {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #adb5bd;
}
.title {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 600;
}
.page {
  font-size: 12px;
  font-weight: 400;
  color: #adb5bd;
}
.stage-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e9ecef;
  font-size: 12.5px;
  color: #6c757d;
  line-height: 1.65;
}
.stage-body p {
  margin: 0 0 6px;
}
.stage-body b {
  color: #495057;
}
.preview {
  padding-top: 8px;
}
.preview-label {
  margin: 0 0 14px;
  font-size: 11.5px;
  letter-spacing: 0.08em;
  color: #adb5bd;
  font-weight: 600;
}
</style>

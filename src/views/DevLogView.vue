<script setup>
import { ref, computed } from 'vue'

/**
 * 개발하면서 실제로 막혔던 문제와 고쳐 쓴 코드를 남기는 화면.
 * 완성된 결과만으로는 어떤 판단을 거쳤는지 알 수 없어서 별도 페이지로 만들었다.
 */
const tabList = ref([
  { id: 'trouble', label: '🔧 트러블슈팅' },
  { id: 'review', label: '🔍 코드리뷰' },
])
const currentTab = ref('trouble')

const troubleList = ref([
  {
    id: 't4',
    title: '도시를 바꿔도 상세 페이지에 이전 도시가 그대로 표시됨',
    date: '4일차',
    symptom: '/weather/city_05 에서 /weather/city_99 로 주소를 바꿨는데 화면에는 계속 대구가 떠 있었다. 없는 도시 코드인데도 안내 문구가 안 나왔다.',
    log: `onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})`,
    dig: '새로고침하면 정상이었다. 주소창 이동일 때만 문제가 생겼다. onMounted 에 로그를 찍어보니 두 번째 이동에서는 아예 실행되지 않았다.',
    cause: 'Vue Router 는 같은 컴포넌트로 매칭되는 경로 사이를 이동할 때 컴포넌트를 파괴하지 않고 재사용한다. 파라미터만 바뀌는 경우가 여기 해당해서 onMounted 가 다시 실행되지 않는다.',
    fix: `watch(
  () => route.params.cityId,
  (newId) => { if (newId) loadCity(newId) },
)`,
    result: 'city_01 → city_04 → city_06 → city_99 → city_02 로 연속 이동해도 매번 올바른 도시가 표시되고, 없는 코드에서는 안내 문구가 나온다.',
    lesson: '교재는 \'Mount 시점에 Mock Data 에서 도시 객체 선택\' 이라고 되어 있어 onMounted 만 썼는데, 동적 경로에서는 그것만으로 부족했다. 데이터 로딩을 함수로 빼서 onMounted 와 watch 양쪽에서 부르도록 했다.',
  },
  {
    id: 't1',
    title: 'npm run dev 실행 시 vite: command not found',
    date: '1일차',
    symptom: '프로젝트를 받아 처음 실행했을 때 vite 명령을 찾지 못했다. node_modules 는 분명히 있었다.',
    log: `sh: vite: command not found

Error: Cannot find native binding.
Cannot find module '@rolldown/binding-darwin-arm64'
  ... library load disallowed by system policy`,
    dig: 'node_modules/.bin 이 비어 있었다. npm install 을 다시 돌린 뒤 열어보니 @rolldown/binding-darwin-arm64 폴더에 README.md 와 package.json 만 있고 정작 필요한 .node 바이너리가 통째로 빠져 있었다.',
    cause: 'npm 의 optional dependency 설치 이슈. 에러 메시지 자체가 npm/cli#4828 을 지목하고 있었다.',
    fix: 'rm -rf node_modules && npm ci',
    result: '16MB 짜리 rolldown-binding.darwin-arm64.node 가 정상적으로 받아졌고 개발 서버가 떴다.',
    lesson: 'npm install 대신 npm ci 를 쓴 이유는 lock 파일에 적힌 버전 그대로 설치해서 강사님 환경과 어긋나지 않게 하기 위해서였다.',
  },
  {
    id: 't2',
    title: '날씨 카드가 좁게 찌그러지고 화면이 세로 중앙정렬됨',
    date: '1일차',
    symptom: '카드 그리드를 만들었는데 화면이 넓어져도 카드가 한 줄에 하나씩만 들어가고, 페이지 전체가 세로 가운데로 몰렸다.',
    log: `/* src/assets/main.css - 스캐폴드 기본값 */
@media (min-width: 1024px) {
  body { display: flex; place-items: center; }
  #app { display: grid; grid-template-columns: 1fr 1fr; }
}`,
    dig: '내 CSS 를 아무리 고쳐도 안 되길래 개발자 도구로 #app 을 찍어보니 grid-template-columns: 1fr 1fr 이 걸려 있었다. 내가 쓴 적 없는 규칙이었다.',
    cause: 'npm create vue 로 만든 스캐폴드의 main.css 에 들어있는 웰컴 화면 전용 레이아웃. 1024px 이상에서 #app 을 2단 그리드로 쪼개고 body 를 flex 중앙정렬한다.',
    fix: '해당 미디어쿼리에서 2단 그리드와 body 중앙정렬을 제거하고, 왜 지웠는지 주석으로 남겼다.',
    result: '카드 그리드가 화면 폭에 맞춰 정상적으로 펼쳐졌다.',
    lesson: '내가 안 쓴 스타일이 먹고 있으면 프레임워크 기본값을 의심해야 한다. 스캐폴드 CSS 는 데모용이라 실제 레이아웃과 충돌할 수 있다.',
  },
  {
    id: 't3',
    title: 'v-model 수식어를 붙였는데 typeof 가 계속 string',
    date: '1일차',
    symptom: '교재 예제를 따라 .number 수식어 실습을 하는데 숫자를 입력해도 데이터 타입이 계속 string 으로 나왔다.',
    log: `<!-- 제목은 .number 인데 정작 바인딩에는 수식어가 없다 -->
<h3>2) .number 수식어 (Number 타입 자동 형변환)</h3>
<input type="text" v-model="age" />`,
    dig: '수식어를 잘못 쓴 줄 알고 문법을 몇 번 확인했다. 결국 예제 코드 자체에 .number 가 빠져 있는 걸 발견했다.',
    cause: '예제의 제목과 실제 바인딩이 어긋나 있었다. 3번 .trim 항목도 마찬가지였다.',
    fix: 'v-model.number="age" / v-model.trim="userEmail" 로 수정',
    result: '입력값 25 의 typeof 가 number 로 바뀌었고, "   test@mail.com   " 의 길이가 13 으로 나와 공백 제거가 확인됐다.',
    lesson: '예제가 안 되면 내 문법을 의심하기 전에 예제 자체를 먼저 읽어봐야 한다. 화면에 결과를 찍어두면 이런 걸 빨리 잡을 수 있다.',
  },
])

const reviewList = ref([
  {
    id: 'r1',
    title: '템플릿에서 함수 호출 → computed 로 전환',
    when: 'Hands on 2 → Hands on 3',
    why: 'Code Challenge 6 에서 computed 의 캐싱을 배우고 나서, 1일차에 짠 코드가 리렌더링마다 재실행된다는 걸 알았다.',
    before: `<!-- 화면이 다시 그려질 때마다 도시 수(6개)만큼 재실행 -->
<div v-for="advice in getAdviceList(item)">`,
    after: `const adviceMap = computed(() => {
  const map = {}
  weatherList.value.forEach((item) => {
    map[item.id] = buildAdvice(item, currentMode.value)
  })
  return map
})`,
    effect: 'computed 안에 로그를 넣고 확인해 보니, 모드를 바꿀 때만 재계산되고 카드를 클릭할 때는 캐싱된 값이 재사용됐다.',
    note: 'computed 는 인자를 받을 수 없어서 한참 고민했다. 도시별로 따로 만들 게 아니라 전체를 한 덩어리로 계산해 객체로 들고 있으면 된다는 걸 알았다.',
  },
  {
    id: 'r2',
    title: 'v-if 4단 체인 → 객체 매핑',
    when: 'Hands on 4',
    why: '판정 등급별로 아이콘을 고르는 데 v-if / v-else-if 를 네 번 늘어놓고 있었다. 등급을 추가하려면 템플릿을 또 고쳐야 했다.',
    before: `<span v-if="advice.level === 'stop'">⛔</span>
<span v-else-if="advice.level === 'warn'">⚠️</span>
<span v-else-if="advice.level === 'good'">✅</span>
<span v-else>📌</span>`,
    after: `const iconMap = { stop: '⛔', warn: '⚠️', good: '✅', info: '📌' }

{{ iconMap[advice.level] }}`,
    effect: '템플릿이 네 줄에서 한 줄로 줄었고, 등급이 늘어나도 객체에 항목만 추가하면 된다.',
    note: '컴포넌트를 AdviceList 로 분리하면서 같이 정리했다. 분리를 하니 이런 게 눈에 띄었다.',
  },
  {
    id: 'r3',
    title: '판정 규칙 중복 → 공용 모듈로 추출',
    when: 'Hands on 5',
    why: '같은 buildAdvice 함수가 WeatherComposition / WeatherParent / WeatherHomeView 세 파일에 그대로 복사되어 있었다. 규칙 하나 고치려면 세 군데를 다 고쳐야 했다.',
    before: `// WeatherComposition.vue
const buildAdvice = (item, mode) => { ... }

// WeatherParent.vue
const buildAdvice = (item, mode) => { ... }   // 완전히 동일

// WeatherHomeView.vue
const buildAdvice = (item, mode) => { ... }   // 완전히 동일`,
    after: `// src/utils/adviceRules.js
export const buildAdvice = (item, mode) => { ... }

// 각 화면에서
import { buildAdvice } from '../utils/adviceRules'`,
    effect: '규칙을 한 곳에서만 관리하게 됐다. 나중에 실제 API 를 붙일 때도 이 파일만 손보면 된다.',
    note: '처음부터 분리했으면 좋았겠지만, 화면이 하나뿐일 때는 중복인지 알 수 없었다. 세 번째로 복사할 때가 되어서야 분리할 시점이라는 게 분명해졌다.',
  },
])

const currentList = computed(() => (currentTab.value === 'trouble' ? troubleList.value : reviewList.value))
</script>

<template>
  <div class="devlog">
    <h2>🛠️ 개발 기록</h2>
    <p class="lead">
      과제를 만들면서 실제로 막혔던 문제와, 배운 것을 적용해 고쳐 쓴 코드를 남겨둡니다.
      완성된 결과만으로는 어떤 판단을 거쳤는지 남지 않기 때문입니다.
    </p>

    <nav class="tabs">
      <button
        v-for="tab in tabList"
        :key="tab.id"
        class="tab"
        :class="{ on: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- 트러블슈팅 -->
    <div v-if="currentTab === 'trouble'" class="list">
      <article v-for="item in currentList" :key="item.id" class="entry">
        <p class="meta">{{ item.date }}</p>
        <h3>{{ item.title }}</h3>
        <dl>
          <dt>증상</dt>
          <dd>{{ item.symptom }}</dd>
          <dt>확인한 내용</dt>
          <dd><pre>{{ item.log }}</pre></dd>
          <dt>추적 과정</dt>
          <dd>{{ item.dig }}</dd>
          <dt>원인</dt>
          <dd>{{ item.cause }}</dd>
          <dt>해결</dt>
          <dd><pre class="fix">{{ item.fix }}</pre></dd>
          <dt>결과</dt>
          <dd>{{ item.result }}</dd>
          <dt>배운 것</dt>
          <dd class="lesson">{{ item.lesson }}</dd>
        </dl>
      </article>
    </div>

    <!-- 코드리뷰 -->
    <div v-else class="list">
      <article v-for="item in currentList" :key="item.id" class="entry">
        <p class="meta">{{ item.when }}</p>
        <h3>{{ item.title }}</h3>
        <dl>
          <dt>고치게 된 이유</dt>
          <dd>{{ item.why }}</dd>
        </dl>
        <div class="diff">
          <div class="col before">
            <p class="col-label">Before</p>
            <pre>{{ item.before }}</pre>
          </div>
          <div class="col after">
            <p class="col-label">After</p>
            <pre>{{ item.after }}</pre>
          </div>
        </div>
        <dl>
          <dt>효과</dt>
          <dd>{{ item.effect }}</dd>
          <dt>덧붙임</dt>
          <dd class="lesson">{{ item.note }}</dd>
        </dl>
      </article>
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
  margin: 0 0 22px;
  font-size: 14.5px;
  color: #495057;
  line-height: 1.75;
}
.tabs {
  display: flex;
  gap: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}
.tab {
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 999px;
  cursor: pointer;
}
.tab.on {
  color: #ffffff;
  background-color: #35495e;
  border-color: #35495e;
}
.list {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.entry {
  padding: 20px 22px;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
}
.meta {
  margin: 0;
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: #adb5bd;
}
.entry h3 {
  margin: 4px 0 18px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
}
dl {
  margin: 0;
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px 14px;
  font-size: 13.5px;
}
dt {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #adb5bd;
  padding-top: 3px;
}
dd {
  margin: 0;
  color: #495057;
  line-height: 1.7;
}
dd.lesson {
  padding: 10px 12px;
  background: #f4fbf8;
  border-left: 3px solid #42b883;
  border-radius: 6px;
}
pre {
  margin: 0;
  padding: 12px 14px;
  background: #2c3e50;
  color: #e9ecef;
  border-radius: 8px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
  line-height: 1.65;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
pre.fix {
  background: #1e3a2f;
}
.diff {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin: 16px 0;
}
.col-label {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.before .col-label {
  color: #e03131;
}
.after .col-label {
  color: #2f9e44;
}
.before pre {
  background: #3b2b2b;
}
.after pre {
  background: #1e3a2f;
}
</style>

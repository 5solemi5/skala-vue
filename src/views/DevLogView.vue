<script setup>
import { ref, computed } from 'vue'

const tabList = ref([
  { id: 'trouble', label: '🔧 트러블슈팅' },
  { id: 'review', label: '🔍 코드리뷰' },
])
const currentTab = ref('trouble')

const troubleList = ref([
  {
    id: 't5',
    title: '실습용 CSS 가 과제 화면 버튼까지 덮음',
    date: '4일차',
    symptom:
      'Element Plus 전역 등록을 걷어내고 나니 과제 화면의 [상세보기] 버튼이 초록에서 회색으로 바뀌어 있었다. Tailwind 로 bg-primary 를 줬는데 안 먹었다.',
    log: `개발자 도구에서 실제 적용값을 찍어봤다
  background-color: rgb(241, 243, 245)   ← #f1f3f5

/* src/assets/practice.css */
button {
  background-color: #f1f3f5;
  ...
}`,
    cause:
      'practice.css 의 전역 button 규칙이 이겼다. 클래스(.bg-primary)가 요소(button)보다 우선순위가 높은데도 진 이유는 Tailwind v4 가 유틸리티를 @layer 안에 넣기 때문이다. 레이어에 속하지 않은 규칙은 레이어에 속한 규칙을 항상 이긴다.',
    fix: `/* 실습 화면 전용 스타일을 그 영역 안으로 한정 */
.practice-container button { ... }
.practice-container input  { ... }
.practice-container h1, h2, h3, hr { ... }`,
    note: '우선순위 계산만 생각하다가 한참 못 찾았다. 캐스케이드 레이어가 우선순위보다 먼저 비교된다는 걸 이번에 알았다.',
  },
  {
    id: 't1',
    title: 'npm run dev 가 안 됨 — vite: command not found',
    date: '1일차',
    symptom:
      '프로젝트 받아서 처음 실행했는데 vite 를 못 찾는다고 했다. node_modules 는 분명히 있었다.',
    log: `$ npm run dev

> skala-vue@0.0.0 dev
> vite

sh: vite: command not found

$ ls node_modules/.bin      # 비어있음
$

# npm install 다시 하고 실행하니 이번엔 다른 에러
file:///Users/.../node_modules/rolldown/dist/shared/binding-Zhafd14U.mjs:597
      const error = new Error("Cannot find native binding. npm has a bug related
      to optional dependencies (https://github.com/npm/cli/issues/4828). Please
      try \`npm i\` again after removing both package-lock.json and node_modules.");
                              ^
Error: Cannot find native binding.
    at file:///.../binding-Zhafd14U.mjs:597:34
    ... 2 lines matching cause stack trace ...
  cause: Error: Cannot find module '@rolldown/binding-wasm32-wasi'
    cause: Error: Cannot find module './rolldown-binding.wasi.cjs'
      cause: Error: dlopen(.../rolldown-binding.darwin-arm64.node, 0x0001)

Node.js v26.5.0`,
    cause:
      '@rolldown/binding-darwin-arm64 폴더를 열어보니 README.md 와 package.json 만 있고 정작 필요한 .node 바이너리가 없었다. 에러 메시지가 npm/cli#4828 을 직접 가리키고 있었다.',
    fix: `rm -rf node_modules
npm ci`,
    note: 'npm install 말고 npm ci 를 쓴 건 lock 파일 그대로 설치해서 강사님 환경과 안 어긋나게 하려고.',
  },
  {
    id: 't2',
    title: '카드가 좁게 찌그러지고 화면이 세로 가운데로 몰림',
    date: '1일차',
    symptom:
      '카드 그리드를 만들었는데 화면이 넓어져도 한 줄에 하나씩만 들어갔다. 내 CSS 를 아무리 고쳐도 그대로였다.',
    log: `/* src/assets/main.css — npm create vue 가 만들어준 파일 */
@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}`,
    cause:
      '개발자 도구로 #app 을 찍어보니 grid-template-columns: 1fr 1fr 이 걸려 있었다. 내가 쓴 적 없는 규칙이었다. 스캐폴드가 만들어준 웰컴 화면 전용 CSS 였다.',
    fix: '해당 미디어쿼리에서 2단 그리드와 body 중앙정렬 제거',
  },
  {
    id: 't3',
    title: '.number 수식어를 붙였는데 typeof 가 계속 string',
    date: '1일차',
    symptom:
      '교재 예제를 따라 하는데 숫자를 넣어도 타입이 안 바뀌었다. 수식어 문법을 잘못 쓴 줄 알고 몇 번 확인했다.',
    log: `<h3>2) .number 수식어 (Number 타입 자동 형변환)</h3>
<input type="text" v-model="age" placeholder="나이를 입력하세요" />
<p>데이터 타입: <strong>{{ typeof age }}</strong></p>

화면 출력 → 데이터 타입: string     (25 를 넣어도)`,
    cause:
      '예제 코드 자체에 .number 가 빠져 있었다. 제목만 .number 고 바인딩은 그냥 v-model="age" 였다. 3번 .trim 항목도 마찬가지였다.',
    fix: `v-model.number="age"
v-model.trim="userEmail"`,
    note: '예제가 안 되면 내 문법부터 의심했는데, 예제를 먼저 읽어봤어야 했다.',
  },
  {
    id: 't4',
    title: '도시를 바꿔도 상세 페이지에 이전 도시가 그대로',
    date: '4일차',
    symptom:
      '/weather/city_05 에서 /weather/city_99 로 주소를 바꿨는데 화면엔 계속 대구가 떠 있었다. 없는 코드인데 안내 문구도 안 나왔다. 새로고침하면 정상이었다.',
    log: `onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})

// onMounted 안에 로그를 찍어봤다
// 첫 진입:            [detail] mounted city_05
// city_99 로 이동 후: (아무것도 안 찍힘)`,
    cause:
      'Vue Router 는 같은 컴포넌트로 매칭되는 경로끼리 이동할 때 컴포넌트를 파괴하지 않고 재사용한다. 파라미터만 바뀌는 경우가 여기 해당해서 onMounted 가 다시 안 돈다.',
    fix: `watch(
  () => route.params.cityId,
  (newId) => { if (newId) loadCity(newId) },
)`,
    note: '교재에는 "Mount 시점에 선택" 이라고만 되어 있어서 onMounted 만 썼는데 동적 경로에서는 부족했다.',
  },
])

const reviewList = ref([
  {
    id: 'r1',
    title: '템플릿에서 함수 호출하던 걸 computed 로',
    when: 'Hands on 2 → 3',
    why: 'Code Challenge 6 에서 computed 캐싱을 배우고 나서, 1일차에 짠 게 리렌더링마다 다시 도는 코드였다는 걸 알았다. 카드가 6개니까 화면 한 번 갱신될 때마다 판정이 6번 돌고 있었다.',
    before: `<div v-for="advice in getAdviceList(item)">`,
    after: `const adviceMap = computed(() => {
  const map = {}
  weatherList.value.forEach((item) => {
    map[item.id] = buildAdvice(item, currentMode.value)
  })
  return map
})

<div v-for="advice in adviceMap[item.id]">`,
    note: 'computed 는 인자를 못 받아서 한참 고민했다. 도시별로 따로 만들 게 아니라 전체를 한 덩어리로 계산해서 객체로 들고 있으면 됐다. 콘솔로 확인해보니 모드 바꿀 때만 재계산되고 카드 클릭할 땐 안 돌았다.',
  },
  {
    id: 'r2',
    title: 'v-if 4단 체인을 객체 조회로',
    when: 'Hands on 4',
    why: '등급별로 아이콘 고르는 데 v-if / v-else-if 를 네 번 늘어놓고 있었다. 등급 하나 추가하려면 템플릿을 또 고쳐야 했다.',
    before: `<span v-if="advice.level === 'stop'">⛔</span>
<span v-else-if="advice.level === 'warn'">⚠️</span>
<span v-else-if="advice.level === 'good'">✅</span>
<span v-else>📌</span>`,
    after: `const iconMap = { stop: '⛔', warn: '⚠️', good: '✅', info: '📌' }

{{ iconMap[advice.level] }}`,
  },
  {
    id: 'r3',
    title: '세 파일에 복사돼 있던 판정 규칙을 모듈로',
    when: 'Hands on 5',
    why: '같은 buildAdvice 함수가 WeatherComposition / WeatherParent / WeatherHomeView 에 그대로 들어가 있었다. 규칙 하나 고치려면 세 군데를 다 고쳐야 했다.',
    before: `// WeatherComposition.vue
const buildAdvice = (item, mode) => { ... }

// WeatherParent.vue
const buildAdvice = (item, mode) => { ... }   // 동일

// WeatherHomeView.vue
const buildAdvice = (item, mode) => { ... }   // 동일`,
    after: `// src/utils/adviceRules.js
export const buildAdvice = (item, mode) => { ... }

// 각 화면에서
import { buildAdvice } from '../utils/adviceRules'`,
    note: '처음부터 분리했으면 좋았겠지만 화면이 하나일 땐 중복인지 몰랐다. 세 번째로 복사할 때가 되어서야 분명해졌다.',
  },
])

const currentList = computed(() =>
  currentTab.value === 'trouble' ? troubleList.value : reviewList.value,
)
</script>

<template>
  <div class="devlog">
    <h2>🛠️ 개발 기록</h2>
    <p class="lead">막혔던 것과, 배운 걸 적용해서 고쳐 쓴 코드.</p>

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
        <p class="symptom">{{ item.symptom }}</p>
        <pre v-if="item.log">{{ item.log }}</pre>
        <dl>
          <dt>원인</dt>
          <dd>{{ item.cause }}</dd>
          <dt>해결</dt>
          <dd>
            <pre class="fix">{{ item.fix }}</pre>
          </dd>
        </dl>
        <p v-if="item.note" class="note">{{ item.note }}</p>
      </article>
    </div>

    <!-- 코드리뷰 -->
    <div v-else class="list">
      <article v-for="item in currentList" :key="item.id" class="entry">
        <p class="meta">{{ item.when }}</p>
        <h3>{{ item.title }}</h3>
        <p class="symptom">{{ item.why }}</p>
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
        <p v-if="item.note" class="note">{{ item.note }}</p>
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
  margin: 14px 0 0;
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
.symptom {
  margin: 0 0 14px;
  font-size: 13.5px;
  color: #495057;
  line-height: 1.75;
}
.note {
  margin: 14px 0 0;
  padding: 10px 12px;
  font-size: 13px;
  color: #495057;
  line-height: 1.7;
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

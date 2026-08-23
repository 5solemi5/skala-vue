<script setup>
import { ref, computed } from 'vue'

const tabList = ref([
  { id: 'trouble', label: '트러블슈팅' },
  { id: 'review', label: '코드리뷰' },
])
const currentTab = ref('trouble')

const troubleList = ref([
  {
    id: 't11',
    title: '배포한 주소가 로그인 화면으로 튕김',
    date: '배포',
    symptom:
      'Vercel 이 배포를 마치고 알려준 주소로 들어가니 사이트 대신 Vercel 로그인 페이지가 떴다. 내 브라우저에서는 잘 보여서 처음엔 알아채지 못했다. 이미 로그인이 되어 있었기 때문이다.',
    log: `curl -I https://skala-qlrmddl5o-428.vercel.app/

HTTP/2 302
location: https://vercel.com/sso-api?url=...&nonce=...
set-cookie: _vercel_sso_nonce=...
x-robots-tag: noindex`,
    cause:
      '주소가 두 종류라는 걸 몰랐다. 빌드마다 새로 생기는 배포 전용 주소는 기본으로 잠겨 있고, 프로젝트에 하나만 붙는 고정 주소는 열려 있다. 내가 확인한 건 잠긴 쪽이었다.',
    fix: `# 고정 주소 (Settings > Domains)
curl -o /dev/null -w '%{http_code}' https://skala-vue-seven-alpha.vercel.app/
200`,
    note: '내 브라우저에서 열린다고 남도 열리는 게 아니었다. 로그인 상태가 없는 곳에서 확인해야 알 수 있다.',
  },
  {
    id: 't10',
    title: '휴대폰에서 화면이 옆으로 밀림',
    date: '내 사람들 화면',
    symptom:
      '등록 상한을 열둘로 올리고 375px 로 줄여봤더니 화면이 오른쪽으로 밀렸다. 사람 카드는 이미 좁은 폭을 처리해 뒀는데도 밀렸다.',
    log: `// 어느 요소가 튀어나왔는지 폭을 직접 재봤다
const w = document.documentElement.clientWidth   // 360
document.querySelectorAll('*').forEach((el) => {
  const r = el.getBoundingClientRect()
  if (r.right > w) console.log(el.className, Math.round(r.right))
})

// seg      541    ← 하는 일 고르는 줄
// track    586    ← 시간대 막대 (overflow: auto 안이라 정상)

document.documentElement.scrollWidth  //  541
document.documentElement.clientWidth  //  360`,
    cause:
      '하는 일이 넷일 때는 한 줄에 들어갔는데 일곱으로 늘리면서 넘쳤다. .seg 는 flex 한 줄이고 각 항목의 글자에 white-space: nowrap 이 걸려 있어서, 줄어들 곳이 없으니 부모 폭을 넘겨 밀어냈다. 시간대 막대는 overflow-x: auto 컨테이너 안이라 잘려서 문제가 아니었다.',
    fix: `.seg {
  display: flex;
  flex-wrap: wrap;   /* 안 들어가면 다음 줄로 */
}

@media (max-width: 560px) {
  .seg-item { margin-right: 16px; }
  .what { font-size: 14px; }
}`,
    note: '항목 수를 늘릴 때는 그 줄이 접힐 수 있는지 같이 봐야 한다. scrollWidth 와 clientWidth 를 비교하면 밀린 건 바로 알 수 있지만, 범인은 결국 요소를 하나씩 재봐야 나왔다.',
  },
  {
    id: 't9',
    title: '카드를 고르면 이름이 흐려 보임',
    date: '내 사람들 화면',
    symptom:
      '고른 칸에 위쪽 빛을 넣었더니 그 칸의 이름만 뿌옇게 보였다. 글자 색은 건드린 적이 없는데 흐려졌다.',
    log: `.person.on::before {
  position: absolute;
  top: 1.5px;
  height: 38%;
  background: linear-gradient(180deg, rgba(255,255,255,.85), transparent);
  pointer-events: none;     /* 클릭은 통과하는데 */
}

getComputedStyle(name).color  →  rgb(44, 62, 80)   /* 색은 그대로였다 */`,
    cause:
      'position: absolute 인 가상요소는 위치를 잡지 않은 일반 콘텐츠보다 위에 그려진다. 흰 그라디언트가 이름을 덮고 있었다. pointer-events: none 은 클릭만 통과시킬 뿐 그리는 순서와는 상관이 없다.',
    fix: `/* 덮지 말고 배경으로 넣는다 */
.person.on {
  background:
    radial-gradient(120% 90% at 78% 0%, rgba(255,255,255,.95), transparent 62%),
    linear-gradient(168deg, #ffffff, #f7fafb);
}`,
    note: '색이 그대로인데 흐려 보이면 글자가 아니라 그 위에 뭐가 덮였는지 봐야 한다.',
  },
  {
    id: 't8',
    title: '한 이벤트 핸들러에 두 줄을 넣어 화면이 통째로 안 뜸',
    date: '사람 편집 기능',
    symptom: '컴포넌트를 붙이자마자 화면이 500 으로 죽었다. 파일 하나 때문에 앱 전체가 안 떴다.',
    log: `GET /src/components/service/PeopleManager.vue  500 (Internal Server Error)

Error parsing JavaScript expression: Unexpected token, expected "," (3:10)
  238 |   class="ghost sm dim"
  239 |   @click="
  240 |     peopleStore.resetPeople()
      |  ^
  241 |     emit('changed')`,
    cause: '@click 안에 문장 두 개를 줄바꿈으로 넣었다. 템플릿 표현식은 한 문장만 받는다.',
    fix: `const resetToSample = () => {
  peopleStore.resetPeople()
  editingId.value = ''
  emit('changed')
}

@click="resetToSample"`,
    note: '템플릿에 로직을 두 줄 이상 쓰고 싶어지면 함수로 빼라는 신호였다.',
  },
  {
    id: 't7',
    title: '철원이 검색되지 않음',
    date: '지역 검색',
    symptom:
      '철원을 추가하려는데 검색 결과가 비어 있었다. 영월·정선 같은 다른 소도시는 나오는데 철원만 안 나왔다.',
    log: `$ curl "api.openweathermap.org/geo/1.0/direct?q=철원&appid=..."
[]

$ curl "geocoding-api.open-meteo.com/v1/search?name=철원&language=ko"
{"results":[{"name":"철원","latitude":38.20917,"longitude":127.2175,
  "admin1":"강원도","admin2":"철원군", ...}]}`,
    cause:
      '두 지오코딩 API 모두 GeoNames 를 쓰지만 서로 다른 스냅샷이라 빠지는 지명이 다르다. 철원은 OpenWeatherMap 에 없고, 반대로 영월은 Open-Meteo 에 없다.',
    fix: `const results = await Promise.allSettled([searchOwm(q), searchMeteo(q)])
const found = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
// 좌표가 거의 같은 결과는 한 번만 보여준다`,
    note: '10곳을 표본으로 확인해 보니 한쪽만 쓰면 4곳이 안 나오고, 합치면 9곳이 나왔다. 좌표만 있으면 날씨는 어디든 받을 수 있으니 한계는 이름을 좌표로 바꾸는 단계에만 있다.',
  },
  {
    id: 't6',
    title: '모바일에서 가로 스크롤이 생김',
    date: '4일차',
    symptom:
      '아이폰 크기(375px)로 줄여보니 화면 아래에 가로 스크롤바가 생겼다. 콘텐츠가 화면보다 4px 넓었다.',
    log: `// 넘치는 요소를 찾아봤다
document.querySelectorAll('*').forEach(el => {
  const r = el.getBoundingClientRect()
  if (r.right > document.documentElement.clientWidth) console.log(el)
})

뷰포트 375 / 문서폭 379
넘침: div.rounded-lg (width 270, right 379)   ← 날씨 카드`,
    cause:
      '카드 그리드를 minmax(270px, 1fr) 로 잡아뒀는데, 375px 화면에서 바깥 여백을 다 빼면 쓸 수 있는 폭이 223px 밖에 안 된다. 그런데 270px 을 최소값으로 강제하고 있어서 화면 밖으로 밀려났다.',
    fix: `grid-template-columns: repeat(auto-fill, minmax(min(270px, 100%), 1fr));`,
    note: 'min(270px, 100%) 로 감싸면 부모가 270px 보다 좁을 때는 부모 폭을 따라간다. 모바일 여백도 함께 줄였다.',
  },
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
    id: 'r15',
    title: '배포하고 나서야 본 API 키의 자리',
    when: '배포',
    why: '환경변수로 빼 뒀으니 키가 안 보이는 줄 알았다. 배포한 번들을 열어 보니 키가 그대로 들어 있었다.',
    before: `# .env.local 에 두고 코드에서는 이렇게만 썼다
const OWM_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY`,
    after: `# 배포된 결과물에서 그대로 찾힌다
curl -s https://.../assets/index-DoGzl147.js | grep -c '63c09e17'
1`,
    note: 'import.meta.env 는 실행 중에 읽는 값이 아니라 빌드할 때 문자열로 바뀌어 박힌다. .env.local 을 Git 에 안 올리는 건 저장소를 지키는 것이지 키를 숨기는 게 아니었다. VITE_ 를 붙인 값은 전부 공개된다고 보는 게 맞고, 진짜 감춰야 하는 키라면 서버를 하나 두고 거기서 불러야 한다. 이번엔 무료 플랜 날씨 키라 그대로 뒀다.',
  },
  {
    id: 'r14',
    title: '고른 칸을 돋보이게 하려고 나머지를 어둡게 했던 것',
    when: '내 사람들 화면',
    why: '고른 칸이 위로 올라와 보이게 하려고 나머지 칸을 한 톤 눌렀다. 대비는 생겼는데, 챙기는 사람들인데 고르지 않았다고 흐려지는 게 이상했다.',
    before: `.person    { background: var(--color-paper-2); }  /* 나머지를 눌러 두고 */
.person.on { background: var(--color-paper);   }  /* 고른 칸만 밝게 */`,
    after: `.person    { background: var(--color-paper); }   /* 모두 그대로 밝게 */
.person.on {
  box-shadow: inset 0 0 0 1.5px var(--color-ink),   /* 테두리를 둘러 또렷하게 */
              0 8px 24px -10px rgba(16,28,38,.32);
  background: ... var(--color-stop-soft);           /* 그 사람 판정 색을 옅게 */
}`,
    note: '빼기(다른 걸 흐리기)가 아니라 더하기(고른 것에 얹기)로 바꿨다. 색은 아무 색이나 쓰지 않고 그날 판정 색을 그대로 써서, 화사해지면서도 색이 여전히 뜻을 갖게 했다.',
  },
  {
    id: 'r12',
    title: '판정 색을 두 곳에 쓰니 경고판이 됨',
    when: '내 사람들 화면',
    why: '카드마다 위쪽에 판정 색 막대를 깔았는데, 네 곳이 모두 같은 등급인 날에는 빨간 줄이 나란히 서서 액자가 아니라 경고판처럼 보였다. 색을 막대와 문구 두 곳에 쓴 게 과했다.',
    before: `.person::before {          /* 카드 상단 3px 막대 */
  height: 3px;
}
.person.stop::before { background: var(--color-stop); }

.person.stop .say { color: var(--color-stop); }   /* 문구도 빨강 */`,
    after: `/* 막대를 걷어내고 이름 앞 점 하나로 */
.pip { width: 7px; height: 7px; border-radius: 50%; }
.pip.stop { background: var(--color-stop); }

/* 색은 판정 문구에만 남긴다 */
.person.stop .say { color: var(--color-stop); }`,
    note: '같은 정보를 두 번 칠하면 강조가 아니라 소음이 된다. 점 하나로 줄이니 오히려 눈에 잘 들어왔다.',
  },
  {
    id: 'r13',
    title: '밑줄을 반짝임으로',
    when: '내 사람들 화면',
    why: '제목 아래에 손으로 그은 듯한 밑줄을 넣었는데, 작게 보니 자로 잰 직선과 구분이 안 됐다. 강조도 안 되고 손맛도 안 났다.',
    before: `.mark::after {
  /* SVG 로 그린 물결 밑줄 */
  background-image: url("data:image/svg+xml,...path d='M3 6.4C24 2.9...'");
}`,
    after: `<span class="mark">
  내 사람들
  <svg class="twinkle">...</svg>   <!-- 크고 작은 별 두 개 -->
</span>

/* 두 별의 박자를 어긋나게 해서 규칙적으로 깜빡이지 않게 */
.twinkle .big   { animation: twinkle 3.4s ease-in-out infinite; }
.twinkle .small { animation: twinkle 3.4s ease-in-out infinite 1.1s; }`,
    note: '아껴 두는 것에 표시를 남기는 느낌으로 바꿨다. 전역 CSS 에 prefers-reduced-motion 규칙이 있어 움직임을 꺼둔 사람에게는 깜빡이지 않는다.',
  },
  {
    id: 'r10',
    title: '기본 목록에서 개인 정보만 걷어내기',
    when: '문구 정리',
    why: '기본 목록과 소개 글에 가까운 사람들이 무슨 일을 하는지가 그대로 적혀 있었다. 공개된 저장소에 올라가는 화면이라 그 부분은 가려야 했다.',
    before: `const DEFAULT_PEOPLE = [
  { who: '아버지', modeId: 'repair', ... },
  { who: '할머니', modeId: 'farm',   ... },
]

// 소개 글
"아버지가 자동차 정비소를, 할머니가 농사를 하십니다..."`,
    after: `const DEFAULT_PEOPLE = [
  { who: '정비소',   modeId: 'repair', ... },
  { who: '밭',       modeId: 'farm',   ... },
  { who: '출퇴근길', modeId: 'bike',   ... },
]

// 소개 글은 한 문장만 바꿨다
"가까운 분들 중에 날씨로 하루가 달라지는 일을 하시는 분들이 있습니다."`,
    note: '처음엔 글 전체를 사실 설명으로 바꿨는데, 그러니 왜 이걸 만들었는지가 사라졌다. 만든 이유는 남기고 누가 무슨 일을 하는지만 가리는 쪽으로 다시 고쳤다. 이름을 장소로 바꾼 것은 덤으로 무엇을 넣는 칸인지 더 잘 보이게 했다.',
  },
  {
    id: 'r11',
    title: '첫 화면에서 카드와 아래 내용이 따로 놀던 것',
    when: '문구 정리',
    why: '맨 위 첫 카드는 정비소(전주)인데 그 아래 큰 화면은 서울이 떠 있었다. 카드를 눌러야 맞춰지는데, 누르기 전까지는 두 영역이 서로 다른 곳을 보고 있었다.',
    before: `onMounted(() => {
  loadWeather()   // 지역 목록의 첫 번째를 고름
  loadPeople()    // 등록한 곳들을 따로 불러옴
})`,
    after: `onMounted(() => {
  // 등록해 둔 첫 곳을 바로 펼쳐 둔다
  const first = peopleStore.people[0]
  if (first && !route.query.mode) handlePersonSelect(first)
  ...
})`,
    note: '주소에 ?mode= 가 붙어 들어온 경우에는 그 설정을 존중하도록 조건을 뒀다. 링크로 공유한 화면이 열자마자 다른 걸 보여주면 안 되기 때문이다.',
  },
  {
    id: 'r9',
    title: '안내 문구를 빼고 버튼 하나로',
    when: '사람 편집 기능',
    why: '예시라는 걸 알리려고 카드 위에 안내 문장을 두 줄 넣었는데, 바로 옆에 "내 사람들로 바꾸기" 버튼이 이미 같은 말을 하고 있었다. 같은 말을 두 번 하면 읽는 사람만 피곤하다.',
    before: `<button v-if="isSample" class="setup">내 사람들로 바꾸기</button>

<p v-if="isSample" class="sample">
  아래는 만든 사람의 예시입니다. 챙기고 싶은 사람과
  그 사람이 있는 지역을 직접 넣어 보세요.
</p>`,
    after: `<button class="setup">
  {{ isSample ? '내 사람들로 바꾸기' : '사람 고치기' }}
</button>`,
    note: '문구를 없애는 대신 버튼을 항상 띄웠다. 아직 예시면 "내 사람들로 바꾸기", 한 번이라도 고쳤으면 "사람 고치기" 로 말이 바뀐다. 버튼 하나가 안내와 진입을 같이 한다.',
  },
  {
    id: 'r8',
    title: '나만 쓸 수 있는 화면이던 것을 고침',
    when: '사람 편집 기능',
    why: '챙길 대상 목록을 코드에 박아 두고 편집 화면을 안 만들었더니, 처음 들어온 사람은 남이 정해 둔 목록을 그대로 보게 됐다. 스토어에 추가·수정·삭제 함수는 있었지만 부를 곳이 없어서 사실상 고정이었다.',
    before: `// stores/peopleStore.js 안에만 있고 화면에서 부르는 곳이 없었다
const DEFAULT_PEOPLE = [
  { who: '정비소', modeId: 'repair', city: { name: '전주', ... } },
  { who: '밭',     modeId: 'farm',   city: { name: '철원', ... } },
]
const addPerson = ...    // 호출하는 곳 없음
const updatePerson = ... // 호출하는 곳 없음`,
    after: `// PeopleManager.vue - 호칭 입력 + 하는 일 선택 + 지역 검색
// 한 번이라도 손대면 isSample 이 false 가 되어 안내 문구가 사라진다
const isSample = ref(localStorage.getItem(STORAGE_KEY) === null)

// 처음 들어온 사람에게는 예시임을 알린다
<p v-if="isSample" class="sample">
  아래는 만든 사람의 예시입니다. 챙기고 싶은 사람과
  그 사람이 있는 지역을 직접 넣어 보세요.
</p>`,
    note: '기본값을 아예 비워 둘까도 했는데, 빈 화면으로 시작하면 이 서비스가 무엇인지 알기 어려웠다. 예시를 보여주되 예시라고 밝히고 바꾸는 길을 옆에 두는 쪽으로 정했다.',
  },
  {
    id: 'r7',
    title: '사람과 지역을 하나로 묶기',
    when: '컨셉 정리',
    why: '하는 일과 지역을 따로 고르게 해뒀더니, 정비소를 골랐는데 서울 날씨로 판정하고 있었다. 정비소는 전주에 있고 밭은 철원에 있는데 둘 다 서울로 보고 있었던 것이다. 챙기는 대상마다 지역이 다르니 둘을 따로 두면 안 됐다.',
    before: `// 모드(하는 일)와 지역이 서로 모르는 상태
configStore.currentMode   // 'repair'
selectedId                // 'city_01' (서울)
// 사용자가 매번 둘 다 맞춰야 한다`,
    after: `// 한 사람 = 호칭 + 하는 일 + 지역
{ who: '정비소', modeId: 'repair', city: { name: '전주', lat, lon } }
{ who: '밭',     modeId: 'farm',   city: { name: '철원', lat, lon } }

const handlePersonSelect = (person) => {
  configStore.setMode(person.modeId)   // 하는 일과
  selectedId.value = person.city.id    // 지역이 함께 바뀐다
}`,
    note: '화면 맨 위에 등록한 대상을 한 줄로 놓고 각자 자기 지역 날씨와 판정을 보여주도록 바꿨다. 아침에 한 번 열면 챙길 곳들이 한눈에 들어온다.',
  },
  {
    id: 'r5',
    title: '카드 그리드를 히어로 + 목록 구조로',
    when: '화면 재구성',
    why: '검색 / 내 지역 / 모드 / 카드목록이 전부 같은 크기의 흰 상자로 쌓여 있어서 무엇부터 봐야 하는지 알 수 없었다. 이 화면이 하는 일은 하나인데(오늘 이 일을 해도 되는가) 정작 그 판단이 카드 안쪽 작은 글씨에 묻혀 있었다.',
    before: `<!-- 같은 무게의 상자 네 개 -->
<BaseDashboardCard><SearchBar /></BaseDashboardCard>
<BaseDashboardCard><CityManager /></BaseDashboardCard>
<BaseDashboardCard><ModeSelector /></BaseDashboardCard>
<BaseDashboardCard>
  <div class="card-grid">
    <WeatherCard v-for="item in list" ... />   <!-- 판정은 카드 안쪽 -->
  </div>
</BaseDashboardCard>`,
    after: `<!-- 결정 순서대로 위에서 아래로 -->
<ModeBar />                       <!-- 1. 나는 어떤 일을 하는가 -->
<CityHero :city="selectedCity" /> <!-- 2. 그래서 오늘 뭘 해야 하는가 -->
<ul>                              <!-- 3. 다른 지역은 어떤가 -->
  <CityRow v-for="item in list" :selected="item.id === selectedId" />
</ul>
<section class="tools">           <!-- 4. 목록 손보기 -->
  <SearchBar /><CityManager />
</section>`,
    note: '교재의 "카드를 누르면 상태바 문구가 바뀐다" 요구사항이 그대로 이 동작이 됐다. 상태바를 화면 아래 회색 띠로 두는 대신 선택한 지역을 위쪽에 크게 띄우는 방식으로 바꿨다. 요구사항 문구는 히어로 하단에 그대로 남겼다.',
  },
  {
    id: 'r6',
    title: '색을 판정에만 쓰기로',
    when: '화면 재구성',
    why: '브랜드 색으로 쓰던 초록과 "양호" 판정 초록이 같은 색이라, 화면에서 색이 보여도 그게 우리 서비스 색인지 괜찮다는 뜻인지 알 수 없었다. 버튼도 초록, 좋은 상태도 초록이었다.',
    before: `--color-primary: hsl(160 47% 49%);   /* 브랜드 초록 */
--color-good: 초록 계열                /* 판정 초록 */
/* 버튼, 링크, 태그, 판정이 전부 같은 초록 */`,
    after: `/* 기본은 전부 무채색으로 두고 색은 판정에만 */
--color-ink: #101c26;      /* 잉크 - 짙은 남색 */
--color-paper-2: #f0f3f5;  /* 지면 - 차가운 회청 */

--color-stop: #9e2b25;
--color-warn: #8c6318;
--color-good: #1f6152;`,
    note: '이렇게 두니 화면에서 색이 보이는 곳이 곧 신경 써야 할 곳이 됐다. 판정 색도 형광에 가까운 기본 팔레트 대신 인쇄 잉크 정도로 채도를 낮췄다.',
  },
  {
    id: 'r4',
    title: 'Promise.all 을 allSettled 로',
    when: '지역 추가 기능',
    why: '사용자가 지역을 직접 추가할 수 있게 되니, 그중 한 곳이라도 응답이 실패하면 Promise.all 이 전부 버려서 화면이 통째로 비어버린다. 잘 되는 다섯 곳까지 못 보게 되는 셈이다.',
    before: `export const fetchAllWeather = async (cities) => {
  return Promise.all(cities.map((city) => fetchCityWeather(city)))
}
// 한 곳만 실패해도 catch 로 빠져서 전체가 에러 화면`,
    after: `const results = await Promise.allSettled(cities.map((c) => fetchCityWeather(c)))
const ok = [], failed = []
results.forEach((r, i) => {
  if (r.status === 'fulfilled') ok.push(r.value)
  else failed.push({ city: cities[i], reason: r.reason })
})
return { list: ok, failed }

// 성공한 곳은 보여주고, 실패한 곳만 따로 안내`,
    note: '고정된 6개 도시일 때는 문제가 안 보였다. 사용자가 값을 넣을 수 있게 되면서 드러났다.',
  },
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
    <h2>개발 기록</h2>
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
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
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

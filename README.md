# SKALA 오늘의 채비

> 날씨를 숫자가 아니라 **"오늘 뭘 해야 하는지"** 로 알려주는 서비스

기존 날씨앱은 "내일 비 20mm"까지만 알려준다. 그런데 같은 예보를 보고도
정비소 사장님과 농사짓는 분이 준비해야 하는 건 정반대다.

| 오늘 날씨 | 🔧 정비소 | 🌾 농사 |
|---|---|---|
| 습도 88% | 도장 걸면 백화가 생긴다 → **작업 연기** | 잎에 물기가 오래 남는다 → **곰팡이병 주의** |
| 최저 2℃ | 배터리 방전 출동이 몰린다 → **재고 확인** | **서리 위험** → 피복하거나 수확을 앞당김 |
| 비 예보 | 사고 입고가 늘어난다 → **판금 일정 여유** | 약제가 씻겨 내려간다 → **방제 취소** |

같은 API, 같은 숫자, 다른 조언. 이 해석을 대신해 주는 것이 이 서비스다.

**만들게 된 이유** — 아버지는 자동차 정비소를, 할머니는 농사를 하신다.
두 분 다 아침마다 날씨를 확인하시는데, 어느 앱도 "그래서 오늘 뭘 하시라"는 말은 해주지 않는다.
그러다 보니 날씨로 일하는 사람이 두 분만은 아니라는 걸 알게 됐고,
하는 일을 고르면 그 일에 맞는 채비를 알려주는 화면을 만들기로 했다.

---

SKALA Full-Stack Engineering — **Frontend framework: Vue.js** 과정 실습 저장소.
교재의 Code Challenge와 Hands on 과제를 순서대로 진행하면서 작성한 코드와 학습 기록을 함께 정리한다.

---

## 개발 환경

| 항목 | 버전 / 내용 |
|---|---|
| OS | macOS (Apple Silicon) |
| Node.js | v26.5.0 |
| npm | 11.17.0 |
| Vue | 3.5.x |
| Vite | 8.x |
| 에디터 | VS Code + Vue (Official) 확장 |
| 디버깅 | Vue Devtools |

## 실행 방법

```sh
npm install     # 의존성 설치
npm run dev     # 개발 서버 실행 → http://localhost:5173
npm run lint    # ESLint 검사
npm run format  # Prettier 포맷팅
npm run build   # 배포용 빌드 (dist/)
```

## 폴더 구조

```
src/
├── App.vue                    # 실습 컨테이너. 진도에 맞춰 섹션을 하나씩 열어가며 사용
├── main.js
├── assets/
│   └── practice.css           # 실습 화면 공통 스타일
├── components/
│   └── practices/
│       └── basic/             # 1~5. 기본 문법 실습 컴포넌트
├── router/
├── stores/
└── views/
```

`App.vue`는 진도에 맞춰 해당 섹션의 `import`와 태그 주석을 함께 풀어서 쓰는 방식으로 운영했다.
아직 안 배운 부분을 미리 열어두면 실행이 깨지기 때문에, 배운 만큼만 열어두고 커밋했다.

---

# 학습 기록

## 1일차 — Vue Syntax

### Code Challenge 1. 학습환경 구성 (p.72)

| 파일 | 내용 |
|---|---|
| `SampleOne.vue` | 일반 변수 vs `ref()` 반응성 변수 비교 |
| `SampleTwo.vue` | Text Interpolation 안에서 JavaScript 표현식 사용 |

**알게 된 점**

- `let normalCount = 0`은 값이 실제로 증가해도 화면이 안 바뀐다. 버튼을 아무리 눌러도 `0` 그대로다.
  Vue가 추적하지 않는 값이라 다시 그릴 이유를 모르기 때문이다.
- `ref(0)`으로 감싸면 값이 바뀔 때마다 화면이 따라 바뀐다. 템플릿에서는 `.value` 없이 쓰지만
  `<script>` 안에서는 `vueCount.value`로 접근해야 한다는 점이 헷갈렸다.
- `{{ }}` 안에는 변수만이 아니라 `welcomeMessage.toUpperCase()`, `Math.ceil(Math.random() * 100)`처럼
  **표현식**을 넣을 수 있다. 다만 `if`문 같은 **문장**은 못 들어간다.

### Code Challenge 2. Vue Directive (p.93)

| 분류 | 파일 |
|---|---|
| v-html / v-text | `VueHtml.vue`, `VueHtmlXss.vue`, `VueText.vue` |
| v-bind | `VueBind.vue`, `VueBindClass.vue`, `VueBindStyle.vue`, `VueBindShorthand.vue` |
| 조건부 렌더링 | `VueIf.vue`, `VueShow.vue` |
| 리스트 렌더링 | `VueFor.vue` |
| 렌더링 최적화 | `VuePre.vue`, `VueCloak.vue`, `VueOnce.vue`, `VueMemo.vue` |

**알게 된 점**

- `{{ }}`는 HTML 태그를 **글자 그대로** 출력하고, `v-html`은 태그로 **해석해서** 출력한다.
  그래서 `v-html`에 사용자 입력을 그대로 넣으면 XSS가 뚫린다. `VueHtmlXss.vue`에서
  입력창에 `<img src=x onerror=alert(1)>`를 넣어보니 실제로 스크립트가 실행됐다.
  → **사용자 입력은 `v-html`에 절대 넣으면 안 된다**는 걸 직접 보고 이해했다.
- `v-if`는 DOM에서 아예 제거하고, `v-show`는 `display: none`만 붙인다.
  개발자 도구로 확인해보니 `v-show` 쪽은 요소가 그대로 남아 있었다. 자주 토글하는 건 `v-show`,
  거의 안 바뀌는 건 `v-if`가 유리하다는 게 이해됐다.
- `v-for`에 `:key`를 꼭 붙여야 하는 이유는 Vue가 어떤 항목이 그대로이고 어떤 게 바뀌었는지
  구분하기 위해서다. 배열 인덱스보다 고유 `id`를 쓰는 게 안전하다.
- `v-once`와 `v-memo`는 처음엔 차이를 몰랐다. `v-once`는 **한 번 그리고 끝**,
  `v-memo="[name]"`은 **지정한 값이 바뀔 때만** 다시 그린다.
  `VueMemo.vue`에서 나이 버튼을 눌러도 화면이 안 바뀌다가, 이름을 바꾸는 순간
  나이까지 같이 갱신되는 걸 보고 확실히 이해했다.
- `v-cloak`은 CSS `[v-cloak] { display: none }`을 같이 써야 의미가 있다.
  디렉티브만 붙이면 아무 일도 안 일어난다.

### Code Challenge 3. Vue Event Handling (p.105)

| 파일 | 내용 |
|---|---|
| `EventBasic.vue` | 인라인 연산(`@click="count++"`) / 메서드 핸들러 호출 |
| `EventObject.vue` | 이벤트 객체로 좌표·태그 정보 얻기, 인자와 `$event` 함께 넘기기 |
| `EventModifier.vue` | `.prevent`, `.stop` |

**알게 된 점**

- 핸들러에 **인자가 없으면** `@click="getOnlyEvent"`처럼 함수 이름만 넘겨도 이벤트 객체가 자동으로 들어온다.
  그런데 **인자를 넘기는 순간** 이벤트 객체가 사라져서, `@click="getWithParam('회원A', $event)"`처럼
  `$event`를 직접 넘겨줘야 한다. 이 부분에서 한 번 막혔다.
- `.prevent`는 `<a>`의 페이지 이동 같은 **브라우저 기본 동작**을 막고,
  `.stop`은 **부모로 이벤트가 올라가는 것**을 막는다. 이름이 비슷해서 헷갈렸는데
  부모 박스 안에 버튼 두 개를 놓고 하나만 `.stop`을 걸어보니 차이가 명확해졌다.
  → 1일차 과제(Weather Mockup)에서 카드 안의 [상세보기] 버튼을 누를 때
  카드 선택 이벤트가 같이 발동하지 않게 하려면 여기서 배운 `.stop`이 필요하겠다.

### Code Challenge 4. Vue Form Handling & Vue Style (p.115)

| 파일 | 내용 |
|---|---|
| `ModelBasic.vue` | `v-model` 축약 문법과 그 내부 원리(`:value` + `@input`) 비교 |
| `ModelForm.vue` | textarea / checkbox(단일·다중) / radio / select 와 `v-model` 매핑 |
| `ModelModifier.vue` | `.lazy`, `.number`, `.trim` 및 수식어 체이닝 |
| `StyleScoped.vue` | `<style scoped>` 와 외부 CSS 클래스 함께 쓰기 |

**알게 된 점**

- `v-model`은 마법이 아니라 **`:value` 바인딩 + `@input` 이벤트**를 한 줄로 줄여 쓴 것이다.
  `ModelBasic.vue`에서 두 방식을 나란히 놓고 입력해보니 결과가 똑같았다.
  1일차 과제에서 한글 입력 때문에 `:value` / `@input`을 직접 쓰는 이유도 여기서 이해됐다.
- 다중 checkbox는 `ref([])`처럼 **배열로 시작해야** 선택한 값들이 배열에 쌓인다.
  처음에 `ref('')`로 두면 값이 덮어써진다.
- 단일 checkbox는 Boolean, 다중 checkbox는 배열, radio·select는 문자열로
  **요소마다 담기는 자료형이 다르다**는 게 제일 헷갈렸던 부분이다.
- `<input type="text">`로 숫자를 받으면 값이 **문자열**로 들어온다.
  `typeof`로 찍어보니 `"25"`가 `string`이었다. `.number`를 붙이니 `number`로 바뀌었다.
  → 나중에 기온 계산 같은 걸 할 때 문자열이 섞이면 `"25" + 1 = "251"`이 되어버릴 수 있으니 주의해야겠다.
- `.trim`은 앞뒤 공백을 지워준다. `"   test@mail.com   "`를 입력했더니 길이가 13으로 나왔다.
  `.trim.number`처럼 **체이닝**도 된다.
- `<style scoped>`를 붙이면 그 컴포넌트 안에서만 스타일이 먹는다.
  반면 `App.vue`에서 `@import` 한 `practice.css`의 `.btn-external` 같은 클래스는 전역이라
  어느 컴포넌트에서든 쓸 수 있다. 공통 디자인은 외부 CSS, 컴포넌트 전용 디자인은 scoped로
  나누는 기준이 잡혔다.

**직접 고친 부분**

강사님 예제의 2·3번 항목은 제목에 `.number` / `.trim`이라고 적혀 있는데
정작 바인딩은 `v-model="age"`, `v-model="userEmail"`로 수식어가 빠져 있었다.
그대로 두니 `typeof`가 계속 `string`으로만 나와서 수식어 효과를 확인할 수 없었다.
`v-model.number`, `v-model.trim`으로 고쳐서 동작을 확인했다.

---

# 과제 (Hands on) 기록

## Hands on 1. Project Scaffolding (p.55~56)

- `npm create vue` 로 `skala-vue` 프로젝트를 생성하고 `npm install` → `npm run dev` 로 실행 확인
- Vue Devtools 로 Components / Pages / Router / Pinia 등 탭 구성 확인
- `src/views/AboutView.vue` 를 수정해 HMR(저장 즉시 반영) 동작 확인


## Hands on 2. Weather Mockup (p.116) — 1일차 과제

### 교재 요구사항 이행

| 요구사항 | 구현 |
|---|---|
| 1. 배열 렌더링 (`v-for`) | `weatherList` 를 카드로 반복 출력, `:key="item.id"` 바인딩 |
| 2. 조건부 렌더링 (`v-if`) | 25도 이상 `🔥 더움 (25도 이상)` / 미만 `❄️ 선선함 (25도 미만)` |
| 3. 양방향 바인딩·한글 처리 | `:value` + `@input` 으로 검색어를 받아 `검색 중인 도시`로 출력 |
| 4. 이벤트 및 수식어 | 카드 클릭 → 상태바 `{도시}이 선택되었습니다.` / [상세보기]는 `@click.stop` 으로 버블링 차단 후 `window.alert` |
| 5. 본인 데이터 추가 | 아래 참조 |

교재에서 주어진 서울·수원·부산 3개 도시의 원본 데이터(`id`/`name`/`temp`/`status`)는
값을 바꾸지 않고 그대로 유지했다.

### 개인 Customization (요구사항 5번)

**① 도시 3개 추가** — 전주 · 대구 · 강릉

**② 판정용 관측 항목 추가** — `humidity`(습도) · `rainProb`(강수확률) · `minTemp`(최저기온)

기온만으로는 "오늘 뭘 해야 하는지"를 말할 수 없어서 항목을 늘렸다.
도장 작업 가능 여부는 습도가, 서리 위험은 최저기온이, 방제 시점은 강수확률이 결정한다.

**③ 하는 일에 따라 조언이 바뀌는 모드** — 🔧 정비 / 🌾 농사 / 🏗️ 현장 / 🏃 운동

이 과제의 핵심이다. 같은 날씨 데이터를 모드별로 다르게 해석한다.
예를 들어 대구(21℃ · 습도 82% · 최저 2℃)는

| 모드 | 오늘의 채비 |
|---|---|
| 🔧 정비 | ⛔ 도장 작업은 미루세요 / 📌 배터리 방전 출동이 늘어납니다 |
| 🌾 농사 | ⛔ 오늘 방제는 하지 마세요 / ⛔ 서리가 내릴 수 있습니다 |
| 🏗️ 현장 | ✅ 특별히 신경 쓸 것이 없습니다 |

**④ 검색어와 일치하는 카드 강조** — `:class` 객체 바인딩으로 테두리·배경 변경.
검색 결과 필터링은 `computed`를 배우는 2일차 과제 범위라 여기서는 강조만 했다.

### 구현하면서 고민한 점

- **`computed` 없이 판정하기.** 모드별 조언을 만들려면 계산이 필요한데 `computed`는 아직 진도 전이다.
  일반 함수 `getAdviceList(item)` 를 만들어 템플릿에서 호출하는 방식으로 처리했다.
  다만 이 방식은 카드가 다시 그려질 때마다 함수가 매번 실행된다.
  2일차에 `computed`를 배우면 캐싱되도록 리팩토링할 예정이다.
- **조언에 판단 근거를 같이 적었다.** `⛔ 도장 작업은 미루세요` 만 있으면 신뢰가 안 간다.
  `습도 88% — 도막에 수분이 물려 백화가 생깁니다` 처럼 왜 그런지를 함께 보여줘야
  사용자가 납득하고 따를 수 있다고 봤다.
- **교재 요구사항과 내 추가분을 코드에서 구분했다.** 주석에 `[교재 요구사항 N]` / `[요구사항 5]` 를
  표시해서 어디까지가 지정 사항이고 어디부터가 내 확장인지 알아볼 수 있게 했다.

---

# 트러블슈팅 기록

## `npm run dev` 실행 시 `vite: command not found` → 네이티브 바이너리 누락

프로젝트를 받아서 처음 실행했을 때 `vite: command not found`가 났고,
`npm install` 후에는 다른 에러가 이어졌다.

```
Error: Cannot find native binding.
Cannot find module '@rolldown/binding-darwin-wasm32-wasi'
```

`node_modules/@rolldown/binding-darwin-arm64/` 안을 열어보니 `README.md`와 `package.json`만 있고
정작 필요한 `.node` 바이너리 파일이 통째로 빠져 있었다.
에러 메시지가 알려준 대로 npm의 optional dependency 관련 이슈였다.

**해결**

```sh
rm -rf node_modules
npm ci
```

`node_modules`를 지우고 lock 파일 기준으로 다시 설치하니 16MB짜리 `rolldown-binding.darwin-arm64.node`가
정상적으로 받아졌고 개발 서버가 떴다.
`npm install`이 아니라 `npm ci`를 쓴 이유는 lock 파일에 적힌 버전 그대로 설치해서
강사님 환경과 어긋나지 않게 하기 위해서였다.

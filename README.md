# skala-vue

SKALA Full-Stack Engineering — **Frontend framework: Vue.js** 과정 실습 저장소.

교재의 Code Challenge와 Hands on 과제를 순서대로 진행하면서 작성한 코드와 학습 기록을 정리한다.
날씨 대시보드(Weather)를 만들어 가며 Vue 3의 기본 문법부터 Router, Pinia, Axios, UI Library, 빌드/배포까지 다룬다.

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

---

# 과제 (Hands on) 기록

## Hands on 1. Project Scaffolding (p.55~56)

- `npm create vue` 로 `skala-vue` 프로젝트를 생성하고 `npm install` → `npm run dev` 로 실행 확인
- Vue Devtools 로 Components / Pages / Router / Pinia 등 탭 구성 확인
- `src/views/AboutView.vue` 를 수정해 HMR(저장 즉시 반영) 동작 확인

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

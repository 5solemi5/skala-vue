# SKALA 오늘의 채비

> 날씨를 숫자가 아니라 "오늘 뭘 해야 하는지"로 알려주는 서비스

날씨앱은 "내일 비 20mm"까지만 알려준다. 그런데 같은 예보를 보고도
정비소와 농사는 준비해야 하는 게 정반대다.

- 습도 88% → 정비소는 도장 작업을 미뤄야 하고(백화), 농사는 곰팡이병을 조심해야 한다
- 최저 2℃ → 정비소는 배터리 재고를 챙기고, 농사는 서리 대비를 한다

같은 숫자를 하는 일에 따라 다르게 읽어주는 게 이 서비스다.

아버지가 자동차 정비소를, 할머니가 농사를 하신다.
두 분 다 아침마다 날씨를 보시는데 어느 앱도 "그래서 뭘 하시라"는 말은 안 해준다.
만들다 보니 날씨로 일하는 사람이 두 분만은 아니어서 모드를 넷으로 늘렸다.

**배포** : (준비 중)

---

## 화면

| 경로               | 설명                                    |
| ------------------ | --------------------------------------- |
| `/`                | 지역별 날씨 + 모드별 오늘의 채비        |
| `/weather/:cityId` | 지역 상세 (네 가지 모드를 한 번에 비교) |
| `/about`           | 서비스 소개                             |
| `/lab`             | 수업 Code Challenge 결과물 모음         |
| `/archive`         | 과제가 단계별로 어떻게 바뀌었는지       |
| `/dev-log`         | 막혔던 것과 고쳐 쓴 코드                |

뒤의 세 개는 Hands on 5 요구사항 6번(본인의 추가 view)으로 만들었다.

## 실행

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

OpenWeatherMap 키가 필요하다. 루트에 `.env.local` 을 만들고 넣는다.

```
VITE_OPENWEATHER_API_KEY=발급받은키
```

## 사용한 것

Vue 3 (Composition API) · Vue Router · Pinia · Axios · Vite
Tailwind CSS v4 + shadcn-vue · Element Plus

API 는 두 곳을 쓴다.

- **OpenWeatherMap** — 현재 기온, 날씨 상태, 습도, 풍속, 아이콘
- **Open-Meteo** — 오늘 최저기온, 강수확률 (키 불필요)

OpenWeatherMap 무료 플랜에 오늘 강수확률과 일 최저기온이 없다.
그게 없으면 방제·서리 판정을 못 해서 Open-Meteo 를 같이 부른다.

## 폴더

```
src/
├── api/weatherApi.js       두 API 를 합쳐 화면이 쓸 형태로 만든다
├── utils/
│   ├── adviceRules.js      하는 일별 판정 규칙
│   └── hourlyScore.js      시간대별 판정 (위 규칙을 그대로 재사용)
├── stores/
│   ├── configStore.js      단위(℃/℉), 하는 일
│   └── cityStore.js        내 지역 목록
├── components/
│   ├── service/            지금 서비스 화면을 이루는 컴포넌트
│   ├── exercise/           과제 단계별 결과물 (아카이브에서 그대로 사용)
│   ├── practices/          수업 Code Challenge 실습 (수업 때 쓴 그대로 둠)
│   └── ui/                 shadcn-vue 컴포넌트
└── views/
```

`practices/` 와 `exercise/` 는 수업·과제 시점의 코드를 유지했다.
지금 화면은 `service/` 아래 컴포넌트로 다시 짰다.

## 과제 대응표

| 과제           | 파일                       | 개인 추가분                                         |
| -------------- | -------------------------- | --------------------------------------------------- |
| 2. Mockup      | `WeatherMockup.vue`        | 도시 3개, 습도·강수확률·최저기온, 모드 4종          |
| 3. Composition | `WeatherComposition.vue`   | `adviceMap` / `alertCityCount` computed, 모드 watch |
| 4. Component   | `WeatherParent.vue` 외 5개 | `ModeSelector` / `AdviceList` 추가 분리             |
| 5. Router      | `views/`                   | `/lab` `/archive` `/dev-log` 추가                   |
| 6. Store       | `configStore.js`           | 모드 state·getter·action, `convertTemp`             |
| 7. Axios       | `api/weatherApi.js`        | Open-Meteo 추가                                     |
| 8. UI Library  | 전역                       | Tailwind + shadcn-vue 선정                          |

## 기록

- 단원별 학습 메모 → [docs/학습노트.md](docs/학습노트.md)
- 막혔던 것 / 고쳐 쓴 코드 → 앱의 `/dev-log`

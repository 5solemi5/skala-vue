<script setup>
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

// 같은 날씨가 사람마다 어떻게 다르게 읽히는지 보여주는 예시
const sameSky = [
  {
    weather: '습도 88%',
    rows: [
      { who: '아버지', what: '자동차 정비소', say: '도장 걸면 백화가 생긴다. 오늘은 미룬다' },
      { who: '할머니', what: '농사', say: '잎에 물기가 오래 남는다. 곰팡이병 조심' },
    ],
  },
  {
    weather: '강수확률 70%',
    rows: [
      { who: '나', what: '자전거', say: '노면이 젖으면 제동 거리가 늘어난다. 두고 간다' },
      { who: '주말 경기', what: '야구', say: '우천 취소 가능성. 표를 미리 정리한다' },
    ],
  },
  {
    weather: '최저 2℃',
    rows: [
      { who: '아버지', what: '자동차 정비소', say: '배터리 방전 출동이 몰린다. 재고 확인' },
      { who: '할머니', what: '농사', say: '서리 위험. 오늘 밤 피복하거나 수확을 앞당긴다' },
    ],
  },
]

const goHome = () => router.push('/')
</script>

<template>
  <div class="about">
    <p class="eyebrow">서비스 소개</p>
    <h2>같은 하늘,<br />다른 하루</h2>

    <p class="lead">
      날씨앱은 “내일 비 20mm”까지만 알려줍니다. 그다음은 각자 알아서 판단해야 합니다. 그런데 같은
      예보를 보고도 준비해야 하는 건 사람마다 다릅니다.
    </p>

    <section class="block">
      <h3>같은 숫자, 다른 결론</h3>
      <div class="cases">
        <article v-for="c in sameSky" :key="c.weather" class="case">
          <p class="w">{{ c.weather }}</p>
          <ul>
            <li v-for="r in c.rows" :key="r.who">
              <span class="who">{{ r.who }}</span>
              <span class="what">{{ r.what }}</span>
              <span class="say">{{ r.say }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="block">
      <h3>왜 만들었나</h3>
      <p class="body">
        아버지가 자동차 정비소를, 할머니가 농사를 하십니다. 두 분 다 아침마다 날씨를 확인하시는데,
        어느 앱도 “그래서 오늘 뭘 하시라”는 말은 해주지 않았습니다. 매일 전화로 물어볼 수도 없어서,
        대신 봐 주는 화면을 만들기로 했습니다.
      </p>
      <p class="body">
        만들다 보니 날씨로 하루가 바뀌는 사람이 두 분만은 아니었습니다. 자전거를 타는 저도, 주말에
        야구를 보러 가는 것도 마찬가지였습니다. 그래서 챙길 대상을 넷으로 늘렸습니다.
      </p>
    </section>

    <section class="block">
      <h3>지금 볼 수 있는 것</h3>
      <ul class="feat">
        <li v-for="mode in configStore.modeList" :key="mode.id">
          <b>{{ mode.who }}</b>
          <span>{{ mode.label }}</span>
        </li>
      </ul>
      <p class="note">
        지역은 직접 추가하고 뺄 수 있습니다. 추가한 목록과 단위 설정은 저장돼서 다음에 들어와도
        그대로입니다.
      </p>
    </section>

    <section class="block">
      <h3>데이터</h3>
      <dl class="src">
        <dt>OpenWeatherMap</dt>
        <dd>현재 기온, 날씨 상태, 습도, 풍속, 지역 검색</dd>
        <dt>Open-Meteo</dt>
        <dd>오늘 최저기온, 강수확률, 시간대별 예보</dd>
      </dl>
      <p class="note">
        OpenWeatherMap 무료 플랜에는 오늘 강수확률과 일 최저기온이 없습니다. 그 두 값이 없으면
        방제·서리 판정을 할 수 없어서 Open-Meteo 를 함께 부릅니다.
      </p>
    </section>

    <button type="button" class="home" @click="goHome">오늘의 채비 보기</button>
  </div>
</template>

<style scoped>
.eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--color-ink-3);
}
h2 {
  margin: 8px 0 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.25;
}
.lead {
  margin: 18px 0 0;
  max-width: 46ch;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-ink-2);
}

.block {
  margin-top: 40px;
  padding-top: 26px;
  border-top: 1px solid var(--color-line);
}
.block h3 {
  margin: 0 0 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.body {
  margin: 0 0 14px;
  max-width: 46ch;
  font-size: 14px;
  line-height: 1.85;
  color: var(--color-ink-2);
}
.body:last-child {
  margin-bottom: 0;
}

.cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 1px;
  background: var(--color-line);
  border: 1px solid var(--color-line);
  border-radius: 4px;
  overflow: hidden;
}
.case {
  padding: 16px 16px 18px;
  background: var(--color-paper);
}
.w {
  margin: 0 0 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-ink);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-line);
}
.case ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.case li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.who {
  font-size: 12.5px;
  font-weight: 600;
}
.what {
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--color-ink-4);
}
.say {
  margin-top: 3px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--color-ink-2);
}

.feat {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
.feat li {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 14px 14px 0;
}
.feat b {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-ink-3);
}
.feat span {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.src {
  margin: 0;
}
.src dt {
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 500;
}
.src dd {
  margin: 4px 0 14px;
  font-size: 13px;
  color: var(--color-ink-2);
}
.note {
  margin: 6px 0 0;
  max-width: 46ch;
  font-size: 12.5px;
  line-height: 1.75;
  color: var(--color-ink-3);
}

.home {
  margin-top: 40px;
  padding: 11px 22px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-paper);
  background: var(--color-ink);
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
.home:hover {
  background: #1d2f3d;
}

@media (max-width: 640px) {
  h2 {
    font-size: 26px;
  }
  .lead {
    font-size: 14px;
  }
}
</style>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

// 같은 날씨가 사람마다 어떻게 다르게 읽히는지 보여주는 예시.
// 문구는 언어 파일에 있고 여기서는 어떤 키를 어떤 순서로 놓을지만 정한다.
const sameSky = computed(() =>
  [1, 2, 3, 4].map((n) => ({
    weather: configStore.t(`about.case${n}.w`),
    rows: ['a', 'b'].map((side) => ({
      who: configStore.t(`about.case${n}.${side}.who`),
      what: configStore.t(`mode.${CASE_MODES[n][side]}`),
      say: configStore.t(`about.case${n}.${side}.say`),
    })),
  })),
)

// 예시마다 어떤 일을 견주는지. 하는 일 이름은 모드 목록과 같은 것을 쓴다.
const CASE_MODES = {
  1: { a: 'repair', b: 'farm' },
  2: { a: 'bike', b: 'baseball' },
  3: { a: 'repair', b: 'farm' },
  4: { a: 'laundry', b: 'hike' },
}

const goHome = () => router.push('/')
</script>

<template>
  <div class="about">
    <p class="eyebrow">{{ configStore.t('about.eyebrow') }}</p>
    <!-- eslint-disable-next-line vue/no-v-html -- 줄바꿈 한 곳뿐이고 문구는 코드 안에 있다 -->
    <h2 v-html="configStore.t('about.title')"></h2>

    <p class="lead">{{ configStore.t('about.lead') }}</p>

    <section class="block">
      <h3>{{ configStore.t('about.casesTitle') }}</h3>
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
      <h3>{{ configStore.t('about.whyTitle') }}</h3>
      <p class="body">{{ configStore.t('about.why1') }}</p>
      <p class="body">{{ configStore.t('about.why2') }}</p>
    </section>

    <section class="block">
      <h3>{{ configStore.t('about.featTitle') }}</h3>
      <ul class="feat">
        <li v-for="mode in configStore.modeList" :key="mode.id">
          <span>{{ mode.label }}</span>
        </li>
      </ul>
      <p class="note">{{ configStore.t('about.featNote') }}</p>
    </section>

    <section class="block">
      <h3>{{ configStore.t('about.dataTitle') }}</h3>
      <dl class="src">
        <dt>OpenWeatherMap</dt>
        <dd>{{ configStore.t('about.dataOwm') }}</dd>
        <dt>Open-Meteo</dt>
        <dd>{{ configStore.t('about.dataMeteo') }}</dd>
      </dl>
      <p class="note">{{ configStore.t('about.dataNote') }}</p>
    </section>

    <button type="button" class="home" @click="goHome">{{ configStore.t('about.home') }}</button>
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

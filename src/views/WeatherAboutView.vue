<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 빌드 모드에 따라 어떤 .env 파일이 적용되는지 확인용
console.log('[env] 현재 API 주소:', import.meta.env.VITE_API_URL, '/ MODE:', import.meta.env.MODE)
const goHome = () => {
  router.push('/')
}

const modeExamples = [
  { mode: '🔧 정비', weather: '습도 88%', advice: '도장 걸면 백화가 생긴다 → 작업 연기' },
  { mode: '🌾 농사', weather: '습도 88%', advice: '잎에 물기가 오래 남는다 → 곰팡이병 주의' },
  { mode: '🏗️ 현장', weather: '기온 33℃', advice: '폭염 구간 → 시간당 휴식 편성' },
  { mode: '🏃 운동', weather: '기온 33℃', advice: '한낮 러닝 회피 → 이른 아침·저녁 권장' },
]
</script>

<template>
  <div class="about">
    <h2>서비스 소개</h2>

    <section class="lead">
      <p class="big">날씨를 숫자가 아니라 <strong>“오늘 뭘 해야 하는지”</strong>로 알려드립니다.</p>
      <p>
        기존 날씨앱은 “내일 비 20mm”까지만 알려줍니다. 그런데 같은 예보를 보고도 정비소 사장님과
        농사짓는 분이 준비해야 하는 건 정반대입니다. 이 서비스는 그 해석을 대신해 드립니다.
      </p>
    </section>

    <section>
      <h3>같은 날씨, 다른 채비</h3>
      <table class="compare">
        <thead>
          <tr>
            <th>하는 일</th>
            <th>날씨</th>
            <th>오늘의 채비</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in modeExamples" :key="row.mode">
            <td>{{ row.mode }}</td>
            <td>{{ row.weather }}</td>
            <td>{{ row.advice }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h3>만들게 된 이유</h3>
      <p>
        아버지는 자동차 정비소를, 할머니는 농사를 하십니다. 두 분 다 아침마다 날씨를 확인하시는데,
        어느 앱도 “그래서 오늘 뭘 하시라”는 말은 해주지 않았습니다. 그러다 날씨로 일하는 사람이 두
        분만은 아니라는 걸 알게 됐고, 하는 일을 고르면 그 일에 맞는 채비를 알려주는 화면을 만들기로
        했습니다.
      </p>
    </section>

    <section>
      <h3>사용 기술</h3>
      <ul class="tech">
        <li>
          <code>Vue 3</code> Composition API — <code>ref</code> / <code>computed</code> /
          <code>watch</code>
        </li>
        <li><code>Vue Router</code> — 지연 로딩, 동적 경로 매칭, 쿼리 스트링 상태 동기화</li>
        <li><code>components/exercise/</code> 의 독립 부품 컴포넌트 조합</li>
        <li><code>utils/adviceRules.js</code> — 하는 일별 판정 규칙을 한 곳에 모은 모듈</li>
      </ul>
    </section>

    <button class="home-btn" @click="goHome">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
h2 {
  margin: 0 0 20px;
  font-size: 1.5rem;
  font-weight: 700;
}
h3 {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #34495e;
}
section {
  margin-bottom: 28px;
}
.lead .big {
  margin: 0 0 10px;
  font-size: 1.15rem;
  line-height: 1.6;
}
p {
  margin: 0;
  color: #495057;
  line-height: 1.75;
  font-size: 14.5px;
}
.compare {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
.compare th,
.compare td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}
.compare th {
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: #adb5bd;
  font-weight: 500;
}
.compare td:first-child {
  font-weight: 600;
  white-space: nowrap;
}
.tech {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #495057;
  line-height: 1.9;
}
code {
  padding: 2px 6px;
  font-size: 0.9em;
  background-color: #f1f3f5;
  border-radius: 4px;
  color: #2c3e50;
}
.home-btn {
  width: 100%;
  padding: 11px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #42b883;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.home-btn:hover {
  background-color: #33a06f;
}
</style>

<script setup>
import AdviceList from './AdviceList.vue'

// 부모로부터 선택된 도시 객체와 그 도시의 채비 목록을 전달받는다
defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  adviceList: {
    type: Array,
    default: () => [],
  },
})

// 카드 선택과 상세보기를 부모에게 알린다
defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="$emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>

    <p class="temp">{{ cityItem.temp }}<span class="unit">℃</span></p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

    <ul class="metric">
      <li><span>습도</span><b>{{ cityItem.humidity }}%</b></li>
      <li><span>강수확률</span><b>{{ cityItem.rainProb }}%</b></li>
      <li><span>최저기온</span><b>{{ cityItem.minTemp }}℃</b></li>
    </ul>

    <AdviceList :advice-list="adviceList" />

    <button class="btn-detail" @click.stop="$emit('click-detail', cityItem.name, cityItem.status)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  display: flex;
  flex-direction: column;
  padding: 18px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.weather-card:hover {
  border-color: #42b883;
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.08);
}
h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.temp {
  margin: 8px 0 10px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}
.unit {
  font-size: 16px;
  font-weight: 500;
  color: #868e96;
  margin-left: 2px;
}
.badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
}
.badge.hot {
  background-color: #ffe8e0;
  color: #d9480f;
}
.badge.cool {
  background-color: #e3f2fd;
  color: #1565c0;
}
.metric {
  margin: 14px 0 0;
  padding: 12px 0 0;
  border-top: 1px dashed #e9ecef;
  list-style: none;
  font-size: 12.5px;
  color: #868e96;
}
.metric li {
  display: flex;
  justify-content: space-between;
  padding: 1px 0;
}
.metric b {
  color: #495057;
}
.btn-detail {
  width: 100%;
  padding: 9px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #42b883;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-detail:hover {
  background-color: #33a06f;
}
</style>

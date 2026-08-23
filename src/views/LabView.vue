<script setup>
import { ref, computed } from 'vue'

// 교재 Code Challenge 로 작성한 실습 컴포넌트 전체
import SampleOne from '../components/practices/basic/SampleOne.vue'
import SampleTwo from '../components/practices/basic/SampleTwo.vue'
import VueHtml from '../components/practices/basic/VueHtml.vue'
import VueHtmlXss from '../components/practices/basic/VueHtmlXss.vue'
import VueText from '../components/practices/basic/VueText.vue'
import VueBind from '../components/practices/basic/VueBind.vue'
import VueBindClass from '../components/practices/basic/VueBindClass.vue'
import VueBindStyle from '../components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from '../components/practices/basic/VueBindShorthand.vue'
import VueIf from '../components/practices/basic/VueIf.vue'
import VueShow from '../components/practices/basic/VueShow.vue'
import VueFor from '../components/practices/basic/VueFor.vue'
import VuePre from '../components/practices/basic/VuePre.vue'
import VueCloak from '../components/practices/basic/VueCloak.vue'
import VueOnce from '../components/practices/basic/VueOnce.vue'
import VueMemo from '../components/practices/basic/VueMemo.vue'
import EventBasic from '../components/practices/basic/EventBasic.vue'
import EventObject from '../components/practices/basic/EventObject.vue'
import EventModifier from '../components/practices/basic/EventModifier.vue'
import ModelBasic from '../components/practices/basic/ModelBasic.vue'
import ModelForm from '../components/practices/basic/ModelForm.vue'
import ModelModifier from '../components/practices/basic/ModelModifier.vue'
import StyleScoped from '../components/practices/basic/StyleScoped.vue'
import ReactiveRef from '../components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '../components/practices/composition/ReactiveReactive.vue'
import ComputedBasic from '../components/practices/composition/ComputedBasic.vue'
import WatchersBasic from '../components/practices/composition/WatchersBasic.vue'
import WatchersMulti from '../components/practices/composition/WatchersMulti.vue'
import WatchersDeep from '../components/practices/composition/WatchersDeep.vue'
import WatchersReactive from '../components/practices/composition/WatchersReactive.vue'
import WatchersRefArray from '../components/practices/composition/WatchersRefArray.vue'
import WatchersReactiveArray from '../components/practices/composition/WatchersReactiveArray.vue'
import WatchersWatchEffect from '../components/practices/composition/WatchersWatchEffect.vue'
import LifecycleParent from '../components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '../components/practices/component/PropsEmitsParent.vue'
import SlotDefaultParent from '../components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '../components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '../components/practices/component/SlotScopedParent.vue'
import StoreCounter from '../components/practices/library/StoreCounter.vue'
import AxiosWeather from '../components/practices/library/AxiosWeather.vue'
import AxiosJson from '../components/practices/library/AxiosJson.vue'

/**
 * 수업에서 진행한 Code Challenge 결과물을 단원별로 모아둔 화면.
 * 한 번에 다 띄우면 타이머가 도는 컴포넌트까지 전부 살아있게 되므로
 * 선택한 단원만 v-if 로 마운트한다.
 */
const groupList = ref([
  { id: 0, title: '1. 학습환경구성', day: '1일차 · Vue Syntax', components: [SampleOne, SampleTwo] },
  { id: 1, title: '2. Vue Directive', day: '1일차 · Vue Syntax', components: [VueHtml, VueHtmlXss, VueText, VueBind, VueBindClass, VueBindStyle, VueBindShorthand, VueIf, VueShow, VueFor, VuePre, VueCloak, VueOnce, VueMemo] },
  { id: 2, title: '3. Vue Event Handling', day: '1일차 · Vue Syntax', components: [EventBasic, EventObject, EventModifier] },
  { id: 3, title: '4. Vue Form Handling', day: '1일차 · Vue Syntax', components: [ModelBasic, ModelForm, ModelModifier] },
  { id: 4, title: '5. Vue Style Handling', day: '1일차 · Vue Syntax', components: [StyleScoped] },
  { id: 5, title: '6. Reactive State', day: '2일차 · Composition API', components: [ReactiveRef, ReactiveReactive] },
  { id: 6, title: '7. Computed & Watchers', day: '2일차 · Composition API', components: [ComputedBasic, WatchersBasic, WatchersMulti, WatchersDeep, WatchersReactive, WatchersRefArray, WatchersReactiveArray, WatchersWatchEffect] },
  { id: 7, title: '8. Component Lifecycle', day: '3일차 · Vue Components', components: [LifecycleParent] },
  { id: 8, title: '9. Props & Emits', day: '3일차 · Vue Components', components: [PropsEmitsParent] },
  { id: 9, title: '10. Component Slot', day: '3일차 · Vue Components', components: [SlotDefaultParent, SlotNamedParent, SlotScopedParent] },
  { id: 10, title: '11. Store (Pinia)', day: '4일차 · 외부 라이브러리', components: [StoreCounter] },
  { id: 11, title: '12. Axios', day: '4일차 · 외부 라이브러리', components: [AxiosWeather, AxiosJson] },
])

const currentGroupId = ref(0)
const currentGroup = computed(() => groupList.value.find((g) => g.id === currentGroupId.value))
const totalCount = computed(() => groupList.value.reduce((sum, g) => sum + g.components.length, 0))
</script>

<template>
  <div class="lab">
    <h2>📚 Vue 문법 실습실</h2>
    <p class="lead">
      수업에서 진행한 <strong>Code Challenge</strong> 결과물입니다.
      교재 순서대로 단원을 나눠 두었고, 컴포넌트는 총 <strong>{{ totalCount }}개</strong>입니다.
      브라우저 콘솔(F12)을 열어두면 <code>watch</code> · <code>watchEffect</code> · 라이프사이클 훅의 로그를 함께 볼 수 있습니다.
    </p>

    <nav class="tabs">
      <button
        v-for="group in groupList"
        :key="group.id"
        class="tab"
        :class="{ on: currentGroupId === group.id }"
        @click="currentGroupId = group.id"
      >
        {{ group.title }}
      </button>
    </nav>

    <div v-if="currentGroup" class="panel">
      <p class="day">{{ currentGroup.day }}</p>
      <h3>{{ currentGroup.title }}</h3>
      <div class="practice-container">
        <component :is="comp" v-for="(comp, index) in currentGroup.components" :key="index" />
      </div>
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
code {
  padding: 2px 6px;
  font-size: 0.9em;
  background-color: #f1f3f5;
  border-radius: 4px;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 18px;
  border-bottom: 1px solid #e9ecef;
}
.tab {
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab:hover {
  border-color: #adb5bd;
}
.tab.on {
  color: #ffffff;
  background-color: #35495e;
  border-color: #35495e;
}
.panel {
  padding-top: 22px;
}
.day {
  margin: 0;
  font-size: 11.5px;
  letter-spacing: 0.08em;
  color: #adb5bd;
}
.panel h3 {
  margin: 4px 0 18px;
  font-size: 1.2rem;
  font-weight: 600;
}
.practice-container {
  width: auto;
  max-width: none;
}
</style>

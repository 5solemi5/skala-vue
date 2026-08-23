// Tailwind 를 가장 먼저 불러온다.
// preflight(기본 스타일 초기화)가 뒤따르는 실습용 CSS 를 덮어쓰지 않도록 순서가 중요하다.
import './assets/tailwind.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

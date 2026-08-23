<script setup>
import { ref, computed } from 'vue'
import { searchCity } from '@/api/weatherApi'
import { usePeopleStore, MAX_PEOPLE } from '@/stores/peopleStore'
import { useConfigStore } from '@/stores/configStore'

const peopleStore = usePeopleStore()
const configStore = useConfigStore()

const emit = defineEmits(['changed'])

const isOpen = ref(false)
const editingId = ref('')

// 편집 중인 내용
const form = ref({ who: '', modeId: 'repair', city: null })
const query = ref('')
const results = ref([])
const isSearching = ref(false)
const message = ref('')

const modeLabel = (id) => configStore.modeList.find((m) => m.id === id)?.label ?? ''
const isNew = computed(() => editingId.value === 'new')

const startEdit = (person) => {
  editingId.value = person.id
  form.value = { who: person.who, modeId: person.modeId, city: { ...person.city } }
  query.value = ''
  results.value = []
  message.value = ''
}

const startAdd = () => {
  if (peopleStore.isFull) {
    message.value = `한 번에 ${MAX_PEOPLE}명까지 볼 수 있습니다. 한 명을 지우고 추가해 주세요.`
    return
  }
  editingId.value = 'new'
  form.value = { who: '', modeId: configStore.modeList[0].id, city: null }
  query.value = ''
  results.value = []
  message.value = ''
}

const cancel = () => {
  editingId.value = ''
  message.value = ''
}

const handleSearch = async () => {
  const q = query.value.trim()
  if (!q) return
  isSearching.value = true
  message.value = ''
  results.value = []
  try {
    const found = await searchCity(q)
    results.value = found
    if (!found.length)
      message.value = `'${q}' 로 찾은 지역이 없습니다. 가까운 큰 지역으로 검색해 보세요.`
  } catch (error) {
    console.error('지역 검색 실패:', error)
    message.value = '지역을 검색하지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSearching.value = false
  }
}

const pickCity = (city) => {
  form.value.city = city
  results.value = []
  query.value = ''
}

const save = () => {
  const who = form.value.who.trim()
  if (!who) {
    message.value = '어떻게 부를지 적어 주세요. (예: 정비소, 밭, 출퇴근길)'
    return
  }
  if (!form.value.city) {
    message.value = '지역을 골라 주세요.'
    return
  }

  if (isNew.value) {
    const added = peopleStore.addPerson({ who, modeId: form.value.modeId, city: form.value.city })
    if (!added) {
      message.value = `한 번에 ${MAX_PEOPLE}명까지 볼 수 있습니다.`
      return
    }
  } else {
    peopleStore.updatePerson(editingId.value, {
      who,
      modeId: form.value.modeId,
      city: form.value.city,
    })
  }
  editingId.value = ''
  emit('changed')
}

const resetToSample = () => {
  peopleStore.resetPeople()
  editingId.value = ''
  emit('changed')
}

const remove = (person) => {
  peopleStore.removePerson(person.id)
  if (editingId.value === person.id) editingId.value = ''
  emit('changed')
}
</script>

<template>
  <div>
    <div class="head">
      <div>
        <h3>
          내 사람들 <span class="cnt tnum">{{ peopleStore.count }}/{{ MAX_PEOPLE }}</span>
        </h3>
        <p class="hint">챙기고 싶은 사람과 그 사람이 있는 지역을 넣으세요.</p>
      </div>
      <button type="button" class="ghost" @click="isOpen = !isOpen">
        {{ isOpen ? '닫기' : '고치기' }}
      </button>
    </div>

    <ul v-if="isOpen" class="list">
      <li v-for="person in peopleStore.people" :key="person.id" class="item">
        <!-- 편집 중이 아닐 때 -->
        <div v-if="editingId !== person.id" class="view">
          <span class="who">{{ person.who }}</span>
          <span class="meta">{{ modeLabel(person.modeId) }} · {{ person.city.name }}</span>
          <button type="button" class="ghost sm" @click="startEdit(person)">수정</button>
          <button type="button" class="ghost sm danger" @click="remove(person)">삭제</button>
        </div>

        <!-- 편집 중 -->
        <form v-else class="edit" @submit.prevent="save">
          <label class="field">
            <span>어떻게 부를까요</span>
            <input v-model="form.who" type="text" placeholder="예: 정비소, 밭, 출퇴근길" />
          </label>

          <fieldset class="field">
            <legend>무엇을 하나요</legend>
            <div class="modes">
              <label v-for="mode in configStore.modeList" :key="mode.id" class="radio">
                <input v-model="form.modeId" type="radio" :value="mode.id" />
                <span>{{ mode.label }}</span>
              </label>
            </div>
          </fieldset>

          <div class="field">
            <span class="lb">어디에 있나요</span>
            <p v-if="form.city" class="picked">
              {{ form.city.name }}
              <small>{{ form.city.region }}</small>
              <button type="button" class="ghost sm" @click="form.city = null">바꾸기</button>
            </p>
            <div v-else class="search">
              <input
                v-model="query"
                type="text"
                placeholder="지역 이름 (예: 전주, 철원, 잠실)"
                @keydown.enter.prevent="handleSearch"
              />
              <button type="button" class="ghost sm" :disabled="isSearching" @click="handleSearch">
                {{ isSearching ? '찾는 중' : '검색' }}
              </button>
            </div>
            <ul v-if="results.length" class="results">
              <li v-for="c in results" :key="c.id">
                <button type="button" @click="pickCity(c)">
                  {{ c.name }} <small>{{ c.region }}</small>
                </button>
              </li>
            </ul>
          </div>

          <p v-if="message" class="msg">{{ message }}</p>

          <div class="actions">
            <button type="submit" class="primary">저장</button>
            <button type="button" class="ghost sm" @click="cancel">취소</button>
          </div>
        </form>
      </li>

      <!-- 새로 추가 -->
      <li v-if="isNew" class="item">
        <form class="edit" @submit.prevent="save">
          <label class="field">
            <span>어떻게 부를까요</span>
            <input v-model="form.who" type="text" placeholder="예: 정비소, 밭, 출퇴근길" />
          </label>

          <fieldset class="field">
            <legend>무엇을 하나요</legend>
            <div class="modes">
              <label v-for="mode in configStore.modeList" :key="mode.id" class="radio">
                <input v-model="form.modeId" type="radio" :value="mode.id" />
                <span>{{ mode.label }}</span>
              </label>
            </div>
          </fieldset>

          <div class="field">
            <span class="lb">어디에 있나요</span>
            <p v-if="form.city" class="picked">
              {{ form.city.name }}
              <small>{{ form.city.region }}</small>
              <button type="button" class="ghost sm" @click="form.city = null">바꾸기</button>
            </p>
            <div v-else class="search">
              <input
                v-model="query"
                type="text"
                placeholder="지역 이름 (예: 전주, 철원, 잠실)"
                @keydown.enter.prevent="handleSearch"
              />
              <button type="button" class="ghost sm" :disabled="isSearching" @click="handleSearch">
                {{ isSearching ? '찾는 중' : '검색' }}
              </button>
            </div>
            <ul v-if="results.length" class="results">
              <li v-for="c in results" :key="c.id">
                <button type="button" @click="pickCity(c)">
                  {{ c.name }} <small>{{ c.region }}</small>
                </button>
              </li>
            </ul>
          </div>

          <p v-if="message" class="msg">{{ message }}</p>

          <div class="actions">
            <button type="submit" class="primary">추가</button>
            <button type="button" class="ghost sm" @click="cancel">취소</button>
          </div>
        </form>
      </li>
    </ul>

    <div v-if="isOpen && !isNew" class="foot">
      <button v-if="!peopleStore.isFull" type="button" class="ghost sm" @click="startAdd">
        + 사람 추가
      </button>
      <span v-else class="full"
        >{{ MAX_PEOPLE }}명이 다 찼습니다. 한 명을 지우면 더 넣을 수 있습니다.</span
      >
      <button type="button" class="ghost sm dim" @click="resetToSample">예시로 되돌리기</button>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.hint {
  margin: 5px 0 0;
  max-width: 42ch;
  font-size: 12px;
  line-height: 1.65;
  color: var(--color-ink-3);
}

.list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-line);
}
.item {
  border-bottom: 1px solid var(--color-line);
}

.view {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
}
.who {
  font-size: 13.5px;
  font-weight: 600;
  min-width: 5rem;
}
.meta {
  flex: 1;
  font-size: 12.5px;
  color: var(--color-ink-3);
}

.edit {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 0 18px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  border: 0;
}
.field > span,
.field legend,
.lb {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--color-ink-3);
  padding: 0;
}
input[type='text'] {
  width: 100%;
  padding: 8px 11px;
  font-family: inherit;
  font-size: 13.5px;
  color: var(--color-ink);
  background: var(--color-paper);
  border: 1px solid var(--color-line-2);
  border-radius: 4px;
  outline: none;
}
input[type='text']:focus {
  border-color: var(--color-ink-3);
}

.modes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  font-size: 12.5px;
  border: 1px solid var(--color-line-2);
  border-radius: 999px;
  cursor: pointer;
}
.radio input {
  accent-color: var(--color-ink);
  margin: 0;
}
.radio:has(input:checked) {
  border-color: var(--color-ink);
  background: var(--color-paper-2);
  font-weight: 500;
}

.search {
  display: flex;
  gap: 6px;
}
.picked {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
}
.picked small {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--color-ink-3);
}
.results {
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--color-line);
  border-radius: 4px;
  overflow: hidden;
}
.results li + li {
  border-top: 1px solid var(--color-line);
}
.results button {
  width: 100%;
  padding: 9px 11px;
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  background: var(--color-paper);
  border: 0;
  cursor: pointer;
}
.results button:hover {
  background: var(--color-paper-2);
}
.results small {
  margin-left: 6px;
  font-size: 11.5px;
  color: var(--color-ink-3);
}

.msg {
  margin: 0;
  font-size: 12px;
  color: var(--color-stop);
}
.actions {
  display: flex;
  gap: 8px;
}

.cnt {
  margin-left: 6px;
  font-size: 11px;
  font-weight: 400;
  color: var(--color-ink-4);
}
.full {
  font-size: 11.5px;
  color: var(--color-ink-3);
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
}

button {
  font-family: inherit;
  cursor: pointer;
}
.primary {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-paper);
  background: var(--color-ink);
  border: 0;
  border-radius: 4px;
}
.ghost {
  padding: 5px 11px;
  font-size: 12px;
  color: var(--color-ink-2);
  background: none;
  border: 1px solid var(--color-line-2);
  border-radius: 4px;
}
.ghost:hover {
  border-color: var(--color-ink-3);
  color: var(--color-ink);
}
.ghost.sm {
  padding: 4px 9px;
  font-size: 11.5px;
}
.ghost.danger:hover {
  color: var(--color-stop);
  border-color: var(--color-stop);
}
.ghost.dim {
  border-color: transparent;
  color: var(--color-ink-4);
}
.ghost.dim:hover {
  color: var(--color-ink-2);
}
</style>

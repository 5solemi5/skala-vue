<script setup>
import { computed } from 'vue'
import AdviceList from './AdviceList.vue'
import { useConfigStore } from '@/stores/configStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const configStore = useConfigStore()

// 부모로부터 선택된 도시 객체와 그 도시의 채비 목록을 전달받는다
const props = defineProps({
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

// 스토어에 설정된 단위에 맞춰 기온을 변환해서 보여준다
const displayTemp = computed(() => configStore.convertTemp(props.cityItem.temp))
const displayMinTemp = computed(() => configStore.convertTemp(props.cityItem.minTemp))
</script>

<template>
  <Card
    class="flex cursor-pointer flex-col transition-shadow hover:border-primary hover:shadow-md"
    @click="$emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <CardContent class="flex flex-1 flex-col p-5">
      <div class="flex items-start justify-between">
        <h4 class="text-base font-bold text-foreground">{{ cityItem.name }} ({{ cityItem.status }})</h4>
        <img
          v-if="cityItem.icon"
          :src="`https://openweathermap.org/img/wn/${cityItem.icon}.png`"
          :alt="cityItem.description"
          class="-mt-1 h-10 w-10"
        />
      </div>

      <p class="mt-1 text-3xl font-bold leading-none">
        {{ displayTemp }}<span class="ml-0.5 text-base font-medium text-muted-foreground">{{ configStore.unitSymbol }}</span>
      </p>
      <p v-if="cityItem.description" class="mt-1 text-xs text-muted-foreground">{{ cityItem.description }}</p>

      <div class="mt-3">
        <Badge v-if="cityItem.temp >= 25" variant="hot">🔥 더움 (25도 이상)</Badge>
        <Badge v-else variant="cool">❄️ 선선함 (25도 미만)</Badge>
      </div>

      <ul class="mt-4 space-y-1 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
        <li class="flex justify-between"><span>습도</span><b class="text-foreground">{{ cityItem.humidity }}%</b></li>
        <li class="flex justify-between"><span>강수확률</span><b class="text-foreground">{{ cityItem.rainProb }}%</b></li>
        <li class="flex justify-between">
          <span>최저기온</span><b class="text-foreground">{{ displayMinTemp }}{{ configStore.unitSymbol }}</b>
        </li>
        <li v-if="cityItem.wind !== undefined" class="flex justify-between">
          <span>풍속</span><b class="text-foreground">{{ cityItem.wind }}m/s</b>
        </li>
      </ul>

      <AdviceList :advice-list="adviceList" />

      <Button
        class="mt-auto w-full"
        @click.stop="$emit('click-detail', cityItem.name, cityItem.status)"
      >
        상세보기
      </Button>
    </CardContent>
  </Card>
</template>

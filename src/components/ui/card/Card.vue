<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div :class="cn('rounded-lg border border-border bg-background shadow-sm', props.class)">
    <slot />
  </div>
</template>

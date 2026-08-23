<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-muted text-muted-foreground',
        outline: 'border border-border text-foreground',
        hot: 'bg-orange-100 text-orange-700',
        cool: 'bg-sky-100 text-sky-700',
        stop: 'bg-red-100 text-red-700',
        warn: 'bg-amber-100 text-amber-700',
        good: 'bg-emerald-100 text-emerald-700',
        info: 'bg-blue-100 text-blue-700',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

const props = defineProps({
  variant: { type: String, default: 'default' },
  class: { type: String, default: '' },
})
</script>

<template>
  <span :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </span>
</template>

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 조건부 클래스(clsx)와 Tailwind 클래스 충돌 정리(tailwind-merge)를 한 번에 처리한다.
 * 예) cn('p-2', isBig && 'p-6') → 'p-6' (뒤에 온 패딩이 이김)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

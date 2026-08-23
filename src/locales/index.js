import ko from './ko'
import en from './en'

/**
 * 아주 작은 번역 함수
 *
 * vue-i18n 을 붙일까 하다가 넣지 않았다.
 * 수업에서 배운 범위를 넘어서고, 이 화면에 필요한 건 값 하나 찾아서 자리를 채우는 것뿐이다.
 *
 * 문구 값은 두 가지다.
 *  - 문자열   : '{name} 상세보기'  처럼 중괄호 자리를 값으로 바꾼다
 *  - 함수     : 수 세는 말이나 복수형처럼 언어마다 규칙이 다른 문구
 *
 * 영어 파일에 키가 빠져 있으면 한국어로 떨어뜨린다.
 * 번역이 덜 끝난 자리가 화면에서 빈칸으로 보이는 것보다는 낫다.
 */

export const LANGS = [
  { id: 'ko', label: '한국어', short: '한' },
  { id: 'en', label: 'English', short: 'EN' },
]

const messages = { ko, en }

export const isKnownLang = (id) => LANGS.some((l) => l.id === id)

export const translate = (lang, key, values = {}) => {
  const message = messages[lang]?.[key] ?? messages.ko[key]

  // 키 자체가 없으면 키를 그대로 보여준다. 화면에서 바로 눈에 띄어 찾기 쉽다.
  if (message === undefined) return key
  if (typeof message === 'function') return message(values)

  return message.replace(/\{(\w+)\}/g, (whole, name) =>
    values[name] !== undefined ? String(values[name]) : whole,
  )
}

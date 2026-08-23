/**
 * 날씨 상태 코드
 *
 * OpenWeatherMap 은 weather[0].main 으로 Rain / Snow 같은 영문 코드를 준다.
 * 화면에 뿌릴 때는 '비' 처럼 바꿔서 쓰는데, 판정 규칙까지 그 한글 표기를 비교하고 있었다.
 * 표기를 손대는 순간 규칙이 조용히 어긋나서, 판단에 쓰는 코드와 보여주는 글자를 나눴다.
 *
 * 코드 종류가 스무 개가 넘는데 판정에 필요한 구분은 다섯 가지뿐이라 묶어서 쓴다.
 */

const GROUP = {
  Clear: 'clear',
  Clouds: 'clouds',
  Rain: 'rain',
  Drizzle: 'rain',
  Thunderstorm: 'rain',
  Snow: 'snow',
  Mist: 'haze',
  Fog: 'haze',
  Haze: 'haze',
  Dust: 'haze',
  Sand: 'haze',
  Smoke: 'haze',
  Ash: 'haze',
  Squall: 'rain',
  Tornado: 'rain',
}

/** 모르는 코드가 와도 화면이 비지 않도록 흐림으로 본다 */
export const groupOf = (condition) => GROUP[condition] ?? 'haze'

/** 비나 눈이 오는 중인지. 여러 규칙이 이 한 가지만 물어본다 */
export const isPrecipitating = (condition) => {
  const g = groupOf(condition)
  return g === 'rain' || g === 'snow'
}

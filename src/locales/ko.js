/**
 * 한국어 문구
 *
 * 화면에 그대로 나가는 글자만 모았다.
 * 수업 산출물 페이지(문법 실습실·과제 아카이브·개발 기록)는 학습 기록이라 대상이 아니다.
 *
 * 값은 문자열이거나 함수다.
 * {name} 처럼 중괄호로 감싼 자리에는 값이 들어간다.
 * 우리말 수 세는 말이나 조사처럼 규칙이 필요한 문구는 함수로 쓴다.
 */

// 숫자보다 우리말이 따뜻하게 읽힌다
const koCount = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두']

export default {
  // ── 머리말·꼬리말 ──────────────────────────────
  'brand.name': '오늘의 채비',
  'brand.tagline': '같은 하늘, 다른 하루',
  'nav.home': '오늘의 채비',
  'nav.about': '서비스 소개',
  'nav.lab': '문법 실습실',
  'nav.archive': '과제 아카이브',
  'nav.devlog': '개발 기록',
  'nav.mainAria': '주요 메뉴',
  'nav.courseAria': '만든 과정',
  'foot.credit': 'SKALA Full-Stack Engineering · Frontend framework: Vue.js',
  'lang.aria': '언어 선택',

  // ── 지금 있는 곳 ──
  'here.ask': '내 위치',
  'here.askTitle': '지금 계신 곳의 날씨를 봅니다',
  'here.loading': '찾는 중',
  'here.goTitle': ({ name }) => `${name} 오늘의 채비 보기`,
  'here.denied': '위치를 쓸 수 없음',
  'here.deniedTitle': '브라우저에서 위치 접근이 막혀 있습니다',
  'here.failed': '다시',
  'here.failedTitle': '위치는 찾았지만 날씨를 못 받았습니다. 다시 눌러 보세요',
  'here.unnamed': '지금 이곳',

  // ── 마당 배경 ──
  'yard.aria': '마당 배경 고르기',
  'yard.prev': '앞 배경',
  'yard.next': '다음 배경',
  'yard.meadow': '들판',
  'yard.seaside': '바닷가',
  'yard.night': '밤하늘',
  'yard.snow': '눈밭',
  'yard.city': '골목',

  // ── 날씨 상태 ────────────────────────────────
  'cond.clear': '맑음',
  'cond.clouds': '구름',
  'cond.rain': '비',
  'cond.snow': '눈',
  'cond.haze': '흐림',

  // ── 하는 일 ─────────────────────────────────
  'mode.repair': '자동차 정비소',
  'mode.farm': '농사',
  'mode.site': '현장 작업',
  'mode.bike': '자전거',
  'mode.hike': '등산',
  'mode.baseball': '야구',
  'mode.laundry': '빨래·환기',
  'mode.eyebrow': '무엇을 볼까요',
  'mode.aria': '하는 일 선택',

  // ── 오늘, 내 사람들 ───────────────────────────
  'people.today': '오늘,',
  'people.mine': '내 사람들',
  'people.count': ({ n }) => `${koCount[n] ?? n} 곳의 하루를 보고 있어요`,
  'people.setup': '내 사람들 챙기기',
  'people.setupMore': '내 사람들 더 챙기기',
  'people.loading': '불러오는 중',

  // ── 판정 ───────────────────────────────────
  'verdict.stop': '오늘은 아니에요',
  'verdict.warn': '조심하세요',
  'verdict.good': '괜찮아요',
  'verdict.info': '알아두세요',

  // ── 오늘의 채비 (큰 카드) ───────────────────────
  'hero.humidity': '습도',
  'hero.rainProb': '강수확률',
  'hero.hot': '더움 (25도 이상)',
  'hero.mild': '선선함 (25도 미만)',
  'hero.detail': '상세보기',
  'hero.detailAria': ({ name }) => `${name} 상세보기`,
  'hero.rowDetail': '상세',

  // ── 시간대 막대 ──────────────────────────────
  'hourly.label': '시간대',
  'hourly.good': '괜찮음',
  'hourly.warn': '주의',
  'hourly.stop': '피하기',
  'hourly.note': '아래 숫자는 기온',
  'hourly.none': '오늘은 여유로운 시간대가 없습니다',
  'hourly.one': ({ from }) => `${from}시가 가장 낫습니다`,
  'hourly.range': ({ from, to }) => `${from}시 ~ ${to}시가 낫습니다`,

  // ── 메인 화면 ────────────────────────────────
  'home.hint': '목록에서 지역을 누르면 여기가 바뀝니다.',
  'home.modeChanged': ({ mode }) => `${mode} 기준으로 오늘의 채비를 다시 계산했습니다.`,
  'home.picked': ({ name }) => `${name}이 선택되었습니다.`,
  'home.loadFail': '날씨 데이터를 불러오지 못했습니다.',
  'home.keyFail': 'OpenWeatherMap API 키가 유효하지 않습니다. .env.local 의 키를 확인해 주세요.',
  'home.loadFailWith': ({ message }) => `날씨 데이터를 불러오지 못했습니다. (${message})`,
  'home.partialFail': ({ names }) =>
    `${names} 은(는) 불러오지 못했습니다. 나머지 지역만 표시합니다.`,
  'home.loading': '불러오는 중입니다',
  'home.others': '다른 지역',
  'home.asOf': ({ time }) => `${time} 기준`,
  'home.refreshing': '갱신 중',
  'home.refresh': '새로고침',
  'home.noCity': '보고 있는 지역이 없습니다.',
  'home.noCityHint': '아래에서 지역을 추가해 주세요.',
  'home.noMatch': ({ query }) => `'${query}' 와(과) 일치하는 지역이 목록에 없습니다.`,
  'home.addQuery': ({ query }) => `'${query}' 추가하기`,
  'home.summaryStop': ({ n }) => `${n}곳은 오늘 피하시는 편이 낫습니다`,
  'home.summaryWarn': ({ n }) => `${n}곳은 주의가 필요합니다`,
  'home.summaryNone': ({ total }) => `${total}곳 모두 오늘은 괜찮습니다`,
  'home.summary': ({ total, parts }) => `${total}곳 중 ${parts}`,

  // ── 상세 화면 ────────────────────────────────
  'detail.back': '전체 지역',
  'detail.loading': '불러오는 중입니다',
  'detail.loadFail': '상세 정보를 불러오지 못했습니다',
  'detail.weather': '날씨',
  'detail.humidity': '습도',
  'detail.rainProb': '강수확률',
  'detail.minTemp': '최저기온',
  'detail.wind': '풍속',
  'detail.feelsLike': '체감',
  'detail.byMode': '하는 일별 채비',
  'detail.byModeHint': '메인에서는 고른 한 가지만 보이지만 여기서는 네 가지를 나란히 볼 수 있습니다.',
  'detail.notInList': '내 지역 목록에 없는 곳입니다.',
  'detail.notInListHint': '전체 지역 화면에서 먼저 추가해 주세요.',

  // ── 사람 편집 ────────────────────────────────
  'edit.title': '내 사람들',
  'edit.hint': '챙기고 싶은 사람과 그 사람이 있는 곳을 적어 두세요.',
  'edit.open': '고르기',
  'edit.close': '접기',
  'edit.edit': '수정',
  'edit.delete': '삭제',
  'edit.who': '어떻게 부를까요',
  'edit.whoPlaceholder': '예: 정비소, 밭, 출퇴근길',
  'edit.what': '무엇을 하나요',
  'edit.where': '어디에 있나요',
  'edit.change': '바꾸기',
  'edit.cityPlaceholder': '지역 이름 (예: 전주, 철원, 잠실)',
  'edit.searching': '찾는 중',
  'edit.search': '검색',
  'edit.save': '저장',
  'edit.cancel': '취소',
  'edit.add': '추가',
  'edit.addPerson': '+ 사람 추가',
  'edit.reset': '예시로 되돌리기',
  'edit.full': ({ max }) => `${max}명이 다 찼습니다. 한 명을 지우면 더 넣을 수 있습니다.`,
  'edit.fullShort': ({ max }) => `한 번에 ${max}명까지 볼 수 있습니다.`,
  'edit.fullRemove': ({ max }) =>
    `한 번에 ${max}명까지 볼 수 있습니다. 한 명을 지우고 추가해 주세요.`,
  'edit.needWho': '어떻게 부를지 적어 주세요. (예: 정비소, 밭, 출퇴근길)',
  'edit.needCity': '지역을 골라 주세요.',
  'edit.noResult': ({ query }) => `'${query}' 로 찾은 지역이 없습니다. 가까운 큰 지역으로 검색해 보세요.`,
  'edit.searchFail': '지역을 검색하지 못했습니다. 잠시 후 다시 시도해 주세요.',

  // ── 없는 화면 ────────────────────────────────
  'notFound.title': '페이지를 찾을 수 없습니다',
  'notFound.body': '요청하신 주소가 존재하지 않거나,<br />아직 만들어지지 않았습니다.',
  'notFound.home': '날씨 메인으로 이동',
}

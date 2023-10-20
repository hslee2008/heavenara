const date = /(\d{4}년 \d{1,2}월 \d{1,2}일 \d{1,2}시 \d{1,2}분 \d{1,2}초경)/;
const location = /([가-힣]+ [가-힣]+ [\d.]+km 해역)/;
const magnitude = /([\d.]+\(± [\d.]+\) 규모의 지진)/;
const latitude = /위도: ([\d.]+ [NS])/;
const longitude = /경도: ([\d.]+ [EW])/;

module.exports = {
  date,
  location,
  magnitude,
  latitude,
  longitude,
};

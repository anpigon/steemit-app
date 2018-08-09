const Remarkable = require('remarkable')
const md = new Remarkable({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
  breaks: true
})

body = `<p><center><img src="https://steemitimages.com/DQmZHe2o4xM1LMR1huH5XBs7LhpQS1RsvbbGmyHzSiVBFoP/ck.png" width="1226" height="800"/></center></p>
<h3><center><a href="https://twitter.com/CoinKor"><strong>CoinKorea</strong></a>는 암호화폐 정보 트위터로 활동을 시작하여<br>국내 암호화폐 커뮤니티를 위해<br><strong>개인</strong>이 진행하고 있는 비영리 활동입니다.</center></h3>
<p><br> 제 기준으로 눈에 띄는 뉴스들만 정리해보았습니다.<br> 잘못된 뉴스나 다른 이슈거리가 있다면 보충,지적해주시면 감사하겠습니다. :)<br> 코인 트레이딩에 많은 도움 되셨으면 좋겠습니다.</p> <br> <p><strong>*사기 경고: 최근 유튜브, 웹사이트 등지에서 암호화폐 펌핑관련 유료 그룹 가입을 권유하는 집단을 주의하세요. 해당 사건에 연루되어 유사수신 행위 공범, 투자 손실 등의 피해 발생에 대한 책임은 그 누구도 책임져주지 않습니다.</strong></p>`
body2 = `<p><center><img src="<img src="https://steemitimages.com/DQmZHe2o4xM1LMR1huH5XBs7LhpQS1RsvbbGmyHzSiVBFoP/ck.png" width="1226" height="800"/></center></p>">
<h3><center><a href="https://twitter.com/CoinKor"><strong>CoinKorea</strong></a>는 암호화폐 정보트위터로 활동을 시작하여<br>국내 암호화폐 커뮤니티를 위해<br><strong>개인</strong>이 진행하고 있는 비영리 활동입니다.</center></h3>
<p><br> 제 기준으로 눈에 띄는 뉴스들만 정리해보았습니다.<br> 잘못된 뉴스나 다른 이슈거리가 있다면보충,지적해주시면 감사하겠습니다. :)<br> 코인 트레이딩에 많은 도움 되셨으면 좋겠습니다.</p> <br> <p><strong>*사기 경고: 최근 유튜브, 웹사이트 등지에서 암호화폐 펌핑관련 유료 그룹 가입을 권유하는집단을 주의하세요. 해당 사건에 연루되어 유사수신 행위 공범, 투자 손실 등의 피해 발생에 대한 책임은 그 누구도 책임져주지 않습니다.</strong></p>`

// html = parseHtml(body)
// console.log(html)
// const

body = `<center>![e6fa72cdffeae672cf3f20c91e9974ff.jpg](https://cdn.steemitimages.com/DQmV8CTWQMmJNVEA7fuXcGhY6P9yKSfzZdz9PBr4aQH996D/e6fa72cdffeae672cf3f20c91e9974ff.jpg)
<hr>
https://steemitimages.com/DQmVQ3XcDADaiifJNiCsEfvUW5t2CZ88XXWGjXWiP5AWVGw/%EA%B7%B8%EB%A6%BC1_20180201142555713.jpg</center>`
html = parseHtml(body)
console.log(html)

function parseHtml(body) {
  const imageRegex = /[^\\(|>|'|"|\\/](https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,}))))/gi;
  // let html = body.replace(/(https?:\/\/steemit(dev|stage)?images.com(\/([0-9]+x[0-9]+))?\/.+)/g, '<img src="$1">')
  // html = html.replace(/[^\\(|>|'|"|\\/](https?:\/\/.*\.(?:jpe?g|gif|png)(\?.*)?)/ig, '<img src="$1">')
  // return md.render(body)
  return body.replace(imageRegex, '![]($1)')
}

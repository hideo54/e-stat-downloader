# e-stat-downloader

e-Stat の検索結果 100 件の CSV ファイルを一括ダウンロードしたいような時に役に立つダウンローダ。テキトーに作っているのでどのくらい汎用的に使えるかは知らない。

雑に ts-node で動かす想定。必要なパラメータは検索結果の URL みればわかるのでは。

ちなみに、`index.ts` で例に使っているのは、2020年国勢調査に基づく「人口及び世帯」の「4次メッシュ (500 m メッシュ)」。

## なぜ公式の一括取得機能を使わないのか

e-Stat は公式に「[統計データ一括取得](https://www.e-stat.go.jp/api/sample/testform2-1/getStatsDatas.html)」というページを作っており、e-Stat API を使ってブラウザ側で一括ダウンロードできるページを公開している。しかしこの「統計データ一括取得パラメータリスト」は非常に難解で作成が困難。

一方でこのリポジトリは、単にスクレイピングをしているので、お行儀は悪いものの、URL に含まれるクエリをそのまま投げるだけでいいという、非常にわかりやすいスグレモノ。

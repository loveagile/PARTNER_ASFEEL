## 説明

- /generateMasterData: master\_{collectionName}.json を Firestore に保存するスクリプト
- /getMasterDataFromDev: ステージングの Firestore から Master データを取得するスクリプト

## 容量が大きいマスターデータ

以下は Backlog に置いてある。使用する際は都度取得してください。
https://tifana.backlog.jp/file/PARTNER_ASFEEL/%E3%83%9E%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%87%E3%83%BC%E3%82%BF/

- master_address.xlsx
- master_organizations.json

## ローカルでスクリプトを実行する手順

```bash

# 1. serviceAccountKeyを./に配置する（すでにあればこの作業をスキップ）
# 2. ローカルの環境変数にセットする
export export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

# 3. package install
npm i

# 4. スクリプト実行
npm run dev


```

# ブランチルール

| 目的 | ブランチ |
| ---- | -------- |
| 開発 | develop  |
| 本番 | main     |

# ディレクトリ構成

- /partner : 登録者アプリ
- /coordinator : コーディネーターアプリ
- /educational-recruiting : 募集掲載者アプリ
- /admin : 管理者アプリ
- /server : API

# 技術スタック

- フロント
  - [Next.js](https://nextjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
- バックエンド（[Firebase](https://firebase.google.com/)）

# 事前準備

このプロジェクトを利用するには以下のソフトウェアが必須となります。  
まだインストールしていない方はご自身の環境にインストールしてください。

- [Node >= 16.0](https://nodejs.org/)
- [JDK](https://www.oracle.com/java/technologies/downloads/) (To run Firebase Emulators)

# インストール手順

それではインストール手順に入ります。順番に実施していってください。

## Git Clone

```shell
git clone https://tifana.backlog.jp/git/PARTNER_ASFEEL/PARTNER_ASFEEL.git
cd PARTNER_ASFEEL
```

## Next.js アプリ 設定

依存関係インストール

```shell
cd client
npm install
```

次のコマンドを実行します。

```shell
cp .env.sample .env
```

## Firebase 設定

Firebase にログインしていない場合は、以下の情報を使用してログインしてください。

- Google account: all-member@ime-3.com
- Password: **\*\***

```bash
firebase login
```

Firebase Emulator を起動する

```bash
cd server
firebase emulators:start
```

## 開発サーバーを起動する

```bash
cd client
npm run dev
```

## デプロイ(deploy)

gcloud コマンドを実行するには、[Google Cloud CLI](https://cloud.google.com/sdk?hl=ja) をインストールします。

```bash
## move target dir
cd coordinator

## check local build
npm run build

## run deploy script
sh ./deploy.sh
```

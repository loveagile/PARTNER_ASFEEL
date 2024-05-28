## 開発環境起動

```fish
npm i
npm run dev
```

## ディレクトリ構成

```
/components: コンポーネント化されたデザイン部品がある
/hooks: hooks
/libs: 外部ライブラリをラッパーしたもの
/models: Firestoreのデータモデル
/pages: 画面
/store: redux(状態管理)
/utils: 共通して使う関数など

```

## アカウント制御について

```
/hooks/useAuthUserStateProvider

firebase authでアカウント作成、ログイン、ログイン状態管理、ログアウトを処理している。
indexDBでセッションを管理していて、サイト起動時にindexDBのセッションを見てログインしているかをチェックしている
```

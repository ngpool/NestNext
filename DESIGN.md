# DESIGN（現段階の設計）

このリポジトリは **Next.js（フロント）** と **NestJS（バック）** を用いた共同開発アプリケーションです。現時点では、主に以下の機能が実装されています。

- オセロゲーム（`/reversi`）
- 計算/可視化デモ（`/sort-demo`）※README記載
- （バックエンド）Todo API（`/todo`）

以降は、現行コードをベースにした「現段階の設計」をまとめます。

## 1. 全体アーキテクチャ

### 1.1 コンテナ構成（Docker）

`compose.yaml` により以下の構成で起動します。

- `frontend`: Next.js（ポート `3000`）
- `backend`: NestJS（ポート `3000`）
- `database`: PostgreSQL（ポート `5432`）
- `nginx`: リバースプロキシ
  - `80`: `frontend` へ転送
  - `81`: `backend` へ転送

Nginx 設定（`docker/nginx/etc/nginx/conf.d/default.conf`）により、

- `http://<host>/...` は `frontend:3000` へ
- `http://<host>:81/...` は `backend:3000` へ

というルーティング方針です。

### 1.2 開発上の責務分界

- フロントエンド
  - UI描画、ゲームロジック（オセロ盤面・合法手計算・表示）
  - 画面更新（React state）
- バックエンド
  - Todo の CRUD API 提供
  - （現時点）オセロ等のゲーム制御はフロント側で完結

## 2. フロントエンド設計（Next.js）

`frontend/src/app` 以下に App Router のページ/コンポーネントが配置されています。

### 2.1 オセロ（`/reversi`）

対象: `frontend/src/app/reversi/page.tsx`

- 盤面: 8x8（`BOARD_SIZE = 8`）
- 表現:
  - `Board` = `Cell[][]`
  - `Cell` = `Stone | null`
  - `Stone` = `"black" | "white"`
- 合法手:
  - `ValidMoves` = `Record<string, Position[]>`
  - キー `"<row>,<col>"` で、置いたときに反転する座標群（`Position[]`）を保持
- 更新フロー:
  1. `initializeGame()` で初期配置と合法手を計算
  2. `handleMove(row, col)` で盤面を更新
     - 反転アニメーション用に `flipAnimations` を組み立てる
     - `setTimeout` で一定時間後に盤面を反転適用し、スコアと次手を再計算
  3. 次のプレイヤーに打てる合法手がない場合はパス処理、双方不可ならゲーム終了

> 現時点ではサーバ通信なし（ローカル state のみでゲーム進行）。

### 2.2 Todo/他画面

- `todo` はバックエンド提供（後述）
- フロント側は README にある通り `sort-demo` を別ページとして想定

## 3. バックエンド設計（NestJS）

`backend/src` は Nest の標準構成です。

### 3.1 エントリポイント

- `backend/src/main.ts`: `AppModule` を起動し `3000` で listen
- `backend/src/app.module.ts`: `TodoModule` を import

### 3.2 Todo API

対象: `backend/src/todo/*`

#### APIエンドポイント

- `POST /todo`
  - 要求: `CreateTodoDto`
  - 応答: `Todo`
- `GET /todo`
  - 応答: `Todo[]`
- `GET /todo/:id`
  - 応答: `Todo | null`
- `PATCH /todo/:id`
  - 要求: `UpdateTodoDto`
  - 応答: `Todo | null`
- `DELETE /todo/:id`
  - 応答: `Todo | null`

#### データモデル

- `Todo`:
  - `id: number`
  - `title: string`
  - `isCompleted: boolean`

#### 現状の実装方針（永続化）

`TodoService` は **メモリ上の配列** を直接更新しています（DB永続化は未実装）。

## 4. 非機能設計（現状）

- セキュリティ/ヘッダ
  - Nginx で基本的なセキュリティヘッダを付与
- 実行環境
  - Docker 前提で Node v20 のイメージを利用
- ログ
  - 現状、必要最低限（詳細なロギング/監視は未整理）


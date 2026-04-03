# todo API 設計（NestJS）

対象ファイル:

- `backend/src/todo/todo.controller.ts`
- `backend/src/todo/todo.service.ts`
- `backend/src/todo/dto/*`
- `backend/src/todo/entities/todo.entity.ts`

## 1. 目的

- Todo の CRUD を HTTP API として提供する
- 現段階では UI 連携より先に API の形を確立する

## 2. エンドポイント

基底パス: `/todo`

### 2.1 POST /todo

- 目的: Todo の作成
- リクエストボディ: `CreateTodoDto`
  - `title: string`
- レスポンス: `Todo`

### 2.2 GET /todo

- 目的: Todo 全件取得
- レスポンス: `Todo[]`

### 2.3 GET /todo/:id

- 目的: 指定IDの取得
- レスポンス: `Todo | null`

### 2.4 PATCH /todo/:id

- 目的: Todo の一部更新
- リクエストボディ: `UpdateTodoDto`
  - `title?: string`
  - `isCompleted?: boolean`
- レスポンス: `Todo | null`

### 2.5 DELETE /todo/:id

- 目的: Todo 削除
- レスポンス: `Todo | null`

## 3. データモデル

`Todo`:

- `id: number`
- `title: string`
- `isCompleted: boolean`

## 4. 実装方針（現状）

`TodoService` は `private todos: Todo[]` に対して配列操作を行い、
永続化せずにメモリ内で状態を保持しています。

## 5. 将来の拡張案（設計上の候補）

- DB永続化（PostgreSQL）への接続
  - TypeORM / Prisma などの採用
- バリデーション
  - `class-validator` / `class-transformer`
- エラーハンドリング方針の整理
  - 404 / 400 / 500 を統一フォーマット化
- ページング/検索
  - `?offset=&limit=`、`?q=` など


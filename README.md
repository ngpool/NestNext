# NestNext

Next.js（フロントエンド）と Nest.js（バックエンド）を使用した 共同開発 アプリケーションです。

## 機能一覧

### 1. オセロゲーム

- パス: `/reversi`
- 特徴:
  - 対人プレイ機能
  - リアルタイムの盤面更新
  - 合法手のハイライト表示

### 2. ソートアルゴリズムビジュアライザー

- パス: `/sort-demo`
- 実装アルゴリズム:
  - バブルソート (O(n²))
  - クイックソート (O(n log n))
  - 選択ソート (O(n²))
  - 挿入ソート (O(n²))
- 特徴:
  - リアルタイムのビジュアライゼーション
  - ソート速度の調整機能
  - 途中停止/再開機能
  - アルゴリズムの詳細説明

## 技術スタック

### フロントエンド

- Next.js (App Router)
- TypeScript
- TailwindCSS
- React Hooks

### バックエンド

- Nest.js
- TypeScript
- PostgreSQL

### インフラ

- Docker
- Nginx
- Node.js (v20.x)

## 開発環境のセットアップ

### 必要条件

- Docker
- Docker Compose
- Node.js (v20 以上)
- npm または yarn

### 環境変数の設定

1. `.env.example`をコピーして`.env`ファイルを作成します：

```bash
cp .env.example .env
```

2. `.env`ファイルを編集して、必要な環境変数を設定します。

### アプリケーションの起動

1. コンテナのビルドと起動：

```bash
docker compose up --build -d
```

2. コンテナの状態確認：

```bash
docker compose ps
```

3. ログの確認：

```bash
# 全てのログを確認
docker compose logs

# 特定のサービスのログを確認
docker compose logs frontend
docker compose logs backend
docker compose logs nginx
```

4. コンテナの停止：

```bash
docker compose down
```

### 開発用コマンド

#### フロントエンド（Next.js）

```bash
# パッケージのインストール
docker compose exec frontend npm install

# 開発サーバー起動
docker compose exec frontend npm run dev

# コンテナ再起動
docker compose restart frontend

# ログの確認
docker compose logs frontend -f
```

#### バックエンド（Nest.js）

```bash
# パッケージのインストール
docker compose exec backend npm install

# 開発サーバー起動
docker compose exec backend npm run start:dev

# コンテナ再起動
docker compose restart backend

# ログの確認
docker compose logs backend -f
```

### アクセス方法

- フロントエンド: http://localhost
  - オセロゲーム: http://localhost/reversi
  - ソートアルゴリズムデモ: http://localhost/sort-demo
- バックエンド API: http://localhost:81

## ディレクトリ構造

```
.
├── frontend/          # Next.jsアプリケーション
│   ├── src/
│   │   └── app/     # ページコンポーネント
│   │       ├── reversi/    # オセロゲーム
│   │       └── sort-demo/  # ソートアルゴリズムデモ
├── backend/           # Nest.jsアプリケーション
│   └── src/          # アプリケーションコード
├── docker/           # Dockerファイル
│   ├── frontend/    # フロントエンド用Dockerfile
│   ├── backend/     # バックエンド用Dockerfile
│   ├── nginx/       # Nginx設定
│   └── database/    # データベース設定
├── compose.yaml      # Docker Compose設定
├── .env.example      # 環境変数のサンプル
└── README.md
```

## トラブルシューティング

### コンテナが起動しない場合

1. ログを確認する

```bash
docker compose logs
```

2. コンテナを再ビルドする

```bash
docker compose down
docker compose up --build -d
```

### API にアクセスできない場合

1. バックエンドのログを確認する

```bash
docker compose logs backend
```

2. Nginx のログを確認する

```bash
docker compose logs nginx
```

## 貢献について

1. このリポジトリをフォークします
2. 新しいブランチを作成します (`git checkout -b feature/awesome-feature`)
3. 変更をコミットします (`git commit -m 'Add awesome feature'`)
4. ブランチをプッシュします (`git push origin feature/awesome-feature`)
5. プルリクエストを作成します

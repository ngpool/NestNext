# NestNext

Next.js（フロントエンド）と Nest.js（バックエンド）を使用した 共同開発 アプリケーションです。

## 技術スタック

### フロントエンド

- Next.js
- TypeScript
- TailwindCSS

### バックエンド

- Nest.js
- TypeScript
- PostgreSQL

### インフラ

- Docker
- Nginx

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
- バックエンド API: http://localhost:81

## ディレクトリ構造

```
.
├── frontend/          # Next.jsアプリケーション
├── backend/           # Nest.jsアプリケーション
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

## サイト一覧

- オセロ
  - http://localhost/reversi

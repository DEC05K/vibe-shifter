# Vercelへのデプロイガイド

## 概要

Vercelにデプロイすることで、固定URLを取得し、URLが変わる問題を完全に解決できます。

## 前提条件

1. **Vercelアカウント**（既にお持ちです）
2. **GitHubリポジトリ**（プロジェクトをGitHubにプッシュする必要があります）
3. **PostgreSQLデータベース**（Supabase、Railway、Neonなど、無料プランで利用可能）

## ステップ1: データベースの準備

VercelではSQLiteが使用できないため、PostgreSQLに移行する必要があります。

### オプション1: Supabase（推奨・最も簡単）

1. **Supabaseアカウントを作成**（無料）
   - https://supabase.com にアクセス
   - アカウントを作成

2. **新しいプロジェクトを作成**
   - 「New Project」をクリック
   - プロジェクト名を入力
   - データベースパスワードを設定
   - リージョンを選択（Tokyo推奨）

3. **接続文字列を取得**
   - プロジェクトの「Settings」> 「Database」を開く
   - 「Connection string」> 「URI」をコピー
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### オプション2: Railway（データベースとアプリを一緒に管理）

1. **Railwayアカウントを作成**（無料）
   - https://railway.app にアクセス
   - GitHubアカウントでログイン

2. **PostgreSQLを追加**
   - 「New Project」をクリック
   - 「Provision PostgreSQL」を選択
   - 接続文字列が自動で生成される

### オプション3: Neon（PostgreSQL専用）

1. **Neonアカウントを作成**（無料）
   - https://neon.tech にアクセス
   - アカウントを作成

2. **新しいプロジェクトを作成**
   - 「Create Project」をクリック
   - 接続文字列が自動で生成される

## ステップ2: Prismaスキーマを更新

`prisma/schema.prisma`を更新して、PostgreSQLを使用するようにします。

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## ステップ3: データベースをマイグレート

```bash
# Prismaクライアントを再生成
npx prisma generate

# データベースにマイグレート
npx prisma migrate deploy
```

## ステップ4: GitHubにプッシュ

プロジェクトをGitHubリポジトリにプッシュします。

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# GitHubリポジトリを作成してプッシュ
# （GitHubでリポジトリを作成してから）
git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
git push -u origin main
```

## ステップ5: Vercelにデプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン

2. **プロジェクトをインポート**
   - 「Add New」> 「Project」をクリック
   - GitHubリポジトリを選択
   - 「Import」をクリック

3. **環境変数を設定**
   - 「Environment Variables」セクションで以下を設定：
     - `SHOPIFY_API_KEY`: あなたのAPIキー
     - `SHOPIFY_API_SECRET`: あなたのAPIシークレット
     - `SCOPES`: `write_products`
     - `DATABASE_URL`: PostgreSQLの接続文字列
     - `NODE_ENV`: `production`
     - `SHOPIFY_APP_URL`: デプロイ後に自動で割り当てられるURL（後で更新）

4. **デプロイ**
   - 「Deploy」をクリック
   - 数分でデプロイ完了
   - 固定URLが自動で割り当てられる（例: `https://delivery-gift-lite.vercel.app`）

## ステップ6: デプロイ後の設定

### 1. VercelのURLを取得

デプロイが完了したら、Vercelが割り当てたURLを確認します（例: `https://delivery-gift-lite.vercel.app`）

### 2. 環境変数を更新

Vercelダッシュボードで、`SHOPIFY_APP_URL`を更新：
- `https://delivery-gift-lite.vercel.app`（実際のURLに置き換え）

### 3. shopify.app.tomlを更新

```toml
application_url = "https://delivery-gift-lite.vercel.app"
```

### 4. Partnersダッシュボードに反映

```bash
shopify app deploy --no-release --force
```

### 5. アプリを再インストール

1. Shopify Adminでアプリをアンインストール
2. アプリを再インストール

## トラブルシューティング

### ビルドエラーが発生する場合

- `package.json`の`build`コマンドが正しいか確認
- `vercel.json`の設定が正しいか確認

### データベース接続エラーが発生する場合

- `DATABASE_URL`環境変数が正しく設定されているか確認
- PostgreSQLデータベースが正常に動作しているか確認

### アプリが表示されない場合

- `SHOPIFY_APP_URL`が正しく設定されているか確認
- PartnersダッシュボードのURLが最新か確認
- アプリを再インストール

## 次のステップ

デプロイが完了したら：
1. アプリが正常に表示されるか確認
2. 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されるか確認
3. エラーが表示されないか確認

これで、URLが変わる問題は完全に解決します！


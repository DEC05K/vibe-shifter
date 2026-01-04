# Vercelデプロイ手順（ステップバイステップ）

## ステップ1: PostgreSQLデータベースを準備（Supabase推奨）

### SupabaseでPostgreSQLをセットアップ

1. **Supabaseアカウントを作成**
   - https://supabase.com にアクセス
   - 「Start your project」をクリック
   - GitHubアカウントでログイン（推奨）

2. **新しいプロジェクトを作成**
   - 「New Project」をクリック
   - プロジェクト名: `delivery-gift-lite`（任意）
   - データベースパスワード: 強力なパスワードを設定（忘れずに保存！）
   - リージョン: `Northeast Asia (Tokyo)`（日本に近い）

3. **接続文字列を取得**
   - プロジェクトが作成されたら、「Settings」> 「Database」を開く
   - 「Connection string」セクションで「URI」を選択
   - 接続文字列をコピー（例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`）
   - **重要**: `[YOUR-PASSWORD]`を実際のパスワードに置き換える

## ステップ2: GitHubにプッシュ

プロジェクトをGitHubリポジトリにプッシュします。

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "Prepare for Vercel deployment"

# GitHubでリポジトリを作成してから
git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
git branch -M main
git push -u origin main
```

## ステップ3: Vercelにデプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン

2. **プロジェクトをインポート**
   - 「Add New」> 「Project」をクリック
   - GitHubリポジトリを選択
   - 「Import」をクリック

3. **プロジェクト設定**
   - Framework Preset: **Remix**（自動検出されるはず）
   - Root Directory: `./`（そのまま）
   - Build Command: `npm run build`（そのまま）
   - Output Directory: `build`（そのまま）
   - Install Command: `npm install`（そのまま）

4. **環境変数を設定**
   - 「Environment Variables」セクションで以下を追加：

   | 変数名 | 値 |
   |--------|-----|
   | `SHOPIFY_API_KEY` | あなたのAPIキー |
   | `SHOPIFY_API_SECRET` | あなたのAPIシークレット |
   | `SCOPES` | `write_products` |
   | `DATABASE_URL` | Supabaseの接続文字列 |
   | `NODE_ENV` | `production` |
   | `SHOPIFY_APP_URL` | （デプロイ後に自動で割り当てられるURLを設定） |

5. **デプロイ**
   - 「Deploy」をクリック
   - 数分でデプロイ完了
   - デプロイが完了したら、URLを確認（例: `https://delivery-gift-lite.vercel.app`）

## ステップ4: デプロイ後の設定

### 1. VercelのURLを取得

デプロイが完了したら、Vercelが割り当てたURLを確認します。

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

## ステップ5: データベースのマイグレート

Vercelにデプロイした後、データベースにテーブルを作成する必要があります。

### 方法1: Vercelのビルド時に自動実行（推奨）

`package.json`の`build`スクリプトを更新：

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && remix vite:build"
  }
}
```

### 方法2: 手動でマイグレート

Vercelのデプロイログでエラーが発生した場合、手動でマイグレート：

```bash
# ローカルで実行（DATABASE_URL環境変数を設定して）
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

## トラブルシューティング

### ビルドエラー: Prisma Client not generated

**解決方法**:
- `package.json`の`build`スクリプトに`prisma generate`を追加

### データベース接続エラー

**解決方法**:
- `DATABASE_URL`環境変数が正しく設定されているか確認
- Supabaseの接続文字列が正しいか確認
- パスワードに特殊文字が含まれている場合、URLエンコードが必要

### アプリが表示されない

**解決方法**:
- `SHOPIFY_APP_URL`が正しく設定されているか確認
- PartnersダッシュボードのURLが最新か確認
- アプリを再インストール

## 開発環境での注意事項

Vercelにデプロイした後、ローカル開発環境でもPostgreSQLを使用する場合は：

1. `.env`ファイルに`DATABASE_URL`を追加
2. `npx prisma migrate deploy`を実行

ローカル開発環境でSQLiteを継続使用する場合は：

1. `prisma/schema.prisma.backup`を`prisma/schema.prisma`に復元
2. `npx prisma generate`を実行

## 次のステップ

デプロイが完了したら：
1. アプリが正常に表示されるか確認
2. 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されるか確認
3. エラーが表示されないか確認

これで、URLが変わる問題は完全に解決します！



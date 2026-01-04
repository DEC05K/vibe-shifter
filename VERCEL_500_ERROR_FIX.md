# Vercel HTTP ERROR 500 の解決方法

## 問題

VercelでHTTP ERROR 500が発生しています。

## 考えられる原因

1. **環境変数が設定されていない、または間違っている**
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SCOPES`
   - `DATABASE_URL`（Supabaseの接続文字列）
   - `SHOPIFY_APP_URL`
   - `NODE_ENV`

2. **データベース接続エラー**
   - Supabaseの接続文字列が正しくない
   - データベースのテーブルが作成されていない

3. **ビルドエラー**
   - Prismaのマイグレートが失敗している
   - ビルドプロセスでエラーが発生している

4. **アプリのコードに問題がある**
   - ランタイムエラーが発生している

## 解決方法

### ステップ1: Vercelのデプロイログを確認

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **デプロイログを確認**
   - 「Deployments」タブを開く
   - 最新のデプロイを選択
   - 「Build Logs」と「Runtime Logs」を確認
   - エラーメッセージを確認

### ステップ2: 環境変数を確認・設定

Vercelダッシュボードで、以下の環境変数が正しく設定されているか確認してください：

| 変数名 | 値 | 必須 |
|--------|-----|------|
| `SHOPIFY_API_KEY` | あなたのAPIキー | ✅ |
| `SHOPIFY_API_SECRET` | あなたのAPIシークレット | ✅ |
| `SCOPES` | `write_products` | ✅ |
| `DATABASE_URL` | Supabaseの接続文字列 | ✅ |
| `SHOPIFY_APP_URL` | `https://v0-vibe-shifter.vercel.app` | ✅ |
| `NODE_ENV` | `production` | ✅ |

**重要**: `DATABASE_URL`が正しく設定されているか確認してください。Supabaseの接続文字列は以下の形式です：

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### ステップ3: データベースのマイグレートを確認

Supabaseのデータベースにテーブルが作成されているか確認してください。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **SQL Editorを開く**
   - 「SQL Editor」を選択
   - 以下のクエリを実行して、`Session`テーブルが存在するか確認：

```sql
SELECT * FROM "Session" LIMIT 1;
```

テーブルが存在しない場合、Prismaのマイグレートが実行されていない可能性があります。

### ステップ4: ビルドログを確認

Vercelのビルドログで、以下のエラーがないか確認してください：

- Prismaのマイグレートエラー
- ビルドエラー
- 環境変数の不足

### ステップ5: ローカルでビルドを確認

ローカルでビルドが成功するか確認してください：

```bash
cd /Users/hakkow_h/delivery-gift-lite
npm run build
```

ビルドが失敗する場合、エラーメッセージを確認してください。

## よくあるエラーと解決方法

### エラー: "Prisma Client not generated"

**解決方法**:
- `package.json`の`build`スクリプトに`prisma generate`が含まれているか確認
- 現在の設定: `"build": "prisma generate && prisma migrate deploy && remix vite:build"`

### エラー: "Database connection failed"

**解決方法**:
- `DATABASE_URL`環境変数が正しく設定されているか確認
- Supabaseの接続文字列が正しいか確認
- Supabaseのデータベースが正常に動作しているか確認

### エラー: "Table 'Session' does not exist"

**解決方法**:
- Prismaのマイグレートが実行されていない
- `package.json`の`build`スクリプトに`prisma migrate deploy`が含まれているか確認
- 手動でマイグレートを実行する必要がある場合があります

## 確認手順

1. ✅ Vercelのデプロイログを確認
2. ✅ 環境変数を確認・設定
3. ✅ データベースのマイグレートを確認
4. ✅ ビルドログを確認
5. ✅ ローカルでビルドを確認

## 次のステップ

エラーメッセージを確認したら、具体的な解決方法を提案できます。Vercelのデプロイログのエラーメッセージを共有してください。



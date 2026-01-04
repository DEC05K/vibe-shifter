# Vercel HTTP ERROR 500 の修正

## 実施した修正

1. **`package.json`の`build`スクリプトを更新**
   - `prisma migrate deploy`を追加
   - これにより、Vercelのビルド時にデータベースのマイグレートが実行されます

2. **`prisma/schema.prisma`を修正**
   - `directUrl`を削除（Supabaseでは通常不要）
   - `DIRECT_URL`環境変数が設定されていない場合、エラーが発生する可能性があったため

## あなたがやるべきこと

### ステップ1: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix Vercel build: add prisma migrate deploy and remove directUrl"
git push
```

### ステップ2: Vercelの環境変数を確認

Vercelダッシュボードで、以下の環境変数が正しく設定されているか確認してください：

| 変数名 | 値 | 必須 |
|--------|-----|------|
| `SHOPIFY_API_KEY` | あなたのAPIキー | ✅ |
| `SHOPIFY_API_SECRET` | あなたのAPIシークレット | ✅ |
| `SCOPES` | `write_products` | ✅ |
| `DATABASE_URL` | Supabaseの接続文字列 | ✅ |
| `SHOPIFY_APP_URL` | `https://v0-vibe-shifter.vercel.app` | ✅ |
| `NODE_ENV` | `production` | ✅ |

**重要**: `DATABASE_URL`が正しく設定されているか確認してください。

### ステップ3: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ**
   - 「Deployments」タブを開く
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - または、GitHubにプッシュすると自動的に再デプロイされます

### ステップ4: デプロイログを確認

再デプロイ後、デプロイログを確認してください：

1. **Build Logsを確認**
   - Prismaのマイグレートが成功しているか確認
   - ビルドエラーがないか確認

2. **Runtime Logsを確認**
   - アプリが起動しているか確認
   - エラーメッセージがないか確認

### ステップ5: データベースのマイグレートを確認

Supabaseのデータベースにテーブルが作成されているか確認してください。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **Table Editorを開く**
   - 「Table Editor」を選択
   - `Session`テーブルが存在するか確認

テーブルが存在しない場合、手動でマイグレートを実行する必要があるかもしれません。

## トラブルシューティング

### エラー: "Prisma migrate deploy failed"

**解決方法**:
- Supabaseの接続文字列が正しいか確認
- Supabaseのデータベースが正常に動作しているか確認
- 手動でマイグレートを実行：

```bash
# ローカルで実行（DATABASE_URL環境変数を設定して）
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### エラー: "Database connection failed"

**解決方法**:
- `DATABASE_URL`環境変数が正しく設定されているか確認
- Supabaseの接続文字列が正しいか確認
- Supabaseのデータベースが正常に動作しているか確認

### エラー: "Table 'Session' does not exist"

**解決方法**:
- Prismaのマイグレートが実行されていない
- 手動でマイグレートを実行する必要がある場合があります

## まとめ

1. ✅ `package.json`の`build`スクリプトを更新（完了）
2. ✅ `prisma/schema.prisma`を修正（完了）
3. ✅ 変更をGitHubにプッシュ（あなたがやること）
4. ✅ Vercelの環境変数を確認（あなたがやること）
5. ✅ Vercelで再デプロイ（あなたがやること）
6. ✅ デプロイログを確認（あなたがやること）

これで、HTTP ERROR 500は解決するはずです。


# HTTP ERROR 500 の修正

## エラー内容

```
このページは動作していません
v0-vibe-shifter.vercel.app では現在このリクエストを処理できません。
HTTP ERROR 500
```

## 考えられる原因

1. **Prismaの接続エラー**
   - データベース接続が失敗している
   - 環境変数`DATABASE_URL`が正しく設定されていない

2. **環境変数が設定されていない**
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SCOPES`
   - `DATABASE_URL`
   - `SHOPIFY_APP_URL`
   - `NODE_ENV`

3. **アプリのコードにエラーがある**
   - ランタイムエラーが発生している

## 実施した修正

1. **`app/db.server.ts`を修正**
   - PrismaClientの接続エラーをキャッチしてログに記録
   - データソースのURLを明示的に設定

## あなたがやるべきこと

### ステップ1: VercelのRuntime Logsを確認（最重要）

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **Runtime Logsを確認**
   - 「Deployments」タブを開く
   - 最新のデプロイを選択
   - 「Runtime Logs」タブを開く
   - エラーメッセージを確認

**重要**: Runtime Logsにエラーメッセージが表示されているはずです。そのエラーメッセージを共有してください。

### ステップ2: 環境変数を確認

Vercelダッシュボードで、以下の環境変数が正しく設定されているか確認してください：

| 変数名 | 値 | 必須 |
|--------|-----|------|
| `SHOPIFY_API_KEY` | あなたのAPIキー | ✅ |
| `SHOPIFY_API_SECRET` | あなたのAPIシークレット | ✅ |
| `SCOPES` | `write_products` | ✅ |
| `DATABASE_URL` | Supabaseの接続文字列（パスワードの`+`を`%2B`にエンコード） | ✅ |
| `SHOPIFY_APP_URL` | `https://v0-vibe-shifter.vercel.app` | ✅ |
| `NODE_ENV` | `production` | ✅ |

**重要**: 
- `DATABASE_URL`が正しく設定されているか確認
- パスワードに特殊文字（`+`）が含まれている場合、URLエンコードが必要（`+` → `%2B`）
- 直接接続用のURL（`db.xxxxx.supabase.co`）を使用しているか確認

### ステップ3: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix HTTP 500: improve Prisma connection error handling"
git push
```

### ステップ4: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ**
   - 「Deployments」タブを開く
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - または、GitHubにプッシュすると自動的に再デプロイされます

### ステップ5: Runtime Logsを再確認

再デプロイ後、Runtime Logsを再確認してください：

1. **Runtime Logsを確認**
   - エラーメッセージが表示されているか確認
   - エラーメッセージの内容を確認

2. **エラーメッセージを共有**
   - エラーメッセージを共有していただければ、より具体的な解決方法を提案できます

## よくあるエラーと解決方法

### エラー1: `Can't reach database server`

**原因**: 
- `DATABASE_URL`が正しく設定されていない
- 接続プーリング用のURLを使用している（直接接続用のURLが必要）

**解決方法**:
- Supabaseの「Direct connection」のURLを使用する
- パスワードの特殊文字をURLエンコードする

### エラー2: `Prisma session table does not exist`

**原因**: 
- テーブルが作成されていない

**解決方法**:
- マイグレートを実行する（既に実行済みの場合は、このエラーは出ないはず）

### エラー3: `Missing required environment variable`

**原因**: 
- 環境変数が設定されていない

**解決方法**:
- Vercelダッシュボードで環境変数を確認・設定する

## まとめ

1. ✅ `app/db.server.ts`を修正（完了）
2. 📋 VercelのRuntime Logsを確認（あなたがやること - 最重要）
3. 📋 環境変数を確認（あなたがやること）
4. 📋 変更をGitHubにプッシュ（あなたがやること）
5. 📋 Vercelで再デプロイ（あなたがやること）

**最も重要なのは、VercelのRuntime Logsを確認して、エラーメッセージを共有することです。**

これにより、より具体的な解決方法を提案できます。



# Prismaエラーの修正

## エラー内容

1. **`prepared statement "s0" already exists`**
   - Prismaの接続プーリングの問題
   - Supabaseを使用している場合、接続プーリング用のURLと直接接続用のURLがある

2. **`Prisma session table does not exist`**
   - セッションテーブルが存在しない
   - マイグレートが実行されていない、または失敗している

## 実施した修正

1. **`app/db.server.ts`を修正**
   - サーバーレス環境（Vercel）では、新しいPrismaClientインスタンスを作成
   - 接続プーリングの問題を回避

2. **`prisma/schema.prisma`を修正**
   - `connectionLimit = 1`を追加
   - Supabaseの接続プーリング問題を回避

## あなたがやるべきこと

### ステップ1: Supabaseの接続文字列を確認

Supabaseを使用している場合、**直接接続用のURL**を使用する必要があります。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **接続文字列を取得**
   - 「Settings」> 「Database」を開く
   - 「Connection string」セクションで、**「Direct connection」**を選択（接続プーリング用ではない）
   - 接続文字列をコピー
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**重要**: 接続プーリング用のURL（`pooler.supabase.com`）ではなく、**直接接続用のURL**（`db.xxxxx.supabase.co`）を使用してください。

### ステップ2: Vercelの環境変数を更新

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を更新**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`を確認
   - 直接接続用のURLになっているか確認
   - 接続プーリング用のURL（`pooler.supabase.com`）になっている場合、直接接続用のURL（`db.xxxxx.supabase.co`）に変更

3. **環境変数を保存後、再デプロイ**
   - 「Save」をクリック
   - 「Deployments」タブで「Redeploy」をクリック

### ステップ3: データベースのマイグレートを確認

Supabaseのデータベースにテーブルが作成されているか確認してください。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **Table Editorを開く**
   - 「Table Editor」を選択
   - `Session`テーブルが存在するか確認

テーブルが存在しない場合、手動でマイグレートを実行する必要があります。

### ステップ4: 手動でマイグレートを実行（必要に応じて）

テーブルが存在しない場合、手動でマイグレートを実行：

```bash
# ローカルで実行（DATABASE_URL環境変数を設定して）
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" npx prisma migrate deploy
```

**重要**: 直接接続用のURLを使用してください。

### ステップ5: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix Prisma connection pooling issues for Supabase"
git push
```

## トラブルシューティング

### エラー: "prepared statement already exists"

**解決方法**:
- Supabaseの直接接続用のURLを使用（接続プーリング用のURLではない）
- `prisma/schema.prisma`に`connectionLimit = 1`を追加（完了）

### エラー: "Prisma session table does not exist"

**解決方法**:
- データベースのマイグレートを実行
- SupabaseのTable Editorで`Session`テーブルが存在するか確認
- 存在しない場合、手動でマイグレートを実行

## まとめ

1. ✅ `app/db.server.ts`を修正（完了）
2. ✅ `prisma/schema.prisma`に`connectionLimit = 1`を追加（完了）
3. ✅ Supabaseの直接接続用のURLを使用（あなたがやること）
4. ✅ Vercelの環境変数を更新（あなたがやること）
5. ✅ データベースのマイグレートを確認（あなたがやること）
6. ✅ 変更をGitHubにプッシュ（あなたがやること）

これで、Prismaのエラーは解決するはずです。


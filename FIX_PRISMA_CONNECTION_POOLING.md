# Prisma接続プーリングエラーの根本的な修正

## エラー内容

```
prepared statement "s0" already exists
Prisma session table does not exist
```

## 根本原因

このエラーは、**Supabaseの接続プーリング**と**Vercelのサーバーレス環境**の組み合わせで発生します。

1. **Vercelのサーバーレス環境**では、各リクエストが新しい環境で実行される可能性がある
2. **Prisma**がprepared statementを再利用しようとする
3. **Supabaseの接続プーリング**が複数の接続を管理している
4. 結果として、prepared statementが既に存在するというエラーが発生

## 解決策

### 最も重要な解決策：Supabaseの直接接続用のURLを使用する

**接続プーリング用のURL（`pooler.supabase.com`）ではなく、直接接続用のURL（`db.xxxxx.supabase.co`）を使用してください。**

### ステップ1: Supabaseの直接接続用のURLを確認

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **接続文字列を取得**
   - 「Settings」> 「Database」を開く
   - 「Connection string」セクションで、**「Direct connection」**を選択
   - **「URI」**を選択（「Session mode」ではない）
   - 接続文字列をコピー
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**重要**: 
- `pooler.supabase.com`ではなく、`db.xxxxx.supabase.co`を使用してください
- パスワードに特殊文字（`+`）が含まれている場合、URLエンコードが必要（`+` → `%2B`）

### ステップ2: Vercelの環境変数を更新

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を更新**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`を確認
   - **直接接続用のURL**（`db.xxxxx.supabase.co`）になっているか確認
   - 接続プーリング用のURL（`pooler.supabase.com`）になっている場合、直接接続用のURLに変更

3. **環境変数を保存後、再デプロイ**
   - 「Save」をクリック
   - 「Deployments」タブで「Redeploy」をクリック

### ステップ3: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix Prisma connection pooling: improve serverless connection handling"
git push
```

## 実施した修正

1. **`app/db.server.ts`を修正**
   - サーバーレス環境での接続管理を改善
   - エラーハンドリングを追加

## まとめ

1. ✅ `app/db.server.ts`を修正（完了）
2. 📋 **Supabaseの直接接続用のURLを使用（あなたがやること - 最重要）**
3. 📋 Vercelの`DATABASE_URL`環境変数を直接接続用のURLに更新（あなたがやること）
4. 📋 変更をGitHubにプッシュ（あなたがやること）
5. 📋 Vercelで再デプロイ（あなたがやること）

**最も重要なのは、Supabaseの直接接続用のURLを使用することです。**

これで、`prepared statement "s0" already exists`エラーは解決するはずです。


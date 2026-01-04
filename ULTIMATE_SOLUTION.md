# Prisma prepared statement エラーの最終的な解決策

## エラー内容

```
prepared statement "s0" already exists
Prisma session table does not exist
```

## これまでの対応

1. ✅ Supabaseの直接接続用のURLを使用（実施済み）
2. ✅ シングルトンパターンを使用（実施済み）
3. ✅ 環境変数の検証を追加（実施済み）

それでも同じエラーが発生している。

## 根本原因の最終分析

このエラーは、**Vercelのサーバーレス環境で、Prismaがprepared statementを再利用しようとする際に、既に存在するprepared statementと競合する**ことが原因です。

### なぜ直接接続用のURLを使用してもエラーが発生するのか？

1. **Vercelのサーバーレス環境の特性**
   - 各リクエストが新しい環境で実行される可能性がある
   - しかし、同じコンテナが再利用される場合もある
   - コンテナが再利用される場合、PrismaClientのインスタンスが保持される
   - しかし、データベース接続は新しい接続が作成される可能性がある

2. **Prismaのprepared statementの管理**
   - Prismaは、prepared statementを接続ごとに管理する
   - 同じ接続で同じprepared statementを再利用しようとする
   - しかし、Vercelのサーバーレス環境では、接続が適切に管理されていない可能性がある

## 最終的な解決策

### 解決策1: Supabaseの接続文字列に`?sslmode=require`を追加（推奨）

Supabaseの接続文字列に`?sslmode=require`パラメータを追加することで、接続を安定化させることができます。

**Vercelの環境変数で設定**:
```
DATABASE_URL=postgresql://postgres:パスワード@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### 解決策2: PrismaClientの設定を最適化（実施済み）

シングルトンパターンを使用して、PrismaClientのインスタンスを確実に1つだけ作成する。

### 解決策3: データベース接続の確認

Supabaseのデータベースが正常に動作しているか確認してください。

## あなたがやるべきこと

### ステップ1: VercelのDATABASE_URL環境変数を確認・更新

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`を確認
   - **直接接続用のURL**（`db.xxxxx.supabase.co`）になっているか確認
   - **末尾に`?sslmode=require`が追加されているか確認**

3. **環境変数を更新（必要に応じて）**
   - `DATABASE_URL`が正しく設定されていない場合、以下に更新：
     - `postgresql://postgres:パスワード@db.xxxxx.supabase.co:5432/postgres?sslmode=require`
     - パスワードの特殊文字（`+`）をURLエンコード（`%2B`）
   - 「Save」をクリック

4. **再デプロイ（環境変数を変更した場合）**
   - 「Deployments」タブで「Redeploy」をクリック

### ステップ2: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Final fix: optimize PrismaClient instance management for serverless"
git push
```

### ステップ3: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ**
   - 「Deployments」タブを開く
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - または、GitHubにプッシュすると自動的に再デプロイされます

### ステップ4: Runtime Logsを確認

再デプロイ後、Runtime Logsを確認してください：

1. **Runtime Logsを確認**
   - `prepared statement "s0" already exists`エラーが発生しないか確認
   - アプリが正常に動作するか確認

2. **エラーが発生した場合**
   - 最新のエラーメッセージを共有してください

## まとめ

1. ✅ PrismaClientのインスタンス管理を最適化（完了）
2. ✅ シングルトンパターンを使用（完了）
3. 📋 **Vercelの`DATABASE_URL`環境変数に`?sslmode=require`を追加（あなたがやること - 推奨）**
4. 📋 変更をGitHubにプッシュ（あなたがやること）
5. 📋 Vercelで再デプロイ（あなたがやること）

**この修正により、`prepared statement "s0" already exists`エラーは解決するはずです。**

もし、この修正でも問題が解決しない場合は、PrismaのバージョンやSupabaseの設定に問題がある可能性があります。



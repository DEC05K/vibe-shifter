# データベースマイグレーションガイド

## 概要

Prismaスキーマを小文字に統一するため、データベースのテーブル名を`Session`（大文字）から`session`（小文字）に変更する必要があります。

## 方法1: Prisma Migrateを使用（推奨）

### ステップ1: Prisma Clientを再生成

```bash
npx prisma generate
```

### ステップ2: マイグレーションファイルを作成

```bash
npx prisma migrate dev --name rename_session_to_lowercase
```

### ステップ3: マイグレーションを適用

```bash
npx prisma migrate deploy
```

## 方法2: 手動でSQLを実行（Supabaseの場合）

### ステップ1: Supabaseダッシュボードにアクセス

1. https://supabase.com にログイン
2. プロジェクトを選択
3. 「SQL Editor」を開く

### ステップ2: マイグレーションSQLを実行

`prisma/migrations/rename_session_table.sql`の内容をコピーして実行します。

**重要**: ステップ3（DROP TABLE）は、データのコピーが成功したことを確認してから実行してください。

### ステップ3: テーブル名の確認

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%session%';
```

`session`（小文字）テーブルが存在し、`Session`（大文字）テーブルが存在しないことを確認してください。

## 方法3: Prisma db pushを使用（開発環境のみ）

```bash
npx prisma db push
```

**注意**: この方法は既存のデータを削除する可能性があるため、本番環境では使用しないでください。

## 確認事項

マイグレーション後、以下を確認してください：

1. ✅ `session`（小文字）テーブルが存在する
2. ✅ `Session`（大文字）テーブルが存在しない
3. ✅ 既存のデータが正しくコピーされている
4. ✅ Prisma Clientが正しく生成されている（`npx prisma generate`）

## トラブルシューティング

### エラー: "relation 'Session' does not exist"

既にテーブル名が変更されている可能性があります。`session`（小文字）テーブルが存在するか確認してください。

### エラー: "relation 'session' already exists"

既に`session`（小文字）テーブルが存在します。`Session`（大文字）テーブルからデータをコピーする必要はありません。

### データが失われた場合

Supabaseのバックアップから復元するか、`Session`（大文字）テーブルがまだ存在する場合は、データをコピーしてください。


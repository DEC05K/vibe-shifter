# データベースマイグレーションコマンド

## 概要

Prismaスキーマを小文字に統一するため、データベースのテーブル名を`Session`（大文字）から`session`（小文字）に変更する必要があります。

## 方法1: Supabase SQL Editorを使用（推奨）

ローカル環境からSupabaseに直接接続できないため、SupabaseのSQL Editorを使用します。

### 手順

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択
   - 左メニューから「SQL Editor」を開く

2. **SQLを実行**
   - `SIMPLE_RENAME_SQL.sql`の内容をコピー
   - SQL Editorに貼り付け
   - ステップごとに実行して確認

3. **確認**
   ```sql
   -- テーブル名が変更されたことを確認
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'session';
   ```

## 方法2: Prisma db push（開発環境のみ）

**注意**: この方法は既存のデータを削除する可能性があるため、本番環境では使用しないでください。

### コマンド

```bash
# Prisma Clientを再生成
npx prisma generate

# データベーススキーマをプッシュ（既存のテーブルを削除して再作成する可能性がある）
npx prisma db push
```

### 注意事項

- `prisma db push`は、既存のテーブルを削除して再作成する可能性があります
- データが失われるリスクがあるため、本番環境では使用しないでください
- 開発環境でも、重要なデータがある場合は使用を避けてください

## 方法3: Prisma Migrate（ローカル接続が必要）

ローカル環境からSupabaseに接続できる場合は、以下のコマンドを使用できます。

### コマンド

```bash
# Prisma Clientを再生成
npx prisma generate

# マイグレーションファイルを作成
npx prisma migrate dev --name rename_session_to_lowercase

# マイグレーションを適用（本番環境）
npx prisma migrate deploy
```

### 前提条件

- ローカル環境からSupabaseのデータベースに接続できること
- `DATABASE_URL`環境変数が正しく設定されていること
- Supabaseの設定で、ローカルIPアドレスからの接続が許可されていること

## 推奨される方法

**Supabase SQL Editorを使用した手動マイグレーション**が最も安全で確実です。

### 理由

1. **データの安全性**: 既存のデータを保持しながらテーブル名を変更できる
2. **型の不一致を回避**: テーブル構造をそのまま保持できる
3. **接続の問題を回避**: ローカル環境から接続できない問題を回避できる

## マイグレーション後の確認

マイグレーションが完了したら、以下を確認してください：

1. ✅ `session`（小文字）テーブルが存在する
2. ✅ `Session`（大文字）テーブルが存在しない（または削除済み）
3. ✅ 既存のデータが保持されている
4. ✅ Prisma Clientが正しく生成されている（`npx prisma generate`）

## トラブルシューティング

### エラー: "relation 'Session' does not exist"

既にテーブル名が変更されている可能性があります。`session`（小文字）テーブルが存在するか確認してください。

### エラー: "relation 'session' already exists"

既に`session`（小文字）テーブルが存在します。`Session`（大文字）テーブルからデータをコピーする必要があるか確認してください。

### エラー: "Can't reach database server"

ローカル環境からSupabaseに接続できない場合、Supabase SQL Editorを使用してください。

## 次のステップ

マイグレーションが完了したら：

1. **Prisma Clientを再生成**
   ```bash
   npx prisma generate
   ```

2. **変更をGitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Fix: Normalize Prisma schema to lowercase"
   git push origin main
   ```

3. **Vercelで再デプロイ**
   - Vercelダッシュボードで再デプロイ
   - ビルドキャッシュをクリア

4. **動作確認**
   - OAuth認証が正常に動作するか確認
   - ダッシュボードが表示されるか確認
   - Runtime Logsでエラーがないか確認


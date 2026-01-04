# Supabaseでのマイグレーション手順

## 問題

ローカル環境からSupabaseのデータベースに直接接続できないため、`prisma migrate dev`コマンドが失敗します。

これは正常な動作です。Supabaseのデータベースは、セキュリティ上の理由から、特定のIPアドレスからの接続のみを許可する設定になっています。

## 解決策: Supabase SQL Editorを使用

### ステップ1: Supabaseダッシュボードにアクセス

1. https://supabase.com にログイン
2. プロジェクト `delivery-gift-lite` を選択
3. 左側のメニューから「SQL Editor」をクリック

### ステップ2: 現在のテーブル状況を確認

まず、現在のテーブル名を確認します：

```sql
-- 現在のテーブル名を確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'Session' OR table_name = 'session');
```

### ステップ3: マイグレーションSQLを実行

以下のSQLを実行して、テーブル名を`Session`（大文字）から`session`（小文字）に変更します。

#### ケース1: `Session`テーブルが存在し、`session`テーブルが存在しない場合

```sql
-- ステップ1: 新しい小文字のテーブルを作成（既存のデータをコピー）
CREATE TABLE IF NOT EXISTS "session" (
  id                  TEXT PRIMARY KEY,
  shop                TEXT NOT NULL,
  state               TEXT NOT NULL,
  "isOnline"          BOOLEAN DEFAULT false,
  scope               TEXT,
  expires             TIMESTAMP,
  "accessToken"        TEXT NOT NULL,
  "userId"            BIGINT,
  "firstName"         TEXT,
  "lastName"          TEXT,
  email               TEXT,
  "accountOwner"      BOOLEAN DEFAULT false,
  locale              TEXT,
  collaborator        BOOLEAN,
  "emailVerified"     BOOLEAN,
  "refreshToken"      TEXT,
  "refreshTokenExpires" TIMESTAMP
);

-- ステップ2: 既存のデータをコピー
INSERT INTO "session" 
SELECT * FROM "Session";

-- ステップ3: データのコピーが成功したことを確認
SELECT COUNT(*) as session_count FROM "session";
SELECT COUNT(*) as Session_count FROM "Session";

-- ステップ4: 古いテーブルを削除（データのコピーが成功したことを確認してから実行）
-- DROP TABLE IF EXISTS "Session";
```

#### ケース2: 既に`session`テーブルが存在する場合

```sql
-- 既にsessionテーブルが存在する場合は、Sessionテーブルからデータをコピー（重複チェック付き）
INSERT INTO "session" 
SELECT * FROM "Session"
WHERE NOT EXISTS (
  SELECT 1 FROM "session" WHERE "session".id = "Session".id
);

-- データの確認
SELECT COUNT(*) as session_count FROM "session";
SELECT COUNT(*) as Session_count FROM "Session";

-- 古いテーブルを削除（データのコピーが成功したことを確認してから実行）
-- DROP TABLE IF EXISTS "Session";
```

#### ケース3: 既に`session`テーブルが存在し、`Session`テーブルが存在しない場合

この場合は、既にマイグレーションが完了している可能性があります。何もする必要はありません。

### ステップ4: マイグレーションの確認

マイグレーションが成功したことを確認します：

```sql
-- テーブル名を確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'Session' OR table_name = 'session');

-- sessionテーブルのデータ数を確認
SELECT COUNT(*) as count FROM "session";
```

### ステップ5: 古いテーブルの削除（オプション）

データのコピーが成功し、`session`テーブルが正常に動作することを確認したら、古い`Session`テーブルを削除できます：

```sql
-- 注意: この操作は取り消せません。必ずデータのバックアップを取ってから実行してください
DROP TABLE IF EXISTS "Session";
```

## 注意事項

1. **データのバックアップ**: マイグレーションを実行する前に、必ずデータをバックアップしてください
2. **段階的な実行**: SQLを一度にすべて実行せず、ステップごとに実行して確認してください
3. **データの確認**: 各ステップの後、データが正しくコピーされていることを確認してください
4. **古いテーブルの削除**: 古いテーブルを削除する前に、十分にテストしてください

## トラブルシューティング

### エラー: "relation 'Session' does not exist"

既にテーブル名が変更されている可能性があります。`session`（小文字）テーブルが存在するか確認してください。

### エラー: "relation 'session' already exists"

既に`session`（小文字）テーブルが存在します。`Session`（大文字）テーブルからデータをコピーする必要があるか確認してください。

### データが失われた場合

Supabaseのバックアップから復元するか、`Session`（大文字）テーブルがまだ存在する場合は、データをコピーしてください。

## マイグレーション後の確認

マイグレーションが完了したら、以下を確認してください：

1. ✅ `session`（小文字）テーブルが存在する
2. ✅ `Session`（大文字）テーブルが存在しない（または削除済み）
3. ✅ 既存のデータが正しくコピーされている
4. ✅ Vercelでアプリが正常に動作する



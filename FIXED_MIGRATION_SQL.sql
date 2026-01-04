-- ============================================
-- 修正版: Supabase SQL Editorで実行するマイグレーションSQL
-- ============================================
-- このSQLをSupabaseのSQL Editorで実行してください
-- ステップごとに実行して、各ステップの結果を確認してください

-- ============================================
-- ステップ1: 現在のテーブル状況を確認
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'Session' OR table_name = 'session');

-- ============================================
-- ステップ2: Sessionテーブルの実際のスキーマを確認
-- ============================================
-- これでSessionテーブルの実際のカラムと型を確認できます
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'Session'
ORDER BY ordinal_position;

-- ============================================
-- ステップ3: sessionテーブルを作成（型を明示的に指定）
-- ============================================
-- Sessionテーブルの実際の型に合わせて作成
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
  collaborator        TEXT,  -- SessionテーブルがTEXT型の場合
  "emailVerified"     BOOLEAN,
  "refreshToken"      TEXT,
  "refreshTokenExpires" TIMESTAMP
);

-- ============================================
-- ステップ4: Sessionテーブルからデータをコピー（型変換付き）
-- ============================================
-- 型の不一致を解決するため、明示的に型変換を行います
INSERT INTO "session" (
  id,
  shop,
  state,
  "isOnline",
  scope,
  expires,
  "accessToken",
  "userId",
  "firstName",
  "lastName",
  email,
  "accountOwner",
  locale,
  collaborator,
  "emailVerified",
  "refreshToken",
  "refreshTokenExpires"
)
SELECT 
  id,
  shop,
  state,
  COALESCE("isOnline", false)::BOOLEAN,
  scope,
  expires,
  "accessToken",
  "userId",
  "firstName",
  "lastName",
  email,
  COALESCE("accountOwner", false)::BOOLEAN,
  locale,
  CASE 
    WHEN collaborator IS NULL THEN NULL
    WHEN collaborator::text = 'true' OR collaborator::text = 't' THEN 'true'
    WHEN collaborator::text = 'false' OR collaborator::text = 'f' THEN 'false'
    ELSE collaborator::text
  END as collaborator,
  COALESCE("emailVerified", false)::BOOLEAN,
  "refreshToken",
  "refreshTokenExpires"
FROM "Session"
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'Session'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ステップ5: データの確認
-- ============================================
-- sessionテーブルのデータ数を確認
SELECT COUNT(*) as session_count FROM "session";

-- Sessionテーブルのデータ数を確認（存在する場合）
SELECT COUNT(*) as Session_count FROM "Session"
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'Session'
);

-- データの整合性を確認（両方のテーブルが存在する場合）
SELECT 
  (SELECT COUNT(*) FROM "session") as session_count,
  (SELECT COUNT(*) FROM "Session") as Session_count;

-- ============================================
-- ステップ6: 古いSessionテーブルを削除（オプション）
-- ============================================
-- ⚠️ 注意: この操作は取り消せません
-- ステップ5でデータが正しくコピーされていることを確認してから実行してください
-- 
-- DROP TABLE IF EXISTS "Session";


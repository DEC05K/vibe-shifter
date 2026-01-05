-- ============================================
-- Supabase SQL Editorで実行するマイグレーションSQL
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
-- ステップ2: sessionテーブルが存在しない場合のみ作成
-- ============================================
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

-- ============================================
-- ステップ3: Sessionテーブルからデータをコピー（存在する場合）
-- ============================================
-- 注意: このクエリは、Sessionテーブルが存在する場合のみデータをコピーします
INSERT INTO "session" 
SELECT * FROM "Session"
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'Session'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ステップ4: データの確認
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

-- ============================================
-- ステップ5: 古いSessionテーブルを削除（オプション）
-- ============================================
-- ⚠️ 注意: この操作は取り消せません
-- ステップ4でデータが正しくコピーされていることを確認してから実行してください
-- 
-- DROP TABLE IF EXISTS "Session";




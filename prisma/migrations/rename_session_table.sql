-- データベースのテーブル名を大文字の"Session"から小文字の"session"に変更するマイグレーション
-- 注意: このSQLを実行する前に、既存のデータをバックアップしてください

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

-- ステップ2: 既存のデータをコピー（"Session"テーブルが存在する場合）
INSERT INTO "session" 
SELECT * FROM "Session" 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Session');

-- ステップ3: 古いテーブルを削除（データのコピーが成功したことを確認してから実行）
-- DROP TABLE IF EXISTS "Session";

-- 注意: ステップ3は、ステップ2が成功し、データが正しくコピーされたことを確認してから実行してください


-- ============================================
-- 代替案: より安全なマイグレーション方法
-- ============================================
-- この方法は、Sessionテーブルの実際の型を確認してから実行します

-- ============================================
-- ステップ1: Sessionテーブルの実際のスキーマを確認
-- ============================================
SELECT 
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'Session'
ORDER BY ordinal_position;

-- ============================================
-- ステップ2: 既存のsessionテーブルを削除（存在する場合）
-- ============================================
-- 注意: このステップは、既存のsessionテーブルがある場合のみ実行
-- DROP TABLE IF EXISTS "session";

-- ============================================
-- ステップ3: Sessionテーブルをリネーム（最も安全な方法）
-- ============================================
-- この方法は、テーブル名を変更するだけなので、データが失われるリスクがありません
ALTER TABLE IF EXISTS "Session" RENAME TO "session";

-- ============================================
-- ステップ4: 確認
-- ============================================
-- テーブル名が変更されたことを確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'Session' OR table_name = 'session');

-- データが保持されていることを確認
SELECT COUNT(*) as count FROM "session";



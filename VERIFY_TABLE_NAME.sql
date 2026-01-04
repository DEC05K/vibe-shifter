-- ============================================
-- データベースのテーブル名を確認するSQL
-- ============================================
-- Supabase SQL Editorで実行して、現在のテーブル名を確認してください

-- すべてのテーブル名を確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name ILIKE '%session%'
ORDER BY table_name;

-- Sessionテーブルが存在するか確認（大文字）
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Session'
    ) THEN 'Sessionテーブル（大文字）が存在します'
    ELSE 'Sessionテーブル（大文字）は存在しません'
  END as session_table_status;

-- sessionテーブルが存在するか確認（小文字）
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'session'
    ) THEN 'sessionテーブル（小文字）が存在します'
    ELSE 'sessionテーブル（小文字）は存在しません'
  END as session_table_status;

-- 両方のテーブルのデータ数を確認（存在する場合）
SELECT 
  'Session' as table_name,
  COUNT(*) as count
FROM "Session"
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'Session'
)
UNION ALL
SELECT 
  'session' as table_name,
  COUNT(*) as count
FROM "session"
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'session'
);



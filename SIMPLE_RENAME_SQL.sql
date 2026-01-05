-- ============================================
-- 最も簡単で安全な方法: テーブル名を直接リネーム
-- ============================================
-- この方法は、データをコピーする必要がなく、型の不一致も発生しません

-- ============================================
-- ステップ1: 現在のテーブル状況を確認
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'Session' OR table_name = 'session');

-- ============================================
-- ステップ2: Sessionテーブルをsessionにリネーム
-- ============================================
-- このコマンドは、テーブル名を変更するだけなので、データが失われるリスクがありません
ALTER TABLE IF EXISTS "Session" RENAME TO "session";

-- ============================================
-- ステップ3: 確認
-- ============================================
-- テーブル名が変更されたことを確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'Session' OR table_name = 'session');

-- データが保持されていることを確認
SELECT COUNT(*) as count FROM "session";

-- テーブルの構造を確認
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'session'
ORDER BY ordinal_position;




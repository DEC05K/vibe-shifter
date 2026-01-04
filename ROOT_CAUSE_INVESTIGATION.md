# 根本原因の徹底的な調査

## 現在の状況

すべての修正を実施したにもかかわらず、以下のエラーが継続しています：

```
[shopify-app/ERROR] Error during OAuth callback | {shop: gift-app-test-01.myshopify.com, error: Prisma session table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information}
```

## 考えられる原因（優先順位順）

### 1. データベースのテーブル名がまだ`Session`（大文字）のまま ⚠️ 最も可能性が高い

**問題**: Supabase SQL Editorでテーブル名のリネームが実行されていない可能性があります。

**確認方法**:
1. Supabase SQL Editorで`VERIFY_TABLE_NAME.sql`を実行
2. テーブル名が`Session`（大文字）のままか確認

**解決方法**:
```sql
ALTER TABLE IF EXISTS "Session" RENAME TO "session";
```

### 2. Vercelのビルド時にPrisma Clientが正しく生成されていない

**問題**: Vercelのビルドプロセスで`prisma generate`が実行されていない、または古いPrisma Clientが使用されている。

**確認方法**:
- Vercelのビルドログで`prisma generate`が実行されているか確認
- `postinstall`スクリプトが実行されているか確認

**解決方法**:
- `package.json`の`postinstall`スクリプトを確認
- ビルドキャッシュをクリアして再デプロイ

### 3. Prisma Clientの初期化タイミングの問題

**問題**: PrismaSessionStorageが初期化される時点で、Prisma Clientがまだ完全に初期化されていない。

**確認方法**:
- `app/shopify.server.ts`でデバッグログを追加（実施済み）

**解決方法**:
- Prisma Clientの初期化を明示的に待つ
- 非同期初期化を実装

### 4. データベース接続の問題

**問題**: データベースには接続できているが、テーブルが見つからない。

**確認方法**:
- VercelのRuntime Logsでデータベース接続エラーがないか確認
- `DATABASE_URL`環境変数が正しいか確認

**解決方法**:
- `DATABASE_URL`を確認
- 直接接続URL（`db.xxxxx.supabase.co`）を使用しているか確認

### 5. Prismaスキーマとデータベースの不一致

**問題**: Prismaスキーマでは`@@map("session")`と指定しているが、実際のデータベースのテーブル名が異なる。

**確認方法**:
- Supabase SQL Editorでテーブル名を確認
- Prismaスキーマの`@@map`設定を確認

**解決方法**:
- データベースのテーブル名を`session`（小文字）に変更
- または、Prismaスキーマの`@@map`を実際のテーブル名に合わせる

## デバッグ手順

### ステップ1: データベースのテーブル名を確認

Supabase SQL Editorで以下を実行：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name ILIKE '%session%';
```

### ステップ2: Vercelのビルドログを確認

1. Vercelダッシュボードにアクセス
2. 最新のデプロイを選択
3. 「Build Logs」を確認
4. `prisma generate`が実行されているか確認

### ステップ3: Runtime Logsを確認

1. Vercelダッシュボードで「Runtime Logs」を開く
2. `=== PrismaSessionStorage Initialization ===`のログを確認
3. `prisma.session`が`undefined`かどうか確認

### ステップ4: 環境変数を確認

Vercelダッシュボードで以下を確認：
- `DATABASE_URL`が正しく設定されているか
- 直接接続URL（`db.xxxxx.supabase.co`）を使用しているか
- 接続プーリングURL（`pooler.supabase.com`）を使用していないか

## 最も可能性の高い原因と解決策

**原因**: データベースのテーブル名がまだ`Session`（大文字）のまま

**理由**:
1. Prismaスキーマでは`@@map("session")`と指定している
2. しかし、実際のデータベースのテーブル名が`Session`（大文字）のままだと、Prisma Clientは`prisma.session`でアクセスできない
3. PostgreSQLは大文字小文字を区別するため、`Session`と`session`は異なるテーブルとして扱われる

**解決策**:
1. Supabase SQL Editorで`SIMPLE_RENAME_SQL.sql`を実行
2. テーブル名を`Session`から`session`に変更
3. 変更を確認
4. Vercelで再デプロイ

## 確認チェックリスト

- [ ] Supabaseでテーブル名が`session`（小文字）になっているか確認
- [ ] Vercelのビルドログで`prisma generate`が実行されているか確認
- [ ] VercelのRuntime Logsで`prisma.session`が`undefined`でないか確認
- [ ] `DATABASE_URL`環境変数が正しく設定されているか確認
- [ ] ビルドキャッシュをクリアして再デプロイしたか確認

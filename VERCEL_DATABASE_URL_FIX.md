# Vercel環境変数の修正手順

## 問題の状況

✅ **IP許可リストの問題は解決しました**
- `FATAL: Address not in tenant allow_list`エラーは表示されていません

⚠️ **新しい問題: 接続プーリングURLの使用**
- 現在の`DATABASE_URL`: `pooler.supabase.com`（接続プーリングURL）
- これにより`prepared statement already exists`エラーが発生する可能性があります

## 解決方法

### ステップ1: Supabaseで直接接続URLを取得

1. **Supabaseダッシュボードにログイン**
   - https://supabase.com/dashboard にアクセス
   - プロジェクトを選択

2. **Settings → Database に移動**
   - 左側のメニューから「Settings」をクリック
   - 「Database」を選択

3. **Connection string を確認**
   - 「Connection string」セクションを探す
   - **「Direct connection」**を選択（重要！）
   - 「URI」または「Connection string」をコピー
   - 形式: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### ステップ2: Vercelの環境変数を更新

1. **Vercelダッシュボードにログイン**
   - https://vercel.com/dashboard にアクセス
   - プロジェクトを選択

2. **Settings → Environment Variables に移動**
   - 左側のメニューから「Settings」をクリック
   - 「Environment Variables」を選択

3. **DATABASE_URLを更新**
   - `DATABASE_URL`を探す
   - 「Edit」をクリック
   - **直接接続URL**に変更:
     ```
     postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
     ```
   - 注意: `[PASSWORD]`と`[PROJECT_REF]`を実際の値に置き換える
   - 注意: パスワードに特殊文字（`+`, `@`, `#`など）が含まれる場合は、URLエンコードが必要
     - `+` → `%2B`
     - `@` → `%40`
     - `#` → `%23`
   - 「Save」をクリック

4. **環境変数の適用範囲を確認**
   - 「Production」「Preview」「Development」すべてに適用されていることを確認
   - 必要に応じて、各環境に個別に設定

### ステップ3: 再デプロイ

1. **Vercelで再デプロイ**
   - 環境変数を変更すると、自動的に再デプロイが開始されます
   - または、手動で「Deployments」タブから「Redeploy」をクリック

2. **ビルドキャッシュをクリア**
   - 再デプロイ時に「Use existing Build Cache」のチェックを**外す**（重要）

### ステップ4: 確認

再デプロイ後、Runtime Logsで以下を確認：

✅ **期待されるログ**:
- `DATABASE_URL configured: postgresql://postgres:****@db.xxxxx.supabase.co:5432/postgres`
- `✅ Database connection established`
- `✅ Session table exists. Record count: X`
- `PrismaSessionStorage isReady (after delay): true`

❌ **表示されないこと**:
- `⚠️ WARNING: Using connection pooling URL`
- `prepared statement already exists`
- `FATAL: Address not in tenant allow_list`

## パスワードのURLエンコード

パスワードに特殊文字が含まれる場合、URLエンコードが必要です：

| 文字 | URLエンコード |
|------|--------------|
| `+`  | `%2B`        |
| `@`  | `%40`        |
| `#`  | `%23`        |
| `%`  | `%25`        |
| `&`  | `%26`        |
| `=`  | `%3D`        |
| `?`  | `%3F`        |
| `/`  | `%2F`        |
| `:`  | `%3A`        |

例:
- パスワード: `My+Password@123`
- URLエンコード後: `My%2BPassword%40123`

## トラブルシューティング

### エラー: `P1001: Can't reach database server`

- **原因**: 直接接続URLが正しくない、またはSupabaseのNetwork Restrictionsが有効
- **解決**: 
  1. SupabaseのNetwork Restrictionsを無効化（前の手順で実施済み）
  2. 直接接続URLが正しいか確認

### エラー: `prepared statement already exists`

- **原因**: まだ接続プーリングURLを使用している
- **解決**: Vercelの環境変数`DATABASE_URL`が直接接続URLに変更されているか確認

### エラー: `Invalid password`

- **原因**: パスワードのURLエンコードが正しくない
- **解決**: パスワードの特殊文字をURLエンコードする



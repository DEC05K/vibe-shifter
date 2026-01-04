# 🚨 緊急: DATABASE_URLの修正が必要です

## 現在の状況

ログから、**接続プーリングURL（`pooler.supabase.com`）がまだ使用されています**。

```
⚠️ WARNING: Using connection pooling URL (pooler.supabase.com). 
This may cause 'prepared statement already exists' errors.
```

## 問題

接続プーリングURLを使用していると、以下のエラーが発生する可能性があります：

1. `prepared statement already exists`エラー
2. セッションの保存に失敗
3. OAuth認証が正常に完了しない
4. リロードループが発生

## 解決方法（今すぐ実行してください）

### ステップ1: Supabaseで直接接続URLを取得

1. **Supabaseダッシュボードにログイン**
   - https://supabase.com/dashboard
   - プロジェクトを選択

2. **Settings → Database に移動**
   - 左側のメニューから「Settings」をクリック
   - 「Database」を選択

3. **Connection string を確認**
   - 「Connection string」セクションを探す
   - **「Direct connection」**を選択（重要！）
   - 「URI」をコピー
   - 形式: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### ステップ2: Vercelの環境変数を更新

1. **Vercelダッシュボードにログイン**
   - https://vercel.com/dashboard
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

## 現在のDATABASE_URLの形式

現在の形式（接続プーリングURL）:
```
postgresql://postgres.jhgszqygorqgqmovijzh:****@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

変更後の形式（直接接続URL）:
```
postgresql://postgres:[PASSWORD]@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres?sslmode=require
```

注意: `jhgszqygorqgqmovijzh`はプロジェクト参照IDです。Supabaseのダッシュボードで確認してください。


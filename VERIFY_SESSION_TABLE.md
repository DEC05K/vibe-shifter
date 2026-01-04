# Sessionテーブルの存在確認と修正

## エラー内容

```
Prisma session table does not exist
```

## 重要な確認事項

### 確認1: SupabaseのTable Editorでテーブルを確認

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **Table Editorを開く**
   - 左側のメニューから「Table Editor」をクリック

3. **Sessionテーブルが存在するか確認**
   - 「Session」テーブルが表示されているか確認
   - テーブルが存在しない場合、作成する必要があります

### 確認2: Vercelの環境変数DATABASE_URLを確認

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`の値を確認
   - **この値が、Supabaseのプロジェクトと一致しているか確認**

### 確認3: ローカルとVercelで同じデータベースを使用しているか確認

**重要**: ローカルで`prisma db push`を実行しても、Vercelが使用するデータベースには影響しません。

Vercelが使用するデータベースは、Vercelの環境変数`DATABASE_URL`で指定されたデータベースです。

## 解決方法

### 方法1: SupabaseのSQL Editorで直接テーブルを作成（最も確実）

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック

3. **以下のSQLを実行**

```sql
-- Sessionテーブルが存在しない場合のみ作成
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP
);
```

4. **「Run」ボタンをクリック**

5. **結果を確認**
   - 「Success. No rows returned」と表示されれば成功です

### 方法2: Vercelの環境変数を使用してローカルで実行

1. **Vercelの環境変数`DATABASE_URL`をコピー**
   - Vercelダッシュボードで`DATABASE_URL`の値をコピー

2. **ローカルで実行**

```bash
cd /Users/hakkow_h/delivery-gift-lite
export DATABASE_URL="Vercelの環境変数の値"
npx prisma db push
npx prisma generate
```

これにより、Vercelが使用するデータベースにテーブルが作成されます。

### 方法3: Vercelの環境変数を確認・更新

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`の値を確認

3. **正しい接続文字列を設定**
   - 直接接続用のURL:
     ```
     postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres
     ```
   - 接続プーリング用のURL（Vercel推奨）:
     ```
     postgresql://postgres.xxxxx:Blessinghamlet_315%2B@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
     ```

4. **環境変数を更新**
   - `DATABASE_URL`を編集
   - 正しい接続文字列に更新
   - 「Save」をクリック

5. **再デプロイ**
   - 「Deployments」タブで最新のデプロイを選択
   - 「...」メニューから「Redeploy」を選択

## 確認手順

### ステップ1: SupabaseのTable Editorで確認

1. **Supabaseダッシュボードにアクセス**
2. **「Table Editor」を開く**
3. **「Session」テーブルが表示されているか確認**

### ステップ2: SQL Editorで確認

1. **「SQL Editor」を開く**
2. **以下のSQLを実行**

```sql
SELECT COUNT(*) FROM "Session";
```

3. **結果を確認**
   - エラーが発生しない場合、テーブルは存在します
   - エラーが発生する場合、テーブルは存在しません

### ステップ3: VercelのRuntime Logsを確認

1. **Vercelダッシュボードにアクセス**
2. **「Deployments」タブで最新のデプロイを選択**
3. **「Runtime Logs」を開く**
4. **以下のエラーが発生していないか確認**:
   - `Prisma session table does not exist`
   - `Can't reach database server`

## まとめ

1. ✅ **SupabaseのTable EditorでSessionテーブルが存在するか確認（最重要）**
2. 📋 **テーブルが存在しない場合、SQL Editorで直接作成（方法1 - 推奨）**
3. 📋 **Vercelの環境変数`DATABASE_URL`を確認・更新**
4. 📋 **Vercelの環境変数を使用してローカルで`prisma db push`を実行（方法2）**
5. 📋 **環境変数を変更した後、必ず再デプロイ**

**最も確実な方法は、方法1のSQL Editorで直接テーブルを作成することです。**


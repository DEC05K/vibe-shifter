# Sessionテーブルが存在しないエラーの修正

## エラー内容

```
Prisma session table does not exist
```

## 根本原因

**データベース（Supabase）にSessionテーブルが作成されていない**ことが原因です。

コードの修正だけでは解決しません。実際にデータベースにテーブルを作成する必要があります。

## 解決方法

### 方法1: `prisma db push`を使用（推奨）

この方法は、Prismaスキーマを直接データベースに反映させます。

#### ステップ1: Supabaseの接続文字列を確認

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **接続文字列を取得**
   - 「Settings」> 「Database」を開く
   - 「Connection string」セクションで、**「Direct connection」**を選択
   - **「URI」**を選択
   - 接続文字列をコピー
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**重要**: 
- `pooler.supabase.com`ではなく、`db.xxxxx.supabase.co`を使用してください
- パスワードに特殊文字（`+`）が含まれている場合、URLエンコードが必要（`+` → `%2B`）

#### ステップ2: ローカルの環境変数を設定（一時的）

ターミナルで以下のコマンドを実行します：

```bash
cd /Users/hakkow_h/delivery-gift-lite
export DATABASE_URL="postgresql://postgres:パスワード@db.xxxxx.supabase.co:5432/postgres"
```

**注意**: `パスワード`の部分を、実際のパスワードに置き換えてください。特殊文字（`+`）がある場合は、`%2B`に変換してください。

#### ステップ3: データベースにテーブルを作成

```bash
npx prisma db push
```

このコマンドは、Prismaスキーマをデータベースに反映させ、Sessionテーブルを作成します。

#### ステップ4: Prisma Clientを再生成

```bash
npx prisma generate
```

### 方法2: Vercelの環境変数を確認

Vercelの環境変数`DATABASE_URL`が正しく設定されているか確認してください。

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`を確認
   - **直接接続用のURL**（`db.xxxxx.supabase.co`）になっているか確認
   - パスワードが正しく設定されているか確認

3. **環境変数を修正（必要に応じて）**
   - `DATABASE_URL`が正しく設定されていない場合、以下に更新：
     - `postgresql://postgres:パスワード@db.xxxxx.supabase.co:5432/postgres`
     - パスワードの特殊文字（`+`）をURLエンコード（`%2B`）
   - 「Save」をクリック

### 方法3: SupabaseのSQL Editorで直接実行

SupabaseのSQL Editorを使用して、直接テーブルを作成することもできます。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック

3. **以下のSQLを実行**

```sql
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

## 確認方法

テーブルが作成されたか確認するには、以下のコマンドを実行します：

```bash
npx prisma db pull
```

または、Supabaseのダッシュボードで「Table Editor」を開き、「Session」テーブルが表示されているか確認してください。

## まとめ

1. ✅ データベースにSessionテーブルを作成する必要がある（最重要）
2. 📋 `prisma db push`を実行してテーブルを作成（方法1 - 推奨）
3. 📋 または、SupabaseのSQL Editorで直接実行（方法3）
4. 📋 Vercelの環境変数`DATABASE_URL`を確認（方法2）

**最も簡単な方法は、方法1の`prisma db push`を実行することです。**




# VercelのDATABASE_URL環境変数の修正

## 問題

ローカルでは`prisma db push`が成功し、「The database is already in sync with the Prisma schema.」と表示されました。これは、ローカルのデータベースにはSessionテーブルが存在することを意味します。

しかし、Vercelでは「Prisma session table does not exist」というエラーが発生しています。

## 根本原因

**Vercelの環境変数`DATABASE_URL`が正しく設定されていない、または接続プーリング用のURLを使用している**ことが原因です。

ローカルでは正しい接続文字列を使用していますが、Vercelでは異なる接続文字列が設定されている可能性があります。

## 解決方法

### ステップ1: Vercelの環境変数を確認

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`を確認
   - **現在の値を確認してください**

### ステップ2: 正しい接続文字列を設定

**正しい接続文字列**（ローカルで使用しているものと同じ）:
```
postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres
```

**重要**:
- `db.jhgszqygorqgqmovijzh.supabase.co`を使用（接続プーリング用のURLではない）
- パスワードの`+`は`%2B`にURLエンコードされている
- 末尾に`?sslmode=require`は不要（必要に応じて追加可能）

### ステップ3: 環境変数を更新

1. **`DATABASE_URL`を編集**
   - `DATABASE_URL`の行の「...」メニューから「Edit」を選択
   - 値を以下に更新：
     ```
     postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres
     ```
   - 「Save」をクリック

2. **環境を確認**
   - 「Production」「Preview」「Development」すべてに適用されているか確認
   - 必要に応じて、各環境に個別に設定

### ステップ4: 再デプロイ

環境変数を変更した後、**必ず再デプロイ**してください。

1. **「Deployments」タブを開く**
2. **最新のデプロイの「...」メニューから「Redeploy」を選択**
3. **「Use existing Build Cache」のチェックを外す**（推奨）
4. **「Redeploy」をクリック**

### ステップ5: Runtime Logsを確認

再デプロイ後、Runtime Logsを確認してください：

1. **「Deployments」タブで最新のデプロイを選択**
2. **「Runtime Logs」を開く**
3. **以下のエラーが発生していないか確認**:
   - `Prisma session table does not exist`
   - `prepared statement "s0" already exists`
   - `Can't reach database server`

## 確認方法

### 方法1: SupabaseのTable Editorで確認

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **Table Editorを開く**
   - 左側のメニューから「Table Editor」をクリック
   - 「Session」テーブルが表示されているか確認

### 方法2: Prisma Studioで確認

ローカルで以下のコマンドを実行：

```bash
cd /Users/hakkow_h/delivery-gift-lite
export DATABASE_URL="postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres"
npx prisma studio
```

ブラウザで`http://localhost:5555`を開き、「Session」テーブルが表示されているか確認してください。

## よくある間違い

### 間違い1: 接続プーリング用のURLを使用している

❌ **間違い**:
```
postgresql://postgres:パスワード@pooler.supabase.com:5432/postgres
```

✅ **正しい**:
```
postgresql://postgres:パスワード@db.xxxxx.supabase.co:5432/postgres
```

### 間違い2: パスワードの特殊文字をURLエンコードしていない

❌ **間違い**:
```
postgresql://postgres:Blessinghamlet_315+@db.xxxxx.supabase.co:5432/postgres
```

✅ **正しい**:
```
postgresql://postgres:Blessinghamlet_315%2B@db.xxxxx.supabase.co:5432/postgres
```

### 間違い3: 環境変数を変更した後、再デプロイしていない

環境変数を変更した後は、**必ず再デプロイ**してください。再デプロイしないと、変更が反映されません。

## まとめ

1. ✅ ローカルのデータベースにはSessionテーブルが存在する（確認済み）
2. 📋 **Vercelの環境変数`DATABASE_URL`を確認・更新（最重要）**
3. 📋 直接接続用のURL（`db.xxxxx.supabase.co`）を使用
4. 📋 環境変数を変更した後、必ず再デプロイ
5. 📋 Runtime Logsを確認

**最も重要なのは、Vercelの環境変数`DATABASE_URL`が正しく設定されていることです。**


# Vercelのデータベース接続の不一致を修正

## 確認結果

✅ **SupabaseのTable Editorで確認**: Sessionテーブルは存在し、データも入っています。

しかし、Vercelでは「Prisma session table does not exist」というエラーが発生しています。

## 根本原因

**Vercelの環境変数`DATABASE_URL`が、このSupabaseプロジェクトを指していない可能性が高い**です。

ローカルでは正しいデータベースに接続できていますが、Vercelでは異なるデータベース（または異なるプロジェクト）に接続しようとしている可能性があります。

## 解決方法

### ステップ1: Vercelの環境変数`DATABASE_URL`を確認

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`の値を確認
   - **この値が、Supabaseのプロジェクト「vibe-shifter」と一致しているか確認**

### ステップ2: 正しい接続文字列を設定

SupabaseのTable Editorで確認したプロジェクトは「vibe-shifter」です。

**正しい接続文字列**（このプロジェクト用）:
```
postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres
```

**確認事項**:
- ホスト名: `db.jhgszqygorqgqmovijzh.supabase.co`
- データベース名: `postgres`
- ユーザー名: `postgres`
- パスワード: `Blessinghamlet_315%2B`（`+`は`%2B`にURLエンコード）

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

### ステップ4: 再デプロイ（重要）

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
   - `Can't reach database server`

## 確認方法

### 方法1: Supabaseの接続文字列を取得

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクト「vibe-shifter」を選択

2. **接続文字列を取得**
   - 「Settings」> 「Database」を開く
   - 「Connection string」セクションで、**「Direct connection」**を選択
   - **「URI」**を選択
   - 接続文字列をコピー
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres`

3. **Vercelの環境変数と比較**
   - Vercelの`DATABASE_URL`と、Supabaseで取得した接続文字列を比較
   - 一致しているか確認

### 方法2: ローカルでVercelの環境変数を使用してテスト

1. **Vercelの環境変数`DATABASE_URL`をコピー**

2. **ローカルで実行**

```bash
cd /Users/hakkow_h/delivery-gift-lite
export DATABASE_URL="Vercelの環境変数の値"
npx prisma db pull
```

3. **結果を確認**
   - エラーが発生しない場合、接続は正常です
   - エラーが発生する場合、接続文字列が間違っています

## よくある間違い

### 間違い1: 異なるSupabaseプロジェクトの接続文字列を使用している

複数のSupabaseプロジェクトがある場合、間違ったプロジェクトの接続文字列を使用している可能性があります。

**解決方法**: SupabaseのTable Editorで確認したプロジェクト（vibe-shifter）の接続文字列を使用してください。

### 間違い2: 接続文字列のパスワードがURLエンコードされていない

パスワードに特殊文字（`+`）が含まれている場合、URLエンコードが必要です。

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

1. ✅ **Sessionテーブルは存在する（確認済み）**
2. 📋 **Vercelの環境変数`DATABASE_URL`を確認・更新（最重要）**
3. 📋 **正しいSupabaseプロジェクト（vibe-shifter）の接続文字列を使用**
4. 📋 **環境変数を変更した後、必ず再デプロイ**
5. 📋 **Runtime Logsを確認**

**最も重要なのは、Vercelの環境変数`DATABASE_URL`が正しいSupabaseプロジェクトを指していることです。**



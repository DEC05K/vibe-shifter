# データベース接続エラーの修正

## エラー内容

```
Can't reach database server at `db.jhgszqygorqgqmovijzh.supabase.co:5432`
Prisma session table does not exist
```

## 根本原因

**Vercelのサーバーレス環境からSupabaseのデータベースサーバーに接続できない**ことが原因です。

考えられる原因：
1. **Supabaseのファイアウォール設定**でVercelからの接続がブロックされている
2. **Supabaseのプロジェクトが一時停止**している
3. **接続プーリングが必要**（Vercelのサーバーレス環境では、接続プーリングが推奨される場合がある）

## 解決方法

### 方法1: Supabaseのファイアウォール設定を確認（最重要）

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **ファイアウォール設定を確認**
   - 「Settings」> 「Database」を開く
   - 「Connection pooling」セクションを確認
   - 「Connection string」セクションで、**「Session mode」**を選択
   - 接続文字列をコピー
   - 例: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`

3. **ファイアウォール設定を更新**
   - 「Network Restrictions」セクションを確認
   - 「Allow all IP addresses」を有効にする（開発中のみ）
   - または、VercelのIPアドレスを許可リストに追加

### 方法2: 接続プーリング用のURLを使用（推奨）

Vercelのサーバーレス環境では、接続プーリングが推奨される場合があります。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **接続プーリング用のURLを取得**
   - 「Settings」> 「Database」を開く
   - 「Connection string」セクションで、**「Connection pooling」**を選択
   - **「Session mode」**を選択
   - 接続文字列をコピー
   - 例: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`

3. **Vercelの環境変数を更新**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択
   - 「Settings」> 「Environment Variables」を開く
   - `DATABASE_URL`を編集
   - 接続プーリング用のURLに更新
   - 「Save」をクリック

4. **再デプロイ**
   - 「Deployments」タブで最新のデプロイを選択
   - 「...」メニューから「Redeploy」を選択

### 方法3: Supabaseのプロジェクトがアクティブか確認

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **プロジェクトの状態を確認**
   - プロジェクトが「Active」になっているか確認
   - 一時停止している場合は、「Resume」をクリック

### 方法4: 接続文字列の形式を確認

接続文字列が正しい形式か確認してください。

**直接接続用のURL（通常）**:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**接続プーリング用のURL（Vercel推奨）**:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

**重要**:
- 接続プーリング用のURLでは、ユーザー名が`postgres.xxxxx`の形式になる
- ポート番号が`6543`になる（直接接続は`5432`）
- ホスト名が`pooler.supabase.com`になる

## 確認方法

### 方法1: Supabaseの接続テスト

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトを選択

2. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック

3. **以下のSQLを実行**

```sql
SELECT * FROM "Session" LIMIT 1;
```

4. **結果を確認**
   - エラーが発生しない場合、データベースは正常に動作しています
   - エラーが発生する場合、テーブルが存在しないか、接続に問題があります

### 方法2: ローカルで接続テスト

ターミナルで以下のコマンドを実行：

```bash
cd /Users/hakkow_h/delivery-gift-lite
export DATABASE_URL="postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres"
npx prisma db pull
```

エラーが発生しない場合、ローカルからの接続は正常です。

## よくある間違い

### 間違い1: 直接接続用のURLをVercelで使用している

Vercelのサーバーレス環境では、接続プーリングが推奨される場合があります。

❌ **直接接続用のURL（Vercelでは問題が発生する可能性がある）**:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

✅ **接続プーリング用のURL（Vercel推奨）**:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 間違い2: ファイアウォール設定で接続がブロックされている

Supabaseのファイアウォール設定で、Vercelからの接続がブロックされている可能性があります。

解決方法：
- 「Network Restrictions」で「Allow all IP addresses」を有効にする（開発中のみ）
- または、VercelのIPアドレスを許可リストに追加

## まとめ

1. ✅ **Supabaseのファイアウォール設定を確認（最重要）**
2. 📋 **接続プーリング用のURLを使用（Vercel推奨）**
3. 📋 **Supabaseのプロジェクトがアクティブか確認**
4. 📋 **接続文字列の形式を確認**
5. 📋 **環境変数を変更した後、必ず再デプロイ**

**最も重要なのは、Supabaseのファイアウォール設定と接続プーリング用のURLの使用です。**



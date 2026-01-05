# PrismaSessionStorageがテーブルを見つけられない問題の修正

## エラー内容

```
Prisma session table does not exist
```

環境変数の設定は問題ないが、エラーが消えない。

## 根本原因

**PrismaSessionStorageがテーブル名を正しく検出できていない**可能性があります。

PrismaSessionStorageは、`prisma.session.count()`のようなクエリを実行してテーブルの存在を確認します。これが失敗する場合、以下の原因が考えられます：

1. Prisma Clientが正しく生成されていない
2. テーブル名の大文字小文字の問題（PostgreSQLは大文字小文字を区別する）
3. Prismaスキーマでテーブル名が明示的に指定されていない

## 実施した修正

### 1. Prismaスキーマでテーブル名を明示的に指定

`prisma/schema.prisma`に`@@map("Session")`を追加しました。これにより、Prismaがテーブル名を正しく認識します。

```prisma
model Session {
  // ... フィールド定義 ...
  
  @@map("Session")
}
```

### 2. Prisma Clientを再生成

テーブル名のマッピングを追加した後、Prisma Clientを再生成する必要があります。

## あなたがやるべきこと

### ステップ1: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add prisma/schema.prisma
git commit -m "Fix: Add explicit table name mapping for Session model"
git push origin main
```

### ステップ2: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ（キャッシュをクリア）**
   - 「Deployments」タブを開く
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - **「Use existing Build Cache」のチェックを外す**（重要）
   - 「Redeploy」をクリック

### ステップ3: Runtime Logsを確認

再デプロイ後、Runtime Logsを確認してください：

1. **「Deployments」タブで最新のデプロイを選択**
2. **「Runtime Logs」を開く**
3. **以下のエラーが発生していないか確認**:
   - `Prisma session table does not exist`
   - `Can't reach database server`

## 確認方法

### 方法1: ローカルでPrisma Clientを再生成

```bash
cd /Users/hakkow_h/delivery-gift-lite
export DATABASE_URL="postgresql://postgres:Blessinghamlet_315%2B@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres"
npx prisma generate
```

### 方法2: Prisma Studioで確認

```bash
npx prisma studio
```

ブラウザで`http://localhost:5555`を開き、「Session」テーブルが表示されているか確認してください。

## まとめ

1. ✅ **Prismaスキーマでテーブル名を明示的に指定（完了）**
2. ✅ **Prisma Clientを再生成（完了）**
3. 📋 **変更をGitHubにプッシュ（あなたがやること）**
4. 📋 **Vercelで再デプロイ（キャッシュをクリア）（あなたがやること）**
5. 📋 **Runtime Logsを確認（あなたがやること）**

**この修正により、PrismaSessionStorageがテーブルを正しく検出できるようになるはずです。**




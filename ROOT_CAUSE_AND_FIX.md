# 根本原因の特定と最終的な修正

## 問題の整理

### 確認済みの事実
1. ✅ **SupabaseのTable EditorでSessionテーブルは存在する**（確認済み、データも1行存在）
2. ✅ **環境変数の設定は問題ない**（確認済み）
3. ✅ **Prismaスキーマは正しい**（`@@map("Session")`を追加済み）
4. ✅ **Prisma Clientは生成されている**（ローカルで確認済み）
5. ❌ **しかし、Vercelでは「Prisma session table does not exist」エラーが発生**

### エラーメッセージ
```
[shopify-app/ERROR] Error during OAuth callback | {shop: gift-app-test-01.myshopify.com, error: Prisma session table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information}
```

## 根本原因の特定

### PrismaSessionStorageのソースコードを確認した結果

PrismaSessionStorageのソースコードを確認したところ、以下のことがわかりました：

1. **デフォルトのテーブル名は`session`（小文字）**
   ```javascript
   tableName = 'session';
   ```

2. **データベースには`Session`（大文字のS）が存在**
   - SupabaseのTable Editorで確認済み

3. **PrismaSessionStorageは`prisma[this.tableName]`でテーブルにアクセス**
   - `tableName`が`session`（小文字）の場合、`prisma.session`を使用
   - しかし、Prisma Clientが正しく生成されていれば、`prisma.session`は`Session`テーブルを参照するはず

4. **問題**: PrismaSessionStorageがテーブルを見つけられない
   - `prisma.session`が`undefined`である可能性
   - または、`prisma.session.count()`が失敗している

### 根本原因

**PrismaSessionStorageの`tableName`パラメータがデフォルト値（`session`）のままになっているため、正しいテーブル名（`Session`）を指定する必要があります。**

Prismaスキーマで`@@map("Session")`を追加しましたが、PrismaSessionStorageはPrisma Clientのモデル名（`session`）を使用してテーブルにアクセスします。そのため、PrismaSessionStorageの初期化時に`tableName`パラメータで明示的に指定する必要があります。

## 実施した最終的な修正

### 修正1: PrismaSessionStorageの初期化時にテーブル名を明示的に指定

`app/shopify.server.ts`でPrismaSessionStorageの初期化時に`tableName: "Session"`を指定しました。

```typescript
const sessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "Session", // テーブル名を明示的に指定（大文字のS）
});
```

これにより、PrismaSessionStorageが正しいテーブル名でテーブルを検索できるようになります。

### 修正2: Prismaスキーマでテーブル名を明示的に指定（既に実施済み）

`prisma/schema.prisma`に`@@map("Session")`を追加しました。

### 修正3: データベース接続の検証ログを追加（既に実施済み）

`app/db.server.ts`にデータベース接続の検証ログを追加しました。

## あなたがやるべきこと

### ステップ1: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix: Specify tableName explicitly in PrismaSessionStorage initialization"
git push origin main
```

### ステップ2: Vercelで再デプロイ（キャッシュをクリア）

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

## まとめ

1. ✅ **根本原因を特定（PrismaSessionStorageのtableNameパラメータの問題）**
2. ✅ **PrismaSessionStorageの初期化時にtableNameを明示的に指定（完了）**
3. ✅ **Prismaスキーマでテーブル名を明示的に指定（完了）**
4. ✅ **データベース接続の検証ログを追加（完了）**
5. 📋 **変更をGitHubにプッシュ（あなたがやること）**
6. 📋 **Vercelで再デプロイ（キャッシュをクリア）（あなたがやること）**
7. 📋 **Runtime Logsを確認（あなたがやること）**

**この修正により、PrismaSessionStorageが正しいテーブル名でテーブルを検索できるようになり、エラーは解決するはずです。**



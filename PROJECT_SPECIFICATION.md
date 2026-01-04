# Delivery Gift Lite - プロジェクト仕様書

**作成日**: 2026年1月4日  
**バージョン**: 1.0  
**プロジェクト名**: delivery-gift-lite

---

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [技術スタック](#技術スタック)
3. [アーキテクチャ](#アーキテクチャ)
4. [連携サービス](#連携サービス)
5. [データベース構造](#データベース構造)
6. [認証フロー](#認証フロー)
7. [課金システム](#課金システム)
8. [環境変数](#環境変数)
9. [デプロイメント](#デプロイメント)
10. [現在の問題点とエラー](#現在の問題点とエラー)
11. [修正履歴](#修正履歴)
12. [ファイル構造](#ファイル構造)

---

## プロジェクト概要

### アプリケーション名
**Delivery Gift Lite**

### アプリケーションタイプ
Shopify Embedded App（Remix + React）

### 目的
Shopifyストア向けのギフト配達アプリケーション。プレミアム機能（和紙・桜・ホログラムなどのテクスチャ）を提供する課金プランを含む。

### 開発環境
- **ローカル開発**: Shopify CLI (`shopify app dev`)
- **本番環境**: Vercel
- **データベース**: Supabase (PostgreSQL)

---

## 技術スタック

### フロントエンド
- **React**: 18.2.0
- **Remix**: 2.7.1
- **Shopify Polaris**: 12.0.0（UIコンポーネントライブラリ）
- **Vite**: 5.0.0（ビルドツール）

### バックエンド
- **Node.js**: >=18.0.0
- **Remix Server**: 2.7.1
- **Shopify App Remix**: 4.1.0

### データベース
- **Prisma**: 6.19.1（ORM）
- **PostgreSQL**: Supabase（本番環境）
- **SQLite**: 開発環境（`dev.sqlite`）

### Shopify関連
- **Shopify API**: 12.2.0
- **Shopify App Bridge React**: 4.1.0
- **Shopify App Session Storage Prisma**: 8.0.0

### その他
- **TypeScript**: 5.2.2
- **ESLint**: 8.42.0

---

## アーキテクチャ

### 全体構成

```
┌─────────────────┐
│  Shopify Admin  │
│   (Embedded)    │
└────────┬────────┘
         │
         │ OAuth / API Calls
         │
┌────────▼─────────────────────────┐
│      Vercel (Serverless)          │
│  ┌─────────────────────────────┐ │
│  │  Remix Application          │ │
│  │  - app/routes/app.tsx       │ │
│  │  - app/routes/app._index.tsx│ │
│  │  - app/shopify.server.ts    │ │
│  └─────────────────────────────┘ │
└────────┬──────────────────────────┘
         │
         │ Prisma Client
         │
┌────────▼────────┐
│   Supabase     │
│  (PostgreSQL)  │
│  - Session表   │
└────────────────┘
```

### 主要なファイル構成

#### サーバーサイド
- `app/shopify.server.ts`: Shopifyアプリの設定と認証
- `app/db.server.ts`: Prisma Clientの初期化
- `app/routes/app.tsx`: メインアプリレイアウトと認証
- `app/routes/app._index.tsx`: ダッシュボード（課金プラン表示）

#### クライアントサイド
- `app/root.tsx`: ルートコンポーネント
- `app/entry.server.tsx`: サーバーエントリーポイント

#### 設定ファイル
- `shopify.app.toml`: Shopifyアプリの設定
- `vercel.json`: Vercelデプロイ設定
- `prisma/schema.prisma`: データベーススキーマ

---

## 連携サービス

### 1. Shopify

#### 連携方法
- **OAuth 2.0認証**: Shopify Adminへの埋め込みアプリとして動作
- **GraphQL API**: Admin APIを使用してショップ情報を取得
- **Webhooks**: アプリのアンインストールイベントを受信

#### 設定ファイル
- `shopify.app.toml`
  - `application_url`: `https://v0-vibe-shifter.vercel.app`
  - `embedded`: `true`
  - `scopes`: `write_products`
  - `redirect_urls`: OAuthコールバックURL

#### APIバージョン
- **Admin API**: 2024-10

### 2. Vercel

#### 連携方法
- **GitHub連携**: プッシュ時に自動デプロイ
- **環境変数**: Vercelダッシュボードで管理
- **サーバーレス関数**: Remixアプリをサーバーレス環境で実行

#### デプロイ設定
- `vercel.json`
  - `buildCommand`: `npm run build`
  - `framework`: `remix`
  - `rewrites`: すべてのリクエストを`/build/server/index.js`にルーティング

#### URL
- **本番URL**: `https://v0-vibe-shifter.vercel.app`

### 3. Supabase

#### 連携方法
- **PostgreSQLデータベース**: Prisma経由で接続
- **接続URL**: `DATABASE_URL`環境変数で指定
- **直接接続**: `db.xxxxx.supabase.co:5432`（接続プーリングは使用しない）

#### データベース構造
- **テーブル**: `Session`（大文字のS）
- **スキーマ**: `public`（デフォルト）

### 4. GitHub

#### 連携方法
- **リポジトリ**: `DEC05K/vibe-shifter`（ブランチ: `main`）
- **自動デプロイ**: VercelがGitHubのプッシュを検知して自動デプロイ

---

## データベース構造

### Prismaスキーマ

```prisma
model Session {
  id                  String    @id
  shop                String
  state               String
  isOnline            Boolean   @default(false)
  scope               String?
  expires             DateTime?
  accessToken         String
  userId              BigInt?
  firstName           String?
  lastName            String?
  email               String?
  accountOwner        Boolean   @default(false)
  locale              String?
  collaborator       Boolean?
  emailVerified       Boolean?
  refreshToken        String?
  refreshTokenExpires DateTime?

  @@map("Session")
}
```

### 重要なポイント

1. **テーブル名マッピング**: `@@map("Session")`でデータベースのテーブル名を明示的に指定
2. **Prisma Clientアクセス**: `prisma.session`（小文字）でアクセス
3. **データベーステーブル名**: `Session`（大文字）

### PrismaSessionStorageの設定

```typescript
const prismaSessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "session", // Prisma Clientのモデル名（小文字）を指定
});
```

---

## 認証フロー

### OAuth認証フロー

1. **ユーザーがアプリを開く**
   - Shopify Adminからアプリにアクセス
   - `app/routes/app.tsx`の`loader`が実行される

2. **認証チェック**
   ```typescript
   await authenticate.admin(request);
   ```

3. **セッション確認**
   - PrismaSessionStorageからセッションを取得
   - セッションが存在しない、または期限切れの場合、OAuthフローを開始

4. **OAuthリダイレクト**
   - Shopifyの認証ページにリダイレクト
   - ユーザーがアプリを承認

5. **コールバック処理**
   - `/auth/callback`でOAuthコールバックを受信
   - セッションをデータベースに保存

6. **アプリ表示**
   - 認証が完了すると、`app/routes/app._index.tsx`が表示される

### エラーハンドリング

- **Responseオブジェクト（リダイレクト）**: そのまま再スローしてShopifyの認証フローに任せる
- **その他のエラー**: 500エラーを返してエラーページを表示

---

## 課金システム

### プラン定義

```typescript
export const MONTHLY_PLAN = "Monthly Subscription";

billing: {
  [MONTHLY_PLAN]: {
    amount: 9.99,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    test: true, // 開発中は true
  },
}
```

### 課金チェック

```typescript
const billingCheck = await billing.check({
  plans: [MONTHLY_PLAN],
  isTest: true,
});
isPremium = billingCheck.hasActivePayment;
```

### アップグレード処理

```typescript
await billing.require({
  plans: [MONTHLY_PLAN],
  isTest: true,
  onFailure: async () =>
    billing.request({
      plan: MONTHLY_PLAN,
      isTest: true,
      returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/app`,
    }),
});
```

### UI表示

- **Free Plan**: バッジ表示 + アップグレードボタン
- **PRO Plan**: バッジ表示 + アクティブ表示

---

## 環境変数

### 必須環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `SHOPIFY_API_KEY` | ShopifyアプリのAPIキー | `dd86bdbd5af3b46679b807523fd9f800` |
| `SHOPIFY_API_SECRET` | Shopifyアプリのシークレットキー | （機密情報） |
| `SHOPIFY_APP_URL` | アプリのURL | `https://v0-vibe-shifter.vercel.app` |
| `SCOPES` | 必要なスコープ（カンマ区切り） | `write_products` |
| `DATABASE_URL` | Supabaseの接続URL | `postgresql://user:pass@db.xxx.supabase.co:5432/postgres` |

### オプション環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NODE_ENV` | 環境（production/development） | `production` |
| `SHOP_CUSTOM_DOMAIN` | カスタムドメイン | （未使用） |

### 環境変数の検証

`app/shopify.server.ts`で必須環境変数の存在をチェックし、不足している場合はエラーログを出力。

---

## デプロイメント

### ビルドプロセス

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **Prisma Clientの生成**
   ```bash
   prisma generate
   ```
   - `postinstall`スクリプトで自動実行

3. **Remixアプリのビルド**
   ```bash
   remix vite:build
   ```

### デプロイフロー

1. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```

2. **Vercelが自動検知**
   - GitHubのプッシュを検知
   - 自動的にビルドとデプロイを開始

3. **ビルド完了**
   - ビルドログを確認
   - デプロイが成功すると、新しいURLが利用可能

### データベースマイグレーション

**注意**: Vercelのビルド時にはマイグレーションを実行しない
- `prisma migrate deploy`はビルドスクリプトに含まれていない
- 手動で実行する必要がある（または`prisma db push`を使用）

---

## 現在の問題点とエラー

### 1. Prisma Session Table Does Not Exist エラー

#### エラーメッセージ
```
[shopify-app/ERROR] Error during OAuth callback | {shop: gift-app-test-01.myshopify.com, error: Prisma session table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information}
```

#### 確認済みの事実
- ✅ SupabaseのTable EditorでSessionテーブルは存在する
- ✅ 環境変数の設定は問題ない
- ✅ Prismaスキーマは正しい（`@@map("Session")`を追加済み）
- ✅ Prisma Clientは生成されている（ローカルで確認済み）
- ❌ しかし、Vercelではエラーが発生

#### 根本原因
**PrismaSessionStorageの`tableName`パラメータの指定方法が間違っていました。**

- **以前の誤った設定**: `tableName: "Session"`（大文字）
- **正しい設定**: `tableName: "session"`（小文字）

PrismaSessionStorageの`tableName`パラメータには、**Prisma Clientのモデル名**を指定する必要があります。Prisma Clientでは、モデル名が`Session`の場合、`prisma.session`（小文字）としてアクセスできます。

#### 最新の修正
```typescript
const prismaSessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "session", // Prisma Clientのモデル名（小文字）を指定
});
```

#### ステータス
- **修正済み**: `app/shopify.server.ts`で`tableName: "session"`に変更
- **未確認**: Vercelでの再デプロイ後の動作確認が必要

---

### 2. リダイレクトループ（過去の問題）

#### 問題
ブラウザでリロードすると、ずっとリロードを繰り返す

#### 原因
- `app/routes/app.tsx`のloaderで、`authenticate.admin(request)`が正しく呼ばれていなかった
- エラーハンドリングが不適切で、リダイレクトループが発生

#### 修正
- `authenticate.admin(request)`を正しく呼び出すように修正
- Responseオブジェクト（リダイレクト）の場合はそのまま再スロー
- その他のエラーの場合は、500エラーを返してリダイレクトループを防ぐ

#### ステータス
- **修正済み**: リダイレクトループは解決済み

---

### 3. Prisma Prepared Statement エラー（過去の問題）

#### エラーメッセージ
```
prepared statement "s0" already exists
```

#### 原因
Vercelのサーバーレス環境で、PrismaClientのインスタンスが複数作成され、prepared statementの競合が発生

#### 修正
- PrismaClientのインスタンス管理をシングルトンパターンに変更
- グローバル変数を使用して、確実に1つのインスタンスのみを作成

#### ステータス
- **修正済み**: シングルトンパターンを実装済み

---

### 4. HTTP ERROR 500（過去の問題）

#### 問題
VercelでHTTP ERROR 500が発生

#### 原因
- 環境変数が設定されていない、または間違っている
- Prismaの接続エラー
- Shopify認証の設定エラー

#### 修正
- 必須環境変数の検証を追加
- エラーハンドリングを改善
- 詳細なログ出力を追加

#### ステータス
- **修正済み**: エラーハンドリングを改善済み

---

## 修正履歴

### 2026年1月4日

#### 最新の修正
1. **PrismaSessionStorageのtableNameパラメータを修正**
   - `tableName: "Session"` → `tableName: "session"`に変更
   - Prisma Clientのモデル名（小文字）を指定

#### 過去の主要な修正
1. **リダイレクトループの修正**
   - `app/routes/app.tsx`のloaderで認証を正しく実行
   - エラーハンドリングを改善

2. **Prisma prepared statementエラーの修正**
   - PrismaClientのシングルトンパターンを実装

3. **認証エラーハンドリングの改善**
   - Responseオブジェクトの適切な処理
   - 詳細なエラーログの追加

4. **環境変数の検証**
   - 必須環境変数のチェックを追加
   - エラーログの改善

5. **Prismaスキーマの改善**
   - `@@map("Session")`を追加してテーブル名を明示的に指定

---

## ファイル構造

### 主要なディレクトリ

```
delivery-gift-lite/
├── app/
│   ├── routes/
│   │   ├── app.tsx              # メインアプリレイアウト
│   │   ├── app._index.tsx       # ダッシュボード
│   │   ├── auth.$.tsx           # 認証ルート
│   │   └── webhooks.*.tsx       # Webhookハンドラー
│   ├── shopify.server.ts        # Shopifyアプリ設定
│   ├── db.server.ts             # Prisma Client初期化
│   ├── root.tsx                 # ルートコンポーネント
│   └── entry.server.tsx         # サーバーエントリー
├── prisma/
│   ├── schema.prisma            # データベーススキーマ
│   └── migrations/              # マイグレーションファイル
├── shopify.app.toml             # Shopifyアプリ設定
├── vercel.json                  # Vercel設定
├── package.json                 # 依存関係
└── README.md                    # プロジェクト説明
```

### 重要なファイル

| ファイル | 説明 |
|----------|------|
| `app/shopify.server.ts` | Shopifyアプリの設定、認証、課金、Webhook |
| `app/db.server.ts` | PrismaClientの初期化（シングルトンパターン） |
| `app/routes/app.tsx` | メインアプリレイアウト、認証、ErrorBoundary |
| `app/routes/app._index.tsx` | ダッシュボード、課金プラン表示、アップグレードボタン |
| `prisma/schema.prisma` | データベーススキーマ（Sessionモデル） |
| `shopify.app.toml` | Shopifyアプリの設定（URL、スコープ、Webhook） |
| `vercel.json` | Vercelのデプロイ設定 |

---

## トラブルシューティング

### よくある問題

#### 1. Prisma Session Table Does Not Exist

**症状**: OAuthコールバック時にエラーが発生

**確認事項**:
1. SupabaseでSessionテーブルが存在するか確認
2. `DATABASE_URL`環境変数が正しく設定されているか確認
3. `tableName: "session"`（小文字）が指定されているか確認
4. Prisma Clientが正しく生成されているか確認（`prisma generate`）

**解決方法**:
- `app/shopify.server.ts`で`tableName: "session"`を指定
- Vercelでビルドキャッシュをクリアして再デプロイ

#### 2. リダイレクトループ

**症状**: ブラウザでリロードすると無限ループ

**確認事項**:
1. `app/routes/app.tsx`のloaderで`authenticate.admin(request)`が呼ばれているか
2. エラーハンドリングが適切か（Responseオブジェクトの処理）

**解決方法**:
- Responseオブジェクト（リダイレクト）の場合はそのまま再スロー
- その他のエラーの場合は、500エラーを返す

#### 3. HTTP ERROR 500

**症状**: VercelでHTTP ERROR 500が発生

**確認事項**:
1. 必須環境変数が設定されているか
2. `DATABASE_URL`が正しいか（直接接続URLを使用）
3. Prisma Clientが正しく生成されているか

**解決方法**:
- VercelのRuntime Logsを確認
- 環境変数を再確認
- ビルドキャッシュをクリアして再デプロイ

---

## 次のステップ

### 確認が必要な項目

1. **Vercelでの再デプロイ**
   - 最新の修正（`tableName: "session"`）をプッシュ
   - ビルドキャッシュをクリアして再デプロイ
   - Runtime Logsを確認

2. **動作確認**
   - OAuth認証が正常に動作するか確認
   - ダッシュボードが表示されるか確認
   - 課金プランが正しく表示されるか確認

3. **エラーログの監視**
   - VercelのRuntime Logsを定期的に確認
   - エラーが発生した場合は、詳細を記録

---

## 参考資料

### 公式ドキュメント

- [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix)
- [Prisma Session Storage](https://www.npmjs.com/package/@shopify/shopify-app-session-storage-prisma)
- [Vercel Deployment](https://vercel.com/docs)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)

### エラー解決の参考

- [Prisma Session Table Does Not Exist](https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting)
- [Shopify App Troubleshooting](https://shopify.dev/docs/apps/tools/cli/troubleshooting)

---

**文書の終わり**



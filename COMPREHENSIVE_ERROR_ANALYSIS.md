# Shopify App エラー対応総合分析書

**作成日**: 2026年1月4日  
**プロジェクト名**: delivery-gift-lite  
**デプロイ先**: Vercel (v0-vibe-shifter.vercel.app)  
**データベース**: Supabase (PostgreSQL)

---

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [発生したエラーの時系列](#発生したエラーの時系列)
3. [実施した修正の詳細](#実施した修正の詳細)
4. [現在の状況](#現在の状況)
5. [根本原因の分析](#根本原因の分析)
6. [未解決の問題](#未解決の問題)
7. [推奨される次のステップ](#推奨される次のステップ)

---

## プロジェクト概要

### 技術スタック

- **フレームワーク**: Remix (App Router)
- **Shopify SDK**: @shopify/shopify-app-remix v3系
- **データベース**: PostgreSQL (Supabase)
- **ORM**: Prisma v6系
- **セッションストレージ**: PrismaSessionStorage
- **デプロイ先**: Vercel (Serverless Functions)
- **UI**: Polaris (Shopify Design System)

### アプリの機能

- Shopify Adminに埋め込まれたアプリ
- 月額サブスクリプション（$9.99/月）の課金機能
- OAuth認証によるShopifyストアとの連携
- セッション管理（PrismaSessionStorage）

---

## 発生したエラーの時系列

### フェーズ1: 初期エラー（MissingAppProviderError）

**エラー**: `MissingAppProviderError: No i18n was provided`

**発生時期**: プロジェクト開始時

**症状**:
- アプリが起動しない
- ErrorBoundaryがPolarisコンポーネントを使用していたため、元のエラーが隠蔽されていた

**対応**:
- ErrorBoundaryを純粋なHTMLに変更
- PolarisコンポーネントをAppProviderの外側から削除

**結果**: ✅ 解決

---

### フェーズ2: Cloudflare Tunnel URL同期問題

**エラー**: 
- `site not accessible`
- `Oauth error invalid_request: The redirect_uri is not whitelisted`
- `サーバーの IP アドレスが見つかりませんでした`

**発生時期**: 開発環境でのURL管理

**症状**:
- Cloudflare Tunnel URLが頻繁に変更される
- `shopify.app.toml`の`application_url`が自動更新されない
- Shopify Partners Dashboardの設定と同期されない
- 古いURLがキャッシュされ続ける

**対応**:
- 手動で`shopify.app.toml`を更新
- 自動更新スクリプトの作成（効果なし）
- `shopify app config pull`が設定を上書きする問題を発見
- Vercelへの移行を決定（固定URLのため）

**結果**: ✅ Vercel移行により解決

---

### フェーズ3: Vercelデプロイ時のエラー

**エラー**: `HTTP ERROR 500`

**発生時期**: Vercelへの初回デプロイ時

**症状**:
- ビルドは成功するが、Runtimeでエラーが発生
- `Cannot find module '@remix-run/dev'`エラー
- ビルド時間が19分以上かかる

**対応**:
- `@remix-run/dev`, `vite`, `vite-tsconfig-paths`を`dependencies`に移動
- `prisma migrate deploy`をビルドスクリプトから削除
- `postinstall`スクリプトに`prisma generate`を追加

**結果**: ✅ 解決

---

### フェーズ4: Prisma接続エラー

**エラー**: 
- `P1001: Can't reach database server`
- `prepared statement "s0" already exists`
- `Prisma session table does not exist`

**発生時期**: Vercel Runtime環境でのデータベース接続

**症状**:
- データベース接続が確立されない
- セッションテーブルが見つからない
- Prepared statementの競合

**対応**:
1. **PrismaClientのシングルトンパターン実装**
   - グローバル変数を使用してインスタンスを再利用
   - Vercelのサーバーレス環境でのprepared statement競合を防止

2. **テーブル名の統一**
   - Prismaスキーマ: `model Session { ... @@map("session") }`
   - PrismaSessionStorage: `tableName: "session"`（小文字）
   - データベーステーブル名: `session`（小文字）

3. **接続リトライの増加**
   - `connectionRetries: 2 → 10`
   - `connectionRetryIntervalMs: 5000ms`

4. **データベース接続の明示的な確立**
   - `prisma.$connect()`を明示的に呼び出し

**結果**: ⚠️ 部分的に解決（接続プーリングURLの問題が残存）

---

### フェーズ5: Supabase IP許可リストエラー

**エラー**: `FATAL: Address not in tenant allow_list: {3, 91, 94, 207}`

**発生時期**: Vercel Runtime環境でのデータベース接続

**症状**:
- VercelのIPアドレスがSupabaseの許可リストに含まれていない
- データベース接続が拒否される

**対応**:
- SupabaseのNetwork Restrictionsを無効化
- Settings → Network Restrictions → 「Restrict connections to specific IP addresses」のチェックを外す

**結果**: ✅ 解決

---

### フェーズ6: 接続プーリングURLの問題（現在進行中）

**エラー**: 
- `⚠️ WARNING: Using connection pooling URL (pooler.supabase.com)`
- `prepared statement already exists`（再発の可能性）

**発生時期**: 現在

**症状**:
- Vercelの環境変数`DATABASE_URL`が接続プーリングURLを使用している
- 直接接続URL（`db.xxxxx.supabase.co`）に変更する必要がある

**対応**:
- Vercelの環境変数`DATABASE_URL`を直接接続URLに変更する必要がある
- まだ実施されていない

**結果**: ❌ 未解決

---

### フェーズ7: リロードループ（現在進行中）

**エラー**: リロードループが発生

**発生時期**: OAuth認証フロー中

**症状**:
- ブラウザでリロードが繰り返される
- OAuth認証が正常に完了しない
- セッションが保存されない可能性

**対応**:
- `app/routes/app.tsx`にリダイレクトループ検出を追加
- `app/routes/auth.$.tsx`に詳細なログを追加
- OAuthパス（`/auth/*`）の場合は認証チェックをスキップ

**結果**: ❌ 未解決（接続プーリングURLの問題が原因の可能性）

---

## 実施した修正の詳細

### 1. PrismaClientのシングルトンパターン実装

**ファイル**: `app/db.server.ts`

```typescript
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.prismaGlobal ??
  (global.prismaGlobal = new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "warn"],
  }));
```

**目的**: Vercelのサーバーレス環境で、PrismaClientのインスタンスが複数作成されることを防ぐ

**効果**: `prepared statement "s0" already exists`エラーの発生を減少

---

### 2. PrismaSessionStorageの設定改善

**ファイル**: `app/shopify.server.ts`

```typescript
prismaSessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "session", // 小文字に統一
  connectionRetries: 10, // デフォルト: 2 → 10に増加
  connectionRetryIntervalMs: 5000, // 5秒間隔
});
```

**目的**: 
- テーブル名の不一致を解決
- データベース接続の確立を待つ時間を増やす

**効果**: 接続タイムアウトエラーの発生を減少

---

### 3. データベース接続の明示的な確立

**ファイル**: `app/shopify.server.ts`

```typescript
// データベース接続を明示的に確立
prisma.$connect()
  .then(() => {
    console.log("✅ Database connection established");
    return prisma.session.count();
  })
  .then((count) => {
    console.log("✅ Session table exists. Record count:", count);
  })
  .catch((error) => {
    console.error("❌ Database connection or table check failed:", error);
  });
```

**目的**: PrismaSessionStorageの初期化前にデータベース接続を確立

**効果**: 接続タイミングの問題を軽減

---

### 4. エラーハンドリングの改善

**ファイル**: `app/routes/app.tsx`, `app/routes/app._index.tsx`

- `authenticate.admin(request)`のエラーハンドリングを改善
- Responseオブジェクト（リダイレクト）の場合はそのまま再スロー
- リダイレクトループの検出を追加

**目的**: 認証エラー時のリダイレクトループを防止

**効果**: リロードループの発生を減少（完全には解決していない）

---

### 5. 詳細なデバッグログの追加

**ファイル**: `app/routes/app.tsx`, `app/routes/auth.$.tsx`, `app/shopify.server.ts`

- OAuth認証フローの各ステップをログ出力
- データベース接続状態の確認
- PrismaSessionStorageの初期化状態の確認

**目的**: 問題の原因を特定しやすくする

**効果**: 問題の特定が容易になった

---

## 現在の状況

### 解決済みの問題

1. ✅ `MissingAppProviderError` - ErrorBoundaryを純粋なHTMLに変更
2. ✅ Cloudflare Tunnel URL同期問題 - Vercelへの移行
3. ✅ Vercelビルドエラー - 依存関係の修正
4. ✅ Supabase IP許可リストエラー - Network Restrictionsを無効化
5. ✅ PrismaClientのシングルトンパターン - 実装済み
6. ✅ PrismaSessionStorageの設定改善 - 接続リトライを増加

### 未解決の問題

1. ❌ **接続プーリングURLの使用**
   - 現在の`DATABASE_URL`: `pooler.supabase.com`
   - 直接接続URL（`db.xxxxx.supabase.co`）に変更する必要がある
   - これにより`prepared statement already exists`エラーが再発する可能性

2. ❌ **リロードループ**
   - OAuth認証フロー中にリロードが繰り返される
   - セッションが保存されない可能性
   - 接続プーリングURLの問題が原因の可能性

### 現在のログ出力

```
⚠️ WARNING: Using connection pooling URL (pooler.supabase.com). 
This may cause 'prepared statement already exists' errors.
Please use Direct connection URL (db.xxxxx.supabase.co) instead.
```

---

## 根本原因の分析

### 1. 接続プーリングURLの問題

**原因**:
- Vercelの環境変数`DATABASE_URL`が接続プーリングURL（`pooler.supabase.com`）を使用している
- 接続プーリングは、複数の接続を共有するため、prepared statementの競合が発生しやすい
- Vercelのサーバーレス環境では、接続の再利用が複雑になる

**影響**:
- `prepared statement already exists`エラーの発生
- セッションの保存に失敗する可能性
- OAuth認証が正常に完了しない可能性

**解決策**:
- Vercelの環境変数`DATABASE_URL`を直接接続URL（`db.xxxxx.supabase.co`）に変更
- パスワードに特殊文字が含まれる場合は、URLエンコードが必要

---

### 2. リロードループの問題

**原因の可能性**:

1. **セッションの保存に失敗**
   - 接続プーリングURLの問題により、セッションが保存されない
   - OAuth認証が完了しても、セッションが存在しないため、再度認証を試みる

2. **OAuthコールバックの処理に失敗**
   - PrismaSessionStorageの初期化が完了していない
   - データベース接続が確立されていない

3. **リダイレクトURLの設定が間違っている**
   - `shopify.app.toml`の`redirect_urls`が正しく設定されていない
   - OAuthコールバックが正しいルートに到達しない

**解決策**:
- まず、接続プーリングURLの問題を解決する
- OAuthコールバック処理のログを確認する
- セッションの保存状態を確認する

---

### 3. PrismaSessionStorageの初期化タイミング

**問題**:
- PrismaSessionStorageは初期化時に`pollForTable()`を実行し、テーブルの存在を確認する
- データベース接続が確立されていない場合、`pollForTable()`が失敗する
- 接続リトライを増やしても、接続プーリングURLの問題により、接続が確立されない可能性

**解決策**:
- 直接接続URLを使用することで、接続の確立を確実にする
- PrismaSessionStorageの初期化前に、データベース接続を明示的に確立する（既に実施済み）

---

## 未解決の問題

### 問題1: 接続プーリングURLの使用

**現状**:
- Vercelの環境変数`DATABASE_URL`が接続プーリングURLを使用している
- 直接接続URLに変更する必要がある

**必要な対応**:
1. Supabaseダッシュボードで「Direct connection」URLを取得
2. Vercelの環境変数`DATABASE_URL`を直接接続URLに変更
3. パスワードに特殊文字が含まれる場合は、URLエンコード
4. 再デプロイ（ビルドキャッシュをクリア）

**優先度**: 🔴 最高（他の問題の根本原因の可能性）

---

### 問題2: リロードループ

**現状**:
- OAuth認証フロー中にリロードが繰り返される
- OAuthコールバックのログが表示されていない

**必要な対応**:
1. 接続プーリングURLの問題を解決（問題1）
2. OAuthコールバック処理のログを確認
3. セッションの保存状態を確認
4. リダイレクトURLの設定を確認

**優先度**: 🔴 高（問題1の解決後に再評価）

---

## 推奨される次のステップ

### ステップ1: 接続プーリングURLの問題を解決（最優先）

1. **Supabaseダッシュボードで直接接続URLを取得**
   - Settings → Database → Connection string → Direct connection

2. **Vercelの環境変数を更新**
   - Settings → Environment Variables → DATABASE_URL
   - 直接接続URLに変更
   - パスワードのURLエンコードを確認

3. **再デプロイ**
   - ビルドキャッシュをクリア
   - Runtime Logsで接続プーリングURLの警告が消えることを確認

### ステップ2: OAuth認証フローの確認

1. **Runtime Logsを確認**
   - `=== OAuth Callback Handler ===`が表示されるか
   - `✅ Authentication successful`が表示されるか
   - セッションの保存が成功しているか

2. **リロードループの再評価**
   - 接続プーリングURLの問題が解決された後、リロードループが解消されるか確認
   - 解消されない場合は、追加の調査が必要

### ステップ3: セッション管理の確認

1. **データベースのセッションテーブルを確認**
   - SupabaseのTable Editorで`session`テーブルを確認
   - セッションレコードが保存されているか

2. **PrismaSessionStorageの状態を確認**
   - Runtime Logsで`PrismaSessionStorage isReady: true`が表示されるか
   - 接続エラーが発生していないか

---

## 技術的な詳細

### データベース接続URLの形式

**接続プーリングURL（非推奨）**:
```
postgresql://postgres.jhgszqygorqgqmovijzh:****@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**直接接続URL（推奨）**:
```
postgresql://postgres:[PASSWORD]@db.jhgszqygorqgqmovijzh.supabase.co:5432/postgres?sslmode=require
```

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

  @@map("session") // 小文字に統一
}
```

### PrismaSessionStorageの設定

```typescript
prismaSessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "session", // Prisma Clientのモデル名（小文字）
  connectionRetries: 10, // 接続リトライ回数
  connectionRetryIntervalMs: 5000, // リトライ間隔（5秒）
});
```

---

## 参考資料

### 関連ファイル

- `app/db.server.ts` - PrismaClientの設定
- `app/shopify.server.ts` - Shopify Appの設定とPrismaSessionStorageの初期化
- `app/routes/app.tsx` - メインアプリレイアウトと認証
- `app/routes/auth.$.tsx` - OAuthコールバック処理
- `app/routes/app._index.tsx` - ダッシュボードページ
- `prisma/schema.prisma` - データベーススキーマ

### ドキュメント

- `URGENT_DATABASE_URL_FIX.md` - DATABASE_URLの修正手順
- `SUPABASE_IP_ALLOWLIST_FIX.md` - Supabase IP許可リストの修正手順
- `VERCEL_DATABASE_URL_FIX.md` - Vercel環境変数の修正手順

---

## 結論

現在の主要な問題は、**接続プーリングURLの使用**です。これが原因で、`prepared statement already exists`エラーが発生し、セッションの保存に失敗し、OAuth認証が正常に完了しない可能性があります。

**最優先の対応**は、Vercelの環境変数`DATABASE_URL`を直接接続URLに変更することです。これにより、他の問題（リロードループなど）も解決される可能性が高いです。

---

**作成者**: AI Assistant  
**最終更新**: 2026年1月4日  
**バージョン**: 1.0



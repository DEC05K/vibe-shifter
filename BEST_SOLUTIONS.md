# 最良の解決策：ngrok/Cloudflare Tunnel以外の方法

## 方法1: クラウドホスティングサービスを使用（最も推奨・最も安全）

### 概要

クラウドホスティングサービス（Vercel、Railway、Renderなど）にアプリをデプロイすることで、固定URLを取得できます。これが最も安全で確実な方法です。

### メリット

✅ **完全無料**（無料プランで十分）  
✅ **固定URL**（再起動しても変わらない）  
✅ **エラーが出にくい**（安定したインフラ）  
✅ **自動デプロイ**（GitHubと連携可能）  
✅ **SSL証明書自動設定**（HTTPS対応）  
✅ **Shopify公式が推奨**（README.mdに記載）

### デメリット

⚠️ 初期設定に少し時間がかかる（30分〜1時間）  
⚠️ データベースの設定が必要（SQLiteからPostgreSQLなどに変更）

### 推奨サービス

#### 1. Vercel（最も簡単・推奨）

**特徴**:
- 無料プランで十分
- 設定が最も簡単
- 自動デプロイ（GitHubと連携）
- 固定URLが自動で割り当てられる

**セットアップ時間**: 約30分

#### 2. Railway（データベース込み）

**特徴**:
- 無料プランでPostgreSQLが利用可能
- データベースとアプリを一緒に管理
- 固定URLが自動で割り当てられる

**セットアップ時間**: 約1時間

#### 3. Render（Docker対応）

**特徴**:
- 無料プランで利用可能
- Docker対応
- 固定URLが自動で割り当てられる

**セットアップ時間**: 約1時間

### セットアップ手順（Vercelの場合）

1. **Vercelアカウントを作成**（無料）
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

2. **プロジェクトをインポート**
   - 「Add New」> 「Project」をクリック
   - GitHubリポジトリを選択
   - プロジェクトをインポート

3. **環境変数を設定**
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SCOPES`
   - `SHOPIFY_APP_URL`（Vercelが自動で割り当てるURL）

4. **デプロイ**
   - 「Deploy」をクリック
   - 数分でデプロイ完了
   - 固定URLが自動で割り当てられる（例: `https://your-app.vercel.app`）

5. **shopify.app.tomlを更新**
   ```toml
   application_url = "https://your-app.vercel.app"
   ```

6. **Partnersダッシュボードに反映**
   ```bash
   shopify app deploy --no-release --force
   ```

### データベースの移行

SQLiteからPostgreSQLに移行する必要があります：

1. **Prismaスキーマを更新**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **環境変数を設定**
   - Vercel: RailwayやSupabaseのPostgreSQLを使用
   - Railway: 自動でPostgreSQLが提供される

## 方法2: shopify app devを継続的に実行し続ける（最も簡単）

### 概要

`shopify app dev`を一度起動したら、再起動しないようにします。これが最も簡単で、エラーが出にくい方法です。

### メリット

✅ **設定不要**（何も変更する必要がない）  
✅ **エラーが出にくい**（現在の設定のまま）  
✅ **すぐに使える**（今すぐ実行可能）  
✅ **バグが発生しない**（既存の設定を使用）

### デメリット

⚠️ 再起動するとURLが変わる（再起動しない限り問題なし）  
⚠️ 長時間実行する必要がある

### 使用方法

1. **shopify app devを起動**
   ```bash
   shopify app dev
   ```

2. **再起動しない**
   - ターミナルを閉じない
   - コンピュータをスリープさせない（可能な限り）
   - コードを変更すると自動的にリロードされる

3. **URLが変わった場合のみ**
   - `./update-url-safe.sh` を実行
   - `./update-env-url.sh` を実行
   - `shopify app deploy --no-release --force` を実行
   - アプリを再インストール

### 推奨事項

- 開発中は、`shopify app dev`を継続的に実行し続ける
- 再起動が必要な場合のみ、URLを更新する
- 本番環境では、クラウドホスティングサービスを使用する

## 方法3: ローカル開発環境を改善（中級者向け）

### 概要

ローカル開発環境で直接アクセスする方法ですが、Shopify Adminからはアクセスできないため、**推奨しません**。

## 推奨される選択

### 開発環境の場合

**方法2（shopify app devを継続的に実行）**を推奨します。

**理由**:
- 最も簡単
- エラーが出にくい
- 設定変更が不要
- すぐに使える

### 本番環境の場合

**方法1（クラウドホスティングサービス）**を推奨します。

**理由**:
- 最も安全
- 最も安定している
- 固定URLが保証される
- Shopify公式が推奨

## まとめ

| 方法 | 難易度 | エラー発生率 | 推奨度 |
|------|--------|------------|--------|
| クラウドホスティング | ⭐⭐⭐ | 低 | ⭐⭐⭐⭐⭐ |
| shopify app dev継続実行 | ⭐ | 低 | ⭐⭐⭐⭐ |
| ngrok | ⭐⭐ | 中 | ⭐⭐⭐ |
| Cloudflare Tunnel | ⭐⭐⭐ | 中 | ⭐⭐⭐ |

**最も安全で確実な方法**: クラウドホスティングサービス（Vercel、Railway、Renderなど）

**最も簡単な方法**: shopify app devを継続的に実行し続ける



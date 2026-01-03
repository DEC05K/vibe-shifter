# Cloudflare Tunnelで固定URLを設定する方法（無料プラン）

## 概要

Cloudflare Tunnelの無料プランでも、独自ドメインを使用することで固定URLを設定できます。これにより、`shopify app dev`を再起動してもURLが変わりません。

## 前提条件

1. **独自ドメインが必要**（無料ドメインでも可）
   - Freenom（.tk, .ml, .ga, .cfなど）: 完全無料
   - Namecheap、GoDaddyなど: 年間$1〜$10程度

2. **Cloudflareアカウント**（無料プランでOK）

## 手順

### ステップ1: 独自ドメインを取得（まだ持っていない場合）

#### 無料ドメインを取得する場合

1. **Freenom**（https://www.freenom.com）にアクセス
2. アカウントを作成
3. 希望のドメイン名を検索（例: `your-app-name.tk`）
4. 無料で取得（最大12ヶ月、更新も可能）

#### 有料ドメインを取得する場合

- Namecheap: 年間$1〜$10程度
- GoDaddy: 年間$10〜$20程度

### ステップ2: Cloudflareにドメインを追加

1. **Cloudflareダッシュボード**（https://dash.cloudflare.com）にログイン
2. **「Add a Site」**をクリック
3. 取得したドメインを入力
4. 無料プランを選択
5. Cloudflareのネームサーバーに変更（指示に従う）

### ステップ3: Cloudflare Tunnelで独自ドメインを使用

1. **Cloudflare Zero Trustダッシュボード**（https://one.dash.cloudflare.com）にアクセス
2. **Networks** > **Tunnels** を開く
3. 既存のトンネルを選択、または新規作成
4. **Public Hostname** を設定:
   - **Subdomain**: `app`（任意）
   - **Domain**: 取得した独自ドメイン（例: `your-app-name.tk`）
   - **Service**: `http://localhost:3000`（またはアプリのポート）

### ステップ4: shopify.app.tomlを更新

```toml
application_url = "https://app.your-app-name.tk"
```

### ステップ5: .envファイルを更新

```bash
SHOPIFY_APP_URL=https://app.your-app-name.tk
```

## メリット

- ✅ **完全無料**（独自ドメインも無料で取得可能）
- ✅ **固定URL**（再起動しても変わらない）
- ✅ **安定性**（Cloudflareのインフラを使用）
- ✅ **高速**（CloudflareのCDNを使用）

## デメリット

- ⚠️ 独自ドメインの取得が必要（無料ドメインでも可）
- ⚠️ 初期設定に少し時間がかかる

## 代替案: ngrok（より簡単）

独自ドメインを取得したくない場合、**ngrok**を使用することもできます：

### ngrokのセットアップ

1. **ngrokアカウントを作成**（無料）
   - https://ngrok.com にアクセス
   - アカウントを作成

2. **ngrokをインストール**
   ```bash
   brew install ngrok
   ```

3. **認証トークンを設定**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **固定URLで起動**
   ```bash
   ngrok http 3000 --domain=your-fixed-domain.ngrok-free.app
   ```

5. **shopify.app.tomlを更新**
   ```toml
   application_url = "https://your-fixed-domain.ngrok-free.app"
   ```

## 推奨される解決策

**開発環境の場合**: Cloudflare Tunnel + 独自ドメイン（無料）を推奨します。

**理由**:
- 最も安定している
- 完全無料
- 設定後はメンテナンス不要

## 次のステップ

1. 独自ドメインを取得（Freenomで無料ドメインを取得）
2. Cloudflareにドメインを追加
3. Cloudflare Tunnelで独自ドメインを使用するように設定
4. `shopify.app.toml`と`.env`を更新
5. `shopify app dev`を再起動

これで、URLが固定され、再起動しても変わりません！


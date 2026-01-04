# Cloudflare Tunnel無料版の代替案

## 問題

Cloudflare Tunnelの無料版は、`shopify app dev`を再起動するたびにURLが変わります。これにより、Shopify Admin側が古いURLを返し、エラーが発生します。

## 解決策

### 解決策1: ngrokを使用（推奨・無料で固定URL可能）

ngrokは無料プランでも固定URLを提供します（制限あり）。

#### インストール

```bash
# Homebrewでインストール（macOS）
brew install ngrok

# または、公式サイトからダウンロード
# https://ngrok.com/download
```

#### セットアップ

1. **ngrokアカウントを作成**（無料）
   - https://ngrok.com にアクセス
   - アカウントを作成して、認証トークンを取得

2. **ngrokを認証**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **固定ドメインを取得**（無料プランでも可能）
   ```bash
   # 無料プランでは、ランダムな固定ドメインが利用可能
   ngrok http 3000 --domain=your-fixed-domain.ngrok-free.app
   ```

4. **shopify.app.tomlを更新**
   ```toml
   application_url = "https://your-fixed-domain.ngrok-free.app"
   ```

#### メリット
- 無料プランでも固定URLが利用可能
- 再起動してもURLが変わらない
- 設定が簡単

#### デメリット
- 無料プランには制限がある（接続数、帯域幅など）
- 固定ドメインはランダム（カスタムドメインは有料）

### 解決策2: localtunnelを使用（完全無料）

localtunnelは完全無料で、固定URLを提供します。

#### インストール

```bash
npm install -g localtunnel
```

#### 使用方法

```bash
# 固定サブドメインを指定
lt --port 3000 --subdomain your-app-name
```

#### メリット
- 完全無料
- 固定URLが利用可能
- 設定が簡単

#### デメリット
- サービスが不安定な場合がある
- カスタムドメインは利用不可

### 解決策3: Cloudflare Tunnelの有料プラン

Cloudflare Tunnelの有料プラン（$5/月）では、固定URLが利用可能です。

#### メリット
- 最も安定している
- 固定URLが利用可能
- 高速

#### デメリット
- 有料（月額$5）

### 解決策4: Shopify CLIの自動URL更新機能を活用

`shopify.app.toml`に`automatically_update_urls_on_dev = true`が設定されている場合、Shopify CLIが自動的にURLを更新するはずです。

しかし、この機能が正常に動作していない可能性があります。

#### 確認方法

```bash
shopify app info
```

「Update URLs」が「Not yet configured」と表示されている場合、自動更新が有効になっていません。

### 解決策5: 開発環境を改善（推奨）

開発時は、`shopify app dev`を停止せず、継続的に実行し続けることで、URLの変更を防げます。

#### 方法

1. `shopify app dev`を実行したままにしておく
2. コードを変更すると、自動的にリロードされる
3. URLが変わるのは、プロセスを再起動した時のみ

## 推奨される解決策

**開発環境の場合**: 解決策1（ngrok）または解決策2（localtunnel）を推奨します。

**本番環境の場合**: 解決策3（Cloudflare Tunnel有料プラン）または、VPS/クラウドサーバーを使用することを推奨します。



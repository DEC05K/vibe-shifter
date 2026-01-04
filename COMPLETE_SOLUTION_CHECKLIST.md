# 完全な解決策チェックリスト

## 固定URL設定で解決する可能性

**高い（80-90%）**: 固定URLを設定することで、URLが変わる問題は解決します。

しかし、**他の原因の可能性**もあります。以下を確認してください。

## 確認すべき項目

### 1. Shopify Partnersダッシュボードの設定（重要）

**問題**: Partnersダッシュボードに古いURLが残っている可能性があります。

**確認方法**:
1. https://partners.shopify.com にログイン
2. Apps > delivery-gift-lite > Settings
3. 「App setup」> 「URLs and redirects」を確認
4. Application URLが最新のURLになっているか確認

**解決方法**:
- 固定URLを設定した後、PartnersダッシュボードのURLも更新する
- `shopify app deploy --no-release --force` を実行して設定を同期

### 2. アプリの再インストール（重要）

**問題**: 開発ストアにアプリをインストールした時点のURLが、Shopify側のデータベースに保存されています。

**確認方法**:
- アプリにアクセスして、エラーが表示されるか確認

**解決方法**:
1. Shopify Adminにログイン
2. 設定 > アプリと販売チャネル
3. 「delivery-gift-lite」を探す
4. 「削除」または「アンインストール」をクリック
5. アプリを再インストール

### 3. ブラウザのキャッシュ

**問題**: ブラウザが古いURLをキャッシュしている可能性があります。

**解決方法**:
- ブラウザのキャッシュを完全にクリア
- シークレットモードで試す

### 4. Shopify Admin側のサーバー側キャッシュ

**問題**: Shopify Admin側のサーバーで、アプリのURL情報がキャッシュされています。

**解決方法**:
- アプリを再インストールすることで、キャッシュがクリアされる
- 時間が経つと自動的に更新される場合もある

### 5. 環境変数の設定

**問題**: `.env`ファイルの`SHOPIFY_APP_URL`が古いURLを指している可能性があります。

**確認方法**:
```bash
cat .env | grep SHOPIFY_APP_URL
```

**解決方法**:
- 固定URLを設定した後、`.env`ファイルも更新する

### 6. shopify.app.tomlの設定

**問題**: `shopify.app.toml`の`application_url`が古いURLを指している可能性があります。

**確認方法**:
```bash
grep "application_url" shopify.app.toml
```

**解決方法**:
- 固定URLを設定した後、`shopify.app.toml`も更新する

## 完全な解決手順

### ステップ1: 固定URLを設定（ngrokまたはCloudflare Tunnel）

#### ngrokの場合

```bash
# 1. ngrokをインストール
brew install ngrok

# 2. 認証トークンを設定
ngrok config add-authtoken YOUR_AUTH_TOKEN

# 3. 固定URLで起動
ngrok http 3000 --domain=your-fixed-domain.ngrok-free.app
```

#### Cloudflare Tunnelの場合

1. 独自ドメインを取得（Freenomで無料ドメインを取得）
2. Cloudflareにドメインを追加
3. Cloudflare Tunnelで独自ドメインを使用するように設定

### ステップ2: 設定ファイルを更新

```bash
# shopify.app.toml
application_url = "https://your-fixed-url.com"

# .env
SHOPIFY_APP_URL=https://your-fixed-url.com
```

### ステップ3: Partnersダッシュボードに反映

```bash
shopify app deploy --no-release --force
```

### ステップ4: アプリを再インストール

1. Shopify Adminでアプリをアンインストール
2. アプリを再インストール

### ステップ5: 動作確認

1. ブラウザでアプリにアクセス
2. エラーが表示されないか確認
3. アプリが正常に表示されるか確認

## 他の原因の可能性

### 可能性1: Shopify CLIのバグ

**症状**: `automatically_update_urls_on_dev = true`が設定されているのに、自動更新されない

**解決方法**:
- Shopify CLIを最新バージョンに更新
- 手動でURLを更新する

### 可能性2: ネットワークの問題

**症状**: トンネルが正常に動作していない

**解決方法**:
- トンネルサービスのステータスを確認
- ファイアウォールの設定を確認

### 可能性3: ポートの競合

**症状**: アプリが起動しない、またはエラーが発生する

**解決方法**:
- ポート3000が使用中でないか確認
- 別のポートを使用する

## 推奨される対応順序

1. **まず固定URLを設定**（ngrokまたはCloudflare Tunnel）
2. **設定ファイルを更新**（shopify.app.toml、.env）
3. **Partnersダッシュボードに反映**（shopify app deploy）
4. **アプリを再インストール**（最重要）
5. **動作確認**

この順序で対応すれば、**ほぼ確実に解決**します。

## まとめ

**固定URLを設定することで、80-90%の問題は解決します。**

残りの10-20%は、以下の原因が考えられます：
- Partnersダッシュボードの設定が古い
- アプリの再インストールが必要
- ブラウザのキャッシュ

これらも上記の手順で解決できます。



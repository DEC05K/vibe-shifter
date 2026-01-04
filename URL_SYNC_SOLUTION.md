# URL同期問題の完全解決ガイド

## 問題の原因

1. **`shopify.app.toml`は最新のURLに更新されている**
   - 現在: `https://inquiry-tvs-energy-kong.trycloudflare.com`
   - 自動更新スクリプトが正常に動作しています

2. **Shopify Partnersダッシュボードには古いURLが残っている**
   - 古いURL: `city-ongoing-falls-waters.trycloudflare.com`
   - これが原因で、アプリのページにアクセスするとエラーが発生します

3. **「Update URLs Not yet configured」状態**
   - Shopify CLIの自動URL更新機能が有効になっていません
   - この機能を有効にする方法は、現在のShopify CLIバージョンでは提供されていません

## 解決方法

### 方法1: Shopify Partnersダッシュボードで手動更新（推奨・確実）

**手順:**

1. https://partners.shopify.com にログイン
2. **Apps** > **delivery-gift-lite** を選択
3. **App setup** > **URLs and redirects** に移動
4. **Application URL** を最新のURLに更新:
   ```
   https://inquiry-tvs-energy-kong.trycloudflare.com
   ```
5. **Allowed redirection URLs** に以下を追加（既に存在する場合は更新）:
   ```
   https://inquiry-tvs-energy-kong.trycloudflare.com/auth/callback
   https://inquiry-tvs-energy-kong.trycloudflare.com/auth/shopify/callback
   ```
6. **保存**をクリック

**メリット:**
- 確実に動作する
- 本番環境に影響しない
- 即座に反映される

### 方法2: 自動更新スクリプトを使用（推奨）

最新のURLを取得して、Partnersダッシュボードの更新手順を表示するスクリプトを実行:

```bash
./fix-url-sync.sh
```

このスクリプトは:
- 最新のCloudflare Tunnel URLを取得
- `shopify.app.toml`を更新
- Partnersダッシュボードの更新手順を表示
- URLの動作確認を行う

### 方法3: 直接最新URLにアクセス（一時的な解決策）

アプリのページにアクセスする代わりに、直接最新のURLにアクセス:

```
https://inquiry-tvs-energy-kong.trycloudflare.com
```

**注意:** これは一時的な解決策です。Shopify Adminからアプリにアクセスする場合は、Partnersダッシュボードの設定を更新する必要があります。

## 自動更新の仕組み

### 現在の自動更新システム

1. **`auto-update-url.sh`**: 30秒ごとに`shopify.app.toml`を自動更新
2. **`update-url-safe.sh`**: 安全に`shopify.app.toml`を更新（バックアップ、検証、ロールバック機能付き）

### 今後の改善案

1. **Partnersダッシュボードの自動更新**
   - 現在、Shopify CLIにはPartnersダッシュボードのURLを自動更新する機能がありません
   - 将来的に、Shopify Partner APIを使用して自動更新する機能を追加する可能性があります

2. **固定URLの使用**
   - Cloudflare Tunnelの有料プランを使用して、固定のカスタムドメインを設定
   - これにより、URLの変更による問題を根本的に解決できます

## トラブルシューティング

### エラー: 「サーバーのIPアドレスが見つかりませんでした」

**原因:**
- Shopify Partnersダッシュボードの設定が古いURLのままになっている

**解決方法:**
1. `./fix-url-sync.sh`を実行して最新のURLを確認
2. 方法1（手動更新）を実行してPartnersダッシュボードを更新

### エラー: 「Update URLs Not yet configured」

**原因:**
- Shopify CLIの自動URL更新機能が有効になっていない

**解決方法:**
- この機能は現在のShopify CLIバージョンでは提供されていません
- 手動更新（方法1）を使用してください

### URLが頻繁に変更される

**原因:**
- Cloudflare Tunnelの無料プランでは、起動のたびにURLが変更されます

**解決方法:**
1. `auto-update-url.sh`が実行中であることを確認
2. URLが変更されたら、`./fix-url-sync.sh`を実行してPartnersダッシュボードを更新

## まとめ

**現在の状況:**
- ✅ `shopify.app.toml`は自動更新されている
- ❌ Partnersダッシュボードは手動更新が必要
- ✅ 自動更新スクリプトが動作している

**推奨されるワークフロー:**
1. `shopify app dev`を起動
2. URLが変更されたら、`./fix-url-sync.sh`を実行
3. 表示された手順に従って、Partnersダッシュボードを手動更新
4. アプリにアクセスして動作確認

**今後の改善:**
- Partnersダッシュボードの自動更新機能の実装を検討
- 固定URLの使用を検討（Cloudflare Tunnel有料プラン）



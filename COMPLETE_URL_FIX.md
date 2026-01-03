# 完全なURL問題解決ガイド

## 現在の問題

新しいバージョン（delivery-gift-lite-5）がActiveになっているにもかかわらず、まだ古いURL（city-ongoing-falls-waters.trycloudflare.com）が表示される。

## 根本原因

1. **開発ストア側のセッション情報**
   - 開発ストアにアプリをインストールした時点のURLがセッションに保存されている
   - バージョンを更新しても、既存のセッション情報は更新されない

2. **ブラウザのキャッシュ**
   - Shopify Adminが古いURLをキャッシュしている
   - Cookieに古いURL情報が保存されている

3. **環境変数の未設定**
   - `SHOPIFY_APP_URL`環境変数が設定されていない可能性

## 完全な解決手順

### ステップ1: ブラウザのキャッシュを完全にクリア

1. **Chrome/Edgeの場合:**
   - `Ctrl+Shift+Delete` (Mac: `Cmd+Shift+Delete`)
   - 「キャッシュされた画像とファイル」をチェック
   - 「Cookieとその他のサイトデータ」をチェック
   - 「時間範囲」を「全期間」に設定
   - 「データを削除」をクリック

2. **Firefoxの場合:**
   - `Ctrl+Shift+Delete` (Mac: `Cmd+Shift+Delete`)
   - 「キャッシュ」と「Cookie」をチェック
   - 「時間範囲」を「すべて」に設定
   - 「今すぐ消去」をクリック

### ステップ2: 開発ストアでアプリを再インストール（最重要）

これが最も確実な解決方法です：

1. **Shopify Adminにログイン**
   ```
   https://admin.shopify.com/store/gift-app-test-01
   ```

2. **アプリをアンインストール**
   - 設定 > アプリと販売チャネル
   - 「delivery-gift-lite」を探す
   - 「削除」または「アンインストール」をクリック

3. **アプリを再インストール**
   - Partnersダッシュボードからアプリを再インストール
   - または、直接URLにアクセス:
     ```
     https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite
     ```
   - インストール時に、最新のURL設定が使用されます

### ステップ3: 環境変数を設定（オプション）

`.env`ファイルに最新のURLを設定：

```bash
SHOPIFY_APP_URL=https://inquiry-tvs-energy-kong.trycloudflare.com
```

### ステップ4: シークレットモードで確認

1. 新しいシークレット/プライベートウィンドウを開く
2. 以下にアクセス:
   ```
   https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite
   ```

### ステップ5: 直接最新URLにアクセス

ブラウザで直接最新URLにアクセスして、セッションをリセット：

```
https://inquiry-tvs-energy-kong.trycloudflare.com
```

## 確認方法

解決後、以下を確認：

1. **Partnersダッシュボード**
   - delivery-gift-lite-5がActiveになっている
   - App URLが最新のURLになっている

2. **Shopify Admin**
   - アプリにアクセスできる
   - エラーが表示されない
   - 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示される

## なぜこれが必要なのか

- **バージョン更新 ≠ セッション更新**: バージョンを更新しても、既存のセッション情報は自動的に更新されません
- **開発ストア側の設定**: アプリをインストールした時点のURLが開発ストア側に保存されています
- **キャッシュ**: ブラウザやShopify Adminが古いURLをキャッシュしている可能性があります

## 今後の予防策

1. **URLが変更されたら、アプリを再インストール**
   - これが最も確実な方法です

2. **自動更新スクリプトを改善**
   - URLが変更されたら、自動的に再インストールを促すスクリプトを作成

3. **固定URLの使用を検討**
   - Cloudflare Tunnelの有料プランを使用して、固定のカスタムドメインを設定


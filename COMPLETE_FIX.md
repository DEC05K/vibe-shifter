# 古いURLが毎回表示される問題の完全解決ガイド

## 問題の根本原因

「毎回毎回古いURLが出る」問題の根本原因は以下です：

1. **Cloudflare TunnelのURLが起動のたびに変わる**
   - 無料プランでは、`shopify app dev`を起動するたびに新しいURLが生成されます
   - 古いURLは即座に無効になります

2. **開発ストア側のセッション情報に古いURLが保存されている**
   - アプリをインストールした時点のURLがセッション情報として保存されます
   - バージョンを更新しても、既存のセッション情報は更新されません

3. **データベースのセッション情報に古いURLが保存されている**
   - ローカルのSQLiteデータベース（`prisma/dev.sqlite`）に古いURLが保存されている可能性があります

4. **ブラウザのキャッシュに古いURLが残っている**
   - Shopify Adminが古いURLをキャッシュしている
   - Cookieに古いURL情報が保存されている

## 完全な解決手順

### ステップ1: データベースのセッション情報をクリア

```bash
./clear-sessions.sh
```

または、手動でデータベースを削除：

```bash
rm prisma/dev.sqlite prisma/dev.sqlite-journal
```

### ステップ2: ブラウザのキャッシュを完全にクリア

1. **Chrome/Edgeの場合:**
   - `Ctrl+Shift+Delete` (Mac: `Cmd+Shift+Delete`)
   - 「キャッシュされた画像とファイル」をチェック
   - 「Cookieとその他のサイトデータ」をチェック
   - 「時間範囲」を「全期間」に設定
   - 「データを削除」をクリック

2. **Shopify AdminのCookieを個別に削除:**
   - ブラウザの設定 > プライバシーとセキュリティ > Cookieとその他のサイトデータ
   - 「すべてのCookieとサイトデータを表示」をクリック
   - `admin.shopify.com`と`partners.shopify.com`のCookieを削除

### ステップ3: 開発ストアでアプリを完全にアンインストール

1. **Shopify Adminにログイン**
   ```
   https://admin.shopify.com/store/gift-app-test-01
   ```

2. **アプリをアンインストール**
   - 設定 > アプリと販売チャネル
   - 「delivery-gift-lite」を探す
   - 「削除」または「アンインストール」をクリック
   - 確認ダイアログで「削除」を確認

### ステップ4: シークレットモードでアプリを再インストール

1. **新しいシークレット/プライベートウィンドウを開く**
   - Chrome: `Ctrl+Shift+N` (Mac: `Cmd+Shift+N`)
   - Firefox: `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)

2. **直接アプリのURLにアクセス**
   ```
   https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite
   ```

3. **インストールを確認**
   - アプリのインストール画面が表示されます
   - 「インストール」または「Install」ボタンをクリック
   - 権限を承認

### ステップ5: 動作確認

1. **アプリが正常に表示されることを確認**
   - 「Free Plan」バッジが表示される
   - 「Upgrade to PRO」ボタンが表示される
   - エラーが表示されない

2. **URLを確認**
   - ブラウザのアドレスバーで、最新のURLが使用されていることを確認
   - 現在の最新URL: `https://forest-cafe-spice-magnificent.trycloudflare.com`

## なぜ毎回古いURLが出るのか

### 原因1: Cloudflare Tunnelの仕様

- Cloudflare Tunnelの無料プランでは、起動のたびに新しいURLが生成されます
- 古いURLは即座に無効になります
- これはCloudflare Tunnelの仕様であり、変更できません

### 原因2: セッション情報の永続化

- アプリをインストールした時点のURLが、開発ストア側のセッション情報として保存されます
- バージョンを更新しても、既存のセッション情報は自動的に更新されません
- そのため、古いURLが残り続けます

### 原因3: ブラウザのキャッシュ

- Shopify Adminが古いURLをキャッシュしている
- Cookieに古いURL情報が保存されている
- そのため、ブラウザを閉じても古いURLが残り続けます

## 根本的な解決策

### オプション1: 固定URLを使用（推奨）

Cloudflare Tunnelの有料プランを使用して、固定のカスタムドメインを設定：

1. Cloudflare Tunnelの有料プランに登録
2. カスタムドメインを設定
3. 固定URLを使用してアプリを設定

これにより、URLが変わる問題を根本的に解決できます。

### オプション2: 自動再インストールスクリプト

URLが変更されたら、自動的にアプリを再インストールするスクリプトを作成：

```bash
# URLが変更されたら、開発ストアでアプリを再インストール
# （実装は複雑なため、手動での再インストールを推奨）
```

### オプション3: 開発環境のクリーンアップ

定期的に開発環境をクリーンアップ：

```bash
# データベースを削除
rm prisma/dev.sqlite prisma/dev.sqlite-journal

# ブラウザのキャッシュをクリア
# （手動で実行）

# アプリを再インストール
# （手動で実行）
```

## 現在の最新URL

```
https://forest-cafe-spice-magnificent.trycloudflare.com
```

このURLを使用して、アプリを再インストールしてください。

## まとめ

「毎回毎回古いURLが出る」問題は、Cloudflare Tunnelの仕様とセッション情報の永続化が原因です。

**即座に解決する方法:**
1. データベースのセッション情報をクリア
2. ブラウザのキャッシュを完全にクリア
3. 開発ストアでアプリを完全にアンインストール
4. シークレットモードで再インストール

**根本的な解決策:**
- 固定URLを使用（Cloudflare Tunnel有料プラン）
- または、URLが変更されたら毎回再インストール


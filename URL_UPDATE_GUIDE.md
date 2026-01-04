# URL自動更新ガイド

## 概要

Shopify CLIの開発環境では、Cloudflare TunnelのURLが起動のたびに変わるため、`shopify.app.toml`のURLを手動で更新する必要があります。

このガイドでは、安全にURLを自動更新する方法を説明します。

## 安全な自動更新スクリプト

`update-url-safe.sh`スクリプトを使用すると、以下の安全機能が有効になります：

### 安全機能

1. **自動バックアップ**: 更新前に`shopify.app.toml`をバックアップ
2. **検証**: 更新後のURLが正しいか検証
3. **ロールバック**: エラーが発生した場合、自動的にバックアップから復元
4. **重複チェック**: URLが既に最新の場合は更新をスキップ

### 使用方法

```bash
./update-url-safe.sh
```

### 実行例

```bash
$ ./update-url-safe.sh
📦 バックアップを作成中...
✅ バックアップ作成完了: .shopify-backups/shopify.app.toml.20260103_193927
🔍 最新のURLを取得中...
✅ 最新のURL: https://interstate-graphical-societies-concern.trycloudflare.com
🔄 URLを更新中...
   現在: https://old-url.trycloudflare.com
   最新: https://interstate-graphical-societies-concern.trycloudflare.com
✅ shopify.app.tomlを安全に更新しました
```

### バックアップからの復元

エラーが発生した場合、以下のコマンドでバックアップから復元できます：

```bash
cp .shopify-backups/shopify.app.toml.20260103_193927 shopify.app.toml
```

## 自動実行の設定（オプション）

`shopify app dev`を起動した後に自動的にURLを更新したい場合、以下の方法があります：

### 方法1: 手動で実行

`shopify app dev`を起動した後、別のターミナルで：

```bash
./update-url-safe.sh
```

### 方法2: 定期的にチェック（推奨）

`watch`コマンドを使用して、定期的にURLをチェック：

```bash
watch -n 30 ./update-url-safe.sh
```

これで30秒ごとにURLをチェックし、変更があれば自動更新します。

## トラブルシューティング

### エラー: Cloudflare Tunnel URLが見つかりません

`shopify app dev`が実行中であることを確認してください。

### エラー: URLの更新に失敗しました

スクリプトが自動的にバックアップから復元します。問題が続く場合は、手動で復元してください。

### 設定がリセットされる

`shopify app config pull`を実行すると、Shopify Partnersダッシュボードの古い設定で`shopify.app.toml`が上書きされます。このコマンドは使用しないでください。

## 注意事項

- このスクリプトは`shopify.app.toml`のみを更新します
- Shopify Partnersダッシュボードの設定は手動で更新する必要があります
- バックアップは`.shopify-backups/`ディレクトリに保存されます（gitignoreに追加済み）



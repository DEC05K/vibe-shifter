# 自動更新を完全に停止する方法

## 原因

`auto-update-url.sh`スクリプトがバックグラウンドで実行され続けているため、`application_url`が自動更新され続けていました。

## 解決方法

### ステップ1: バックグラウンドプロセスを停止

以下のコマンドで、`auto-update-url.sh`を停止します：

```bash
pkill -f "auto-update-url.sh"
```

### ステップ2: shopify.app.tomlを確認

`application_url`が正しい値（VercelのURL）に設定されているか確認します：

```toml
application_url = "https://v0-vibe-shifter.vercel.app"
```

### ステップ3: 実行中のプロセスを確認

以下のコマンドで、自動更新スクリプトが実行されていないか確認します：

```bash
ps aux | grep -i "auto-update\|update-url" | grep -v grep
```

何も表示されなければ、自動更新は停止しています。

## 今後の対策

### auto-update-url.shを無効化

`auto-update-url.sh`を削除するか、名前を変更して実行されないようにします：

```bash
# 削除する場合
rm auto-update-url.sh

# または、名前を変更して無効化
mv auto-update-url.sh auto-update-url.sh.disabled
```

### shopify.app.tomlを保護

`application_url`を固定URLに設定し、変更されないようにします：

```toml
application_url = "https://v0-vibe-shifter.vercel.app"
```

### shopify app devを停止（Vercelを使用している場合）

Vercelにデプロイしている場合、`shopify app dev`を実行する必要はありません。

`shopify app dev`を停止するには：

```bash
# shopify app devを実行しているターミナルで Ctrl+C を押す
# または、プロセスを強制終了
pkill -f "shopify app dev"
```

## 確認方法

1. **自動更新スクリプトが実行されていないか確認**
   ```bash
   ps aux | grep -i "auto-update\|update-url" | grep -v grep
   ```

2. **shopify.app.tomlのapplication_urlを確認**
   ```bash
   grep "application_url" shopify.app.toml
   ```

3. **ファイルが変更されていないか監視**
   ```bash
   # 5秒ごとにapplication_urlを確認
   watch -n 5 'grep "application_url" shopify.app.toml'
   ```

## まとめ

- ✅ `auto-update-url.sh`を停止
- ✅ `shopify.app.toml`の`application_url`をVercelのURLに設定
- ✅ `shopify app dev`を停止（Vercelを使用している場合）
- ✅ 自動更新スクリプトを削除または無効化

これで、`application_url`が自動更新されることはなくなります。


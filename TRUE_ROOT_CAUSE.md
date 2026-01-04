# 真の根本原因

## 重要な発見

### 現在の状態

- **Activeなバージョン**: `delivery-gift-lite-12`（2026-01-03 14:45:39作成）
- **新しいバージョン**: 17, 16, 15, 14, 13が作成されているが、**すべてinactive**

### 問題の本質

**Shopify Adminが表示するURLは、Activeなバージョンの情報から取得されます。**

- 新しいバージョンを作成しても、それをActiveにしない限り、古いバージョンが使用され続けます
- 古いバージョン（delivery-gift-lite-12）に古いURL（`verified-mailto-scoop-filled.trycloudflare.com`）が保存されている
- そのため、いくらPartnersダッシュボードの設定を更新しても、アプリを再インストールしても、古いURLが表示され続ける

## 私の以前の説明の問題点

以前、私は「Shopify Adminはアプリのインストール時にURLを保存し、再インストールしない限り更新されない」と説明しましたが、**これは間違っていました**。

実際には：

1. **アプリのバージョン情報**にURLが保存されている
2. **Activeなバージョン**の情報が使用される
3. 新しいバージョンを作成しても、それをActiveにしない限り、古いバージョンが使用され続ける

## 解決方法

### ステップ1: 新しいバージョンをデプロイ

```bash
cd /Users/hakkow_h/delivery-gift-lite
shopify app deploy --no-release --force
```

このコマンドで、`shopify.app.toml`の内容（VercelのURL）を含む新しいバージョンが作成されます。

### ステップ2: 新しいバージョンをActiveにする（最重要）

```bash
shopify app release
```

**これが最も重要です。** このコマンドで、最新のバージョンがActiveになります。

### ステップ3: バージョンを確認

```bash
shopify app versions list
```

最新のバージョンが`★ active`になっていることを確認してください。

### ステップ4: Vercelの環境変数を確認

Vercelダッシュボードで、`SHOPIFY_APP_URL`が`https://v0-vibe-shifter.vercel.app`になっているか確認してください。

### ステップ5: Partnersダッシュボードの設定を確認

Partnersダッシュボードで、実際に設定が保存されているか確認してください。

## まとめ

**真の原因：**

- Activeなバージョン（delivery-gift-lite-12）に古いURLが保存されている
- 新しいバージョンを作成しても、Activeにしない限り、古いバージョンが使用され続ける

**解決方法：**

1. ✅ `shopify app dev clean`を実行（完了）
2. ✅ `shopify app deploy --no-release --force`で新しいバージョンをデプロイ
3. ✅ **`shopify app release`で新しいバージョンをActiveにする（最重要）**
4. ✅ Vercelの環境変数を確認
5. ✅ Partnersダッシュボードの設定を確認

これで、古いURLが表示される問題は解決するはずです。



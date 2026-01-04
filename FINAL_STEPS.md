# 最終ステップ：新しいバージョンをActiveにする

## ✅ 実施した作業

1. **新しいバージョンをデプロイ**
   - `shopify app deploy --no-release --force`を実行
   - 新しいバージョン `delivery-gift-lite-19` が作成されました

2. **新しいバージョンをActiveにする**
   - `shopify app release --version=delivery-gift-lite-19 --force`を実行
   - バージョンがリリースされました ✅

## 次のステップ

### ステップ1: バージョンを確認

```bash
shopify app versions list
```

`delivery-gift-lite-19`が`★ active`になっていることを確認してください。

### ステップ2: Vercelの環境変数を確認

Vercelダッシュボードで、`SHOPIFY_APP_URL`が`https://v0-vibe-shifter.vercel.app`になっているか確認してください。

### ステップ3: Partnersダッシュボードの設定を確認

Partnersダッシュボードで、実際に設定が保存されているか確認してください。

### ステップ4: アプリページで動作確認

1. **シークレットモードでアプリページにアクセス**
   - https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite にアクセス

2. **エラーが表示されないか確認**
   - 「サーバーの IP アドレスが見つかりませんでした」というエラーが表示されないことを確認

3. **アプリが正常に表示されるか確認**
   - 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されることを確認

## まとめ

✅ 新しいバージョン（delivery-gift-lite-19）をデプロイ
✅ 新しいバージョンをActiveにする
✅ バージョンを確認
✅ Vercelの環境変数を確認
✅ Partnersダッシュボードの設定を確認
✅ アプリページで動作確認

これで、古いURLが表示される問題は解決するはずです！



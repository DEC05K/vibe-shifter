# サーバー側ログの確認方法

## 確認手順

### ステップ1: `shopify app dev`を実行しているターミナルウィンドウを開く

`shopify app dev`を実行しているターミナルウィンドウを確認してください。

### ステップ2: ブラウザでアプリにアクセス

ブラウザで以下のURLにアクセスしてください：
```
https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite
```

### ステップ3: ターミナルに表示されるログを確認

以下のログが表示されるか確認してください：

#### 期待されるログ（正常な場合）

```
🔍 entry.server.tsx リクエスト受信: { hostname: 'verified-mailto-scoop-filled.trycloudflare.com', pathname: '/app' }
✅ サーバー側リダイレクト不要
🔍 root.tsx loader実行: { requestHost: 'verified-mailto-scoop-filled.trycloudflare.com', latestUrl: 'https://verified-mailto-scoop-filled.trycloudflare.com', hasLatestUrl: true }
```

#### 古いURLでリクエストが来た場合

```
🔍 entry.server.tsx リクエスト受信: { hostname: 'forest-cafe-spice-magnificent.trycloudflare.com', pathname: '/app' }
🔄 サーバー側リダイレクト実行
```

#### ログが全く表示されない場合

- リクエストがサーバーに到達していない
- 古いURLでCloudflare Tunnelレベルで接続拒否されている可能性が高い

## 次のステップ

### ログが表示されている場合

1. ログの内容を共有してください
2. 特に、`hostname`が古いURLか最新URLかを確認してください

### ログが表示されていない場合

1. **Networkタブを確認**してください（次のステップ2）
2. 古いURLでCloudflare Tunnelレベルで接続拒否されている可能性が高いです
3. アプリを再インストールする必要があるかもしれません

## 補足情報

- サーバー側のログは、`shopify app dev`を実行しているターミナルに直接出力されます
- ログファイルには保存されません
- ブラウザでアプリにアクセスした時に、リアルタイムでログが表示されます


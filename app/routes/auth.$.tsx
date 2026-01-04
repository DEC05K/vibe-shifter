import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // 認証フロー（ログイン開始、コールバック処理、iframe脱出など）をすべて自動処理
    // ※ 処理が必要な場合、内部で自動的にリダイレクト(Response)が throw されます
    await authenticate.admin(request);

    // すべて正常に完了した場合
    return null;
  } catch (error) {
    // Responseオブジェクト（リダイレクト）は正常な動作なので、そのまま通過させる
    if (error instanceof Response) {
      // デバッグ: リダイレクト先をログに残す（ループしていないか確認するため）
      const location = error.headers.get("Location");
      const status = error.status;
      console.log(`[Auth] Handling redirect (${status}) to: ${location}`);
      throw error;
    }

    // 本当のエラー（DB接続失敗や設定ミスなど）のみログに出力
    console.error("❌ Auth Route Critical Error:", error);
    throw error;
  }
};
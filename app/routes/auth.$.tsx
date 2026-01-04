import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  console.log("=== OAuth Callback Handler ===");
  console.log("Request URL:", url.toString());
  console.log("Pathname:", url.pathname);
  console.log("Search params:", url.searchParams.toString());
  
  try {
    console.log("Step 1: Calling authenticate.admin(request)...");
    const result = await authenticate.admin(request);
    console.log("✅ Authentication successful");
    console.log("Result:", result ? "Session exists" : "No session");
    
    // 認証が成功した場合、リダイレクトが必要な場合はリダイレクトを返す
    // ただし、リダイレクトループを防ぐため、現在のURLを確認
    const currentPath = url.pathname;
    if (currentPath.includes("/auth/callback")) {
      console.log("OAuth callback completed. Redirecting to app...");
      // 認証が完了したら、アプリのルートにリダイレクト
      // ただし、リダイレクトループを防ぐため、Responseオブジェクトを返すのではなく、
      // authenticate.admin()が返すリダイレクトを使用
    }
    
    return null;
  } catch (error) {
    console.error("❌ OAuth callback error:", error);
    
    // Responseオブジェクト（リダイレクト）の場合は、そのまま再スロー
    if (error instanceof Response) {
      const redirectUrl = error.headers.get("Location");
      console.log("Redirecting to:", redirectUrl);
      throw error;
    }
    
    // その他のエラーの場合、詳細をログに記録
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    // エラーを再スローして、Shopifyの認証フローに任せる
    throw error;
  }
};
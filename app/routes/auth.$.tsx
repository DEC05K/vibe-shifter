import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Token Exchange (New Embedded Auth Strategy) を使用する場合、
  // 認証フローは自動的に処理されるため、シンプルに認証を実行するだけ
  // リダイレクトが必要な場合は、authenticate.admin() が自動的に Response を throw します
  await authenticate.admin(request);
  return null;
};
import { type LoaderFunctionArgs } from "@remix-run/node";
import { login } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const apiKey = process.env.SHOPIFY_API_KEY;

  if (shop && apiKey) {
    const installUrl = `https://${shop}/admin/oauth/install?client_id=${apiKey}`;
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Redirecting...</title></head>
        <body>
          <script>
            if (window.top) { window.top.location.href = "${installUrl}"; }
            else { window.location.href = "${installUrl}"; }
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
  return await login(request);
};


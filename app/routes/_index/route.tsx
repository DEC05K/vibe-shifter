import { type LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { login } from "../../shopify.server"; // ※パスが変わるため ../../ になる可能性があります

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    try {
      const shop = url.searchParams.get("shop");
      const apiKey = process.env.SHOPIFY_API_KEY;

      if (shop && apiKey) {
        const installUrl = `https://${shop}/admin/oauth/install?client_id=${apiKey}`;

        return new Response(
          `<!DOCTYPE html>
          <html>
            <head>
              <title>Redirecting...</title>
            </head>
            <body>
              <script>
                if (window.top) {
                  window.top.location.href = "${installUrl}";
                } else {
                  window.location.href = "${installUrl}";
                }
              </script>
              <p>Redirecting to installation...</p>
            </body>
          </html>`,
          {
            headers: { "Content-Type": "text/html" },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return redirect("/app");
};

export default function Index() {
  return null;
}
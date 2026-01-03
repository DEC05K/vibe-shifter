import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { login } from "../../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  // もしURLに ?shop=... があればログイン処理へ
  if (url.searchParams.get("shop")) {
    throw await login(request);
  }
  return json({ showForm: true });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  return await login(request);
};

export default function Index() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Delivery Gift Lite
        </h1>
        <p
          style={{
            marginBottom: "30px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          ショップドメインを入力してログインしてください。
        </p>

        <Form method="post">
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="shop"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Shop domain
            </label>
            <input
              id="shop"
              name="shop"
              type="text"
              required
              autoComplete="on"
              placeholder="my-shop.myshopify.com"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
            <p
              style={{
                marginTop: "4px",
                marginBottom: 0,
                fontSize: "12px",
                color: "#666",
              }}
            >
              e.g: my-shop.myshopify.com
            </p>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              color: "white",
              backgroundColor: "#008060",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#006e52";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#008060";
            }}
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const prisma = new PrismaClient();
  let status = "pending";
  let error = null;
  let count = 0;
  let dbUrlInfo = "Checking...";

  try {
    // 環境変数の確認（パスワードは隠す）
    const url = process.env.DATABASE_URL || "";
    dbUrlInfo = url.replace(/:([^:@]+)@/, ":****@");

    // 強制的に接続テスト
    await prisma.$connect();
    
    // 単純なクエリ実行
    count = await prisma.session.count();
    
    status = "success";
    await prisma.$disconnect();
  } catch (e: any) {
    status = "error";
    error = {
      message: e.message,
      code: e.code,
      meta: e.meta,
      name: e.name,
    };
    console.error("DEBUG PAGE ERROR:", e);
  }

  return json({ status, count, error, dbUrlInfo });
};

export default function Debug() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h1>Database Connection Debugger</h1>
      <div style={{ 
        padding: "15px", 
        backgroundColor: data.status === "success" ? "#d4edda" : "#f8d7da",
        border: "1px solid #ccc",
        borderRadius: "5px"
      }}>
        <h2>Status: {data.status.toUpperCase()}</h2>
        <p><strong>Current Database URL:</strong> {data.dbUrlInfo}</p>
        
        {data.status === "success" && (
          <p>✅ Connection Successful! Session Count: {data.count}</p>
        )}

        {data.status === "error" && (
          <div>
            <h3>❌ Error Details:</h3>
            <pre style={{ background: "#eee", padding: "10px", overflowX: "scroll" }}>
              {JSON.stringify(data.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
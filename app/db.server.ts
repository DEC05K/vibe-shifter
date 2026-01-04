import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Vercel（サーバーレス環境）では、接続プーリングの問題を避けるため、新しいインスタンスを作成
const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient({
        log: ["error"],
      })
    : global.prismaGlobal ??
      (global.prismaGlobal = new PrismaClient({
        log: ["query", "error", "warn"],
      }));

export default prisma;

import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // ← ../ に直しました
import db from "../db.server"; // ← ../ に直しました

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (!admin) {
    return new Response();
  }

  if (topic === "APP_UNINSTALLED") {
    if (session) {
      await db.session.deleteMany({ where: { shop } });
    }
  }

  return new Response();
};
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // ← ../ に直しました

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop, admin } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  return new Response();
};
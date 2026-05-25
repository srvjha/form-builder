import type { Request, Response } from "express";
import { Webhook } from "svix";
import { logger } from "@repo/logger";
import UserService from "@repo/services/user";
import { env } from "../env";

const userService = new UserService();

// Clerk sends these fields on user.created and user.updated events
interface ClerkUserPayload {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  email_addresses: Array<{ id: string; email_address: string }>;
  primary_email_address_id: string;
}

function buildFullName(first: string | null, last: string | null): string | null {
  return [first, last].filter(Boolean).join(" ") || null;
}

export async function handleClerkWebhook(req: Request, res: Response): Promise<void> {
  // svix requires the raw request body (Buffer), not the parsed JSON.
  // That's why this route uses express.raw() in server.ts — before express.json().
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({ error: "Missing svix headers" });
    return;
  }

  if (!env.CLERK_WEBHOOK_SECRET) {
    logger.error("CLERK_WEBHOOK_SECRET is not set — cannot verify webhook");
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: { type: string; data: ClerkUserPayload };

  try {
    event = wh.verify(req.body as string, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event;
  } catch (err) {
    logger.error("Clerk webhook signature verification failed", { error: err });
    res.status(400).json({ error: "Webhook verification failed" });
    return;
  }

  const { type, data } = event;
  logger.info("Clerk webhook received", { type, clerkId: data.id });

  try {
    if (type === "user.created" || type === "user.updated") {
      const primaryEmail = data.email_addresses.find(
        (e) => e.id === data.primary_email_address_id,
      );

      if (!primaryEmail) {
        logger.error("No primary email found in Clerk payload", { clerkId: data.id });
        res.status(400).json({ error: "No primary email in payload" });
        return;
      }

      await userService.upsertUser({
        clerkId: data.id,
        fullName: buildFullName(data.first_name, data.last_name),
        email: primaryEmail.email_address,
        profileImageUrl: data.image_url,
      });

      logger.info(`User ${type === "user.created" ? "created" : "updated"} in DB`, {
        clerkId: data.id,
      });
    }

    if (type === "user.deleted") {
      await userService.deleteUserByClerkId(data.id);
      logger.info("User deleted from DB", { clerkId: data.id });
    }

    res.json({ received: true });
  } catch (err) {
    logger.error("Clerk webhook handler error", { type, error: err });
    res.status(500).json({ error: "Internal server error" });
  }
}

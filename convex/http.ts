import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/whatsapp-webhook",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const verifyToken = process.env.META_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified successfully");
      return new Response(challenge, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    console.log("Webhook verification failed");
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }),
});

http.route({
  path: "/whatsapp-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      console.log("Received webhook:", JSON.stringify(body, null, 2));

      if (body.object !== "whatsapp_business_account") {
        return new Response("Not a WhatsApp event", { status: 400 });
      }

      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            const value = change.value;

            if (value.messages) {
              for (const message of value.messages) {
                const fromPhone = message.from;
                const messageId = message.id;
                const messageType = message.type;

                let content = "";
                let mediaUrl;
                let metadata = {};

                switch (messageType) {
                  case "text":
                    content = message.text?.body || "";
                    break;
                  case "image":
                    content = message.image?.caption || "[Image]";
                    mediaUrl = message.image?.id;
                    metadata = {
                      mimeType: message.image?.mime_type,
                    };
                    break;
                  case "audio":
                    content = "[Audio]";
                    mediaUrl = message.audio?.id;
                    metadata = {
                      mimeType: message.audio?.mime_type,
                    };
                    break;
                  case "video":
                    content = message.video?.caption || "[Video]";
                    mediaUrl = message.video?.id;
                    metadata = {
                      mimeType: message.video?.mime_type,
                    };
                    break;
                  case "document":
                    content = message.document?.filename || "[Document]";
                    mediaUrl = message.document?.id;
                    metadata = {
                      mimeType: message.document?.mime_type,
                      fileName: message.document?.filename,
                    };
                    break;
                  case "location":
                    content = "[Location]";
                    metadata = {
                      latitude: message.location?.latitude,
                      longitude: message.location?.longitude,
                    };
                    break;
                  default:
                    content = `[Unsupported message type: ${messageType}]`;
                }

                console.log("Processing message:", {
                  fromPhone,
                  messageId,
                  messageType,
                  content,
                });

                try {
                  await ctx.runMutation(api.whatsapp.handleWebhookMessage, {
                    storeId: "demo_store_123" as any,
                    fromPhone,
                    messageId,
                    messageType: messageType as any,
                    content,
                    mediaUrl,
                    metadata,
                  });
                  console.log("Message saved to database");
                } catch (error) {
                  console.error("Error saving message:", error);
                }
              }
            }

            if (value.statuses) {
              for (const status of value.statuses) {
                console.log("Message status update:", {
                  messageId: status.id,
                  status: status.status,
                  timestamp: status.timestamp,
                });
              }
            }
          }
        }
      }

      return new Response("EVENT_RECEIVED", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  }),
});

export default http;

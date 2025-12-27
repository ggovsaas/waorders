# Convex Backend Documentation

This directory contains all Convex backend logic for the wcommerce-creator application.

## File Structure

```
convex/
├── schema.ts              # Database schema definitions
├── auth.config.js        # Clerk authentication configuration
├── http.ts               # HTTP endpoints (webhooks)
├── whatsapp.ts          # WhatsApp business logic
├── automation.ts        # Automation workflow management
└── _generated/          # Auto-generated types (do not edit)
```

## Database Schema

### Tables

- **stores** - Store/merchant information
- **products** - Product catalog
- **orders** - Customer orders
- **conversations** - Customer conversations across channels
- **messages** - Individual messages in conversations
- **whatsappConfig** - WhatsApp API configuration per store
- **automationWorkflows** - Enabled automation workflows

## HTTP Endpoints

### WhatsApp Webhook

**Endpoint:** `https://your-deployment.convex.cloud/whatsapp-webhook`

#### GET - Webhook Verification

Used by Meta to verify your webhook URL.

**Query Parameters:**
- `hub.mode` - Should be "subscribe"
- `hub.verify_token` - Must match `META_VERIFY_TOKEN` env var
- `hub.challenge` - String to echo back

**Response:** Plain text challenge string

#### POST - Webhook Events

Receives incoming WhatsApp messages and status updates.

**Supported Events:**
- Incoming messages (text, image, audio, video, document, location)
- Message status updates (sent, delivered, read, failed)

**Processing Flow:**
1. Validate webhook payload
2. Extract message data
3. Call `whatsapp.handleWebhookMessage` mutation
4. Store message in database
5. Create or update conversation
6. Return "EVENT_RECEIVED" response

## Mutations

### whatsapp.handleWebhookMessage

Processes incoming WhatsApp messages and creates/updates conversations.

**Arguments:**
```typescript
{
  storeId: Id<"stores">,
  fromPhone: string,
  messageId: string,
  messageType: "text" | "image" | "audio" | "video" | "document" | "location",
  content: string,
  mediaUrl?: string,
  metadata?: any
}
```

**Returns:**
```typescript
{
  conversationId: Id<"conversations">,
  messageId: Id<"messages">,
  isNew: boolean
}
```

### whatsapp.sendMessage

Sends a message to a customer via WhatsApp.

**Arguments:**
```typescript
{
  conversationId: Id<"conversations">,
  storeId: Id<"stores">,
  senderId: string,
  content: string,
  messageType?: "text" | "image" | "audio" | "video" | "document" | "location"
}
```

### automation.toggleWorkflow

Enables or disables an automation workflow.

**Arguments:**
```typescript
{
  storeId: Id<"stores">,
  workflowType: string,
  enabled: boolean
}
```

## Queries

### whatsapp.getConversations

Fetches conversations for a store, optionally filtered by channel.

**Arguments:**
```typescript
{
  storeId: Id<"stores">,
  channelType?: "whatsapp" | "instagram" | "google" | "pos" | "web"
}
```

### whatsapp.getMessages

Fetches all messages for a specific conversation.

**Arguments:**
```typescript
{
  conversationId: Id<"conversations">
}
```

### automation.getWorkflows

Fetches all automation workflows for a store.

**Arguments:**
```typescript
{
  storeId: Id<"stores">
}
```

## Environment Variables

Required in your Convex deployment:

```env
# Clerk JWT Issuer (from Clerk Dashboard)
CLERK_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev

# Meta WhatsApp Verify Token (you create this)
META_VERIFY_TOKEN=your_secret_token_here
```

## Development Workflow

### 1. Start Development Server

```bash
npx convex dev
```

This will:
- Push your schema to Convex
- Generate TypeScript types
- Watch for changes and auto-deploy
- Provide real-time logs

### 2. Test Mutations Locally

Use the Convex dashboard or run queries directly:

```typescript
// In your React app
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function MyComponent() {
  const sendMessage = useMutation(api.whatsapp.sendMessage);

  const handleSend = async () => {
    await sendMessage({
      conversationId: "...",
      storeId: "...",
      senderId: "...",
      content: "Hello!"
    });
  };
}
```

### 3. View Logs

Open your Convex dashboard and go to "Logs" to see real-time execution logs.

### 4. Deploy to Production

```bash
npx convex deploy
```

## Important Notes

### Store ID Resolution

**Current Implementation:**
The webhook handler uses a hardcoded `storeId` (`"demo_store_123"`).

**Production TODO:**
You need to implement store ID resolution based on:
- The WhatsApp phone number receiving the message
- Query `whatsappConfig` table to find the matching store
- Use that store's ID when calling `handleWebhookMessage`

Example:
```typescript
const config = await ctx.runQuery(api.whatsapp.getWhatsAppConfig, {
  phoneNumberId: value.metadata.phone_number_id
});
const storeId = config.storeId;
```

### Security

1. **Verify Token:** Keep `META_VERIFY_TOKEN` secret
2. **Webhook Signature:** In production, verify the `X-Hub-Signature-256` header
3. **HTTPS Only:** Convex provides HTTPS by default
4. **Rate Limiting:** Handle webhook bursts gracefully

### Error Handling

The webhook handler catches and logs errors but doesn't fail the entire webhook if one message fails to process. This ensures Meta continues sending events.

## Troubleshooting

### "Function not found" errors

Run `npx convex dev` to regenerate types and push schema changes.

### Webhook verification fails

1. Check `META_VERIFY_TOKEN` matches exactly
2. Ensure Convex deployment is running
3. Verify webhook URL has no trailing slash

### Messages not appearing in database

1. Check Convex logs for errors
2. Verify `handleWebhookMessage` mutation is working
3. Ensure store and tables exist in database

## Testing

### Test Webhook Verification

```bash
curl "https://your-deployment.convex.cloud/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test123"
```

Expected response: `test123`

### Send Test Message

Use Meta's Webhooks testing tool in your app dashboard to send a test event.

## Next Steps

1. Implement dynamic store ID resolution
2. Add webhook signature verification
3. Implement media download for images/videos
4. Add message reply functionality
5. Set up automation workflow triggers
6. Implement rate limiting and retry logic

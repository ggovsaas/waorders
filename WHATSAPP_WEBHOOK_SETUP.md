# WhatsApp Webhook Setup Guide

This guide will help you configure the WhatsApp webhook to receive messages and status updates in your application.

## Prerequisites

- A Meta Business Account
- A WhatsApp Business API number
- Your Convex deployment URL
- A verify token (you create this yourself)

---

## Part 1: Configure Environment Variables

### 1. Create Your Verify Token

Create a random string to use as your verify token. This can be anything you want (e.g., `my_secret_verify_token_12345`).

Add it to your `.env` file:

```env
META_VERIFY_TOKEN=your_secret_verify_token_here
```

**Important:** This token is used to verify that webhook requests are coming from Meta. Keep it secret!

### 2. Deploy to Convex

Make sure your Convex deployment is up and running:

```bash
npx convex dev
```

Or for production:

```bash
npx convex deploy
```

---

## Part 2: Get Your Webhook URL

### 1. Find Your Convex Deployment URL

Your webhook URL will be:

```
https://your-project.convex.cloud/whatsapp-webhook
```

Replace `your-project.convex.cloud` with your actual Convex deployment URL from your Convex dashboard.

### 2. Copy the Full Webhook URL

Example:
```
https://happy-animal-123.convex.cloud/whatsapp-webhook
```

---

## Part 3: Configure Meta Webhook

### 1. Access Meta Business Settings

1. Go to [https://business.facebook.com](https://business.facebook.com)
2. Select your Business Account
3. Click "WhatsApp Accounts" in the left sidebar
4. Select your WhatsApp Business Account

### 2. Navigate to Webhook Configuration

1. In the WhatsApp Account settings, go to "Configuration" → "Webhooks"
2. Click "Edit" or "Configure webhooks"

### 3. Configure the Webhook

**Callback URL:**
```
https://your-project.convex.cloud/whatsapp-webhook
```

**Verify Token:**
```
your_secret_verify_token_here
```
(This must match exactly what you set in `META_VERIFY_TOKEN` in your `.env` file)

### 4. Subscribe to Webhook Fields

Select the following webhook fields to subscribe to:
- ✅ **messages** - Required for receiving customer messages
- ✅ **message_status** - Optional but recommended for delivery status updates

### 5. Click "Verify and Save"

Meta will send a GET request to your webhook URL to verify it. If configured correctly, you should see:
- ✅ Verification successful

If verification fails, check:
- Is your Convex deployment running?
- Does your `META_VERIFY_TOKEN` match exactly?
- Is the webhook URL correct?

---

## Part 4: Test Your Webhook

### 1. Send a Test Message

1. Use your WhatsApp Business API test number
2. Send a message to your business number from a customer's phone
3. Check your Convex logs to see if the message was received

### 2. Check Convex Logs

In your Convex dashboard:
1. Go to "Logs"
2. Look for entries like:
   ```
   Received webhook: {...}
   Processing message: {...}
   ```

### 3. Verify Message Storage

1. Go to your Convex dashboard → "Data" → "messages" table
2. You should see the incoming message stored there

---

## Webhook Event Types

Your webhook handler processes these event types:

### Incoming Messages

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "messages",
      "value": {
        "messages": [{
          "from": "1234567890",
          "id": "wamid.XXX==",
          "type": "text",
          "text": {
            "body": "Hello!"
          }
        }]
      }
    }]
  }]
}
```

**Supported Message Types:**
- `text` - Plain text messages
- `image` - Images with optional caption
- `audio` - Audio messages
- `video` - Video messages with optional caption
- `document` - Document files
- `location` - Location sharing

### Message Status Updates

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "messages",
      "value": {
        "statuses": [{
          "id": "wamid.XXX==",
          "status": "delivered",
          "timestamp": "1234567890"
        }]
      }
    }]
  }]
}
```

**Status Types:**
- `sent` - Message sent to WhatsApp servers
- `delivered` - Message delivered to recipient's phone
- `read` - Message read by recipient
- `failed` - Message delivery failed

---

## Troubleshooting

### Webhook Verification Fails

**Error: "The callback URL or verify token couldn't be validated"**

**Solutions:**
1. Check your `META_VERIFY_TOKEN` in `.env` matches exactly what you entered in Meta
2. Make sure your Convex deployment is running (`npx convex dev` or `npx convex deploy`)
3. Verify the webhook URL is correct (no trailing slash)
4. Check Convex logs for any errors

### Messages Not Being Received

**Symptoms:** Webhook verified successfully, but messages don't appear in your app

**Solutions:**
1. Check Convex logs to see if webhook requests are coming in
2. Verify you subscribed to the "messages" field in Meta webhook settings
3. Check that your WhatsApp Business API number is active
4. Ensure you're sending messages to the correct business number

### 403 Forbidden Response

**Cause:** Verify token mismatch

**Solution:**
1. Double-check `META_VERIFY_TOKEN` in your `.env` file
2. Redeploy to Convex: `npx convex deploy`
3. Try webhook verification again in Meta

### 500 Internal Server Error

**Cause:** Error in webhook processing logic

**Solution:**
1. Check Convex logs for detailed error messages
2. Verify your Convex schema includes all required tables
3. Make sure you've run `npx convex dev` to push your schema

---

## Security Best Practices

### 1. Keep Your Verify Token Secret

Never commit your `META_VERIFY_TOKEN` to Git. Always use environment variables.

### 2. Validate Webhook Signatures (Advanced)

For production, you should verify the `X-Hub-Signature-256` header to ensure requests are actually from Meta.

Add this to your webhook handler:

```typescript
const signature = request.headers.get("X-Hub-Signature-256");
// Implement signature verification
```

### 3. Use HTTPS Only

Convex provides HTTPS by default. Never use HTTP for webhook URLs.

### 4. Rate Limiting

Meta may send many webhook events. Ensure your handler can process them efficiently.

---

## Meta Developer Portal Links

- **Webhooks Documentation:** https://developers.facebook.com/docs/graph-api/webhooks
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Webhook Testing:** https://developers.facebook.com/apps/YOUR_APP_ID/webhooks

---

## Next Steps

Once your webhook is working:

1. Integrate message processing with your `convex/whatsapp.ts` mutations
2. Update the `POST` handler to call `handleWebhookMessage` mutation
3. Set up message status tracking for delivery confirmations
4. Implement two-way messaging to reply to customers
5. Add media download handling for images/videos/documents

---

## Quick Reference

```env
# .env file
META_VERIFY_TOKEN=your_secret_token
VITE_CONVEX_URL=https://your-project.convex.cloud
```

```
Webhook URL: https://your-project.convex.cloud/whatsapp-webhook
Verify Token: your_secret_token
Subscribe to: messages, message_status
```

---

## Support

If you need help:
- **Meta Support:** https://business.facebook.com/business/help
- **Convex Docs:** https://docs.convex.dev
- **WhatsApp API Docs:** https://developers.facebook.com/docs/whatsapp

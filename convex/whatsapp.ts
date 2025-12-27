import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const handleWebhookMessage = mutation({
  args: {
    storeId: v.id("stores"),
    fromPhone: v.string(),
    messageId: v.string(),
    messageType: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("audio"),
      v.literal("video"),
      v.literal("document"),
      v.literal("location")
    ),
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existingMessage = await ctx.db
      .query("messages")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.messageId))
      .first();

    if (existingMessage) {
      return { conversationId: existingMessage.conversationId, isNew: false };
    }

    let conversation = await ctx.db
      .query("conversations")
      .withIndex("by_customer", (q) =>
        q.eq("storeId", args.storeId).eq("customerId", args.fromPhone)
      )
      .filter((q) => q.eq(q.field("channel_type"), "whatsapp"))
      .first();

    if (!conversation) {
      conversation = {
        _id: await ctx.db.insert("conversations", {
          storeId: args.storeId,
          customerId: args.fromPhone,
          customerPhone: args.fromPhone,
          channel_type: "whatsapp",
          lastMessage: args.content,
          lastMessageAt: Date.now(),
          unreadCount: 1,
          status: "active",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
      } as any;
    } else {
      await ctx.db.patch(conversation._id, {
        lastMessage: args.content,
        lastMessageAt: Date.now(),
        unreadCount: (conversation.unreadCount || 0) + 1,
        updatedAt: Date.now(),
      });
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId: conversation._id,
      storeId: args.storeId,
      senderId: args.fromPhone,
      senderType: "customer",
      messageType: args.messageType,
      content: args.content,
      mediaUrl: args.mediaUrl,
      metadata: args.metadata,
      externalId: args.messageId,
      status: "delivered",
      createdAt: Date.now(),
    });

    return { conversationId: conversation._id, messageId, isNew: true };
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    storeId: v.id("stores"),
    senderId: v.string(),
    content: v.string(),
    messageType: v.optional(
      v.union(
        v.literal("text"),
        v.literal("image"),
        v.literal("audio"),
        v.literal("video"),
        v.literal("document"),
        v.literal("location")
      )
    ),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      storeId: args.storeId,
      senderId: args.senderId,
      senderType: "agent",
      messageType: args.messageType || "text",
      content: args.content,
      status: "sent",
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageAt: Date.now(),
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const getConversations = query({
  args: {
    storeId: v.id("stores"),
    channelType: v.optional(
      v.union(
        v.literal("whatsapp"),
        v.literal("instagram"),
        v.literal("google"),
        v.literal("pos"),
        v.literal("web")
      )
    ),
  },
  handler: async (ctx, args) => {
    let conversationsQuery = ctx.db
      .query("conversations")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId));

    const conversations = await conversationsQuery.collect();

    const filtered = args.channelType
      ? conversations.filter((c) => c.channel_type === args.channelType)
      : conversations;

    return filtered.sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const markConversationAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      unreadCount: 0,
      updatedAt: Date.now(),
    });
  },
});

export const saveWhatsAppConfig = mutation({
  args: {
    storeId: v.id("stores"),
    phoneNumberId: v.string(),
    accessToken: v.string(),
    verifyToken: v.string(),
  },
  handler: async (ctx, args) => {
    const existingConfig = await ctx.db
      .query("whatsappConfig")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .first();

    if (existingConfig) {
      await ctx.db.patch(existingConfig._id, {
        phoneNumberId: args.phoneNumberId,
        accessToken: args.accessToken,
        verifyToken: args.verifyToken,
        isActive: true,
        updatedAt: Date.now(),
      });
      return existingConfig._id;
    } else {
      return await ctx.db.insert("whatsappConfig", {
        storeId: args.storeId,
        phoneNumberId: args.phoneNumberId,
        accessToken: args.accessToken,
        verifyToken: args.verifyToken,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const getWhatsAppConfig = query({
  args: {
    storeId: v.id("stores"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("whatsappConfig")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .first();
  },
});

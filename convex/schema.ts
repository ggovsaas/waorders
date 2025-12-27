import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stores: defineTable({
    name: v.string(),
    ownerId: v.string(),
    domain: v.optional(v.string()),
    industry: v.optional(v.string()),
    currency: v.optional(v.string()),
    timezone: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    sku: v.optional(v.string()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    stock: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_category", ["storeId", "category"]),

  orders: defineTable({
    storeId: v.id("stores"),
    customerId: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("refunded")
    ),
    paymentMethod: v.optional(v.string()),
    shippingAddress: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.optional(v.string()),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_status", ["storeId", "status"])
    .index("by_customer", ["customerId"]),

  conversations: defineTable({
    storeId: v.id("stores"),
    customerId: v.string(),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    channel_type: v.union(
      v.literal("whatsapp"),
      v.literal("instagram"),
      v.literal("google"),
      v.literal("pos"),
      v.literal("web")
    ),
    lastMessage: v.optional(v.string()),
    lastMessageAt: v.optional(v.number()),
    unreadCount: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("resolved"),
      v.literal("archived")
    ),
    assignedTo: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_channel", ["storeId", "channel_type"])
    .index("by_customer", ["storeId", "customerId"])
    .index("by_last_message", ["storeId", "lastMessageAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    storeId: v.id("stores"),
    senderId: v.string(),
    senderType: v.union(v.literal("customer"), v.literal("agent"), v.literal("bot")),
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
    metadata: v.optional(
      v.object({
        mimeType: v.optional(v.string()),
        fileName: v.optional(v.string()),
        fileSize: v.optional(v.number()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
      })
    ),
    externalId: v.optional(v.string()),
    status: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("read"),
      v.literal("failed")
    ),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_store", ["storeId", "createdAt"])
    .index("by_external_id", ["externalId"]),

  whatsappConfig: defineTable({
    storeId: v.id("stores"),
    phoneNumberId: v.string(),
    accessToken: v.string(),
    verifyToken: v.string(),
    businessAccountId: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_store", ["storeId"]),
});

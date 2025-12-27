// src/api/whatsapp-webhook.js

// This function is designed to run as a Vercel/Node.js serverless function
// that is registered as the Webhook URL in the Meta Business Manager.

// Replace with your actual Supabase client initialization
// const { createClient } = require('@supabase/supabase-js');
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

    // --- 1. META WEBHOOK VERIFICATION (GET request) ---
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('Webhook Verified Successfully.');
                return res.status(200).send(challenge);
            } else {
                // Not authorized: Invalid token
                return res.status(403).send('Verification failed or token mismatch.');
            }
        }
        return res.status(400).send('Bad Request: Missing hub.mode or hub.verify_token.');
    }

    // --- 2. INCOMING MESSAGE HANDLING (POST request) ---
    if (req.method === 'POST') {
        const body = req.body;

        // Always respond with 200 OK immediately to Meta, even before processing,
        // to prevent Meta from retrying the webhook.
        res.status(200).send('EVENT_RECEIVED');

        // Check if the body contains actual message data
        if (!body || !body.entry || !body.entry[0] || !body.entry[0].changes || !body.entry[0].changes[0]) {
            console.warn('Received webhook event with no content.');
            return;
        }

        try {
            const messageData = body.entry[0].changes[0].value.messages?.[0];
            const metaBusinessId = body.entry[0].id; // Used to identify the account/store

            if (messageData && messageData.type === 'text') {
                const customerPhone = messageData.from;
                const messageText = messageData.text.body;

                // --- PLACEHOLDER: Data Extraction and Store Identification ---
                // In a production setup, the store_id would be looked up using the 
                // Meta Business ID (metaBusinessId) associated with the phone number.
                const storeId = "LOOKUP_STORE_ID_USING_META_BUSINESS_ID";

                console.log(`[Message] Store: ${storeId}, From: ${customerPhone}, Text: "${messageText}"`);

                // --- CORE LOGIC: Find/Create Conversation and User ---
                /*
                // 1. Find or create the customer (user) in the 'users' table.
                // 2. Find the current open conversation in the 'conversations' table 
                //    using store_id and user_id. If none exists, create a new one.
                const { data: conversation } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('store_id', storeId)
                    .eq('user_id', userId)
                    .eq('status', 'open') // Only deal with active chats
                    .single();
                */

                // --- ROUTING LOGIC: Chatbot vs. Human ---
                /*
                if (conversation.chatbot_active) {
                    // Chatbot is active: Process the message through the Libromi-style flow builder
                    console.log("Routing to Chatbot Engine...");
                    // await processMessageThroughFlows(storeId, messageText, conversation);
                } else {
                    // Chatbot is inactive: Message is for the human staff in the Team Inbox
                    console.log("Routing to Human Inbox (Real-time update)...");
                    // await saveMessageToDatabase(conversation.id, messageText, 'customer');
                    // This will trigger the real-time update via Supabase for the staff members (Comet)
                }
                */

            } else {
                console.log('Received non-text message or unhandled event type.');
            }

        } catch (error) {
            console.error('Error processing WhatsApp webhook:', error);
            // Crucially, we still return 200 OK above, so Meta does not retry the bad payload.
        }

        return;
    }

    // Default for unhandled methods
    res.status(405).send('Method Not Allowed');
}

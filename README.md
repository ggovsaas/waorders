# waorders.com - Merchant Dashboard

A React-based merchant dashboard for managing WhatsApp-based e-commerce stores, built with Supabase backend.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) Google Gemini API key for AI product descriptions

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key (optional)
```

3. Set up Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase-schema.sql`

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
wcommerce-creator/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx          # Navigation sidebar
│   ├── pages/
│   │   └── StoreSetup.jsx       # Store onboarding form
│   ├── utils/
│   │   └── aiProductDescription.js  # Gemini AI integration
│   ├── supabaseClient.js        # Supabase client initialization
│   ├── App.jsx                  # Main app component with routing
│   └── main.jsx                 # App entry point
├── supabase-schema.sql          # Database schema
└── .env.example                 # Environment variables template
```

## 🗄️ Database Schema

The application uses three main tables:

1. **stores** - Merchant/business configuration
2. **products** - Product catalog
3. **orders** - Order management

See `supabase-schema.sql` for the complete schema with RLS policies.

## 🔐 Authentication

Currently uses a placeholder UUID for `owner_id`. Full Supabase Auth integration is pending.

## 🛠️ Features

- ✅ Store creation and onboarding
- ✅ Supabase integration
- ✅ Tailwind CSS styling
- ✅ React Router navigation
- ✅ AI product description generation (Gemini API)

## 📝 Next Steps

- Implement full Supabase Auth
- Add product management UI
- Integrate WhatsApp API
- Build order management system
- Add analytics dashboard

## 🏷️ Branding

This project is branded as **waorders.com**

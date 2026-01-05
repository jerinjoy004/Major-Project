# 🚀 Quick Setup Guide

## Step 1: Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and wait for it to initialize

2. **Run the Database Schema**
   - In your Supabase dashboard, go to "SQL Editor"
   - Click "New Query"
   - Copy the entire contents of `supabase/schema.sql`
   - Paste and click "Run"
   - You should see "Success. No rows returned"

3. **Get Your API Credentials**
   - Go to Settings > API
   - Copy your "Project URL"
   - Copy your "anon public" key

## Step 2: Configure Environment

1. **Create `.env.local` file** in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=optional-for-now
```

Replace the values with your actual Supabase credentials.

## Step 3: Start the App

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Step 4: Test It Out

1. **Create an Account**
   - Click "Sign Up"
   - Enter email, password, and username
   - Click "Sign Up"

2. **Explore the Store**
   - Use WASD or Arrow keys to move
   - Walk near products to highlight them
   - Click products to view details
   - Add items to cart
   - Walk to the green checkout counter

3. **Test Multi-User** (Optional)
   - Open another browser window in incognito mode
   - Create a different account
   - See both avatars in the same store!
   - Try chatting between them

## 🎯 Next Steps

- Customize products in the database
- Modify store layout in `src/lib/game/Store.ts`
- Add sprite sheets for better avatar graphics
- Integrate OpenAI API for advanced AI features

## ⚠️ Troubleshooting

**"Missing Supabase environment variables"**
- Make sure `.env.local` exists and has the correct values
- Restart the dev server after creating `.env.local`

**Products not showing**
- Check that the SQL schema ran successfully
- Verify sample products were inserted

**Can't see other users**
- Make sure both users are logged in
- Check browser console for errors
- Verify Supabase Realtime is enabled in your project

**Build errors**
- Run `npm install` again
- Delete `node_modules` and run `npm install`

## 📞 Need Help?

Check the full README.md for detailed documentation!

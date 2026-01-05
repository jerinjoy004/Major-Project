# Virtual Shopping Store - 2D Gamified Shopping Platform

A revolutionary 2D virtual shopping experience where users enter as avatars, walk around a virtual store, interact with products, chat with other shoppers in real-time, and receive AI-powered recommendations.

## 🎮 Features

- **Avatar-Based Shopping**: Walk around as a human-like 2D avatar with smooth animations
- **Real-Time Multi-User**: See other shoppers, their movements, and chat with them live
- **Interactive Products**: Click on products to view details and add to cart
- **AI Recommendations**: Get smart product suggestions based on your browsing behavior
- **AI Shopping Assistant**: Chat with an AI assistant for product help and recommendations
- **Live Chat**: Text chat with other shoppers in the store
- **Shopping Cart**: Full cart management with quantity controls
- **Checkout Flow**: Complete purchases at the checkout counter

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Game Engine**: Custom HTML5 Canvas 2D engine
- **Backend**: Supabase (Database, Auth, Realtime, Storage)
- **State Management**: Zustand
- **Styling**: Vanilla CSS with CSS Modules
- **Routing**: React Router v6

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- (Optional) OpenAI API key for advanced AI features

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key (optional)
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🎯 How to Use

1. **Sign Up/Login**: Create an account or sign in
2. **Enter the Store**: You'll spawn as an avatar in the virtual store
3. **Move Around**: Use WASD or Arrow keys to walk around
4. **Browse Products**: Walk near products to see them highlight
5. **View Products**: Click on highlighted products to see details
6. **Add to Cart**: Add items to your shopping cart
7. **Chat**: Use the chat panel to talk with other shoppers
8. **Get Recommendations**: Check the recommendation panel for AI suggestions
9. **AI Assistant**: Click the AI Assistant button for shopping help
10. **Checkout**: Walk to the green checkout counter to complete your purchase

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── ProductModal.tsx
│   ├── CartPanel.tsx
│   ├── ChatPanel.tsx
│   ├── HUD.tsx
│   ├── CheckoutModal.tsx
│   ├── AIAssistant.tsx
│   └── RecommendationPanel.tsx
├── lib/
│   ├── game/           # Game engine
│   │   ├── GameEngine.ts
│   │   ├── Camera.ts
│   │   ├── InputManager.ts
│   │   ├── Store.ts
│   │   ├── StoreRenderer.ts
│   │   └── entities/   # Game entities
│   ├── realtime/       # Real-time features
│   │   ├── PresenceManager.ts
│   │   └── ChatManager.ts
│   ├── supabase/       # Supabase client
│   ├── store/          # State management
│   └── auth/           # Authentication
├── pages/              # Page components
│   ├── LoginPage.tsx
│   └── StorePage.tsx
└── App.tsx             # Main app component

supabase/
└── schema.sql          # Database schema
```

## 🎨 Customization

### Adding Products

Products are defined in the database. You can add more by inserting into the `products` table:

```sql
INSERT INTO products (name, description, price, category, position_x, position_y)
VALUES ('Product Name', 'Description', 99.99, 'Category', 200, 150);
```

### Modifying Store Layout

Edit `src/lib/game/Store.ts` to change:
- Store dimensions
- Shelf positions
- Walkable areas
- Checkout counter location

### Customizing Avatars

Avatar rendering is in `src/lib/game/entities/Avatar.ts`. You can:
- Change colors
- Add sprite sheets
- Modify animations

## 🔧 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- AI features use rule-based logic by default (integrate OpenAI API for advanced features)
- Avatar sprites are simple shapes (can be replaced with actual sprite sheets)
- Mobile support is limited (desktop experience recommended)

## 🎓 Learning Resources

This project demonstrates:
- Custom 2D game engine with Canvas API
- Real-time multi-user synchronization
- State management in complex applications
- Supabase integration (Auth, Database, Realtime)
- TypeScript best practices

Enjoy your virtual shopping experience! 🛍️

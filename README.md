# Nutri-Guru 🥗

A comprehensive nutrition guidance application powered by AI, designed to help users make informed dietary choices and maintain healthy eating habits.

## Features

### User Features
- **Personalized Nutrition Tracking** - Track daily calorie and nutrient intake
- **AI-Powered Meal Planning** - Get customized meal recommendations
- **Health Goal Setting** - Set and monitor nutrition and fitness goals
- **Interactive Dashboard** - User-friendly interface with visual progress tracking

### Admin Features
- **User Management** - Monitor and manage user accounts and activities
- **Content Management** - Manage recipes, nutrition database, and meal plans
- **Analytics Dashboard** - Real-time statistics and user behavior insights
- **AI Model Configuration** - Fine-tune AI recommendations and responses

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **RESTful API** architecture
- **Environment Variables** for secure configuration
- **Gemini AI API** integration for intelligent nutrition advice

### Frontend
- **Vanilla HTML/CSS/JavaScript** for lightweight performance
- **Tailwind CSS** for modern, responsive styling
- **Component-based architecture** with separate user and admin interfaces
- **Progressive Web App** features

### Project Structure
```
nutri-guru/
├── backend/
│   ├── controllers/        # Request handlers and business logic
│   ├── routes/            # API route definitions
│   ├── models/            # Data models and database schemas
│   ├── utils/             # Utility functions and helpers
│   ├── services/          # External service integrations
│   ├── .env              # Environment variables (Gemini API Key)
│   ├── server.js         # Express server configuration
│   └── package.json      # Backend dependencies
│
├── frontend/
│   ├── public/           # Main landing page and shared assets
│   │   ├── assets/
│   │   │   ├── gifs/     # Animated graphics
│   │   │   └── bitmojis/ # Character illustrations
│   │   └── index.html    # Main entry point
│   │
│   ├── user/             # User dashboard and features
│   │   ├── index.html    # User dashboard
│   │   ├── style.css     # User-specific styles
│   │   └── script.js     # User dashboard functionality
│   │
│   ├── admin/            # Admin panel and management tools
│   │   ├── dashboard.html # Admin dashboard
│   │   ├── style.css     # Admin-specific styles
│   │   └── script.js     # Admin panel functionality
│   │
│   └── tailwind.config.js # Tailwind CSS configuration
│
├── README.md             # Project documentation
└── .gitignore           # Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AJ1312/Nutri-Baba.git
   cd Nutri-Baba
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main App: http://localhost:3000
   - User Dashboard: http://localhost:3000/user
   - Admin Panel: http://localhost:3000/admin

## API Endpoints

### Health Check
- `GET /api/health` - Server status and health check

### User Endpoints (Coming Soon)
- `GET /api/user/profile` - Get user profile
- `POST /api/user/nutrition` - Log nutrition data
- `GET /api/user/recommendations` - Get AI recommendations

### Admin Endpoints (Coming Soon)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/content` - Manage content

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/AJ1312/Nutri-Baba](https://github.com/AJ1312/Nutri-Baba)

---

**Nutri-Guru** - Empowering healthier lifestyle choices through intelligent nutrition guidance. 🌱

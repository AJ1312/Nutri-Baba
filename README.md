# 🥗 Nutri Baba - Modern Nutrition Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A beautiful, interactive nutrition dashboard that makes healthy living fun and engaging! Nutri Baba combines modern design with delightful animations to create an exceptional user experience for tracking your nutrition journey.

## ✨ Features

### 🏠 **Interactive Dashboard**
- **Personal Greeting**: Warm welcome with user stats and streak tracking
- **Quick Actions Grid**: Easy access to core features (Scan Food, Meal Planner, Ask Expert, Track Progress)
- **Health Advice**: Daily personalized nutrition tips and recommendations
- **Animated Character**: Interactive emoji character that responds to clicks with flowing animations

### 🎨 **Visual Design**
- **Modern Blue Gradient Theme**: Beautiful color scheme with `#0ea5e9`, `#0284c7`, and `#0369a1`
- **Responsive Layout**: Seamlessly adapts to all screen sizes
- **Clean Typography**: Inter font family for excellent readability
- **Smooth Animations**: Delightful micro-interactions throughout

### 🎭 **Interactive Elements**

#### Dashboard Character
- **Auto-changing Emojis**: Cycles through 6 different expressions every 10 seconds
- **Click Interactions**: Changes emoji and triggers flowing animation
- **Hover Effects**: Shows motivational messages
- **Flowing Emoji Burst**: 5-12 themed emojis flow across the screen on click

#### Fun Facts Sidebar
- **Colorful Cards**: 5 vibrant gradient cards with nutrition facts
- **Educational Content**: Interesting facts about apples, carrots, dairy, broccoli, and spicy foods
- **Hover Animations**: Cards lift and glow on interaction

### 📊 **Core Functionality**

#### 📸 Food Photo Analysis
- **Drag & Drop Upload**: Easy image upload interface
- **Instant Analysis**: Get nutrition information from food photos
- **Detailed Results**: Calories, protein, carbs, and fat breakdown

#### 📅 Weekly Meal Planner
- **Personalized Plans**: Based on your goals and dietary preferences
- **Diet Types**: Balanced, Vegetarian, Vegan, Ketogenic options
- **Calorie Customization**: Adjustable daily calorie targets (1200-3000)
- **Weekly Navigation**: Easy day-by-day meal planning

#### 💬 Expert Consultation
- **Live Chat**: Connect with certified nutritionists
- **Expert Profiles**: Browse available nutrition professionals
- **Real-time Messaging**: Instant communication system

#### 📈 Progress Tracking
- **Visual Charts**: Weekly calorie and macronutrient tracking
- **Achievement System**: Gamified progress with badges and rewards
- **Streak Tracking**: Monitor consistency and build healthy habits

### 🎯 **User Experience**

#### Navigation
- **Sidebar Menu**: Clean, intuitive navigation
- **Search Functionality**: Quick find for foods and recipes
- **Notifications**: Stay updated with important alerts
- **User Profile**: Personalized user information display

#### Accessibility
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility support
- **High Contrast**: Excellent color contrast ratios
- **Mobile Optimized**: Touch-friendly interface design

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AJ1312/Nutri-Baba.git
   cd Nutri-Baba
   ```

2. **Start local server**
   ```bash
   # Using Python 3
   cd Frontend/User
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000/modern-dashboard.html
   ```

## 📁 Project Structure

```
Nutri-Baba/
├── Frontend/
│   └── User/
│       ├── modern-dashboard.html    # Main dashboard page
│       ├── modern-dashboard.css     # Styling and animations
│       └── modern-dashboard.js      # Interactive functionality
├── LICENSE                          # MIT License
└── README.md                       # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0ea5e9` (Sky Blue 500)
- **Primary Blue Dark**: `#0284c7` (Sky Blue 600)
- **Primary Blue Darker**: `#0369a1` (Sky Blue 700)
- **Success Green**: `#10b981` (Emerald 500)
- **Warning Orange**: `#f59e0b` (Amber 500)
- **Error Red**: `#ef4444` (Red 500)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive Scaling**: Fluid typography system

### Animations
- **Bounce Effects**: Character and card interactions
- **Flowing Emojis**: Physics-based animation system
- **Smooth Transitions**: 0.3s cubic-bezier easing
- **Hover States**: Subtle lift and glow effects

## 🛠️ Technical Features

### Performance
- **Optimized Assets**: Compressed images and efficient code
- **Lazy Loading**: Content loaded on demand
- **Debounced Search**: Prevents excessive API calls
- **Memory Management**: Automatic cleanup of animations

### Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### JavaScript Features
- **ES6+ Syntax**: Modern JavaScript features
- **Class-based Architecture**: Organized, maintainable code
- **Event Delegation**: Efficient event handling
- **Animation API**: Smooth, hardware-accelerated animations

## 🎮 Interactive Features

### Dashboard Character Interactions
```javascript
// Click the character to see flowing emojis
// Hover for motivational messages
// Automatic emoji changes every 10 seconds
```

### Emoji Categories
- **✨ Effects**: Stars, sparkles, celebrations
- **🥗 Healthy Foods**: Fruits, vegetables, nutritious meals
- **💪 Motivation**: Strength, fire, rockets, achievements

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow existing code style and structure
2. Test animations across different browsers
3. Ensure responsive design works on all devices
4. Add comments for complex animations or interactions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Font Awesome** - Icons
- **Google Fonts** - Inter typography
- **Twemoji** - Emoji graphics
- **Modern CSS** - Animation techniques

## 📞 Contact

- **GitHub**: [@AJ1312](https://github.com/AJ1312)
- **Project Link**: [https://github.com/AJ1312/Nutri-Baba](https://github.com/AJ1312/Nutri-Baba)

---

<div align="center">
  <strong>Made with ❤️ for a healthier world</strong>
  <br>
  <em>Nutri Baba - Where nutrition meets innovation!</em>
</div>

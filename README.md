# 🧠 Brainrot Clicker

An absurd incremental clicker game inspired by viral AI meme phenomena. Features characters based on popular TikTok AI-generated memes. Click your way through evolution stages while building an empire of caffeine-powered generators!

## 🎮 Game Overview

Brainrot Clicker is a browser-based incremental/idle game where you:
- Click to earn **Brainrot Points (BP)**
- Purchase generators that automatically earn BP over time
- Buy upgrades to increase your clicking power and generator efficiency
- Build up **click intensity** for temporary bonuses
- **Evolve through 5 meme-inspired characters**
- Watch your character's world crumble with special brick-breaking effects!

## 🌟 Key Features

### 🎯 Core Gameplay
- **Manual Clicking**: Earn BP by clicking the main character
- **Auto-Generation**: Purchase generators that work while you're away
- **Progressive Upgrades**: Unlock powerful multipliers and bonuses
- **Click Intensity System**: Build momentum for temporary generator boosts

### 🎭 Character Evolution
Progress through 5 characters based on viral AI memes:
1. **[Ballerina Cappuccina](https://knowyourmeme.com/memes/ballerina-cappuccina-italian-brainrot)** - Coffee cup ballerina from viral TikTok AI memes
2. **[Bombardiro Crocodilo](https://knowyourmeme.com/memes/bombardiro-crocodilo-italian-brainrot)** - Flying crocodile bomber plane hybrid
3. **Tung Tung Tung Sahur** - Indonesian brainrot character (crossover with Italian memes)
4. **[Trippi Troppi/Trulimero Trulichina](https://knowyourmeme.com/memes/trippi-troppi-trulimero-trulichina-italian-brainrot)** - Fish-bear hybrid with sigma energy
5. **[Brr Brr Patapim](https://knowyourmeme.com/memes/brr-brr-patapim)** - Tree-monkey hybrid with large feet and mysterious hat

### 🎨 Visual Effects
- **Dynamic intensity meter** with color-coded levels (CHILL → WARM → HOT → FEVER → BRAINROT!)
- **Circular generator orbit** around the main character
- **Particle effects** and floating damage numbers
- **Brick-breaking animations** during intense clicking
- **Special effect waves** for golden opportunities and frenzy modes

### 🔄 Advanced Systems
- **Evolution Progress Tracking** - Fill the meter to unlock new characters
- **Persistent Save System** - Your progress is automatically saved
- **Reset Functionality** - Start fresh anytime
- **Responsive Design** - Works on desktop and mobile

## 🚀 How to Play

### Getting Started
1. **Enter the pin code**: `123456` to access the game
2. **Click the character** in the center to earn your first Brainrot Points
3. **Buy your first generator** from the shop on the left
4. **Watch the Auto BP/sec** counter increase as generators work automatically
5. **Keep clicking** to build intensity and boost generator efficiency

### Progression Strategy
1. **Balance clicking and generators** - clicking builds intensity, generators provide steady income
2. **Buy upgrades** when available to multiply your earnings
3. **Watch the evolution meter** on the right - it fills as you earn more BP
4. **Evolve to new characters** for fresh content and higher earning potential
5. **Experiment with different upgrade paths** to optimize your strategy

### Understanding the UI
- **Top Header**: Shows total Brainrot Points and control buttons (🚪 Logout, 🗑️ Reset)
- **Left Panel**: Shop with generators and upgrades
- **Center**: Main character, intensity meter (left), evolution meter (right)
- **Intensity Meter**: Shows current click momentum and generator bonus
- **Evolution Meter**: Progress toward next character unlock

### Game Controls
- **Pin Code Access**: Enter `123456` on the login screen
- **🚪 Logout Button**: Return to login screen (saves progress)
- **🗑️ Reset Button**: Delete all progress and start over
- **🚀 NEXT CHARACTER**: Appears when evolution is ready

## 🛠️ Technical Details

### Technology Stack
- **Pure HTML5/CSS3/JavaScript** - No frameworks required
- **Local Storage** for game saves
- **CSS animations** and transitions for smooth effects
- **Responsive design** with Flexbox and CSS Grid

### Browser Compatibility
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+

### Performance
- Optimized for 60fps animations
- Efficient DOM manipulation
- Automatic cleanup of visual effects
- Lightweight codebase (~5MB total)

## 📁 Project Structure

```
brainrotclicker/
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── main.js             # Core game logic and mechanics
├── ui.js               # User interface and visual effects
├── gameState.js        # Save/load system and game state
├── brainrot/           # Character images
│   ├── 1.jpg           # Bombardiro Crocodilo
│   ├── 2.jpg           # Tung Tung Tung Sahur  
│   ├── 3.jpg           # Trippi Troppi/Trulimero Trulichina
│   ├── 4.jpg           # Brr Brr Patapim
│   └── 5.jpg           # Ballerina Cappuccina
├── .gitignore          # Git ignore rules
└── README.md           # This documentation
```

### Code Architecture

#### `main.js` - Core Game Logic
- Game state management and main loop
- Click handling and intensity system
- Generator and upgrade logic
- Character evolution mechanics
- Save/load integration

#### `ui.js` - User Interface
- Visual effect creation and management
- Floating numbers and animations
- Shop rendering and updates
- Meter and progress bar updates
- Character display synchronization

#### `gameState.js` - Data Persistence
- LocalStorage save/load operations
- Game state serialization
- Auto-save functionality
- Reset and import/export features

#### `style.css` - Styling and Animation
- Responsive layout system
- CSS animations and keyframes
- Visual effect styling
- Color schemes and themes
- Mobile adaptations

## 🔧 Local Development

### Running Locally
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gonzalles2009/brainrotclicker.git
   cd brainrotclicker
   ```

2. **Open in browser**:
   ```bash
   # Option 1: Simple HTTP server (Python 3)
   python -m http.server 8000
   
   # Option 2: Simple HTTP server (Node.js)
   npx serve .
   
   # Option 3: Just open the file
   open index.html
   ```

3. **Visit**: `http://localhost:8000` (or just open `index.html` directly)

### Making Changes
- Edit any file and refresh the browser to see changes
- Use browser DevTools for debugging
- Console logs are available for debugging game state

## 🎯 Game Balance

### Generator Economics
- Each generator type has exponential cost scaling
- Generators provide increasingly higher base income
- Upgrades offer multiplicative bonuses
- Click intensity provides temporary generator boosts (1.0x to 1.67x)

### Evolution Requirements
Characters unlock based on total BP earned:
- Character 2: 1,000 BP
- Character 3: 10,000 BP  
- Character 4: 100,000 BP
- Character 5: 1,000,000 BP

### Intensity System
Click intensity affects generator efficiency:
- **CHILL** (0-20%): Base generator speed
- **WARM** (20-40%): Slight boost
- **HOT** (40-60%): Moderate boost
- **FEVER** (60-80%): High boost
- **BRAINROT!** (80-100%): Maximum boost (1.67x)

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Deploy automatically on every push
4. Custom domain support available

### Alternative Hosting
- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop deployment
- **Any static hosting**: Upload all files to web server

## 🤝 Contributing

This is a fun experimental project! Feel free to:
- Report bugs or suggest improvements
- Fork and create your own variants
- Submit pull requests for enhancements
- Share your high scores!

## 📜 License

Open source project - feel free to use, modify, and share!

## 🎮 Credits

- **Game Design**: Internet meme culture meets Italian coffee meets incremental gaming
- **Character Inspiration**: Based on real viral [Italian Brainrot AI Animals](https://knowyourmeme.com/memes/italian-brainrot-ai-italian-animals) memes from TikTok
- **Meme Sources**: Ballerina Cappuccina, Bombardiro Crocodilo, Brr Brr Patapim, and other Italian Brainrot characters
- **Art Style**: Minimalist with maximum chaos (and AI-generated absurdity)
- **Sound**: Silent but deadly (clicking sounds)
- **Inspiration**: Cookie Clicker, Adventure Capitalist, and way too much TikTok brainrot

---

### 🚀 [Play Now!](https://brainrotclicker-xxx.vercel.app)

*Warning: May cause excessive coffee consumption and uncontrollable clicking urges.* 
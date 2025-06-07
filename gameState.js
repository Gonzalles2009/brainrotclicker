// Game State
let gameState = {
    // Primary currency
    brainrotPoints: 0,
    
    // Click mechanics
    clickPower: 1,
    totalClicks: 0,
    
    // Character evolution
    currentCharacter: 0,
    characterLevel: 1,
    evolutionProgress: 0,
    evolutionPaused: false,
    
    // Generators - balanced for better ROI (30-60 seconds)
    generators: [
        { name: 'Tiny Espresso Machine', icon: '☕', cost: 15, owned: 0, cps: 0.5, baseCost: 15 },
        { name: 'Cappuccino Robot', icon: '🤖', cost: 100, owned: 0, cps: 2, baseCost: 100 },
        { name: 'Brainrot Factory', icon: '🏭', cost: 500, owned: 0, cps: 10, baseCost: 500 },
        { name: 'Mamma Mia Distillery', icon: '🍷', cost: 3000, owned: 0, cps: 60, baseCost: 3000 },
        { name: 'Italian Space Station', icon: '🚀', cost: 20000, owned: 0, cps: 400, baseCost: 20000 },
        { name: 'Quantum Pasta Maker', icon: '🍝', cost: 150000, owned: 0, cps: 3000, baseCost: 150000 },
        { name: 'Interdimensional Gelato', icon: '🍨', cost: 1200000, owned: 0, cps: 24000, baseCost: 1200000 },
        { name: 'Time-Travel Pizza Oven', icon: '🍕', cost: 10000000, owned: 0, cps: 200000, baseCost: 10000000 }
    ],
    
    // Click upgrades - now repeatable with increasing cost
    upgrades: [
        { name: 'Manual Labor', icon: '👆', cost: 100, owned: 0, effect: 1, baseCost: 100 },
        { name: 'Espresso Shot', icon: '☕', cost: 500, owned: 0, effect: 5, baseCost: 500 },
        { name: 'Power Click', icon: '💪', cost: 2500, owned: 0, effect: 25, baseCost: 2500 },
        { name: 'Brain Spark', icon: '🧠', cost: 12000, owned: 0, effect: 150, baseCost: 12000 },
        { name: 'Italian Thunder', icon: '⚡', cost: 60000, owned: 0, effect: 800, baseCost: 60000 },
        { name: 'Nonna\'s Blessing', icon: '👵', cost: 300000, owned: 0, effect: 5000, baseCost: 300000 }
    ],
    
    // "Moments of Triumph" - replaces achievements
    triumphs: [
        { name: 'First K', requirement: 1000, triggered: false, stat: 'totalEarned' },
        { name: 'First Million', requirement: 1000000, triggered: false, stat: 'totalEarned' },
        { name: 'First Billion', requirement: 1000000000, triggered: false, stat: 'totalEarned' },
        { name: 'Automation', requirement: 100, triggered: false, stat: 'cps' },
        { name: 'Industrialization', requirement: 10000, triggered: false, stat: 'cps' }
    ],
    triumphBonus: { active: false, multiplier: 2, timeLeft: 0 },
    
    // Special events
    goldenCappuccino: { active: false, timeLeft: 0, multiplier: 3 },
    brainrotFrenzy: { active: false, timeLeft: 0, multiplier: 2 },
    
    // Statistics
    totalEarned: 0,
    cps: 0,
    
    // Click rate tracking
    clicksInLastSecond: 0,
    lastSecondClicks: [],
    manualBPPerSec: 0,
    
    // Click intensity meter
    clickIntensity: 0,
    clickIntensityDecay: 0.95, // Decay rate per game loop (10 times per second)
    maxClicksPerSecond: 10, // Maximum CPS for full meter
    intensityMultiplier: 1.0,
    
    // Game time
    startTime: Date.now(),
    playtime: 0,
    
    // Random event slot machine animation
    eventSlotTicker: 0,
    eventSlotNames: [
        'Golden Cappuccino - 3x click',
        'Brainrot Frenzy - 2x click'
    ],
    eventSlotIndex: 0,
    
    // Generator income display ticker
    incomeDisplayTicker: 0,

    // Characters data
    characters: [
        { name: 'Ballerina Cappuccina', desc: 'Cappuccino-head queen serving daily dose of caffeine chaos', image: 'brainrot/5.jpg', unlockAt: 0 },
        { name: 'Bombardiro Crocodilo', desc: 'Skibidi bomber with crocodile rizz - no cap fr fr', image: 'brainrot/1.jpg', unlockAt: 1000 },
        { name: 'Tung Tung Tung Sahur', desc: 'Long stick boy with infinite aura - lowkey sus but highkey fire', image: 'brainrot/2.jpg', unlockAt: 10000 },
        { name: 'Trippi Troppi Troppa Trippa', desc: 'Fish-bear hybrid living that sigma grindset lifestyle', image: 'brainrot/3.jpg', unlockAt: 100000 },
        { name: 'Brr Brr Patapim', desc: 'Tree spirit with massive schnoz and human feet - absolute unit', image: 'brainrot/4.jpg', unlockAt: 1000000 }
    ]
}; 
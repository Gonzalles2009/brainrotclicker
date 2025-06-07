// Pin Code Protection
const GAME_PIN = "123456"; // Simple pin code

function checkPin() {
    const input = document.getElementById('pin-input');
    const error = document.getElementById('pin-error');
    const pinValue = input.value.toLowerCase().trim();
    
    if (pinValue === GAME_PIN) {
        // Correct pin - show game and hide pin screen
        localStorage.setItem('brainrot_pin_verified', 'true');
        document.getElementById('pin-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        initActualGame(); // Initialize the game
    } else {
        // Wrong pin - show error
        error.style.display = 'block';
        input.value = '';
        input.focus();
        setTimeout(() => {
            error.style.display = 'none';
        }, 3000);
    }
}

// Check if already verified
function checkPinVerification() {
    const verified = localStorage.getItem('brainrot_pin_verified');
    if (verified === 'true') {
        document.getElementById('pin-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        return true;
    }
    return false;
}

let gameLoopInterval = null;
let saveInterval = null;

// Core Game Functions
function clickCharacter(event) {
    // Update click intensity first
    updateClickIntensity();
    
    // Calculate click power with all bonuses
    let clickValue = gameState.clickPower;
    
    // Apply intensity multiplier
    clickValue *= gameState.intensityMultiplier;
    
    // Apply Triumph Bonus
    if (gameState.triumphBonus.active) {
        clickValue *= gameState.triumphBonus.multiplier;
    }
    
    // Apply special event bonuses
    if (gameState.goldenCappuccino.active) {
        clickValue *= gameState.goldenCappuccino.multiplier;
    }
    if (gameState.brainrotFrenzy.active) {
        clickValue *= gameState.brainrotFrenzy.multiplier;
    }
    
    // Add brainrot points
    gameState.brainrotPoints += clickValue;
    gameState.totalEarned += clickValue;
    gameState.totalClicks++;
    
    // Track clicks for BP/sec calculation
    const currentTime = Date.now();
    gameState.lastSecondClicks.push({ time: currentTime, value: clickValue });
    
    // Create floating number effect and click effect
    const characterRect = elements.mainCharacter.getBoundingClientRect();
    
    // Use absolute screen coordinates for floating numbers
    const floatingX = event.clientX + Math.random() * 40 - 20;
    const floatingY = event.clientY + Math.random() * 40 - 20;
    
    // Use relative coordinates for click effect within the main-character container
    // Add 5px offset to account for the image border (5px on each side)
    const relativeX = event.clientX - characterRect.left;
    const relativeY = event.clientY - characterRect.top;
    
    // No need to set color here anymore - it's handled inside createFloatingNumber
    createFloatingNumber(floatingX, floatingY, clickValue);
    
    // Create click effect
    createClickEffect(relativeX, relativeY);
    
    // Update evolution progress
    updateEvolutionProgress();
    
    // Update display
    updateDisplay();
}

function buyGenerator(index) {
    const generator = gameState.generators[index];
    if (gameState.brainrotPoints >= generator.cost) {
        gameState.brainrotPoints -= generator.cost;
        generator.owned++;
        
        // Increase cost (exponential growth)
        generator.cost = Math.floor(generator.baseCost * Math.pow(1.15, generator.owned));
        
        rebuildGeneratorVisuals();
        updateCPS();
        updateShopDisplay(); // Full rebuild needed after purchase
    }
}

function buyUpgrade(index) {
    const upgrade = gameState.upgrades[index];
    
    if (gameState.brainrotPoints >= upgrade.cost) {
        gameState.brainrotPoints -= upgrade.cost;
        upgrade.owned++;

        // Increase cost (exponential growth)
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.25, upgrade.owned));
        
        // Apply upgrade effect (additive)
        gameState.clickPower += upgrade.effect;
        
        // Create special effect for upgrade purchase
        createUpgradeEffect();
        
        updateShopDisplay(); // Full rebuild needed after upgrade purchase
    }
}

function updateCPS() {
    let totalCPS = 0;
    
    gameState.generators.forEach(generator => {
        totalCPS += generator.owned * generator.cps;
    });
    
    // Apply intensity bonus to generators (1/6 of click intensity effect)
    // Click intensity gives 1.0x to 5.0x (4x range), generators get 1.0x to 1.67x (0.67x range)
    const intensityRatio = gameState.clickIntensity / 100;
    const generatorIntensityMultiplier = 1.0 + (intensityRatio * 4.0 / 6); // 1/6 of the 4x range = 0.67x max
    
    gameState.cps = totalCPS * generatorIntensityMultiplier;
}

function updateManualBPPerSec() {
    const currentTime = Date.now();
    const oneSecondAgo = currentTime - 1000;
    
    // Remove clicks older than 1 second
    gameState.lastSecondClicks = gameState.lastSecondClicks.filter(click => click.time > oneSecondAgo);
    
    // Calculate total BP from clicks in the last second
    gameState.manualBPPerSec = gameState.lastSecondClicks.reduce((total, click) => total + click.value, 0);
}

function updateClickIntensity() {
    // Increase intensity with a simpler, more generous formula
    // Fixed increase of 8 units per click - simple and predictable
    const increase = 8;
    gameState.clickIntensity = Math.min(100, gameState.clickIntensity + increase);
    
    // Calculate multiplier based on intensity (1.0x to 5.0x)
    const intensityRatio = gameState.clickIntensity / 100;
    gameState.intensityMultiplier = 1.0 + (intensityRatio * 4.0); // 1.0x to 5.0x
    
    updateIntensityDisplay();
    updateCPS(); // Update generator CPS with new intensity
}

function decayClickIntensity() {
    // Gradually decrease intensity
    gameState.clickIntensity *= gameState.clickIntensityDecay;
    if (gameState.clickIntensity < 0.1) {
        gameState.clickIntensity = 0;
    }
    
    // Calculate multiplier
    const intensityRatio = gameState.clickIntensity / 100;
    gameState.intensityMultiplier = 1.0 + (intensityRatio * 4.0);
    
    updateIntensityDisplay();
    updateCPS(); // Update generator CPS with decaying intensity
}

function gameLoop() {
    // Останавливаем игру во время паузы эволюции
    if (gameState.evolutionPaused) {
        updateDisplay(); // Обновляем только визуал, но не прогресс
        return;
    }
    
    // Generate passive income
    let passiveIncome = gameState.cps / 10; // 10 updates per second

    // Apply Triumph Bonus
    if (gameState.triumphBonus.active) {
        passiveIncome *= gameState.triumphBonus.multiplier;
    }

    if (passiveIncome > 0) {
        gameState.brainrotPoints += passiveIncome;
        gameState.totalEarned += passiveIncome;
    }
    
    const wasEventActive = isAnyEventActive();
    
    // Update special events and triumph bonus
    updateSpecialEvents();
    
    const isEventActiveNow = isAnyEventActive();

    // Handle slot machine animation
    if (!isEventActiveNow) {
        // If an event JUST ended, immediately show the first slot item
        if (wasEventActive) {
            gameState.eventSlotTicker = 0;
            gameState.eventSlotIndex = 0;
            elements.activeEffect.textContent = `${gameState.eventSlotNames[0]}...`;
        } else {
            gameState.eventSlotTicker++;
            if (gameState.eventSlotTicker >= 15) { // Update every 1.5 seconds
                gameState.eventSlotTicker = 0;
                gameState.eventSlotIndex = (gameState.eventSlotIndex + 1) % gameState.eventSlotNames.length;
                elements.activeEffect.textContent = `${gameState.eventSlotNames[gameState.eventSlotIndex]}...`;
            }
        }
    }
    
    // Update click intensity decay
    decayClickIntensity();
    
    // Update manual BP/sec tracking
    updateManualBPPerSec();
    
    // Update playtime
    gameState.playtime = Math.floor((Date.now() - gameState.startTime) / 1000);
    
    // Handle generator income display
    gameState.incomeDisplayTicker++;
    if (gameState.incomeDisplayTicker > 5) { // roughly twice a second
        gameState.incomeDisplayTicker = 0;
        showRandomGeneratorIncome();
    }
    
    // Check for triumphs
    checkTriumphs();
    
    // Update evolution
    updateEvolutionProgress();
    
    // Update display
    updateDisplay();
}

function updateSpecialEvents() {
    // Handle active Triumph bonus
    if (gameState.triumphBonus.active) {
        gameState.triumphBonus.timeLeft--;
        if (gameState.triumphBonus.timeLeft <= 0) {
            gameState.triumphBonus.active = false;
            // The glow for triumph is a one-shot animation, so no need to turn it off here.
            // Принудительно обновляем тему счетчика после окончания triumph
            if (typeof updateCentralCounterTheme === 'function') {
                updateCentralCounterTheme();
            }
        }
    }

    // Handle Golden Cappuccino
    if (gameState.goldenCappuccino.active) {
        gameState.goldenCappuccino.timeLeft--;
        if (gameState.goldenCappuccino.timeLeft <= 0) {
            gameState.goldenCappuccino.active = false;
            updateGlowEffect('golden', false);
        }
    }

    // Handle Brainrot Frenzy
    if (gameState.brainrotFrenzy.active) {
        gameState.brainrotFrenzy.timeLeft--;
        if (gameState.brainrotFrenzy.timeLeft <= 0) {
            gameState.brainrotFrenzy.active = false;
            updateGlowEffect('frenzy', false);
        }
    }
    
    // If no special event is active, try to trigger a new one.
    // We check for !isAnyEventActive() to prevent events from overlapping.
    if (!isAnyEventActive()) {
        // Golden Cappuccino (1% chance per second = ~once per 100 seconds)
        if (Math.random() < 0.001) { // 0.1% chance per tick (10 ticks/sec)
            gameState.goldenCappuccino.active = true;
            gameState.goldenCappuccino.timeLeft = 200; // 20 seconds * 10 ticks/sec
            updateGlowEffect('golden', true);
            return; // Prevent triggering frenzy in the same tick
        }
        
        // Brainrot Frenzy (0.8% chance per second = ~once per 125 seconds)
        if (Math.random() < 0.0008) { // 0.08% chance per tick
            gameState.brainrotFrenzy.active = true;
            gameState.brainrotFrenzy.timeLeft = 100; // 10 seconds * 10 ticks/sec
            updateGlowEffect('frenzy', true);
        }
    }
}

function updateEvolutionProgress() {
    const currentChar = gameState.characters[gameState.currentCharacter];
    const prevChar = gameState.characters[gameState.currentCharacter - 1];
    const nextChar = gameState.characters[gameState.currentCharacter + 1];

    // Определяем, с какой отметки считать прогресс
    const startPoints = prevChar ? prevChar.unlockAt : 0;
    const currentPointsInLevel = gameState.totalEarned - startPoints;
    
    if (nextChar && gameState.totalEarned >= nextChar.unlockAt && !gameState.evolutionPaused) {
        // Достигли 100% - ставим игру на паузу и показываем кнопку
        gameState.evolutionPaused = true;
        elements.evolutionNextBtn.style.display = 'block';
        elements.evolutionText.textContent = `🎉 Ready to evolve to ${nextChar.name}!`;
    }
    
    // Update progress bar (vertical now) и кирпичную кладку
    if (nextChar && !gameState.evolutionPaused) {
        // Рассчитываем прогресс относительно текущего уровня
        const levelTotalPoints = nextChar.unlockAt - startPoints;
        const progress = (currentPointsInLevel / levelTotalPoints) * 100;
        
        gameState.evolutionProgress = Math.min(progress, 100);
        elements.evolutionProgress.style.height = gameState.evolutionProgress + '%';
        elements.evolutionText.textContent = `Next: ${nextChar.name} (${formatNumber(nextChar.unlockAt)} BP)`;
        
        // Обновляем кирпичную кладку
        if (typeof updateBrickOverlay === 'function') {
            updateBrickOverlay(gameState.evolutionProgress);
        }
    } else if (gameState.evolutionPaused) {
        // Во время паузы показываем 100% прогресс
        elements.evolutionProgress.style.height = '100%';
    } else {
        elements.evolutionProgress.style.height = '100%';
        elements.evolutionText.textContent = 'Maximum Evolution Reached!';
        
        // Максимальная эволюция - убираем все кирпичи
        if (typeof updateBrickOverlay === 'function') {
            updateBrickOverlay(100);
        }
    }
}

function checkTriumphs() {
    // Не активируем триумфы во время эволюции чтобы не мешать визуалам
    if (gameState.evolutionPaused) {
        return;
    }
    
    gameState.triumphs.forEach(triumph => {
        if (!triumph.triggered) {
            let currentValue = 0;
            switch (triumph.stat) {
                case 'totalEarned':
                    currentValue = gameState.totalEarned;
                    break;
                case 'cps':
                    currentValue = gameState.cps;
                    break;
            }
            
            if (currentValue >= triumph.requirement) {
                triumph.triggered = true;
                gameState.triumphBonus.active = true;
                gameState.triumphBonus.timeLeft = 50; // 5 seconds
                updateGlowEffect('triumph', true);
            }
        }
    });
}

// Save/Load System
function saveGame() {
    console.log('Saving game with character:', gameState.currentCharacter, 'paused:', gameState.evolutionPaused);
    localStorage.setItem('italianBrainrotClicker', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('italianBrainrotClicker');
    console.log('Loading game. Saved data exists:', !!saved);
    if (saved) {
        const loadedState = JSON.parse(saved);
        console.log('Loaded character from save:', loadedState.currentCharacter, 'paused:', loadedState.evolutionPaused);
        
        // Safely merge data to handle new features and structure changes
        gameState.brainrotPoints = loadedState.brainrotPoints || 0;
        gameState.clickPower = loadedState.clickPower || 1;
        gameState.totalClicks = loadedState.totalClicks || 0;
        gameState.totalEarned = loadedState.totalEarned || 0;
        gameState.currentCharacter = loadedState.currentCharacter || 0;
        gameState.characterLevel = loadedState.characterLevel || 1;
        // evolutionProgress НЕ загружаем - он рассчитывается динамически
        gameState.evolutionPaused = loadedState.evolutionPaused || false;
        gameState.playtime = loadedState.playtime || 0;
        
        console.log('After loading - character:', gameState.currentCharacter, 'paused:', gameState.evolutionPaused);
        
        // Handle generators (preserve existing structure)
        if (loadedState.generators) {
            loadedState.generators.forEach((savedGen, index) => {
                if (gameState.generators[index]) {
                    gameState.generators[index].owned = savedGen.owned || 0;
                    gameState.generators[index].cost = savedGen.cost || gameState.generators[index].baseCost;
                }
            });
        }
        
        // Handle upgrades (convert old boolean structure to new numeric)
        if (loadedState.upgrades) {
            loadedState.upgrades.forEach((savedUpgrade, index) => {
                if (gameState.upgrades[index]) {
                    // Convert old boolean owned to numeric
                    if (typeof savedUpgrade.owned === 'boolean') {
                        gameState.upgrades[index].owned = savedUpgrade.owned ? 1 : 0;
                    } else {
                        gameState.upgrades[index].owned = savedUpgrade.owned || 0;
                    }
                    gameState.upgrades[index].cost = savedUpgrade.cost || gameState.upgrades[index].baseCost;
                }
            });
        }
        
        // Handle triumphs
        if (loadedState.triumphs) {
            loadedState.triumphs.forEach((savedTriumph, index) => {
                if (gameState.triumphs[index]) {
                    gameState.triumphs[index].triggered = savedTriumph.triggered || false;
                }
            });
        }
        
        // Recalculate click power based on owned upgrades
        gameState.clickPower = 1; // Reset to base
        gameState.upgrades.forEach(upgrade => {
            gameState.clickPower += upgrade.effect * upgrade.owned;
        });
        
        gameState.startTime = Date.now() - gameState.playtime * 1000;
        
        // Clean up any running animations and effects and reset all temporary bonuses
        gameState.triumphBonus.active = false;
        gameState.goldenCappuccino.active = false;
        gameState.brainrotFrenzy.active = false;
        updateGlowEffect('golden', false);
        updateGlowEffect('frenzy', false);
        updateGlowEffect('triumph', false);

        rebuildGeneratorVisuals();
        updateCPS();
        updateShopDisplay();
        
        // Обновляем отображение персонажа после загрузки
        console.log('Calling updateCharacterDisplay from loadGame');
        if (typeof updateCharacterDisplay === 'function') {
            updateCharacterDisplay();
        } else {
            console.error('updateCharacterDisplay function not found!');
        }
        
        // Принудительно обновляем тему счетчика после загрузки
        if (typeof updateCentralCounterTheme === 'function') {
            updateCentralCounterTheme();
        }
    }
}

function logoutGame() {
    // Stop game loops
    clearInterval(gameLoopInterval);
    clearInterval(saveInterval);
    
    // Save current game state
    saveGame();
    
    // Remove pin verification
    localStorage.removeItem('brainrot_pin_verified');
    
    // Hide game and show pin screen
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('pin-screen').style.display = 'flex';
    
    // Clear and focus pin input
    const pinInput = document.getElementById('pin-input');
    if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
    }
}

function resetGame() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        // Stop game loops to prevent saving before reload
        clearInterval(gameLoopInterval);
        clearInterval(saveInterval);

        // Clear localStorage
        localStorage.removeItem('italianBrainrotClicker');
        
        // Set flag to prevent auto-save during reset
        window.isResetting = true;
        
        // Force reload without cache
        window.location.reload();
    }
}

// Initialize Game
function initActualGame() {
    // Try to load saved game
    loadGame();
    
    // Add event listeners
    if (elements.mainCharacter) {
        elements.mainCharacter.addEventListener('click', clickCharacter);
    }
    
    // Добавляем обработчик кликов для волн только на персонажа и пустые области
    const mainContent = document.querySelector('.main-content');
    let lastWaveTime = 0;
    const waveThrottle = 150; // Минимум 150мс между волнами
    
    if (mainContent) {
        mainContent.addEventListener('click', function(event) {
            // Проверяем, не кликнули ли на интерактивные элементы
            const clickedElement = event.target;
            const isInterfaceElement = clickedElement.closest('.shop-item') || 
                                     clickedElement.closest('.left-panel') ||
                                     clickedElement.closest('.reset-btn') ||
                                     clickedElement.closest('.intensity-meter-left') ||
                                     clickedElement.closest('.evolution-meter-right') ||
                                     clickedElement.closest('.click-multiplier-display') ||
                                     clickedElement.closest('.character-info');
            
            // Создаем волны только если клик НЕ на интерфейсных элементах
            if (!isInterfaceElement) {
                const now = Date.now();
                if (now - lastWaveTime > waveThrottle) {
                    createClickWave(event.clientX, event.clientY);
                    lastWaveTime = now;
                }
            }
        });
    }
    
    // Start game loop (10 FPS for performance)
    gameLoopInterval = setInterval(gameLoop, 100);
    
    // Auto-save every 30 seconds
    saveInterval = setInterval(saveGame, 30000);
    
    // Initial display update
    updateCPS();
    updateShopDisplay(); // Full shop build on init
    updateIntensityDisplay(); // Initialize intensity meter
    
    // Initialize central counter
    if (typeof updateCentralCounter === 'function') {
        updateCentralCounter(gameState.brainrotPoints);
    }
    
    // Initialize brick overlay
    if (typeof initializeBricks === 'function') {
        initializeBricks();
    }
    
    // Initialize evolution next button
    if (typeof initEvolutionNextButton === 'function') {
        initEvolutionNextButton();
    }
    
    updateDisplay(); // Regular stats display
    updateEvolutionProgress(); // Initialize evolution progress and bricks
    
    // Обновляем отображение персонажа (для новых игр тоже)
    console.log('Calling updateCharacterDisplay from initGame');
    if (typeof updateCharacterDisplay === 'function') {
        updateCharacterDisplay();
    } else {
        console.error('updateCharacterDisplay function not found in initGame!');
    }
}

// Initialize game (called when page loads)
function initGame() {
    // Set up pin input event listener
    const pinInput = document.getElementById('pin-input');
    if (pinInput) {
        pinInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPin();
            }
        });
        pinInput.focus(); // Auto-focus pin input
    }
    
    // Check if already verified
    if (checkPinVerification()) {
        // If verified, start the actual game
        initActualGame();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Save game when page is about to unload (but not during reset)
window.addEventListener('beforeunload', function(e) {
    if (!window.isResetting) {
        saveGame();
    }
}); 

// DEBUG: Add test commands to console
window.debugAddMoney = function() {
    gameState.brainrotPoints += 50000;
    updateDisplay();
    updateShopDisplay();
    console.log('Added 50k BP for testing');
};

window.debugShowUpgrades = function() {
    console.log('Current upgrades state:');
    gameState.upgrades.forEach((upgrade, i) => {
        console.log(`${i}: ${upgrade.name} - owned: ${upgrade.owned}, cost: ${upgrade.cost}, effect: ${upgrade.effect}`);
    });
    console.log(`Total click power: ${gameState.clickPower}`);
};

window.debugNextCharacter = function() {
    gameState.currentCharacter = (gameState.currentCharacter + 1) % gameState.characters.length;
    gameState.evolutionPaused = false; // Сбрасываем паузу
    updateCharacterDisplay();
    updateEvolutionProgress(); // Пересчитываем прогресс
    saveGame();
    console.log(`Switched to character ${gameState.currentCharacter}: ${gameState.characters[gameState.currentCharacter].name}`);
};

window.debugSaveLoad = function() {
    console.log('Before save:', {
        character: gameState.currentCharacter,
        paused: gameState.evolutionPaused,
        totalEarned: gameState.totalEarned
    });
    saveGame();
    console.log('Game saved. Refresh the page to test loading.');
}; 
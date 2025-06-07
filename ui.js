// DOM Elements
const elements = {
    glowOverlay: document.getElementById('glow-overlay'),
    cps: document.getElementById('cps'),
    totalEarned: document.getElementById('total-earned'),
    activeEffect: document.getElementById('active-effect'),
    clickPower: document.getElementById('click-power'),
    brickOverlay: document.getElementById('brick-overlay'),
    evolutionNextBtn: document.getElementById('evolution-next-btn'),
    mainCharacter: document.getElementById('main-character'),
    characterImage: document.getElementById('character-image'),
    characterName: document.getElementById('character-name'),
    characterDesc: document.getElementById('character-desc'),
    evolutionProgress: document.getElementById('evolution-progress'),
    evolutionText: document.getElementById('evolution-text'),
    shopList: document.getElementById('shop-list'),
    clickEffects: document.getElementById('click-effects'),
    floatingNumbers: document.getElementById('floating-numbers'),
    intensityFill: document.getElementById('intensity-fill'),
    intensityBonus: document.getElementById('intensity-bonus'),
    intensityParticles: document.getElementById('intensity-particles'),
    generatorCircle: document.getElementById('generator-circle'),
    clickWaves: document.getElementById('click-waves')
};

// Helper function to check if any event is active
function isAnyEventActive() {
    return gameState.triumphBonus.active || gameState.goldenCappuccino.active || gameState.brainrotFrenzy.active;
}

// --- Glow Effect Manager ---
function updateGlowEffect(type, isActive) {
    const styleId = `glow-style-${type}`;
    const existingStyle = document.getElementById(styleId);

    if (!isActive) {
        if (existingStyle) {
            existingStyle.remove();
        }
        return;
    }

    if (existingStyle) {
        return; // Style already active
    }

    const style = document.createElement('style');
    style.id = styleId;

    let keyframes, animationName;
    if (type === 'golden') {
        animationName = 'golden-glow';
        keyframes = `
            @keyframes ${animationName} {
                from { box-shadow: inset 0 0 80px 40px rgba(255, 215, 0, 0.4); }
                to { box-shadow: inset 0 0 120px 60px rgba(255, 215, 0, 0.7); }
            }
        `;
    } else if (type === 'frenzy') {
        animationName = 'brainrot-glow';
        keyframes = `
            @keyframes ${animationName} {
                from { box-shadow: inset 0 0 80px 40px rgba(255, 71, 87, 0.5); }
                to { box-shadow: inset 0 0 120px 60px rgba(255, 71, 87, 0.9); }
            }
        `;
    } else if (type === 'triumph') {
        animationName = 'triumph-flash';
        keyframes = `
            @keyframes ${animationName} {
                0% { box-shadow: inset 0 0 100px 50px rgba(255, 255, 255, 0.9); opacity: 1; }
                100% { box-shadow: inset 0 0 200px 100px rgba(255, 255, 255, 0); opacity: 0; }
            }
        `;
    }

    style.innerHTML = `
        ${keyframes}
        #glow-overlay {
            animation: ${animationName} ${type === 'triumph' ? '0.5s' : (type === 'golden' ? '2s' : '1s')} ease-out ${type === 'triumph' ? '1' : 'infinite alternate'};
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    if (type === 'triumph') {
        // Self-destructing style for one-shot animations
        setTimeout(() => style.remove(), 500);
    }
}

// Utility Functions
function formatNumber(num) {
    // Show decimals for small numbers
    if (num < 1) return num.toFixed(2);
    if (num < 10) return num.toFixed(1);
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
}

// Функция showNotification удалена - уведомления больше не используются

function createFloatingNumber(x, y, value, color = '#00ff88') {
    const floatingNum = document.createElement('div');
    floatingNum.className = 'floating-number';
    floatingNum.textContent = '+' + formatNumber(value);
    floatingNum.style.left = x + 'px';
    floatingNum.style.top = y + 'px';
    
    // Determine if this is a special event click for enhanced effects
    let isSpecialEvent = false;
    let eventMultiplier = 1;
    
    if (gameState.goldenCappuccino.active) {
        isSpecialEvent = true;
        eventMultiplier = gameState.goldenCappuccino.multiplier;
        floatingNum.style.color = '#ffd700';
        floatingNum.style.textShadow = `
            2px 2px 0px #000000,
            4px 4px 8px rgba(0, 0, 0, 0.9),
            0 0 10px #ffd700,
            0 0 20px #ffd700`;
        floatingNum.style.fontSize = '40px';
        floatingNum.style.webkitTextStroke = '2px #000000';
        floatingNum.textContent = '💰+' + formatNumber(value);
    } else if (gameState.brainrotFrenzy.active) {
        isSpecialEvent = true;
        eventMultiplier = gameState.brainrotFrenzy.multiplier;
        floatingNum.style.color = '#ff4757';
        floatingNum.style.textShadow = `
            2px 2px 0px #000000,
            4px 4px 8px rgba(0, 0, 0, 0.9),
            0 0 10px #ff4757,
            0 0 20px #ff4757`;
        floatingNum.style.fontSize = '38px';
        floatingNum.style.webkitTextStroke = '2px #000000';
        floatingNum.textContent = '🔥+' + formatNumber(value);
    } else {
        // Regular click
        floatingNum.style.color = color;
    }
    
    // Add extra sparkle for big numbers
    if (value >= 1000 || isSpecialEvent) {
        floatingNum.style.animation = 'floatUpEnhanced 1.4s ease-out forwards';
        
        // Create sparkle particles around the number
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'floating-sparkle';
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = (x + Math.random() * 60 - 30) + 'px';
            sparkle.style.top = (y + Math.random() * 40 - 20) + 'px';
            sparkle.style.fontSize = '16px';
            sparkle.style.animation = `sparkleFloat ${0.8 + Math.random() * 0.4}s ease-out forwards`;
            sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '999';
            elements.floatingNumbers.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }
    
    elements.floatingNumbers.appendChild(floatingNum);
    
    // Remove after animation
    setTimeout(() => {
        floatingNum.remove();
    }, 1500);
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    // Create 40px effect and center it at the click point
    effect.style.left = (x - 20) + 'px';
    effect.style.top = (y - 20) + 'px';
    elements.clickEffects.appendChild(effect);
    
    // Add some randomized colors for special events
    if (gameState.goldenCappuccino.active) {
        effect.style.background = 'radial-gradient(circle, rgba(243, 156, 18, 0.8), rgba(243, 156, 18, 0.3), transparent)';
    } else if (gameState.brainrotFrenzy.active) {
        effect.style.background = 'radial-gradient(circle, rgba(231, 76, 60, 0.8), rgba(231, 76, 60, 0.3), transparent)';
    }
    
    setTimeout(() => {
        effect.remove();
    }, 600);
}

function createUpgradeEffect() {
    // Create a burst effect on the character when upgrade is purchased
    const burst = document.createElement('div');
    burst.className = 'upgrade-burst';
    elements.clickEffects.appendChild(burst);
    
    // Multiple particles for dramatic effect
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'upgrade-particle';
        particle.style.setProperty('--angle', (i * 45) + 'deg');
        particle.style.animationDelay = (i * 0.05) + 's';
        burst.appendChild(particle);
    }
    
    setTimeout(() => {
        burst.remove();
    }, 1500);
}

function updateIntensityDisplay() {
    const intensityPercent = Math.max(0, Math.min(100, gameState.clickIntensity));
    
    // Update meter fill height
    elements.intensityFill.style.height = intensityPercent + '%';
    
    // Update multiplier display text
    elements.intensityBonus.textContent = 'x' + gameState.intensityMultiplier.toFixed(1);
    
    // Update text color and shadow based on intensity
    let color = '#00b894'; // Default: CHILL
    if (intensityPercent >= 80) color = '#ff4757'; // BRAINROT
    else if (intensityPercent >= 60) color = '#e84393'; // FEVER
    else if (intensityPercent >= 40) color = '#e17055'; // HOT
    else if (intensityPercent >= 20) color = '#fdcb6e'; // WARM
    
    elements.intensityBonus.style.color = color;
    elements.intensityFill.style.boxShadow = `0 0 20px ${color}`;
}

function createIntensityParticles(count) {
    // Don't create too many particles at once
    if (!elements.intensityParticles || elements.intensityParticles.children.length > 5) return;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'intensity-particle';
        particle.style.bottom = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        
        elements.intensityParticles.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 2500);
    }
}

function updateDisplay() {
    // Update central counter with animation
    updateCentralCounter(gameState.brainrotPoints);
    updateCentralCounterTheme();
    
    // Update stats
    elements.cps.textContent = formatNumber(gameState.cps);
    
    // Calculate and display total BP/sec (auto + manual)
    const totalBPPerSec = gameState.cps + gameState.manualBPPerSec;
    elements.totalEarned.textContent = formatNumber(totalBPPerSec);
    
    // Update active effect display
    if (isAnyEventActive()) {
        if (gameState.triumphBonus.active) {
            elements.activeEffect.textContent = `TRIUMPH! x2 EVERYTHING! (${Math.ceil(gameState.triumphBonus.timeLeft / 10)}s)`;
        } else if (gameState.goldenCappuccino.active) {
            elements.activeEffect.textContent = `Golden Cappuccino - ${gameState.goldenCappuccino.multiplier}x click (${Math.ceil(gameState.goldenCappuccino.timeLeft / 10)}s)`;
        } else if (gameState.brainrotFrenzy.active) {
            elements.activeEffect.textContent = `Brainrot Frenzy - ${gameState.brainrotFrenzy.multiplier}x click (${Math.ceil(gameState.brainrotFrenzy.timeLeft / 10)}s)`;
        }
    }
    
    // Calculate total click power with all bonuses
    let totalClickPower = gameState.clickPower * gameState.intensityMultiplier;
    if (gameState.triumphBonus.active) totalClickPower *= gameState.triumphBonus.multiplier;
    if (gameState.goldenCappuccino.active) totalClickPower *= gameState.goldenCappuccino.multiplier;
    if (gameState.brainrotFrenzy.active) totalClickPower *= gameState.brainrotFrenzy.multiplier;
    elements.clickPower.textContent = '+' + formatNumber(totalClickPower);
    
    // Optimization: only update shop affordability, not full rebuild
    updateShopAffordability();
}

// Full shop display rebuild - only called when needed (purchase, upgrade, etc.)
function updateShopDisplay() {
    elements.shopList.innerHTML = '';
    
    // Combine all items into one array with type info
    const allItems = [];
    
    // Add generators
    gameState.generators.forEach((generator, index) => {
        allItems.push({
            type: 'generator',
            item: generator,
            index: index,
            owned: generator.owned,
            cost: generator.cost,
            canAfford: gameState.brainrotPoints >= generator.cost,
            effect: `+${formatNumber(generator.cps)} BP/sec`,
            currentEffect: generator.owned > 0 ? `Total: ${formatNumber(generator.cps * generator.owned)} BP/sec` : null,
            synergyInfo: null
        });
    });
    
    // Add upgrades
    gameState.upgrades.forEach((upgrade, index) => {
        allItems.push({
            type: 'upgrade',
            item: upgrade,
            index: index,
            owned: upgrade.owned,
            cost: upgrade.cost,
            canAfford: gameState.brainrotPoints >= upgrade.cost,
            effect: `+${formatNumber(upgrade.effect)} click power`,
            currentEffect: upgrade.owned > 0 ? `Total: +${formatNumber(upgrade.effect * upgrade.owned)}` : null
        });
    });
    
    // Sort by cost for better organization
    allItems.sort((a, b) => a.cost - b.cost);
    
    // Create shop items
    allItems.forEach(shopItem => {
        const div = document.createElement('div');
        const affordableClass = shopItem.canAfford ? 'affordable' : 'unaffordable';
        div.className = `shop-item ${shopItem.type} ${affordableClass}`;
        div.dataset.itemType = shopItem.type;
        div.dataset.itemIndex = shopItem.index;
        div.dataset.itemCost = shopItem.cost;
        
        if (shopItem.type === 'generator') {
            div.onclick = () => buyGenerator(shopItem.index);
        } else {
            div.onclick = () => buyUpgrade(shopItem.index);
        }
        
        const typeLabel = shopItem.type === 'generator' ? '🏭 AUTO' : '⚡ CLICK';
        const countDisplay = (shopItem.type === 'generator' || shopItem.type === 'upgrade') && shopItem.owned > 0 ?
            `<span class="shop-count">${shopItem.owned}</span>` : '';
        
        const effectDisplay = shopItem.type === 'generator' ? shopItem.effect : 
            `${shopItem.effect}${shopItem.currentEffect ? ' (' + shopItem.currentEffect + ')' : ''}`;
        
        div.innerHTML = `
            <div class="shop-header">
                <span class="shop-type">${typeLabel}</span>
                <span class="shop-name">${shopItem.item.icon} ${shopItem.item.name}</span>
                ${countDisplay}
            </div>
            <div class="shop-info">
                <span>Cost: ${formatNumber(shopItem.cost)} BP</span>
                <span class="shop-effect">${effectDisplay}</span>
            </div>
            ${shopItem.type === 'upgrade' && shopItem.item.description ? `<div class="shop-info"><span></span><span style="color: #ddd; font-size: 10px;">${shopItem.item.description}</span></div>` : ''}
            ${shopItem.synergyInfo ? `<div class="shop-info"><span></span><span style="color: #e17055; font-size: 10px;">${shopItem.synergyInfo}</span></div>` : ''}
        `;
        elements.shopList.appendChild(div);
    });
}

// Fast affordability update - only changes CSS classes
function updateShopAffordability() {
    const shopItems = elements.shopList.querySelectorAll('.shop-item');
    
    shopItems.forEach(item => {
        const cost = parseFloat(item.dataset.itemCost);
        const canAfford = gameState.brainrotPoints >= cost;
        
        if (canAfford && item.classList.contains('unaffordable')) {
            item.classList.remove('unaffordable');
            item.classList.add('affordable');
        } else if (!canAfford && item.classList.contains('affordable')) {
            item.classList.remove('affordable');
            item.classList.add('unaffordable');
        }
    });
}

// Add functions for generator visuals
function calculateGeneratorGroups(generator) {
    const owned = generator.owned;
    const groups = [];
    
    if (owned === 0) return groups;
    
    let remaining = owned;
    
    // Tier 4: 64+ as one mega unit
    if (remaining >= 64) {
        groups.push({ tier: 4, count: 1, represents: remaining });
        return groups;
    }
    
    // Tier 3: groups of 16
    while (remaining >= 16) {
        groups.push({ tier: 3, count: 1, represents: 16 });
        remaining -= 16;
    }
    
    // Tier 2: groups of 4
    while (remaining >= 4) {
        groups.push({ tier: 2, count: 1, represents: 4 });
        remaining -= 4;
    }
    
    // Tier 1: individual units
    while (remaining > 0) {
        groups.push({ tier: 1, count: 1, represents: 1 });
        remaining -= 1;
    }
    
    return groups;
}

function rebuildGeneratorVisuals() {
    const generatorCircle = document.getElementById('generator-circle');
    if (!generatorCircle) return;
    
    generatorCircle.innerHTML = '';

    // Set random animation duration for the entire circle
    const randomDuration = Math.random() * (90 - 20) + 20;
    generatorCircle.style.animationDuration = `${randomDuration.toFixed(1)}s`;

    let allGeneratorItems = [];

    gameState.generators.forEach(generator => {
        if (generator.owned === 0) return;
        
        const groups = calculateGeneratorGroups(generator);
        
        groups.forEach((group, index) => {
            const groupElement = createCircularGeneratorGroup(generator, group);
            allGeneratorItems.push(groupElement);
        });
    });

    // Position generators in a circle
    positionGeneratorsInCircle(allGeneratorItems, generatorCircle);
}

function createCircularGeneratorGroup(generator, group) {
    const container = document.createElement('div');
    container.className = 'generator-circular-item';
    
    const visual = document.createElement('span');
    visual.className = 'hangar-generator';
    visual.textContent = generator.icon;
    visual.dataset.cps = generator.cps * group.represents;
    visual.dataset.tier = group.tier;
    
    // Scale based on tier
    const scales = { 1: 1, 2: 1.5, 3: 2, 4: 2.5 };
    const scale = scales[group.tier];
    visual.style.fontSize = `${2.2 * scale}rem`;
    
    // Add tier indicator
    if (group.tier > 1) {
        visual.classList.add(`tier-${group.tier}`);
    }
    
    container.appendChild(visual);
    
    return container;
}

function positionGeneratorsInCircle(generators, container) {
    const numGenerators = generators.length;
    if (numGenerators === 0) return;
    
    const centerX = 175; // Half of container width (350px)
    const centerY = 175; // Half of container height (350px)
    
    // Радиус круга (оставляем место в центре для персонажа)
    const radius = Math.min(200, 150 + numGenerators * 3); // Увеличенный радиус
    
    generators.forEach((generator, index) => {
        // Рассчитываем угол для этого генератора
        const angle = (index * 2 * Math.PI) / numGenerators - Math.PI / 2; // Начинаем сверху
        
        // Рассчитываем позицию
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Устанавливаем позицию (центрируем элемент)
        generator.style.left = (x - 25) + 'px'; // 25px = примерно половина ширины элемента
        generator.style.top = (y - 25) + 'px';  // 25px = примерно половина высоты элемента
        
        container.appendChild(generator);
    });
}

function showRandomGeneratorIncome() {
    const generatorCircle = document.getElementById('generator-circle');
    if (!generatorCircle) return;
    
    const allGenerators = generatorCircle.querySelectorAll('.hangar-generator');
    
    if (allGenerators.length === 0) return;

    // Show income from 1-3 random generators
    const numToShow = Math.min(allGenerators.length, Math.floor(Math.random() * 3) + 1);
    const shown = new Set();
    
    for (let i = 0; i < numToShow; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * allGenerators.length);
        } while (shown.has(randomIndex) && shown.size < allGenerators.length);
        
        shown.add(randomIndex);
        const generator = allGenerators[randomIndex];
        
        // Get current actual position on screen (accounts for rotation)
        const rect = generator.getBoundingClientRect();
        const cps = parseFloat(generator.dataset.cps);
        const tier = parseInt(generator.dataset.tier) || 1;

        if (cps > 0) {
            // Apply intensity multiplier to displayed income (same as in updateCPS)
            const intensityRatio = gameState.clickIntensity / 100;
            const generatorIntensityMultiplier = 1.0 + (intensityRatio * 4.0 / 3);
            const actualCPS = cps * generatorIntensityMultiplier;
            
            const incomeNum = document.createElement('div');
            incomeNum.className = 'generator-income-bubble';
            incomeNum.textContent = `+${formatNumber(actualCPS)}`;
            
            // Adjust style based on tier
            if (tier >= 3) {
                incomeNum.style.fontSize = '1.2rem';
                incomeNum.style.color = '#ff6348';
            } else if (tier === 2) {
                incomeNum.style.fontSize = '1rem';
                incomeNum.style.color = '#feca57';
            }
            
            // Position at the current visual center of the rotated generator
            // Account for floating-numbers container position
            const floatingRect = elements.floatingNumbers.getBoundingClientRect();
            incomeNum.style.left = (rect.left + rect.width / 2 - floatingRect.left) + 'px';
            incomeNum.style.top = (rect.top + rect.height / 2 - floatingRect.top) + 'px';

            elements.floatingNumbers.appendChild(incomeNum);

            setTimeout(() => incomeNum.remove(), 2500);
        }
    }
}

function createClickWave(x, y) {
    if (!elements.clickWaves) return;

    // Ограничиваем количество одновременных волн для производительности
    const existingWaves = elements.clickWaves.children.length;
    if (existingWaves > 8) { // Максимум 8 волн одновременно
        return;
    }

    // Получаем позицию клика относительно всей игровой области
    const rect = elements.clickWaves.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    // Определяем цвет волн в зависимости от активного ивента и интенсивности
    const intensityRatio = gameState.clickIntensity / 100;
    let baseOpacity = 0.8 + (intensityRatio * 0.2); // От 0.8 до 1.0
    
    let waveColor = `rgba(0, 184, 148, ${baseOpacity})`; // Обычный зеленый
    let glowColor = `rgba(0, 184, 148, ${0.3 + intensityRatio * 0.2})`;
    let waveClass = 'click-wave';
    
    if (gameState.goldenCappuccino.active) {
        waveColor = `rgba(255, 215, 0, ${0.9 + intensityRatio * 0.1})`; // Золотой
        glowColor = `rgba(255, 215, 0, ${0.4 + intensityRatio * 0.3})`;
        waveClass = 'click-wave golden-wave';
    } else if (gameState.brainrotFrenzy.active) {
        waveColor = `rgba(255, 71, 87, ${0.9 + intensityRatio * 0.1})`; // Красный
        glowColor = `rgba(255, 71, 87, ${0.4 + intensityRatio * 0.3})`;
        waveClass = 'click-wave frenzy-wave';
    } else if (gameState.triumphBonus.active) {
        waveColor = `rgba(255, 255, 255, ${0.9 + intensityRatio * 0.1})`; // Белый для триумфа
        glowColor = `rgba(255, 255, 255, ${0.5 + intensityRatio * 0.3})`;
        waveClass = 'click-wave triumph-wave';
    } else if (intensityRatio > 0.7) {
        // При высокой интенсивности обычные волны становятся более яркими и быстрыми
        waveColor = `rgba(0, 255, 170, ${baseOpacity})`; // Более яркий зеленый
        glowColor = `rgba(0, 255, 170, ${0.4 + intensityRatio * 0.2})`;
        waveClass = 'click-wave intensity-wave';
    }

    // Создаем основную волну
    const wave = document.createElement('div');
    wave.className = waveClass;
    wave.style.left = relX + 'px';
    wave.style.top = relY + 'px';
    wave.style.borderColor = waveColor;
    // Убираем тяжелые box-shadow для лучшей производительности
    elements.clickWaves.appendChild(wave);

    // Создаем дополнительные волны только если волн немного (для производительности)
    if (existingWaves < 4) {
        setTimeout(() => {
            if (elements.clickWaves && elements.clickWaves.children.length < 8) {
                const wave2 = document.createElement('div');
                wave2.className = waveClass;
                wave2.style.left = relX + 'px';
                wave2.style.top = relY + 'px';
                wave2.style.animationDelay = '0.3s';
                wave2.style.opacity = '0.4';
                wave2.style.borderColor = waveColor;
                elements.clickWaves.appendChild(wave2);
                
                setTimeout(() => {
                    if (wave2.parentNode) {
                        wave2.remove();
                    }
                }, 1500);
            }
        }, 200);
    }

    // Удаляем основную волну
    setTimeout(() => {
        if (wave.parentNode) {
            wave.remove();
        }
    }, 1200); // Соответствует длительности анимации
}

// Центральный счетчик с бегущими цифрами
let lastDisplayedValue = 0;

function updateCentralCounter(newValue) {
    const counterDisplay = document.getElementById('central-counter');
    if (!counterDisplay) return;

    // Форматируем число с 2 знаками после запятой
    const currentValue = Math.floor(newValue * 100) / 100; // Округляем до сотых
    const integerPart = Math.floor(currentValue);
    const decimalPart = Math.round((currentValue - integerPart) * 100);
    
    const integerStr = integerPart.toString();
    const decimalStr = decimalPart.toString().padStart(2, '0');
    
    // Динамическое количество разрядов: длина числа + 1 ведущий ноль (только для целой части)
    const displayDigits = integerStr.length + 1;
    
    // Если это первый раз или контейнер пустой, пересоздаем счетчик
    const digitContainers = counterDisplay.querySelectorAll('.digit-container');
    if (lastDisplayedValue === 0 || digitContainers.length === 0) {
        rebuildCentralCounter(integerStr, decimalStr);
        lastDisplayedValue = currentValue;
        return;
    }

    // Проверяем, изменилось ли количество нужных разрядов в целой части
    const lastIntegerPart = Math.floor(lastDisplayedValue);
    const lastIntegerStr = lastIntegerPart.toString();
    const lastDisplayDigits = lastIntegerStr.length + 1;
    
    if (lastDisplayDigits !== displayDigits) {
        rebuildCentralCounter(integerStr, decimalStr);
        lastDisplayedValue = currentValue;
        return;
    }

    // Обновляем постепенно для плавной анимации
    const lastDecimalPart = Math.round((lastDisplayedValue - lastIntegerPart) * 100);
    const lastDecimalStr = lastDecimalPart.toString().padStart(2, '0');
    
    const paddedIntegerNew = integerStr.padStart(displayDigits, '0');
    const paddedIntegerOld = lastIntegerStr.padStart(lastDisplayDigits, '0');
    
    // Обновляем целую часть
    for (let i = 0; i < paddedIntegerNew.length; i++) {
        const newDigit = parseInt(paddedIntegerNew[i]);
        const oldDigit = i < paddedIntegerOld.length ? parseInt(paddedIntegerOld[i]) : 0;
        
        if (newDigit !== oldDigit && i < digitContainers.length) {
            animateDigitChange(digitContainers[i], newDigit);
            
            // Убираем класс leading-zero если цифра стала значащей
            if (newDigit !== 0 && digitContainers[i].classList.contains('leading-zero')) {
                digitContainers[i].classList.remove('leading-zero');
            }
        }
    }
    
    // Обновляем десятичную часть
    const decimalContainers = counterDisplay.querySelectorAll('.decimal-digit-container');
    for (let i = 0; i < 2; i++) {
        const newDigit = parseInt(decimalStr[i]);
        const oldDigit = parseInt(lastDecimalStr[i]);
        
        if (newDigit !== oldDigit && i < decimalContainers.length) {
            animateDigitChange(decimalContainers[i], newDigit);
        }
    }
    
    lastDisplayedValue = currentValue;
}

function rebuildCentralCounter(integerStr, decimalStr) {
    const counterDisplay = document.getElementById('central-counter');
    if (!counterDisplay) return;
    
    counterDisplay.innerHTML = '';
    
    // Динамическое количество разрядов: длина числа + 1 ведущий ноль
    const displayDigits = integerStr.length + 1;
    const paddedValue = integerStr.padStart(displayDigits, '0');
    
    // Разбиваем число на группы по 3 цифры (тысячи)
    const groups = [];
    for (let i = paddedValue.length; i > 0; i -= 3) {
        const start = Math.max(0, i - 3);
        groups.unshift(paddedValue.slice(start, i));
    }
    
    // Создаем целую часть
    groups.forEach((group, groupIndex) => {
        // Создаем цифры для группы
        for (let i = 0; i < group.length; i++) {
            const digit = parseInt(group[i]);
            const digitContainer = createDigitContainer(digit);
            
            // Добавляем специальный класс для ведущего нуля (только самый левый ноль)
            if (groupIndex === 0 && i === 0 && digit === 0) {
                digitContainer.classList.add('leading-zero');
            }
            
            counterDisplay.appendChild(digitContainer);
        }
        
        // Добавляем разделитель тысяч, если это не последняя группа
        if (groupIndex < groups.length - 1) {
            const separator = document.createElement('span');
            separator.className = 'counter-separator';
            separator.textContent = ',';
            counterDisplay.appendChild(separator);
        }
    });
    
    // Добавляем десятичную точку
    const decimalPoint = document.createElement('span');
    decimalPoint.className = 'decimal-point';
    decimalPoint.textContent = '.';
    counterDisplay.appendChild(decimalPoint);
    
    // Создаем десятичную часть (2 цифры)
    for (let i = 0; i < 2; i++) {
        const digit = parseInt(decimalStr[i]);
        const digitContainer = createDigitContainer(digit);
        digitContainer.classList.add('decimal-digit-container');
        counterDisplay.appendChild(digitContainer);
    }
}

function createDigitContainer(initialDigit = 0) {
    const container = document.createElement('div');
    container.className = 'digit-container';
    container.dataset.digit = initialDigit.toString();
    
    const wrapper = document.createElement('div');
    wrapper.className = 'digit-wrapper';
    
    // Создаем все цифры от 0 до 9
    for (let i = 0; i <= 9; i++) {
        const digitSpan = document.createElement('span');
        digitSpan.className = 'digit';
        digitSpan.textContent = i.toString();
        wrapper.appendChild(digitSpan);
    }
    
    // Устанавливаем начальную позицию (правильные размеры согласно CSS)
    let digitHeight = 42; // Размер для header (.header-counter .digit)
    if (container.classList && container.classList.contains('decimal-digit-container')) {
        digitHeight = 36; // Размер для десятичных в header (.header-counter .decimal-digit-container .digit)
    }
    
    wrapper.style.transform = `translateY(${-initialDigit * digitHeight}px)`;
    
    container.appendChild(wrapper);
    return container;
}

function animateDigitChange(container, newDigit) {
    const wrapper = container.querySelector('.digit-wrapper');
    if (!wrapper) return;
    
    // Добавляем эффект свечения
    container.classList.add('updating');
    setTimeout(() => container.classList.remove('updating'), 500);
    
    // Определяем высоту цифры в зависимости от типа контейнера (правильные значения из CSS)
    let digitHeight = 42; // Размер для header (.header-counter .digit)
    if (container.classList.contains('decimal-digit-container')) {
        digitHeight = 36; // Размер для десятичных в header (.header-counter .decimal-digit-container .digit)
    }
    
    // Анимируем переход к новой цифре
    wrapper.style.transform = `translateY(${-newDigit * digitHeight}px)`;
    container.dataset.digit = newDigit.toString();
}

function updateCentralCounterTheme() {
    const headerCounter = document.querySelector('.header-counter');
    const activeEffectGroup = document.querySelector('.active-effect-group');
    
    if (headerCounter) {
        // Убираем все классы тем у счетчика
        headerCounter.classList.remove('golden-active', 'frenzy-active', 'triumph-active');
    }
    
    if (activeEffectGroup) {
        // Убираем все классы тем у группы ивентов
        activeEffectGroup.classList.remove('golden-active', 'frenzy-active', 'triumph-active');
    }
    
    // Добавляем класс в зависимости от активного события
    if (gameState.triumphBonus.active) {
        if (headerCounter) headerCounter.classList.add('triumph-active');
        if (activeEffectGroup) activeEffectGroup.classList.add('triumph-active');
    } else if (gameState.goldenCappuccino.active) {
        if (headerCounter) headerCounter.classList.add('golden-active');
        if (activeEffectGroup) activeEffectGroup.classList.add('golden-active');
    } else if (gameState.brainrotFrenzy.active) {
        if (headerCounter) headerCounter.classList.add('frenzy-active');
        if (activeEffectGroup) activeEffectGroup.classList.add('frenzy-active');
    }
} 

// Кирпичная кладка для эволюции
let brickPattern = [];
let lastBrickProgress = 0;

function generateBrickPattern() {
    if (!elements.brickOverlay) return;
    
    brickPattern = [];
    lastBrickProgress = 0;
    elements.brickOverlay.innerHTML = '';
    
    // Получаем реальный размер контейнера из DOM, чтобы он совпадал с CSS
    const containerSize = elements.brickOverlay.offsetWidth;
    if (containerSize === 0) return; // Если элемент скрыт, ничего не делаем

    const brickSizes = ['small', 'medium', 'large'];
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const radius = containerSize / 2 - 5; // Радиус с небольшим отступом
    
    // Более плотная сетка кирпичей
    for (let y = 0; y < containerSize; y += 10) {
        for (let x = 0; x < containerSize; x += 12) {
            // Добавляем чередующееся смещение для кирпичной кладки
            let actualX = x;
            if (Math.floor(y / 10) % 2 === 1) {
                actualX += 6; // Половина шага для смещения
            }
            
            // Добавляем небольшие случайные смещения
            const finalX = actualX + Math.random() * 4 - 2;
            const finalY = y + Math.random() * 4 - 2;
            
            // Проверяем, попадает ли кирпич в круг
            const distanceFromCenter = Math.sqrt((finalX - centerX) ** 2 + (finalY - centerY) ** 2);
            
            if (distanceFromCenter < radius) {
                const brick = document.createElement('div');
                const sizeClass = brickSizes[Math.floor(Math.random() * brickSizes.length)];
                
                brick.className = `brick ${sizeClass}`;
                brick.style.left = finalX + 'px';
                brick.style.top = finalY + 'px';
                
                // Добавляем индекс удаления для постепенного эффекта (случайный порядок)
                brick.dataset.removeOrder = Math.random();
                
                elements.brickOverlay.appendChild(brick);
                brickPattern.push(brick);
            }
        }
    }
}

function updateBrickOverlay(evolutionProgress) {
    if (!brickPattern.length) return;
    
    // Кирпичи полностью исчезают к 90% прогресса
    const brickProgress = Math.min(evolutionProgress / 90 * 100, 100);
    
    // Проверяем, изменился ли прогресс достаточно для удаления новых кирпичей
    const progressDiff = brickProgress - lastBrickProgress;
    if (progressDiff < 2) return; // Удаляем кирпичи каждые 2% прогресса (чаще)
    
    // Получаем оставшиеся кирпичи
    const totalBricks = brickPattern.filter(brick => brick.parentNode && !brick.classList.contains('crumbling')).length;
    
    // При достижении 90% принудительно удаляем ВСЕ оставшиеся кирпичи
    let bricksToRemoveNow;
    if (brickProgress >= 90) {
        bricksToRemoveNow = totalBricks; // Удаляем всё что осталось
    } else {
        // Вычисляем сколько кирпичей должно остаться при текущем прогрессе
        const totalBricksAtStart = brickPattern.length;
        const targetRemainingBricks = Math.round(totalBricksAtStart * (100 - brickProgress) / 100);
        bricksToRemoveNow = Math.max(0, totalBricks - targetRemainingBricks);
    }
    
    if (bricksToRemoveNow <= 0) return;
    
    // Сортируем кирпичи по порядку удаления и берем нужное количество
    const availableBricks = brickPattern
        .filter(brick => brick.parentNode && !brick.classList.contains('crumbling'))
        .sort((a, b) => parseFloat(a.dataset.removeOrder) - parseFloat(b.dataset.removeOrder))
        .slice(0, bricksToRemoveNow);
    
    // При 90%+ принудительно удаляем даже те что уже в процессе crumbling
    if (brickProgress >= 90) {
        const allRemainingBricks = brickPattern.filter(brick => brick.parentNode);
        allRemainingBricks.forEach(brick => {
            if (brick.parentNode) {
                brick.remove();
            }
        });
        return;
    }
    
    availableBricks.forEach((brick, index) => {
        if (brick && !brick.classList.contains('crumbling')) {
            // Добавляем случайную задержку для более органичного эффекта
            setTimeout(() => {
                brick.classList.add('crumbling');
                setTimeout(() => {
                    if (brick.parentNode) {
                        brick.remove();
                    }
                }, 500);
            }, index * 80 + Math.random() * 150);
        }
    });
    
    lastBrickProgress = brickProgress;
}

// Инициализируем кирпичи при загрузке
function initializeBricks() {
    generateBrickPattern();
}

// Обновляем отображение персонажа (для использования при загрузке игры)
function updateCharacterDisplay() {
    console.log('updateCharacterDisplay called with character:', gameState.currentCharacter);
    const currentCharacter = gameState.characters[gameState.currentCharacter];
    if (currentCharacter && elements.characterImage && elements.characterName && elements.characterDesc) {
        elements.characterImage.src = currentCharacter.image;
        elements.characterName.textContent = currentCharacter.name;
        elements.characterDesc.textContent = currentCharacter.desc;
        
        // Обновляем текст следующей эволюции
        if (elements.evolutionText) {
            const nextCharacter = gameState.characters[gameState.currentCharacter + 1];
            elements.evolutionText.textContent = `Next: ${nextCharacter?.name || 'Max Evolution'} (${formatNumber(nextCharacter?.unlockAt || 0)} BP)`;
        }
        
        // НЕ обновляем прогресс здесь - он обновляется через updateEvolutionProgress()
        
        // Показываем или скрываем кнопку "Next" в зависимости от состояния паузы
        if (elements.evolutionNextBtn) {
            elements.evolutionNextBtn.style.display = gameState.evolutionPaused ? 'block' : 'none';
        }
    }
}

function initEvolutionNextButton() {
    elements.evolutionNextBtn.addEventListener('click', () => {
        if (gameState.evolutionPaused) {
            // Переходим к следующему персонажу
            gameState.currentCharacter = (gameState.currentCharacter + 1) % gameState.characters.length;
            gameState.evolutionProgress = 0;
            gameState.evolutionPaused = false;
            
            // Скрываем кнопку
            elements.evolutionNextBtn.style.display = 'none';
            
            // Обновляем персонажа напрямую
            const newCharacter = gameState.characters[gameState.currentCharacter];
            elements.characterImage.src = newCharacter.image;
            elements.characterName.textContent = newCharacter.name;
            elements.characterDesc.textContent = newCharacter.desc;
            
            // Сбрасываем визуальную шкалу эволюции
            elements.evolutionProgress.style.height = '0%';
            elements.evolutionText.textContent = `Next: ${gameState.characters[gameState.currentCharacter + 1]?.name || 'Max Evolution'} (${formatNumber(gameState.characters[gameState.currentCharacter + 1]?.unlockAt || 0)} BP)`;
            
            // Генерируем новые кирпичи сразу (закрываем нового персонажа)
            generateBrickPattern();
            
            // ВАЖНО: Сохраняем игру после переключения персонажа!
            if (typeof saveGame === 'function') {
                saveGame();
            }
        }
    });
}
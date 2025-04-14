document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        cookies: 0,
        cookiesAllTime: 0,
        cookiesPerClick: 1,
        cookiesPerSecond: 0,
        totalClicks: 0,
        handMadeCookies: 0,
        startTime: Date.now(),
        buildingsOwned: 0,
        settings: {
            soundEnabled: true,
            animationsEnabled: true,
            autoSaveEnabled: true
        },
        buildings: [
            {
                id: 'cursor',
                name: 'Cursor',
                description: 'Automatically clicks the cookie once every 10 seconds.',
                baseCost: 15,
                cost: 15,
                cpsIncrease: 0.1,
                count: 0,
                icon: 'fas fa-mouse-pointer',
                type: 'building'
            },
            {
                id: 'grandma',
                name: 'Grandma',
                description: 'A nice grandma to bake more cookies for you.',
                baseCost: 100,
                cost: 100,
                cpsIncrease: 1,
                count: 0,
                icon: 'fas fa-user',
                type: 'building'
            },
            {
                id: 'farm',
                name: 'Cookie Farm',
                description: 'Grows cookie plants from cookie seeds.',
                baseCost: 500,
                cost: 500,
                cpsIncrease: 5,
                count: 0,
                icon: 'fas fa-tractor',
                type: 'building'
            },
            {
                id: 'mine',
                name: 'Cookie Mine',
                description: 'Mines cookie dough from the depths of the earth.',
                baseCost: 2000,
                cost: 2000,
                cpsIncrease: 10,
                count: 0,
                icon: 'fas fa-hard-hat',
                type: 'building'
            },
            {
                id: 'factory',
                name: 'Cookie Factory',
                description: 'Mass produces cookies at industrial scale.',
                baseCost: 7000,
                cost: 7000,
                cpsIncrease: 40,
                count: 0,
                icon: 'fas fa-industry',
                type: 'building'
            }
        ],
        upgrades: [
            {
                id: 'reinforced-fingers',
                name: 'Reinforced Fingers',
                description: 'Your clicking is now more efficient.',
                baseCost: 50,
                cost: 50,
                clickIncrease: 1,
                purchased: false,
                icon: 'fas fa-hand-point-up',
                type: 'upgrade'
            },
            {
                id: 'golden-clicker',
                name: 'Golden Clicker',
                description: 'Clicking power is greatly increased.',
                baseCost: 200,
                cost: 200,
                clickIncrease: 5,
                purchased: false,
                icon: 'fas fa-hand-sparkles',
                type: 'upgrade'
            },
            {
                id: 'super-clicker',
                name: 'Super Clicker',
                description: 'Your clicking power is now super enhanced.',
                baseCost: 1000,
                cost: 1000,
                clickIncrease: 10,
                purchased: false,
                icon: 'fas fa-bolt',
                type: 'upgrade',
                requires: 'golden-clicker'
            },
            {
                id: 'double-cookies',
                name: 'Double Cookies',
                description: 'All buildings produce twice as many cookies.',
                baseCost: 5000,
                cost: 5000,
                cpsMultiplier: 2,
                purchased: false,
                icon: 'fas fa-cookie',
                type: 'upgrade'
            },
            {
                id: 'steel-plated-rollers',
                name: 'Steel-plated Rollers',
                description: 'Cursors are twice as efficient.',
                baseCost: 500,
                cost: 500,
                buildingBoost: {
                    buildingId: 'cursor',
                    multiplier: 2
                },
                purchased: false,
                icon: 'fas fa-cog',
                type: 'upgrade',
                requires: {
                    building: 'cursor',
                    count: 10
                }
            },
            {
                id: 'grandmas-recipe',
                name: 'Grandma\'s Secret Recipe',
                description: 'Grandmas are twice as efficient.',
                baseCost: 1000,
                cost: 1000,
                buildingBoost: {
                    buildingId: 'grandma',
                    multiplier: 2
                },
                purchased: false,
                icon: 'fas fa-book',
                type: 'upgrade',
                requires: {
                    building: 'grandma',
                    count: 10
                }
            }
        ],
        achievements: [
            {
                id: 'first-cookie',
                name: 'First Cookie',
                description: 'Click the cookie for the first time.',
                icon: 'fas fa-cookie-bite',
                unlocked: false,
                condition: state => state.totalClicks >= 1
            },
            {
                id: 'cookie-monster',
                name: 'Cookie Monster',
                description: 'Click the cookie 100 times.',
                icon: 'fas fa-drumstick-bite',
                unlocked: false,
                condition: state => state.totalClicks >= 100
            },
            {
                id: 'cookie-rain',
                name: 'Cookie Rain',
                description: 'Have 1000 total cookies.',
                icon: 'fas fa-cloud-rain',
                unlocked: false,
                condition: state => state.cookiesAllTime >= 1000,
                effect: () => startCookieRain()
            },
            {
                id: 'cookie-factory',
                name: 'Cookie Factory',
                description: 'Produce 10 cookies per second.',
                icon: 'fas fa-industry',
                unlocked: false,
                condition: state => state.cookiesPerSecond >= 10
            },
            {
                id: 'cookie-empire',
                name: 'Cookie Empire',
                description: 'Own 10 buildings.',
                icon: 'fas fa-building',
                unlocked: false,
                condition: state => state.buildingsOwned >= 10
            },
            {
                id: 'cookie-billionaire',
                name: 'Cookie Billionaire',
                description: 'Have 1,000,000 total cookies.',
                icon: 'fas fa-gem',
                unlocked: false,
                condition: state => state.cookiesAllTime >= 1000000
            }
        ]
    };

    // DOM Elements
    const cookieElement = document.getElementById('cookie');
    const cookieCountElement = document.getElementById('cookie-count');
    const cookiesPerSecondElement = document.getElementById('cookies-per-second');
    const shopButton = document.getElementById('shop-button');
    const shopModal = document.getElementById('shop-modal');
    const statsButton = document.getElementById('stats-button');
    const statsModal = document.getElementById('stats-modal');
    const achievementsButton = document.getElementById('achievements-button');
    const achievementsModal = document.getElementById('achievements-modal');
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const buildingsContainer = document.getElementById('buildings-container');
    const upgradesContainer = document.getElementById('upgrades-container');
    const achievementsContainer = document.getElementById('achievements-container');
    const notification = document.getElementById('notification');
    const achievementNotification = document.getElementById('achievement-notification');
    const achievementNameElement = document.getElementById('achievement-name');
    const totalClicksElement = document.getElementById('total-clicks');
    const clickPowerElement = document.getElementById('click-power');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const buySound = document.getElementById('buy-sound');
    const achievementSound = document.getElementById('achievement-sound');

    // Stats elements
    const statsCookiesBaked = document.getElementById('stats-cookies-baked');
    const statsTotalClicks = document.getElementById('stats-total-clicks');
    const statsBuildingsOwned = document.getElementById('stats-buildings-owned');
    const statsHandMade = document.getElementById('stats-hand-made');
    const statsCookiesPerClick = document.getElementById('stats-cookies-per-click');
    const statsCookiesPerSecond = document.getElementById('stats-cookies-per-second');
    const statsTimePlayed = document.getElementById('stats-time-played');

    // Settings elements
    const soundSetting = document.getElementById('sound-setting');
    const animationsSetting = document.getElementById('animations-setting');
    const autoSaveSetting = document.getElementById('auto-save-setting');
    const saveGameButton = document.getElementById('save-game');
    const loadGameButton = document.getElementById('load-game');
    const resetGameButton = document.getElementById('reset-game');

    // Load game from localStorage if available
    function loadGame() {
        const savedGame = localStorage.getItem('cookieClickerSave');
        if (savedGame) {
            try {
                const parsedSave = JSON.parse(savedGame);
                
                // Update game state with saved values while preserving structure
                gameState.cookies = parsedSave.cookies || 0;
                gameState.cookiesAllTime = parsedSave.cookiesAllTime || 0;
                gameState.cookiesPerClick = parsedSave.cookiesPerClick || 1;
                gameState.cookiesPerSecond = parsedSave.cookiesPerSecond || 0;
                gameState.totalClicks = parsedSave.totalClicks || 0;
                gameState.handMadeCookies = parsedSave.handMadeCookies || 0;
                gameState.buildingsOwned = parsedSave.buildingsOwned || 0;
                gameState.startTime = parsedSave.startTime || Date.now();
                
                // Load settings
                if (parsedSave.settings) {
                    gameState.settings.soundEnabled = parsedSave.settings.soundEnabled !== undefined ? 
                        parsedSave.settings.soundEnabled : true;
                    gameState.settings.animationsEnabled = parsedSave.settings.animationsEnabled !== undefined ? 
                        parsedSave.settings.animationsEnabled : true;
                    gameState.settings.autoSaveEnabled = parsedSave.settings.autoSaveEnabled !== undefined ? 
                        parsedSave.settings.autoSaveEnabled : true;
                }
                
                // Update buildings from save
                if (parsedSave.buildings) {
                    for (let i = 0; i < gameState.buildings.length; i++) {
                        const savedBuilding = parsedSave.buildings.find(b => b.id === gameState.buildings[i].id);
                        if (savedBuilding) {
                            gameState.buildings[i].count = savedBuilding.count || 0;
                            gameState.buildings[i].cost = savedBuilding.cost || gameState.buildings[i].baseCost;
                        }
                    }
                }
                
                // Update upgrades from save
                if (parsedSave.upgrades) {
                    for (let i = 0; i < gameState.upgrades.length; i++) {
                        const savedUpgrade = parsedSave.upgrades.find(u => u.id === gameState.upgrades[i].id);
                        if (savedUpgrade) {
                            gameState.upgrades[i].purchased = savedUpgrade.purchased || false;
                        }
                    }
                }
                
                // Update achievements from save
                if (parsedSave.achievements) {
                    for (let i = 0; i < gameState.achievements.length; i++) {
                        const savedAchievement = parsedSave.achievements.find(a => a.id === gameState.achievements[i].id);
                        if (savedAchievement) {
                            gameState.achievements[i].unlocked = savedAchievement.unlocked || false;
                        }
                    }
                }
                
                showNotification("Game loaded successfully!");
            } catch (error) {
                console.error("Error loading saved game:", error);
                showNotification("Failed to load saved game.");
            }
        }
    }

    // Save game to localStorage
    function saveGame() {
        try {
            localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
            showNotification("Game saved successfully!");
            return true;
        } catch (error) {
            console.error("Error saving game:", error);
            showNotification("Failed to save game.");
            return false;
        }
    }

    // Initialize the game
    function initGame() {
        loadGame();
        renderCookieCount();
        renderCookiesPerSecond();
        renderBuildings();
        renderUpgrades();
        renderAchievements();
        updateClickPower();
        updateTotalClicks();
        startAutoClickLoop();
        setupSettings();
        
        // Set up auto-save
        if (gameState.settings.autoSaveEnabled) {
            setInterval(saveGame, 60000); // Auto-save every minute
        }
        
        // Update statistics every second
        setInterval(updateStats, 1000);
    }

    // Event Listeners
    cookieElement.addEventListener('click', handleCookieClick);
    shopButton.addEventListener('click', () => openModal(shopModal));
    statsButton.addEventListener('click', () => openModal(statsModal));
    achievementsButton.addEventListener('click', () => openModal(achievementsModal));
    settingsButton.addEventListener('click', () => openModal(settingsModal));
    
    // Close buttons for all modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Tab switching in shop
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show selected tab content
            const tabToShow = button.dataset.tab;
            document.getElementById(`${tabToShow}-tab`).classList.remove('hidden');
        });
    });
    
    // Setting buttons
    saveGameButton.addEventListener('click', saveGame);
    loadGameButton.addEventListener('click', () => {
        loadGame();
        renderBuildings();
        renderUpgrades();
        renderAchievements();
        updateClickPower();
        updateTotalClicks();
        renderCookieCount();
        renderCookiesPerSecond();
        updateStats();
    });
    
    resetGameButton.addEventListener('click', () => {
        const confirmed = confirm("Are you sure you want to reset your game? All progress will be lost!");
        if (confirmed) {
            localStorage.removeItem('cookieClickerSave');
            location.reload();
        }
    });

    // Handle cookie click
    function handleCookieClick() {
        playSound(clickSound);
        
        if (gameState.settings.animationsEnabled) {
            cookieElement.classList.add('cookie-pop');
            setTimeout(() => {
                cookieElement.classList.remove('cookie-pop');
            }, 300);
        }
        
        gameState.cookies += gameState.cookiesPerClick;
        gameState.cookiesAllTime += gameState.cookiesPerClick;
        gameState.handMadeCookies += gameState.cookiesPerClick;
        gameState.totalClicks++;
        
        renderCookieCount();
        createCookieClickAnimation();
        updateTotalClicks();
        updateButtons();
        checkAchievements();
    }

    // Create cookie click animation
    function createCookieClickAnimation() {
        if (!gameState.settings.animationsEnabled) return;
        
        // Create a floating number animation
        const floatingNumber = document.createElement('div');
        floatingNumber.textContent = `+${gameState.cookiesPerClick}`;
        floatingNumber.style.position = 'absolute';
        floatingNumber.style.color = '#784315';
        floatingNumber.style.fontWeight = 'bold';
        floatingNumber.style.fontSize = '1.2rem';

        // Position near the cookie
        const cookieRect = cookieElement.getBoundingClientRect();
        const randomX = Math.random() * 40 - 20; // Random offset
        
        floatingNumber.style.left = `${cookieRect.left + cookieRect.width / 2 + randomX}px`;
        floatingNumber.style.top = `${cookieRect.top + cookieRect.height / 3}px`;
        floatingNumber.style.opacity = '1';
        floatingNumber.style.transition = 'top 1s, opacity 1s';
        
        document.body.appendChild(floatingNumber);
        
        // Animate the number floating up and fading
        setTimeout(() => {
            floatingNumber.style.top = `${cookieRect.top - 50}px`;
            floatingNumber.style.opacity = '0';
        }, 10);
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(floatingNumber);
        }, 1000);
    }

    // Open modal
    function openModal(modal) {
        // Close any open modals first
        document.querySelectorAll('.modal').forEach(m => {
            if (m.style.display === 'block') {
                closeModal(m);
            }
        });
        
        // Update stats if opening stats modal
        if (modal === statsModal) {
            updateStats();
        }
        
        modal.style.display = 'block';
        updateButtons();
    }

    // Close modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Start automatic cookie generation loop
    function startAutoClickLoop() {
        setInterval(() => {
            if (gameState.cookiesPerSecond > 0) {
                const cookiesGenerated = gameState.cookiesPerSecond / 10; // For smoother updates (10 times per second)
                gameState.cookies += cookiesGenerated;
                gameState.cookiesAllTime += cookiesGenerated;
                renderCookieCount();
                updateButtons();
                checkAchievements();
            }
        }, 100); // Update 10 times per second for smoother counter
    }

    // Render the current cookie count
    function renderCookieCount() {
        cookieCountElement.textContent = formatNumber(Math.floor(gameState.cookies));
    }

    // Render the cookies per second
    function renderCookiesPerSecond() {
        cookiesPerSecondElement.textContent = formatNumber(gameState.cookiesPerSecond.toFixed(1));
    }

    // Format number with commas for thousands
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Update total clicks display
    function updateTotalClicks() {
        totalClicksElement.textContent = formatNumber(gameState.totalClicks);
    }

    // Update click power display
    function updateClickPower() {
        clickPowerElement.textContent = `x${gameState.cookiesPerClick}`;
    }

    // Render buildings
    function renderBuildings() {
        buildingsContainer.innerHTML = '';
        
        gameState.buildings.forEach(building => {
            const buildingElement = document.createElement('div');
            buildingElement.className = `upgrade-item ${building.count > 0 ? 'owned' : ''}`;
            
            const buildingInfo = document.createElement('div');
            buildingInfo.className = 'upgrade-info';
            
            const buildingName = document.createElement('div');
            buildingName.className = 'upgrade-name';
            buildingName.innerHTML = `<i class="${building.icon}"></i> ${building.name}`;
            
            if (building.count > 0) {
                const counter = document.createElement('span');
                counter.className = 'counter';
                counter.textContent = building.count;
                buildingName.appendChild(counter);
            }
            
            const buildingDescription = document.createElement('div');
            buildingDescription.className = 'upgrade-description';
            buildingDescription.textContent = building.description;
            
            const buildingCost = document.createElement('div');
            buildingCost.className = 'upgrade-cost';
            buildingCost.textContent = `Cost: ${formatNumber(Math.floor(building.cost))} cookies`;
            
            const buildingCps = document.createElement('div');
            buildingCps.className = 'upgrade-description';
            buildingCps.textContent = `Produces: ${building.cpsIncrease} cookies per second`;
            
            buildingInfo.appendChild(buildingName);
            buildingInfo.appendChild(buildingDescription);
            buildingInfo.appendChild(buildingCps);
            buildingInfo.appendChild(buildingCost);
            
            const buyButton = document.createElement('button');
            buyButton.className = 'upgrade-button';
            buyButton.textContent = 'Buy';
            buyButton.disabled = gameState.cookies < building.cost;
            buyButton.dataset.id = building.id;
            
            buyButton.addEventListener('click', () => {
                purchaseBuilding(building.id);
            });
            
            buildingElement.appendChild(buildingInfo);
            buildingElement.appendChild(buyButton);
            
            buildingsContainer.appendChild(buildingElement);
        });
    }

    // Render upgrades
    function renderUpgrades() {
        upgradesContainer.innerHTML = '';
        
        gameState.upgrades.forEach(upgrade => {
            // Check if the upgrade should be shown (based on requirements)
            const shouldShow = shouldShowUpgrade(upgrade);
            if (!shouldShow) return;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-item ${upgrade.purchased ? 'owned' : ''}`;
            
            const upgradeInfo = document.createElement('div');
            upgradeInfo.className = 'upgrade-info';
            
            const upgradeName = document.createElement('div');
            upgradeName.className = 'upgrade-name';
            upgradeName.innerHTML = `<i class="${upgrade.icon}"></i> ${upgrade.name}`;
            
            const upgradeDescription = document.createElement('div');
            upgradeDescription.className = 'upgrade-description';
            upgradeDescription.textContent = upgrade.description;
            
            const upgradeCost = document.createElement('div');
            upgradeCost.className = 'upgrade-cost';
            upgradeCost.textContent = `Cost: ${formatNumber(Math.floor(upgrade.cost))} cookies`;
            
            upgradeInfo.appendChild(upgradeName);
            upgradeInfo.appendChild(upgradeDescription);
            upgradeInfo.appendChild(upgradeCost);
            
            const buyButton = document.createElement('button');
            buyButton.className = 'upgrade-button';
            buyButton.textContent = upgrade.purchased ? 'Purchased' : 'Buy';
            buyButton.disabled = gameState.cookies < upgrade.cost || upgrade.purchased;
            buyButton.dataset.id = upgrade.id;
            
            buyButton.addEventListener('click', () => {
                purchaseUpgrade(upgrade.id);
            });
            
            upgradeElement.appendChild(upgradeInfo);
            upgradeElement.appendChild(buyButton);
            
            upgradesContainer.appendChild(upgradeElement);
        });
    }

    // Check if an upgrade should be shown based on requirements
    function shouldShowUpgrade(upgrade) {
        // If it's already purchased, always show it
        if (upgrade.purchased) return true;
        
        // Check if it requires another upgrade
        if (upgrade.requires) {
            // If it requires a specific upgrade
            if (typeof upgrade.requires === 'string') {
                const requiredUpgrade = gameState.upgrades.find(u => u.id === upgrade.requires);
                if (!requiredUpgrade || !requiredUpgrade.purchased) return false;
            }
            // If it requires a building count
            else if (upgrade.requires.building && upgrade.requires.count) {
                const building = gameState.buildings.find(b => b.id === upgrade.requires.building);
                if (!building || building.count < upgrade.requires.count) return false;
            }
        }
        
        return true;
    }

    // Render achievements
    function renderAchievements() {
        achievementsContainer.innerHTML = '';
        
        gameState.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            
            const achievementIcon = document.createElement('div');
            achievementIcon.className = 'achievement-icon';
            achievementIcon.innerHTML = `<i class="${achievement.icon}"></i>`;
            
            const achievementName = document.createElement('div');
            achievementName.className = 'achievement-name';
            achievementName.textContent = achievement.unlocked ? achievement.name : '???';
            
            const achievementDescription = document.createElement('div');
            achievementDescription.className = 'achievement-description';
            achievementDescription.textContent = achievement.unlocked ? achievement.description : 'Achievement locked';
            
            achievementElement.appendChild(achievementIcon);
            achievementElement.appendChild(achievementName);
            achievementElement.appendChild(achievementDescription);
            
            achievementsContainer.appendChild(achievementElement);
        });
    }

    // Update buttons state
    function updateButtons() {
        // Update building buttons
        const buildingButtons = document.querySelectorAll('#buildings-container .upgrade-button');
        buildingButtons.forEach(button => {
            const buildingId = button.dataset.id;
            const building = gameState.buildings.find(b => b.id === buildingId);
            if (building) {
                button.disabled = gameState.cookies < building.cost;
            }
        });
        
        // Update upgrade buttons
        const upgradeButtons = document.querySelectorAll('#upgrades-container .upgrade-button');
        upgradeButtons.forEach(button => {
            const upgradeId = button.dataset.id;
            const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
            if (upgrade) {
                button.disabled = gameState.cookies < upgrade.cost || upgrade.purchased;
            }
        });
    }

    // Purchase a building
    function purchaseBuilding(buildingId) {
        const buildingIndex = gameState.buildings.findIndex(b => b.id === buildingId);
        
        if (buildingIndex === -1) return;
        
        const building = gameState.buildings[buildingIndex];
        
        if (gameState.cookies < building.cost) {
            showNotification("Not enough cookies!");
            return;
        }
        
        playSound(buySound);
        
        // Purchase logic
        gameState.cookies -= building.cost;
        building.count++;
        gameState.buildingsOwned++;
        
        // Apply any building multipliers from upgrades
        let buildingCpsIncrease = building.cpsIncrease;
        gameState.upgrades.forEach(upgrade => {
            if (upgrade.purchased && upgrade.buildingBoost && upgrade.buildingBoost.buildingId === building.id) {
                buildingCpsIncrease *= upgrade.buildingBoost.multiplier;
            }
        });
        
        // Apply global CPS multiplier if applicable
        gameState.upgrades.forEach(upgrade => {
            if (upgrade.purchased && upgrade.cpsMultiplier) {
                buildingCpsIncrease *= upgrade.cpsMultiplier;
            }
        });
        
        gameState.cookiesPerSecond += buildingCpsIncrease;
        
        // Increase cost for next purchase
        building.cost = Math.ceil(building.baseCost * Math.pow(1.15, building.count));
        
        // Update UI
        renderCookieCount();
        renderCookiesPerSecond();
        renderBuildings();
        renderUpgrades(); // Some upgrades might become available
        
        showNotification(`Purchased ${building.name}!`);
        checkAchievements();
    }

    // Purchase an upgrade
    function purchaseUpgrade(upgradeId) {
        const upgradeIndex = gameState.upgrades.findIndex(u => u.id === upgradeId);
        
        if (upgradeIndex === -1) return;
        
        const upgrade = gameState.upgrades[upgradeIndex];
        
        if (gameState.cookies < upgrade.cost) {
            showNotification("Not enough cookies!");
            return;
        }
        
        if (upgrade.purchased) {
            showNotification("Already purchased!");
            return;
        }
        
        playSound(buySound);
        
        // Purchase logic
        gameState.cookies -= upgrade.cost;
        upgrade.purchased = true;
        
        // Apply upgrade effects
        if (upgrade.clickIncrease) {
            gameState.cookiesPerClick += upgrade.clickIncrease;
            updateClickPower();
        }
        
        if (upgrade.buildingBoost) {
            // Recalculate CPS for all buildings
            recalculateCPS();
        }
        
        if (upgrade.cpsMultiplier) {
            // Recalculate CPS with the new multiplier
            recalculateCPS();
        }
        
        // Update UI
        renderCookieCount();
        renderCookiesPerSecond();
        renderUpgrades();
        
        showNotification(`Purchased ${upgrade.name}!`);
        checkAchievements();
    }

    // Recalculate the total cookies per second
    function recalculateCPS() {
        let newCPS = 0;
        
        gameState.buildings.forEach(building => {
            let buildingCPS = building.cpsIncrease * building.count;
            
            // Apply building-specific boosts
            gameState.upgrades.forEach(upgrade => {
                if (upgrade.purchased && upgrade.buildingBoost && upgrade.buildingBoost.buildingId === building.id) {
                    buildingCPS *= upgrade.buildingBoost.multiplier;
                }
            });
            
            newCPS += buildingCPS;
        });
        
        // Apply global CPS multiplier
        gameState.upgrades.forEach(upgrade => {
            if (upgrade.purchased && upgrade.cpsMultiplier) {
                newCPS *= upgrade.cpsMultiplier;
            }
        });
        
        gameState.cookiesPerSecond = newCPS;
        renderCookiesPerSecond();
    }

    // Check for achievements
    function checkAchievements() {
        let newAchievements = false;
        
        gameState.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(gameState)) {
                achievement.unlocked = true;
                newAchievements = true;
                
                // Show achievement notification
                showAchievementNotification(achievement);
                
                // Run effect if exists
                if (achievement.effect && typeof achievement.effect === 'function') {
                    achievement.effect();
                }
            }
        });
        
        if (newAchievements) {
            renderAchievements();
        }
    }

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Show achievement notification
    function showAchievementNotification(achievement) {
        playSound(achievementSound);
        
        achievementNameElement.textContent = achievement.name;
        achievementNotification.classList.add('show');
        
        setTimeout(() => {
            achievementNotification.classList.remove('show');
        }, 5000);
    }

    // Play sound
    function playSound(sound) {
        if (gameState.settings.soundEnabled && sound) {
            // Clone the audio element to allow overlapping sounds
            const soundClone = sound.cloneNode();
            soundClone.volume = 0.3;
            soundClone.play();
            
            // Clean up the clone after it's done playing
            soundClone.onended = () => {
                soundClone.remove();
            };
        }
    }

    // Update statistics
    function updateStats() {
        if (statsModal.style.display !== 'block') return;
        
        statsCookiesBaked.textContent = formatNumber(Math.floor(gameState.cookiesAllTime));
        statsTotalClicks.textContent = formatNumber(gameState.totalClicks);
        statsBuildingsOwned.textContent = formatNumber(gameState.buildingsOwned);
        statsHandMade.textContent = formatNumber(Math.floor(gameState.handMadeCookies));
        statsCookiesPerClick.textContent = formatNumber(gameState.cookiesPerClick);
        statsCookiesPerSecond.textContent = formatNumber(gameState.cookiesPerSecond.toFixed(1));
        
        // Calculate time played
        const now = Date.now();
        const timePlayed = Math.floor((now - gameState.startTime) / 1000); // In seconds
        const minutes = Math.floor(timePlayed / 60);
        const seconds = timePlayed % 60;
        statsTimePlayed.textContent = `${minutes}m ${seconds}s`;
    }

    // Setup settings panel
    function setupSettings() {
        soundSetting.checked = gameState.settings.soundEnabled;
        animationsSetting.checked = gameState.settings.animationsEnabled;
        autoSaveSetting.checked = gameState.settings.autoSaveEnabled;
        
        soundSetting.addEventListener('change', () => {
            gameState.settings.soundEnabled = soundSetting.checked;
        });
        
        animationsSetting.addEventListener('change', () => {
            gameState.settings.animationsEnabled = animationsSetting.checked;
        });
        
        autoSaveSetting.addEventListener('change', () => {
            gameState.settings.autoSaveEnabled = autoSaveSetting.checked;
        });
    }

    // Cookie Rain Effect
    function startCookieRain() {
        if (!gameState.settings.animationsEnabled) return;
        
        // Create 20 falling cookies
        for (let i = 0; i < 20; i++) {
            createFallingCookie();
        }
    }

    function createFallingCookie() {
        const cookie = document.createElement('img');
        cookie.src = 'public/images/cookie.png';
        cookie.className = 'cookie-rain';
        cookie.style.left = `${Math.random() * 100}vw`;
        cookie.style.animationDuration = `${Math.random() * 5 + 3}s`; // Between 3-8s
        
        document.body.appendChild(cookie);
        
        // Remove the cookie after animation
        cookie.addEventListener('animationend', () => {
            cookie.remove();
        });
    }

    // Initialize the game
    initGame();
}); 
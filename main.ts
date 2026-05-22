
/**
 * THE ECHO SWAP PROTOCOL: MULTI-CHAIN GAUNTLET (GAP BALANCED)
 * Controls:
 * - Left/Right Arrows: Move
 * - A Button (Space Bar): Jump 
 * - B Button (Enter Key): Deploy Echo (3-Second Auto-Return)
 */

namespace SpriteKind {
    export const Echo = SpriteKind.create()
    export const Platform = SpriteKind.create()
    export const Hazard = SpriteKind.create()
    export const Switch = SpriteKind.create()
    export const SwitchTwo = SpriteKind.create()
    export const Gate = SpriteKind.create()
    export const GateTwo = SpriteKind.create()
    export const Goal = SpriteKind.create()
    export const Coin = SpriteKind.create()
}

// --- 1. GAME STATE CONFIGURATION ---
let isEchoActive = false
let isGateOneOpen = false
let isGateTwoOpen = false
let savedX = 0
let savedY = 0

let player: Sprite = null
let currentEcho: Sprite = null
let laserGate1: Sprite = null
let laserGate2: Sprite = null
let floorSwitch1: Sprite = null
let floorSwitch2: Sprite = null

scene.setBackgroundColor(15) // Deep prototype void black

// --- 2. SPRITE ART DESIGNS ---
player = sprites.create(img`
    . . . . 6 6 6 6 . . . . 
    . . . 6 6 1 6 1 6 . . . 
    . . . 6 6 6 6 6 6 . . . 
    . . . . 6 6 6 6 . . . . 
    . . 6 6 7 7 7 7 6 6 . . 
    . 6 6 7 7 7 7 7 7 6 6 . 
    . 6 . 7 7 7 7 7 7 . 6 . 
    . 6 . 7 7 7 7 7 7 . 6 . 
    . . . . 7 7 7 7 . . . . 
    . . . . 6 6 . 6 6 . . . 
    . . . 6 6 6 . 6 6 6 . . 
    . . . 1 1 1 . 1 1 1 . . 
`, SpriteKind.Player)

player.setPosition(20, 60)
player.ay = 350
controller.moveSprite(player, 85, 0)
scene.cameraFollowSprite(player)

// --- 3. LEVEL DESIGN (GEOMETRY BALANCED) ---
let platforms: Sprite[] = []

function buildFloor(x: number, y: number, w: number, h: number, color: number) {
    let imgBuf = image.create(w, h)
    imgBuf.fill(color)
    let block = sprites.create(imgBuf, SpriteKind.Platform)
    block.setPosition(x, y)
    platforms.push(block)
}

function buildSpikes(x: number, y: number, w: number, h: number) {
    let imgBuf = image.create(w, h)
    imgBuf.fill(2)
    let haz = sprites.create(imgBuf, SpriteKind.Hazard)
    haz.setPosition(x, y)
}

function spawnCoin(x: number, y: number) {
    let coin = sprites.create(img`
        . . 5 5 5 . . 
        . 5 5 1 5 5 . 
        . 5 1 1 1 5 . 
        . 5 5 1 5 5 . 
        . . 5 5 5 . . 
    `, SpriteKind.Coin)
    coin.setPosition(x, y)
}

// === ACT 1: KI (THE RUNWAY) ===
buildFloor(60, 95, 120, 20, 11)
buildFloor(190, 115, 80, 20, 14)
spawnCoin(190, 95)

// === ACT 2: SHŌ (THE MID-AIR CHAIN SWAP VOID - CALIBRATED) ===
buildFloor(270, 115, 40, 20, 14)  // Start cliff
buildSpikes(380, 120, 180, 10)     // Pit scaled down slightly to prevent physics engine failure

// Anchor platform widened from 12px to 24px for cleaner landing space
buildFloor(355, 95, 24, 12, 5)
spawnCoin(355, 75)

buildFloor(460, 115, 50, 20, 14)  // Far-side cliff brought closer (from 490 down to 460)

// === ACT 3: TEN (THE DOUBLE-GATE TERMINAL PUZZLE) ===
buildFloor(580, 90, 130, 15, 11)   // Central Secure Deck (Adjusted for new Act 2 layout)

// Deep Pit Switch #1 (Left Side Challenge)
buildFloor(540, 145, 30, 15, 12)
floorSwitch1 = sprites.create(img`
    . . 4 4 4 4 . .
    . 4 5 5 5 5 4 .
    4 5 2 2 2 2 5 4
`, SpriteKind.Switch)
floorSwitch1.setPosition(540, 137)

// Deep Pit Switch #2 (Right Side Challenge)
buildFloor(645, 145, 30, 15, 12)
floorSwitch2 = sprites.create(img`
    . . 4 4 4 4 . .
    . 4 5 5 5 5 4 .
    4 5 4 4 4 4 5 4
`, SpriteKind.SwitchTwo)
floorSwitch2.setPosition(645, 137)

// Security Laser Barrier #1 (Red Gate)
laserGate1 = sprites.create(img`
    2 2 2 2
    . 2 2 .
    2 2 2 2
`, SpriteKind.Gate)
laserGate1.setPosition(600, 77)

// Security Laser Barrier #2 (Orange Gate)
laserGate2 = sprites.create(img`
    4 4 4 4
    . 4 4 .
    4 4 4 4
`, SpriteKind.GateTwo)
laserGate2.setPosition(620, 77)

// === ACT 4: KETSU (THE VERTIGO ASCENT WALL - FIXED JUMP GAP) ===
buildFloor(745, 85, 120, 20, 11)  // Brought closer and set at optimal jump height 

// Advanced Vertical Coin Trailing
spawnCoin(685, 65)
spawnCoin(705, 50)
spawnCoin(725, 35)

// Quantum Goal Extraction Flag
let levelGoal = sprites.create(img`
    . 5 5 5 5 5 . .
    . 5 5 5 5 5 5 .
    . 5 5 5 5 5 . .
    . 5 . . . . . .
    . 7 . . . . . .
    . 7 . . . . . .
    7 7 7 . . . . .
`, SpriteKind.Goal)
levelGoal.setPosition(785, 65)


// --- 4. ENGINE PHYSICS ENGINE ---
let jumpGrace = 0

game.onUpdate(function () {
    let grounded = false

    for (let p of platforms) {
        if (player.overlapsWith(p)) {
            if (player.vy >= 0 && (player.bottom - player.vy) <= p.top + 8) {
                player.bottom = p.top
                player.vy = 0
                grounded = true
            } else {
                if (player.x < p.x) {
                    player.right = p.left - 1
                } else {
                    player.left = p.right + 1
                }
            }
        }
    }

    if (grounded) {
        jumpGrace = 8
    } else if (jumpGrace > 0) {
        jumpGrace--
    }

    // Solid Boundaries for Laser Gate 1
    if (!isGateOneOpen && player.overlapsWith(laserGate1)) {
        player.vy = 0
        if (player.x < laserGate1.x) {
            player.right = laserGate1.left - 1
        } else {
            player.left = laserGate1.right + 1
        }
    }

    // Solid Boundaries for Laser Gate 2
    if (!isGateTwoOpen && player.overlapsWith(laserGate2)) {
        player.vy = 0
        if (player.x < laserGate2.x) {
            player.right = laserGate2.left - 1
        } else {
            player.left = laserGate2.right + 1
        }
    }

    if (player.y > 155) {
        game.over(false, effects.melt)
    }
})


// --- 5. PLAYER INPUT ACTIONS ---

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jumpGrace > 0) {
        player.vy = -145
        jumpGrace = 0
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isEchoActive) {
        player.sayText("LINK BUSY", 400)
        return
    }

    isEchoActive = true
    savedX = player.x
    savedY = player.y

    currentEcho = sprites.create(img`
        . . . . 9 9 9 9 . . . . 
        . . . 9 9 1 9 1 9 . . . 
        . . . 9 9 9 9 9 9 . . . 
        . . . . 9 9 9 9 . . . . 
        . . 9 9 8 8 8 8 9 9 . . 
        . 9 9 8 8 8 8 8 8 9 9 . 
        . 9 . 8 8 8 8 8 8 . 9 . 
        . 9 . 8 8 8 8 8 8 . 9 . 
        . . . . 8 8 8 8 . . . . 
        . . . . 9 9 . 9 9 . . . 
        . . . 9 9 9 . 9 9 9 . . 
        . . . 1 1 1 . 1 1 1 . . 
    `, SpriteKind.Echo)
    currentEcho.setPosition(savedX, savedY)
    currentEcho.setFlag(SpriteFlag.Ghost, true)

    player.sayText("3...")
    music.playTone(523, 60)
    pause(1000)

    player.sayText("2...")
    music.playTone(523, 60)
    pause(1000)

    player.sayText("1...")
    music.playTone(523, 60)
    pause(1000)

    if (currentEcho) {
        player.setPosition(savedX, savedY)
        player.vy = 0

        currentEcho.destroy(effects.halo, 300)
        currentEcho = null
        player.sayText("SWAPPED!", 600)
        music.playTone(659, 120)

        pause(200) // Fast reset window for quick chain swaps
        isEchoActive = false
    }
})


// --- 6. OVERLAP LOGIC ---

// Collecting Coins
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.confetti, 200)
    info.changeScoreBy(1)
    music.playTone(880, 100)
})

// Activating Red Switch #1
sprites.onOverlap(SpriteKind.Player, SpriteKind.Switch, function (sprite, otherSprite) {
    if (!isGateOneOpen) {
        isGateOneOpen = true
        music.playTone(587, 200)
        floorSwitch1.setImage(img`
            . . 7 7 7 7 . .
            . 7 2 2 2 2 7 .
            7 2 7 7 7 7 2 7
        `)
        laserGate1.destroy(effects.disintegrate, 300)
        player.sayText("GATE 1 COMPROMISED", 600)
    }
})

// Activating Orange Switch #2
sprites.onOverlap(SpriteKind.Player, SpriteKind.SwitchTwo, function (sprite, otherSprite) {
    if (!isGateTwoOpen) {
        isGateTwoOpen = true
        music.playTone(698, 200)
        floorSwitch2.setImage(img`
            . . 7 7 7 7 . .
            . 7 4 4 4 4 7 .
            7 4 7 7 7 7 4 7
        `)
        laserGate2.destroy(effects.disintegrate, 300)
        player.sayText("DECK SECURE!", 600)
    }
})

// Hazard Interaction
sprites.onOverlap(SpriteKind.Player, SpriteKind.Hazard, function (sprite, otherSprite) {
    sprite.destroy(effects.disintegrate, 200)
    game.over(false, effects.melt)
})

// Extraction Goal Achievement
sprites.onOverlap(SpriteKind.Player, SpriteKind.Goal, function (sprite, otherSprite) {
    game.over(true, effects.confetti)
})
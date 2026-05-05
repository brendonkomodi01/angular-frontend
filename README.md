# Mythology Slots

A full-stack slot machine game built with Spring Boot and Angular, featuring mythological themes from Greek, Egyptian, and Norse mythology.

**Made by Komodi Brendon**

---

## Tech Stack

### Backend
- Java 21
- Spring Boot 4.0.6
- Spring Security + JWT (jjwt 0.11.5)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
- ModelMapper 3.1.1

### Frontend
- Angular 20 (no-standalone)
- Bootstrap 5.3
- TypeScript 5.9

---

## Features

- **5×5 slot grid** with rows, columns, and diagonal win detection
- **WILD symbol** — substitutes for any card, acts as multiplier
- **SCATTER symbol** — triggers Free Spin mode (4 scatters = 10 spins, 5 scatters = 20 spins)
- **Sticky Wilds** — wilds collected during Free Spins remain on the grid for the entire session
- **Expanding Symbols** — 3–5 matching symbols in a column trigger an animated video expansion
- **Win tiers:**
  - Big Win (5x bet)
  - Mega Win (20x bet)
  - Epic Win (40x bet)
- **Free Spin mode** — dedicated background video, hidden paytable, enlarged grid, sticky wilds
- **Free Spin total win display** with animated counter and continue button
- **Scatter animation** — 3.5 second flash and zoom effect before Free Spin intro
- **Chain lightning** animation on winning positions
- **Fast spin** — auto-spin with 25 / 50 / 100 options, pauses for win displays
- **Daily coin claim** — 500 coins per day
- **Auto balance refill** — refills to 20,000 coins if balance drops below 100
- **Background music** toggle
- **JWT authentication** — register and login

---

## Card Multipliers

| Card | 3x | 4x | 5x |
|---|---|---|---|
| Zeus / Medusa | 15x | 17x | 20x |
| Minotaur / Hermes | 10x | 12x | 15x |
| Anubis / Ra | 8x | 10x | 13x |
| Athena / Cerberus / Horus | 6x | 8x | 11x |
| Valkyrie / Sphinx | 7x | 9x | 12x |
| Fenrir / Hydra / Osiris / Odin | 5x | 7x | 10x |

---

## Symbol Probabilities (per cell)

| Symbol | Probability |
|---|---|
| SCATTER | 6% |
| WILD | 3% |
| J / Q / K / A | 20% |
| Mythological cards | 71% |

---

## Project Structure

```
mythology-slots/                    # Spring Boot backend
├── src/main/java/hu/brendonkomodi/mythologyslots/
│   ├── config/
│   │   ├── DataLoader.java         # Auto-seeds card data on startup
│   │   ├── ModelMapperConfig.java
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── InventoryController.java
│   │   └── SlotController.java
│   ├── domain/
│   │   ├── AppUser.java
│   │   ├── Card.java
│   │   ├── Rarity.java
│   │   └── SpinResult.java
│   ├── dto/
│   │   ├── incoming/
│   │   └── outgoing/
│   │       └── SpinResultDto.java
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   ├── repository/
│   │   ├── AppUserRepository.java
│   │   ├── CardRepository.java
│   │   └── SpinResultRepository.java
│   └── service/
│       ├── AppUserService.java
│       ├── InventoryService.java
│       └── SlotService.java
└── src/main/resources/
    └── application.properties

angular-frontend/                   # Angular frontend
├── src/app/
│   ├── component/
│   │   ├── login/
│   │   ├── navbar/
│   │   ├── register/
│   │   └── slot/
│   │       ├── slot.ts
│   │       ├── slot.html
│   │       └── slot.css
│   ├── service/
│   │   ├── auth.ts
│   │   ├── inventory.ts
│   │   └── slot.ts
│   ├── app.module.ts
│   └── app-routing-module.ts
└── src/assets/
    ├── images/                     # Card and symbol images
    ├── sounds/                     # Audio files
    └── videos/                     # Expanding symbol and free spin videos
```

---

## Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- Docker (for MySQL)
- Angular CLI 20

### 1. Start MySQL with Docker

```bash
docker run --name mysql-server -e MYSQL_ROOT_PASSWORD=test1234 -p 3306:3306 -d mysql:8.0
```

If you already have the container:

```bash
docker start mysql-server
```

### 2. Configure Backend

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mythology_slots?serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=test1234
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Run the Backend

Open the project in IntelliJ IDEA and run `MythologySlotsApplication`.

The backend starts on `http://localhost:8080`. Card data is automatically seeded on first startup via `DataLoader`.

### 4. Run the Frontend

```bash
cd angular-frontend
npm install
ng serve
```

The frontend starts on `http://localhost:4200`.

### 5. Register and Play

Open `http://localhost:4200` in your browser, register an account, and start spinning.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/slot/spin` | Spin the slot machine |
| GET | `/api/inventory/balance` | Get current coin balance |
| POST | `/api/inventory/daily` | Claim daily coins |

---

## Assets Required

Place the following files in `angular-frontend/src/assets/`:

**images/** — zeus.png, medusa.png, minotaur.png, hermes.png, anubis.png, ra.png, fenrir.png, hydra.png, osiris.png, odin.png, athena.png, cerberus.png, horus.png, valkyrie.png, sphinx.png, scatter.png

**sounds/** — spin.wav, stop.wav, win.mp3, bigwin.mp3, megawin.mp3, epicwin.wav, freespin.mp3, freespinwin.wav, scatter.mp3, click.mp3, background-music.mp3

**videos/** — zeus.mp4, medusa.mp4, ra.mp4, anubis.mp4, hydra.mp4, cerberus.mp4, sphinx.mp4, minotaur.mp4, fenrir.mp4, athena.mp4, hermes.mp4, osiris.mp4, horus.mp4, odin.mp4, valkyrie.mp4, freespin.mp4, freespin (2).mp4, freespinvideo1.mp4

**images/background.png** — main background image

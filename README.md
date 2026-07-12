# Gator Blog Aggregator CLI

A modular, high-performance **Node.js Command Line Interface (CLI)** application that scrapes RSS feeds, tracks user feed follow preferences, and builds an aggregate personal dashboard of blog posts. The backend leverages **Drizzle ORM** coupled with a **PostgreSQL** database.

---

## Project Structure

```text
├── src/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── feed_follow_handlers/  # follow, unfollow, following
│   │   │   ├── feed_handlers/         # addfeed, feeds
│   │   │   ├── post_handlers/         # browse
│   │   │   └── user_handlers/         # login, register, reset, users
│   │   └── registry.ts                # Command registry and execution engine
│   ├── db/
│   │   ├── generated_files/           # Drizzle migration artifacts (SQL/snapshots)
│   │   ├── queries/                   # Database interaction layers (users, feeds, etc.)
│   │   ├── index.ts                   # Drizzle client configuration and connection initialization
│   │   └── scheme.ts                  # PostgreSQL database table schemas (Drizzle schema)
│   ├── services/
│   │   └── fetch_feed.ts              # RSS XML network retrieval and parsing service
│   ├── utils/                         # Global helper scripts
│   ├── config.ts                      # Configuration manager for ~/.gatorconfig.json
│   ├── index.ts                       # Application runtime entry point (process.argv routing)
│   └── types.ts                       # Common TypeScript interface definitions
├── .env                               # Local database credentials
├── .gitignore                         # Build-time and runtime exclusion tracking
├── drizzle.config.ts                  # Configuration for drizzle-kit migration workflows
├── package.json                       # Core dependency listings and project scripts
└── tsconfig.json                      # Explicit TypeScript compilation rule configurations
```

---

## Key Features

*   **Stateful Local Profiles**: Transparently reads, writes, and validates developer execution identities from a local state cache safely separated from source tracking boundaries at `~/.gatorconfig.json`.
*   **Dynamic Command Registry Routing**: Decouples terminal commands from sequential `if/else` checks by storing execution mappings inside an automated closure lookup container.
*   **State Guard Authentication Middleware**: Employs structural higher-order wrappers (`middlewareLoggedIn`) to insulate protected command contexts, verifying user table links prior to downstream processing.
*   **Asynchronous Content Sync Daemon**: Spines continuous feed queries using an infinite signal-trapped execution architecture (`npm run start agg <duration>`) prioritized via automated stale timestamp tracking (`NULLS FIRST`).
*   **Relational Schema Integrity**: Automatically manages account purges without manual intervention by utilizing explicit database-level cascades (`ON DELETE CASCADE`).

---

## Installation & Setup

### Prerequisites
*   **Node.js** (v20+ recommended)
*   **PostgreSQL** database instance running locally or via cloud provisioners.

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd blog-aggregator
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the root directory to point to your live development database instance:
```env
DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_database_name
```

### 3. Generate & Execute Migrations
Push your structural schema definitions into your database using `drizzle-kit`:
```bash
# Generate the SQL migration scripts
npm run generate

# Apply the tables to your PostgreSQL instance
npm run migrate
```

---

## CLI Usage Reference

Run commands using your local start script followed by arguments:

### User Management
*   **Register a new user account**:
    ```bash
    npm run start register <username>
    ```
*   **Log into an existing account**:
    ```bash
    npm run start login <username>
    ```
*   **List all registered database accounts**:
    ```bash
    npm run start users
    ```
*   **Hard-reset the database state (deletes all tables)**:
    ```bash
    npm run start reset
    ```

### Feed Operations
*   **Add a new feed and automatically follow it**:
    ```bash
    npm run start addfeed "<Feed Name>" "<Feed URL>"
    ```
*   **List all tracked system feeds alongside their creators**:
    ```bash
    npm run start feeds
    ```

### Follow Tracking (Protected Actions)
*   **Follow an existing feed URL**:
    ```bash
    npm run start follow <feed_url>
    ```
*   **Unfollow a feed URL**:
    ```bash
    npm run start unfollow <feed_url>
    ```
*   **View all feeds followed by your current profile identity**:
    ```bash
    npm run start following
    ```

### Content Scraping & Aggregation
*   **Launch the continuous synchronization service loop**:
    ```bash
    npm run start agg 1m   # Acceptable formats: ms, s, m, h
    ```
    *Exit this process at any point by hitting `Ctrl + C` to fire a clean state shutdown sequence.*

*   **Browse your aggregated dashboard feed**:
    ```bash
    npm run start browse [optional_limit] # Defaults to the latest 2 entries
    ```

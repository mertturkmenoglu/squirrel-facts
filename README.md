# Squirrel Facts

An example project that uses [Asena](https://asena.sh).

# Prerequisites

- Bun v1.3.0 or later: https://bun.sh/
- Docker (Compose): https://www.docker.com/get-started
- Asena CLI: https://asena.sh/docs/cli/installation

# Setup

1. Clone the repository:

```bash
git clone https://github.com/mertturkmenoglu/squirrel-facts.git
```

2. Install dependencies (on the project root folder):

```bash
bun install
```

3. Navigate to the `apps/api` directory and create a `.env` file.
   - You can copy the `.env.example` file and fill the missing values.
   - If you are on development environment, you can copy and paste these values to your `.env` file:

```env
PORT=5000
BETTER_AUTH_SECRET=secret
BETTER_AUTH_URL=http://localhost:5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/squirrel
```

4. Start the Docker containers:

```bash
docker compose up -d
```

Or

```bash
bun db:start
```

5. You can generate migrations or push the current schema to the database using Drizzle Kit:

```bash
bun db:push
```

6. Create an `uploads` folder:

```bash
mkdir uploads
```

7. Navigate back to the project root.

```bash
cd ../../
```

8. Start the development server:

```bash
bun dev
```

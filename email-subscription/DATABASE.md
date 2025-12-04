# Database Setup Guide

## Current Setup

The app uses **SQLite** for local development and should use **PostgreSQL** for production.

## Local Development (SQLite)

1. Create a `.env` file in the `email-subscription` directory:
```bash
DATABASE_URL="file:./prisma/dev.sqlite"
```

2. The database file will be created at `prisma/dev.sqlite` and will persist between dev sessions.

3. Run migrations:
```bash
npm run prisma migrate dev
```

## Production (PostgreSQL) - Recommended

SQLite will **lose data** on container restarts in Docker/production. Use PostgreSQL instead.

### Option 1: Render PostgreSQL (Recommended)

1. Create a PostgreSQL database on Render
2. Get the connection string from Render dashboard
3. Set `DATABASE_URL` in your Render service environment variables:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

4. Update `prisma/schema.prisma` to use PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. Run migrations in production:
```bash
npm run prisma migrate deploy
```

### Option 2: Other PostgreSQL Providers

- **Supabase**: Free tier available
- **Neon**: Serverless PostgreSQL
- **Railway**: Easy PostgreSQL setup
- **DigitalOcean**: Managed PostgreSQL

## Migration from SQLite to PostgreSQL

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update field types if needed (PostgreSQL uses different types)

3. Generate new migration:
```bash
npm run prisma migrate dev --name switch_to_postgresql
```

4. Deploy:
```bash
npm run prisma migrate deploy
```

## Important Notes

- **SQLite**: Good for local dev, but data is lost on container restarts
- **PostgreSQL**: Required for production with persistent data
- Always backup your database before migrations
- The `DATABASE_URL` environment variable controls which database is used

## Environment Variables

```bash
# Development (SQLite)
DATABASE_URL="file:./prisma/dev.sqlite"

# Production (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

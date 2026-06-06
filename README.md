# Dream Evidence Locker

Dream Evidence Locker is a minimal PERN hackathon project.

The app is a fictional investigation system where users submit strange dreams as evidence. Public reports are visible on the reports page. Archived reports are shown on the archive page. Report links show connections between related dream reports.

## Current Project Status

This project currently has:

- React client built with Vite
- Express server using ES modules
- PostgreSQL database schema
- Seed data for users, reports, archived reports, and report links
- Dark glassmorphism CSS theme
- Public reports page
- Single report detail page
- New report form
- Edit report form
- Report links page
- Archive page

This project does not yet have:

- Authentication
- Authorization
- Role-based route protection
- Test coverage for grading requirements
- Security review work

Those items are the hackathon grading focus and should be written by the team during that part of the project.

## Tech Stack

- PostgreSQL
- Express
- React
- Node.js
- Vite

## Project Structure

```text
dream-locker/
  client/
    src/
      components/
      App.jsx
      index.css
      main.jsx
    package.json
    vite.config.js
  server/
    db/
      pool.js
      schema.sql
      seed.sql
    index.js
    package.json
```

## Setup Instructions

These steps are for setting up the project on another computer.

### 1. Clone the repository

```bash
git clone https://github.com/itspaigenli/dream-locker.git
cd dream-locker
```

### 2. Install PostgreSQL

PostgreSQL must be installed and running before the server can connect to the database.

Check if `psql` exists:

```bash
psql --version
```

If that command does not work, install PostgreSQL before continuing.

### 3. Create the database

The project expects a local database named `locker_db`.

```bash
createdb locker_db
```

### 4. Install server dependencies

```bash
cd server
npm install
```

### 5. Create the server environment file

Inside the `server/` folder, create a file named `.env`.

Add this:

```env
DATABASE_URL=postgresql://YOUR_POSTGRES_USERNAME@localhost:5432/locker_db
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

Replace `YOUR_POSTGRES_USERNAME` with the local PostgreSQL username.

On a Mac, this is often the same as the computer username. To check it:

```bash
whoami
```

Example:

```env
DATABASE_URL=postgresql://nessali@localhost:5432/locker_db
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

### 6. Build the database tables

Run this from the `server/` folder:

```bash
npm run db:schema
```

What this does:

- Drops the current project tables if they exist
- Creates the `users` table
- Creates the `dream_reports` table
- Creates the `report_links` table

### 7. Add seed data

Run this from the `server/` folder:

```bash
npm run db:seed
```

What this adds:

- Example users
- Active public reports
- Active private reports
- Archived resolved reports
- Example report links

The user records have placeholder password hash values. Authentication is not implemented yet.

### 8. Start the server

Run this from the `server/` folder:

```bash
npm run dev
```

The server should run at:

```text
http://localhost:3000
```

Health check route:

```text
http://localhost:3000/api/health
```

Expected response:

```json
{
  "message": "Dream Evidence Locker API is running"
}
```

### 9. Install client dependencies

Open a second terminal.

From the project root:

```bash
cd client
npm install
```

### 10. Create the client environment file

Inside the `client/` folder, create a file named `.env`.

Add this:

```env
VITE_API_URL=http://localhost:3000/api
```

### 11. Start the client

Run this from the `client/` folder:

```bash
npm run dev
```

The client should run at:

```text
http://localhost:5173
```

## Server Scripts

Run these commands from the `server/` folder.

```bash
npm run dev
```

Starts the Express server with `nodemon`.

```bash
npm start
```

Starts the Express server with Node.

```bash
npm run db:check
```

Checks that PostgreSQL responds.

```bash
npm run db:connect
```

Connects to the `locker_db` database with `psql`.

```bash
npm run db:schema
```

Rebuilds the database tables.

```bash
npm run db:seed
```

Adds the project seed data.

## Client Scripts

Run these commands from the `client/` folder.

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in `client/dist`.

`client/dist` is generated output. It is not source code.

```bash
npm run lint
```

Runs ESLint.

## Current API Routes

Base API URL:

```text
http://localhost:3000/api
```

### Health

```text
GET /api/health
```

Checks that the server is running.

### Reports

```text
GET /api/reports
```

Returns active public reports.

```text
GET /api/reports/:id
```

Returns one active public report by id.

```text
POST /api/reports
```

Creates a report.

Current request body pattern:

```json
{
  "title": "The Red Staircase",
  "description": "Dream description text",
  "symbols": "red staircase, hospital, water, 314",
  "location": "unknown hospital basement",
  "visibility": "public"
}
```

Current note:

The server uses a temporary hard-coded user id for report creation because authentication has not been added yet.

```text
PUT /api/reports/:id
```

Updates a report.

Current note:

Authorization checks are not added yet. The team should add those during the hackathon grading work.

### Archive

```text
GET /api/archive
```

Returns archived reports.

Archived reports represent resolved or closed evidence files.

### Report Links

```text
GET /api/report-links
```

Returns existing links between reports.

Current note:

Creating report links is not built yet. Investigator/admin permission checks should be added during the authorization work.

## Database Tables

### users

Stores user records.

Columns:

- `id`
- `username`
- `email`
- `password_hash`
- `role`
- `created_at`

Current roles:

- `dreamer`
- `investigator`
- `admin`

### dream_reports

Stores dream report records.

Columns:

- `id`
- `user_id`
- `title`
- `description`
- `symbols`
- `location`
- `visibility`
- `archived`
- `created_at`
- `updated_at`

Current visibility values:

- `public`
- `private`

### report_links

Stores official links between related reports.

Columns:

- `id`
- `source_report_id`
- `target_report_id`
- `investigator_id`
- `reason`
- `created_at`

## Current App Pages

### Dashboard

Shows project summary counts and recent public reports.

### All Reports

Shows active public reports.

Private reports are seeded in the database, but the current public route does not show them.

### Report Detail

Shows one active public report.

### New Report

Shows a form for creating a report.

Current note:

The form does not ask for a user. The backend temporarily assigns new reports to user id `1` until authentication is added.

### Edit Report

Shows a form for updating a report.

Current note:

This page exists for base CRUD structure. Authorization rules still need to be added.

### Linked Reports

Shows existing report links from the seed data.

### Archive

Shows archived resolved reports.

## Files That Should Not Be Committed

Do not commit:

- `node_modules`
- `.env`
- `client/dist`
- `.DS_Store`

Notes:

- `node_modules` is recreated with `npm install`.
- `.env` contains local computer settings.
- `client/dist` is generated by `npm run build`.
- `.DS_Store` is created by macOS.

## Common Setup Problems

### `createdb: command not found`

PostgreSQL is not installed or the PostgreSQL command line tools are not available in the terminal.

### `database "locker_db" does not exist`

Create the database:

```bash
createdb locker_db
```

Then run:

```bash
npm run db:schema
npm run db:seed
```

### `psql: connection refused`

PostgreSQL is not running.

Start PostgreSQL, then try again.

### Client page cannot load reports

Check these items:

- The server is running on `http://localhost:3000`
- The client `.env` has `VITE_API_URL=http://localhost:3000/api`
- The server terminal does not show a database error
- The database has been seeded

### `client/dist` appeared

This folder is created by:

```bash
npm run build
```

It is generated output. It can be removed:

```bash
rm -rf client/dist
```

## Hackathon Work Still Needed

The remaining grading work should be added by the team:

- Authentication with Auth0
- User mapping between Auth0 users and database users
- Authorization checks for roles and ownership
- Private report visibility rules
- Admin archive rules
- Archived report edit restrictions
- Tests for authentication and authorization behavior
- Security review and cleanup

Core authorization rules for later:

- Logged-out users cannot create reports.
- Dreamers can edit only their own reports.
- Dreamers cannot edit another user's reports.
- Private reports are visible only to the creator, investigators, and admins.
- Investigators can link reports together.
- Dreamers cannot create official report links.
- Admins can archive reports.
- Regular users cannot archive reports.
- Archived reports cannot be edited by regular users.

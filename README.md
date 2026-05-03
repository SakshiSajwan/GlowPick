# Running Glowpick Project in VS Code

## Quick Start Commands

### Option 1: Using VS Code Integrated Terminal

1. **Open two terminals** in VS Code (Terminal → New Terminal)

2. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: Using PowerShell Commands

**Backend:**
```powershell
cd "c:\Users\Tanishka\Desktop\Main Glowpick\backend"
npm run dev
```

**Frontend:**
```powershell
cd "c:\Users\Tanishka\Desktop\Main Glowpick\frontend"
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Login Credentials

- **Admin**: admin@example.com / password123
- **User**: user@example.com / 123456

## Troubleshooting

### MongoDB Connection Error
If you see "IP not whitelisted" error:
1. Go to https://cloud.mongodb.com/
2. Navigate to Network Access
3. Add your current IP address
4. Restart backend server

### Port Already in Use
If port 5000 or 5173 is already in use:
- Stop the running process
- Or change the port in `.env` (backend) or `vite.config.js` (frontend)

## Project Structure

```
Main Glowpick/
├── backend/          # Node.js + Express API
│   ├── server.js     # Entry point
│   └── .env          # Environment variables
└── frontend/         # React + Vite
    ├── src/
    └── package.json
```

## Useful Commands

### Install Dependencies (First Time Only)
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Production Build
```bash
# Frontend
cd frontend
npm run build
```

### Database Seeding
```bash
cd backend
node seeder.js
```

# Personal Expense Tracker

A full-stack web application for tracking personal expenses with data visualization and CSV export functionality.

## Features

- **Add Expenses**: Record expenses with amount, category, description, and date
- **View & Filter**: View all expenses with filtering by date range and category
- **Monthly Summary Dashboard**:
  - Total expenses for current month
  - Category breakdown with pie and bar charts
  - Comparison with previous month
- **Edit & Delete**: Full CRUD operations for managing expenses
- **CSV Export**: Export expenses for any date range to CSV format
- **Responsive Design**: Clean, mobile-friendly UI built with Tailwind CSS
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and loading states

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Chart.js (with react-chartjs-2)
- Axios
- date-fns

### Backend
- Node.js
- Express.js
- PostgreSQL
- express-validator

### DevOps
- Docker & Docker Compose
- Nginx (for serving React SPA)
- Multi-stage Docker builds

## Project Structure

```
expense-tracker/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── ExpenseFilter.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExportButton.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── MonthlySummary.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── expenseController.js
│   │   ├── database/
│   │   │   ├── init.js
│   │   │   └── schema.sql
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   ├── models/
│   │   │   └── expenseModel.js
│   │   ├── routes/
│   │   │   └── expenseRoutes.js
│   │   ├── utils/
│   │   │   └── csvExport.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Default values in `.env`:
```env
# Database Configuration
DB_NAME=expense_tracker
DB_USER=expense_user
DB_PASSWORD=expense_password
DB_PORT=5432

# Backend Configuration
NODE_ENV=production
BACKEND_PORT=5000

# Frontend Configuration
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Application

Run all services using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Build the frontend and backend Docker images
- Start PostgreSQL database
- Initialize the database schema
- Start the backend API
- Start the frontend

### 4. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### 5. Stop the Application

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## Development Setup

### Running Locally (without Docker)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

Make sure PostgreSQL is running locally and update the backend `.env` file with:
```env
DB_HOST=localhost
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Expenses

- **GET** `/expenses` - Get all expenses (supports filtering)
  - Query params: `category`, `startDate`, `endDate`

- **GET** `/expenses/:id` - Get single expense

- **POST** `/expenses` - Create new expense
  ```json
  {
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15"
  }
  ```

- **PUT** `/expenses/:id` - Update expense

- **DELETE** `/expenses/:id` - Delete expense

#### Summary

- **GET** `/expenses/summary/monthly` - Get monthly summary
  - Query params: `year`, `month` (optional, defaults to current)

#### Export

- **GET** `/expenses/export/csv` - Export expenses to CSV
  - Query params: `startDate`, `endDate` (required)

### Categories

Valid expense categories:
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Other

## Database Schema

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Docker Commands

### Build images
```bash
docker-compose build
```

### View logs
```bash
docker-compose logs -f
```

### View specific service logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart a service
```bash
docker-compose restart backend
```

### Execute commands in containers
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U expense_user -d expense_tracker

# Access backend shell
docker-compose exec backend sh
```

## Deployment to Digital Ocean App Platform

### Option 1: Using Docker Hub

1. Push images to Docker Hub:
```bash
docker-compose build
docker tag expense-tracker-backend:latest yourusername/expense-tracker-backend:latest
docker tag expense-tracker-frontend:latest yourusername/expense-tracker-frontend:latest
docker push yourusername/expense-tracker-backend:latest
docker push yourusername/expense-tracker-frontend:latest
```

2. Create app on Digital Ocean App Platform
3. Add three components:
   - **Database**: Managed PostgreSQL
   - **Backend**: Container from Docker Hub
   - **Frontend**: Container from Docker Hub

4. Configure environment variables in App Platform

### Option 2: Using GitHub

1. Push code to GitHub repository
2. Connect repository to Digital Ocean App Platform
3. Configure build settings:
   - Dockerfile path for backend: `/backend/Dockerfile`
   - Dockerfile path for frontend: `/frontend/Dockerfile`
4. Add managed PostgreSQL database
5. Configure environment variables

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_NAME=${db.DATABASE}
DB_USER=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}
REACT_APP_API_URL=https://your-backend-url.ondigitalocean.app/api
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Manually initialize database
docker-compose exec postgres psql -U expense_user -d expense_tracker -f /docker-entrypoint-initdb.d/01-schema.sql
```

### Backend Not Starting

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Build Issues

```bash
# Rebuild frontend
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Port Conflicts

If ports 3000, 5000, or 5432 are already in use, modify the `.env` file:
```env
FRONTEND_PORT=3001
BACKEND_PORT=5001
DB_PORT=5433
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### API Testing with curl

```bash
# Health check
curl http://localhost:5000/health

# Get all expenses
curl http://localhost:5000/api/expenses

# Create expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2024-01-15"
  }'
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Support

For issues and questions, please open an issue in the GitHub repository.

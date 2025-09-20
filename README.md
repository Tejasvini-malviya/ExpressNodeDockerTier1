# User Management API

A RESTful API built with Node.js, Express, and PostgreSQL for managing user data with comprehensive input validation and error handling.

## 🚀 Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete users
- ✅ **Input Validation**: Comprehensive validation using Joi
- ✅ **Database Integration**: PostgreSQL with connection pooling
- ✅ **Error Handling**: Centralized error handling middleware
- ✅ **Environment Configuration**: Secure environment variable management
- ✅ **CORS Support**: Cross-origin resource sharing enabled
- ✅ **Auto Restart**: Development server with nodemon

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Validation Rules](#validation-rules)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## 🛠 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **PostgreSQL** (v12 or higher) OR **Docker** (for containerized setup)
- **Docker** (optional, for containerized database setup)

## 📦 Installation

### Option 1: Local PostgreSQL Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Docker_Nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a PostgreSQL database named `mydb`
   - Ensure PostgreSQL is running on port 5432
   - Update database credentials in `.env` file

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Option 2: Docker Setup (Recommended)

This setup provides a complete development environment with PostgreSQL and pgAdmin using Docker containers.

#### Step 1: Create Docker Network
Create a network for containers to communicate:
```bash
docker network create pg-network
```

#### Step 2: Run PostgreSQL Container
Start PostgreSQL database container:
```bash
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=mydb \
  --network pg-network \
  -p 5432:5432 \
  -d postgres
```

**For Windows PowerShell:**
```powershell
docker run --name postgres-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=1234 `
  -e POSTGRES_DB=mydb `
  --network pg-network `
  -p 5432:5432 `
  -d postgres
```

#### Step 3: Run pgAdmin Container
Start pgAdmin for database management:
```bash
docker run --name pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  --network pg-network \
  -p 8080:80 \
  -d dpage/pgadmin4
```

**For Windows PowerShell:**
```powershell
docker run --name pgadmin `
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com `
  -e PGADMIN_DEFAULT_PASSWORD=admin `
  --network pg-network `
  -p 8080:80 `
  -d dpage/pgadmin4
```

#### Step 4: Verify Containers
Check that both containers are running:
```bash
docker ps
```

You should see both `postgres-db` and `pgadmin` containers in the running state.

#### Step 5: Configure pgAdmin
1. **Access pgAdmin**
   - Open your browser and navigate to: http://localhost:8080
   - Login credentials:
     - **Email:** `admin@admin.com`
     - **Password:** `admin`

2. **Add PostgreSQL Server**
   - Click "Add New Server"
   - **General Tab:**
     - **Name:** `Postgres DB`
   - **Connection Tab:**
     - **Host:** `postgres-db`
     - **Port:** `5432`
     - **Username:** `postgres`
     - **Password:** `1234`
     - **Database:** `mydb`
   - Click "Save"

#### Step 6: Setup Application
1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Ensure your `.env` file has:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=1234
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mydb
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🐳 Docker Management Commands

### Useful Docker Commands

#### Start Existing Containers
```bash
docker start postgres-db
docker start pgadmin
```

#### Stop Containers
```bash
docker stop postgres-db
docker stop pgadmin
```

#### Remove Containers (⚠️ This will delete all data)
```bash
docker rm postgres-db
docker rm pgadmin
docker network rm pg-network
```

#### View Container Logs
```bash
docker logs postgres-db
docker logs pgadmin
```

#### Execute Commands in PostgreSQL Container
```bash
docker exec -it postgres-db psql -U postgres -d mydb
```

### Docker Compose Alternative

For easier management, you can also create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  postgres-db:
    image: postgres:15-alpine
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: "1234"
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - pg-network

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    networks:
      - pg-network
    depends_on:
      - postgres-db

volumes:
  postgres_data:

networks:
  pg-network:
    driver: bridge
```

Then run with:
```bash
docker-compose up -d
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

**For Local PostgreSQL:**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
```

**For Docker Setup:**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
```

### Database Access Points

- **PostgreSQL Database:** `localhost:5432`
- **pgAdmin Web Interface:** `http://localhost:8080`
- **API Server:** `http://localhost:5000`

## 🎯 Usage

Once the server is running, you can access the API at:
```
http://localhost:5000
```

The server will automatically create the users table on startup if it doesn't exist.

## 📚 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | None |
| GET | `/users/:id` | Get user by ID | None |
| POST | `/users` | Create new user | `{ name, email, age }` |
| PUT | `/users/:id` | Update user | `{ name, email, age }` |
| DELETE | `/users/:id` | Delete user | None |

### Example Requests

#### Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

#### Get All Users
```bash
curl http://localhost:5000/api/users
```

#### Get User by ID
```bash
curl http://localhost:5000/api/users/1
```

#### Update User
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 28
  }'
```

#### Delete User
```bash
curl -X DELETE http://localhost:5000/api/users/1
```

## 📁 Project Structure

```
Docker_Nodejs/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controller/
│   │   └── userController.js     # User route handlers
│   ├── Data/
│   │   ├── createTable.js        # Database table creation
│   │   └── Data.sql              # SQL scripts
│   ├── Middleware/
│   │   ├── errorhandler.js       # Error handling middleware
│   │   └── inputValidator.js     # Input validation middleware
│   ├── models/
│   │   └── UsersModel.js         # Database queries
│   ├── routes/
│   │   └── userRoute.js          # API route definitions
│   └── index.js                  # Application entry point
├── .env                          # Environment variables
├── package.json                  # Project dependencies
└── README.md                     # Project documentation
```

## ✅ Validation Rules

### User Creation/Update
- **Name**: 
  - Required (for creation)
  - 2-100 characters
  - String type
- **Email**: 
  - Required (for creation)
  - Valid email format
  - Max 100 characters
  - Unique in database
- **Age**: 
  - Required (for creation)
  - Integer between 1-150
  - Positive number

### ID Parameters
- Must be positive integers
- Required for GET, PUT, DELETE operations

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚨 Error Handling

The API provides structured error responses:

### Validation Errors (400)
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Please provide a valid email address"
  ]
}
```

### Server Errors (500)
```json
{
  "status": 500,
  "message": "Something broke!",
  "error": "Error details"
}
```

### Success Responses
```json
{
  "status": 200,
  "message": "Users Retrieved",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "created_at": "2025-09-20T10:30:00.000Z"
    }
  ]
}
```

## 📋 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## 🛠 Built With

- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Express.js](https://expressjs.com/)** - Web framework
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[Joi](https://joi.dev/)** - Input validation
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management
- **[CORS](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing
- **[nodemon](https://nodemon.io/)** - Development auto-restart

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```
This will start the server with nodemon, which automatically restarts when files change.

### Database Connection
The application automatically connects to PostgreSQL on startup and creates the users table if it doesn't exist.

### Environment Variables
All sensitive configuration is stored in environment variables. Never commit the `.env` file to version control.

## 🚀 Deployment

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   DB_USER=your_production_user
   DB_PASSWORD=your_production_password
   DB_HOST=your_production_host
   DB_PORT=5432
   DB_NAME=your_production_db
   ```

2. **Build and Start**
   ```bash
   npm install --production
   node src/index.js
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

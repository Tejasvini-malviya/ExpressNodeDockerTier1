# Docker Setup Guide for User Management API

This guide provides detailed instructions for setting up the User Management API with PostgreSQL and pgAdmin using Docker containers.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [pgAdmin Configuration](#pgadmin-configuration)
- [Troubleshooting](#troubleshooting)
- [Container Management](#container-management)
- [Data Persistence](#data-persistence)

## 🎯 Overview

This Docker setup provides:
- **PostgreSQL Database** - Containerized database server
- **pgAdmin** - Web-based database administration tool
- **Network Isolation** - Secure container communication
- **Port Mapping** - Access from host machine
- **Data Persistence** - Database data survives container restarts

## 🛠 Prerequisites

- **Docker Desktop** installed and running
- **Git** for cloning the repository
- **Node.js** for running the API application

## 🚀 Quick Start

Run these commands in sequence:

```bash
# 1. Create network
docker network create pg-network

# 2. Start PostgreSQL
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=mydb \
  --network pg-network \
  -p 5432:5432 \
  -d postgres

# 3. Start pgAdmin
docker run --name pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  --network pg-network \
  -p 8080:80 \
  -d dpage/pgadmin4

# 4. Verify containers
docker ps
```

## 📝 Detailed Setup

### Step 1: Create Docker Network

```bash
docker network create pg-network
```

**Purpose:** Creates an isolated network for containers to communicate securely.

**Verification:**
```bash
docker network ls
```

### Step 2: PostgreSQL Container

#### Command Breakdown:
```bash
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=mydb \
  --network pg-network \
  -p 5432:5432 \
  -d postgres
```

#### Parameters Explained:
- `--name postgres-db` - Container name for easy reference
- `-e POSTGRES_USER=postgres` - Database superuser username
- `-e POSTGRES_PASSWORD=1234` - Database password
- `-e POSTGRES_DB=mydb` - Initial database to create
- `--network pg-network` - Attach to custom network
- `-p 5432:5432` - Map host port 5432 to container port 5432
- `-d` - Run in detached mode (background)
- `postgres` - Official PostgreSQL image

#### Windows PowerShell Version:
```powershell
docker run --name postgres-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=1234 `
  -e POSTGRES_DB=mydb `
  --network pg-network `
  -p 5432:5432 `
  -d postgres
```

### Step 3: pgAdmin Container

#### Command Breakdown:
```bash
docker run --name pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  --network pg-network \
  -p 8080:80 \
  -d dpage/pgadmin4
```

#### Parameters Explained:
- `--name pgadmin` - Container name
- `-e PGADMIN_DEFAULT_EMAIL=admin@admin.com` - Login email
- `-e PGADMIN_DEFAULT_PASSWORD=admin` - Login password
- `--network pg-network` - Same network as PostgreSQL
- `-p 8080:80` - Map host port 8080 to container port 80
- `dpage/pgadmin4` - Official pgAdmin image

#### Windows PowerShell Version:
```powershell
docker run --name pgadmin `
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com `
  -e PGADMIN_DEFAULT_PASSWORD=admin `
  --network pg-network `
  -p 8080:80 `
  -d dpage/pgadmin4
```

### Step 4: Verification

Check running containers:
```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                    NAMES
abc123def456   dpage/pgadmin4   "/entrypoint.sh"         2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp     pgadmin
def456ghi789   postgres         "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:5432->5432/tcp   postgres-db
```

## 🔧 pgAdmin Configuration

### Accessing pgAdmin

1. **Open Browser**
   - Navigate to: http://localhost:8080
   
2. **Login**
   - **Email:** `admin@admin.com`
   - **Password:** `admin`

### Adding PostgreSQL Server

1. **Right-click "Servers"** → **Register** → **Server**

2. **General Tab:**
   - **Name:** `Postgres DB` (or any descriptive name)

3. **Connection Tab:**
   - **Host name/address:** `postgres-db`
   - **Port:** `5432`
   - **Maintenance database:** `mydb`
   - **Username:** `postgres`
   - **Password:** `1234`

4. **Save Password:** Check this option for convenience

5. **Click "Save"**

### Why Use `postgres-db` as Host?

When containers are on the same Docker network, they can communicate using container names as hostnames. The PostgreSQL container is named `postgres-db`, so pgAdmin uses this as the host address.

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Error: Port 5432 is already allocated
# Solution: Stop local PostgreSQL or use different port
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=mydb \
  --network pg-network \
  -p 5433:5432 \
  -d postgres
```

#### 2. Container Name Conflicts
```bash
# Error: Container name already exists
# Solution: Remove existing container
docker rm postgres-db
docker rm pgadmin
```

#### 3. Network Issues
```bash
# Check network exists
docker network ls

# Inspect network
docker network inspect pg-network

# Recreate network if needed
docker network rm pg-network
docker network create pg-network
```

#### 4. Connection Refused
- Ensure containers are running: `docker ps`
- Check container logs: `docker logs postgres-db`
- Verify network connectivity: `docker network inspect pg-network`

### Useful Debugging Commands

```bash
# Container logs
docker logs postgres-db
docker logs pgadmin

# Execute commands in container
docker exec -it postgres-db bash
docker exec -it postgres-db psql -U postgres -d mydb

# Container inspection
docker inspect postgres-db
docker inspect pgadmin
```

## 📊 Container Management

### Starting/Stopping Containers

```bash
# Start containers
docker start postgres-db
docker start pgadmin

# Stop containers
docker stop postgres-db
docker stop pgadmin

# Restart containers
docker restart postgres-db
docker restart pgadmin
```

### Removing Containers

```bash
# Stop and remove containers
docker stop postgres-db pgadmin
docker rm postgres-db pgadmin

# Remove network
docker network rm pg-network

# Remove all (including volumes - ⚠️ DATA LOSS)
docker system prune -a --volumes
```

## 💾 Data Persistence

### Default Behavior
By default, PostgreSQL data is stored inside the container and will be lost when the container is removed.

### Adding Volume for Persistence

```bash
# Create named volume
docker volume create postgres_data

# Run PostgreSQL with volume
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=mydb \
  --network pg-network \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres
```

### Backup and Restore

#### Backup Database
```bash
docker exec postgres-db pg_dump -U postgres mydb > backup.sql
```

#### Restore Database
```bash
docker exec -i postgres-db psql -U postgres mydb < backup.sql
```

## 🐳 Docker Compose Alternative

Create `docker-compose.yml`:

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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

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
      postgres-db:
        condition: service_healthy

volumes:
  postgres_data:

networks:
  pg-network:
    driver: bridge
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# Remove everything including volumes
docker-compose down -v
```

## 🔐 Security Considerations

### Production Setup

1. **Change Default Passwords**
2. **Use Environment Files**
3. **Enable SSL/TLS**
4. **Restrict Network Access**
5. **Use Secrets Management**

### Environment File Example

Create `.env` file:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=mydb
PGADMIN_EMAIL=your_email@domain.com
PGADMIN_PASSWORD=your_secure_pgadmin_password
```

Reference in docker-compose:
```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

## 📚 Additional Resources

- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [pgAdmin Docker Documentation](https://hub.docker.com/r/dpage/pgadmin4)
- [Docker Networking Guide](https://docs.docker.com/network/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Happy Dockerizing! 🐳**
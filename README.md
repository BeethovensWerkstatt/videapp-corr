# videapp-corr

This repository is part of the Beethoven's Werkstatt project. This project is
divided in five modules. Startinh from module 3, the modules are implemented inside
this application. The results from Module 4 will be visible soon. The prototypes
of Module 1 and 2 are not integrated yet, but are linked from the landing page.
VideApp-Corr is a Vue.js application for displaying facimiles of Beethoven's works
with high-resolution images using OpenSeadragon. The facsimiles are retrieved from
IIIF-compliant image servers. The used data is stored in an eXist-db XML database.

The application provides different views for exploring Beethoven's works, including
a desktop view, where reconstructions of Beethoven's manuscripts can be viewed 
side-by-side with the original facsimiles.

## Architecture

The project consists of two main components:
- **Frontend**: Vue.js Single-Page-Application (SPA) with OpenSeadragon for image display
- **Backend**: eXist-db XML database (runs in Docker container)

## Setup and Deployment

### Development Environment

*The Vue.js application relies on the legacy Node.js version 16 or `lts/gallium`. Ensure you have the correct Node version using `nvm` or similar tools.*

**Automated Setup** (recommended):
```bash
./start-dev.sh
```
This command starts:
1. eXist-db container in the background (`docker compose up -d`)
2. Vue Development Server with Hot-Reload (`npm run serve`)
3. Upon termination, the Docker container is automatically stopped

**Manual Steps**:
```bash
# 1. Start eXist-db
docker compose up -d

# 2. Start Frontend Development Server
nvm use lts/gallium # or ensure Node.js v16 is active
npm install # Install dependencies, if not done yet
npm run serve
```

The application will be available at:
- Frontend: `http://localhost:8081` (or port from terminal output)
- eXist-db: `http://localhost:8080/exist`

**eXist-db Access**:
- The admin password is loaded from `./existdb/password-file`
- Data is persisted in `./existdb/existdb_data`
- Logs are located in `./existdb/existdb_logs`

### Production Environment

**Docker Build & Deployment**:
```bash
# Multi-Stage Build
docker build -t videapp-corr .

# Start container
docker run -p 80:80 videapp-corr
```

The Dockerfile performs a multi-stage build:
1. **Build-Stage**: Compiles the Vue.js application (`npm run build`) and generates Git version information (`gulp gitlog`)
2. **Production-Stage**: Serves the application with nginx

**Standard Build Commands**:
```bash
# Production build (without Docker)
npm run build
```

## Configuration

### Current Configuration

The application configuration is currently located in `src/config/index.js` and includes:

**API Endpoints**:
- Branch-dependent URL resolution
- Local development (`jpv/dev`): `http://localhost:8080/exist/apps/api/`
- Staging (`dev`): `https://dev-api.beethovens-werkstatt.de/`
- Production (`main`): `https://api.beethovens-werkstatt.de/`

**Configured Modules**:
- `api.works`: Endpoint for works directory (`/module3/works.json`)
- `api.documents`: Endpoint for documents (`/module4/documents.json`)
- `osd`: OpenSeadragon default configuration (see `src/config/osd.default.js`)
- `mainbranch`: Definition of the production branch (`'main'`)
- `version`: Dynamic loading of version information from `public/version.json`

### Planned JSON Configuration

**TODO**: The configuration should be externalized to a JSON file (`public/config.json`) in the future.

**Benefits of Externalization**:
- Separation of code and configuration
- Easier adaptation for different deployment environments
- No rebuild required for configuration changes
- Build-time independent environment configuration

**Proposed Structure** (`public/config.json`):
*replace `<developer>` with your personal branch prefix for local development*
```json
{
  "api": {
    "urls": {
      "<developer>/dev": "http://localhost:8080/exist/apps/api/",
      "dev": "https://dev-api.beethovens-werkstatt.de/",
      "main": "https://api.beethovens-werkstatt.de/"
    },
    "hosts": {
      "main": "api.beethovens-werkstatt.de",
      "dev": "dev-api.beethovens-werkstatt.de"
    },
    "endpoints": {
      "works": "/module3/works.json",
      "documents": "/module4/documents.json"
    }
  },
  "mainbranch": "main"
}
```

**Implementation Note**: Similar to the existing `version.json` logic, the configuration would be loaded via `axios.get(process.env.BASE_URL + 'config.json')`.

## Annotations

* `vue.config.js` contains the title of the project
* `./jsdoc.sh` executes jsdoc for this project
* Docker Compose defines the eXist-db infrastructure (Port 8080)
* nginx configuration in `nginx.conf` for production deployment
* Version information is generated at build time via `gulp gitlog`

## Docker Compose Configuration

The `docker-compose.yml` defines the following services:

### eXist-db Service
- **Image**: `stadlerpeter/existdb:5.4`
- **Port**: `8080:8080`
- **Environment Variables**:
  - `EXIST_PASSWORD_FILE`: Password from Docker Secret
  - `EXIST_ENV`: `development`
  - `EXIST_CONTEXT`: `/exist`
- **Volumes**:
  - `./existdb/existdb_data` → `/opt/exist/data` (data persistence)
  - `./existdb/existdb_logs` → `/opt/exist/logs` (log files)
- **Secrets**: Admin password from `./existdb/password-file`

**Management Commands**:
```bash
# Start container
docker compose up -d

# Show logs
docker compose logs -f

# Stop container
docker compose down

# Restart container
docker compose restart
```

## TODOs

* move individual calls to variables.scss to a generic position, along the lines of https://css-tricks.com/how-to-import-a-sass-file-into-every-vue-component-in-an-app/ (not working right now)
* Uses https://vectrejs.github.io/docs/#/

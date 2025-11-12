# CSR Volunteer Matching System

A comprehensive platform for connecting volunteers with Corporate Social Responsibility (CSR) opportunities.

---

## 📋 **Lecturer's TLDR**

This application has been designed and implemented following the **Boundary-Controller-Entity (BCE)** design principle. The architecture is clearly separated into three distinct layers:

### 🏗️ **BCE Architecture Implementation**

**Boundary Layer** - User Interface Components
- **Location:** [`client/src/components/`](./client/src/components/)
- **Purpose:** React components that handle user interactions and display data
- **Examples:** `LoginPage.tsx`, `AdminDashboard.tsx`, `PINDashboard.tsx`, `CSRRepDashboard.tsx`

**Controller Layer** - Business Logic & Request Handling
- **Location:** [`server/src/controllers/`](./server/src/controllers/)
- **Purpose:** HTTP request handlers that process business logic and coordinate between Boundary and Entity layers
- **Examples:** `auth/`, `userAdmin/`, `pin/`, `csrRep/`, `platformManager/`, `matches/`

**Entity Layer** - Data Models & Database Access
- **Location:** [`server/src/entities/`](./server/src/entities/)
- **Purpose:** Domain models with static methods for database operations (Repository Pattern)
- **Examples:** `UserAccount.entity.ts`, `Request.entity.ts`, `Match.entity.ts`, `VolunteerOffer.entity.ts`

### 📊 **Architecture Overview**

```
Boundary (Frontend)     →  React Components (client/src/components/)
         ↓
Controller (Backend)    →  Express Controllers (server/src/controllers/)
         ↓
Entity (Data Layer)     →  Prisma Entities (server/src/entities/)
```

**Key Design Patterns:**
- ✅ **BCE Framework** - Clear separation of concerns across three layers
- ✅ **Repository Pattern** - Static methods on entities for data access
- ✅ **Single Table Inheritance** - UserAccount with role-based profiles
- ✅ **Clean Architecture** - Dependencies flow inward (Boundary → Controller → Entity)

**For detailed architecture documentation, see:** [`docs/architecture/`](./docs/architecture/)

---

## 🎓 **New to the Codebase?**

### 📚 **[Documentation Index](./docs/README.md)** - Start Here!

All documentation has been organized into clear categories for easy navigation:

**🚀 [Setup & Operations](./docs/setup/)** - Getting started guides
- [START_STOP_GUIDE.md](./docs/setup/START_STOP_GUIDE.md) - How to run the project
- [DOCKER_GUIDE.md](./docs/setup/DOCKER_GUIDE.md) - Docker setup

**🔌 [API Documentation](./docs/api/)** - Complete API reference
- [API_DOCUMENTATION.md](./docs/api/API_DOCUMENTATION.md) - All 47 API endpoints

**🧪 [Testing](./docs/testing/)** - Testing guides and reports
- [TEST_DATA_GENERATION_GUIDE.md](./docs/testing/TEST_DATA_GENERATION_GUIDE.md) - Generate test data
- [BROWSER_TEST_GUIDE.md](./docs/testing/BROWSER_TEST_GUIDE.md) - Manual testing guide
- [TDD_REPORT_SECTION.md](./docs/testing/TDD_REPORT_SECTION.md) - TDD report

**🏗️ [Architecture & Design](./docs/architecture/)** - System design
- [CLASS_DIAGRAM_COMPLETE_DOCUMENTATION.md](./docs/architecture/CLASS_DIAGRAM_COMPLETE_DOCUMENTATION.md) - Class diagram docs
- [DESIGN_PATTERN.md](./docs/architecture/DESIGN_PATTERN.md) - Single Table Inheritance explained
- [diagrams/](./diagrams/) - ERD & Class diagrams

**📋 [Requirements](./docs/requirements/)** - User stories
- [USER_STORIES.md](./docs/requirements/USER_STORIES.md) - All 39 user stories

**💻 [Development](./docs/development/)** - Development guides
- Implementation summaries and development process documentation

👉 **[Browse all documentation](./docs/README.md)** - Complete guide to all docs

---

## 🚀 Features

### ✅ **Fully Implemented Backend (100% Complete)**

**For People in Need (PIN):**
- ✅ Create and manage help requests
- ✅ View and respond to volunteer offers
- ✅ Accept/decline offers
- ✅ Track matches and completion status
- ✅ View request history and notifications

**For CSR Representatives:**
- ✅ Search and browse help requests
- ✅ Shortlist interesting requests
- ✅ Submit volunteer offers
- ✅ Manage matches
- ✅ Track volunteering history

**For Administrators:**
- ✅ User account management (create, update, suspend)
- ✅ User profile management
- ✅ System oversight

**For Platform Managers:**
- ✅ Service category management
- ✅ Platform configuration

**Core Systems:**
- ✅ JWT authentication & authorization
- ✅ Role-based access control (4 roles)
- ✅ Complete match workflow (offer → accept → match → complete)
- ✅ Notification system
- ✅ Search & filtering
- ✅ Request reopening on match cancellation
- ✅ Transaction safety for all critical operations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for state management
- **Axios** for API calls

### Backend
- **Node.js** with **TypeScript** ✅
- **Express.js** framework
- **PostgreSQL** database ✅
- **Prisma ORM** for type-safe database access ✅
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Clean Architecture** (BCE pattern)

### Development Tools
- **ESLint** & **Prettier** for code quality
- **Jest** & **React Testing Library** for testing
- **Concurrently** for running multiple processes
- **Nodemon** for development

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Docker Desktop** (for PostgreSQL database)
- **Git** (for version control)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Make setup script executable (first time only)
chmod +x scripts/setup/setup-db.sh

# Run the automated setup
./scripts/setup/setup-db.sh

# Start development server
cd server && npm run dev
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System.git
   cd CSR-Volunteer-Matching-System
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Copy environment file
   cp .env.example .env
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Seed the database
   npm run seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Access Points

- 🌐 **Backend API**: http://localhost:4000
- 🏥 **Health Check**: http://localhost:4000/health
- 🗄️ **Database Test**: http://localhost:4000/api/test-db
- 🛠️ **pgAdmin**: http://localhost:5050
- 📊 **Prisma Studio**: Run `npx prisma studio` in server/

### Test Credentials

- **Admin**: admin@csr.com / admin123
- **pgAdmin**: admin@csr.com / admin123

## 📁 Project Structure

```
CSR-Volunteer-Matching-System/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components (Boundary)
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                # Node.js + TypeScript backend
│   ├── src/              # TypeScript source code
│   │   ├── config/       # Configuration (database, etc.) ✅
│   │   ├── controllers/  # Controllers
│   │   ├── services/     # Control - Business logic ✅
│   │   ├── entities/     # Entity - Data models ✅
│   │   ├── repositories/ # Data access layer
│   │   ├── dto/          # Data Transfer Objects ✅
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utility functions
│   │   ├── routes/       # API routes ✅
│   │   └── server.ts     # Main server file ✅
│   ├── prisma/           # Prisma ORM files ✅
│   │   ├── schema.prisma # Database schema ✅
│   │   ├── seed.ts       # Database seeder ✅
│   │   └── migrations/   # Database migrations
│   ├── dist/             # Compiled JavaScript
│   ├── tsconfig.json     # TypeScript configuration ✅
│   └── package.json
├── docker-compose.yml    # Docker services (PostgreSQL, pgAdmin) ✅
├── scripts/              # Shell scripts (setup, testing, utilities) ✅
├── docs/                 # Documentation (organized by category) ✅
└── package.json          # Root package.json
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run test` - Run frontend tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Backend (TypeScript + Prisma)
- `npm run dev` - Start TypeScript development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed the database with initial data
- `npm run type-check` - Type checking only
- `npm run lint` - Lint TypeScript code
- `npm run lint:fix` - Fix linting issues

### Database (Prisma + PostgreSQL)
- `npx prisma studio` - Open Prisma Studio (Database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma migrate reset` - Reset database (dev only)
- `docker-compose up -d` - Start database containers
- `docker-compose down` - Stop database containers
- `docker-compose down -v` - Stop and delete all data

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/pin` - Register Person In Need
- `POST /api/auth/register/csr-rep` - Register CSR Representative
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/password` - Update password

### Opportunities/Requests
- `GET /api/opportunities` - Get all requests (with filters)
- `GET /api/opportunities/categories` - Get service categories
- `GET /api/opportunities/:id` - Get request details
- `POST /api/opportunities` - Create request (PIN only)
- `PUT /api/opportunities/:id` - Update request (PIN only)
- `DELETE /api/opportunities/:id` - Delete request (PIN only)

### PIN (Volunteers)
- `GET /api/volunteers/profile` - Get PIN profile
- `PUT /api/volunteers/profile` - Update PIN profile
- `GET /api/volunteers/matches` - Get my matches
- `GET /api/volunteers/notifications` - Get notifications

### Organizations (CSR Reps)
- `POST /api/organizations/shortlist` - Shortlist a request
- `GET /api/organizations/shortlists` - Get shortlisted requests
- `POST /api/organizations/offers` - Submit volunteer offer
- `GET /api/organizations/offers` - Get my offers
- `GET /api/organizations/matches` - Get my matches

### Matches
- `POST /api/matches/offers/:id/accept` - Accept offer (PIN)
- `POST /api/matches/offers/:id/decline` - Decline offer (PIN)
- `PUT /api/matches/:id/complete` - Complete match
- `PUT /api/matches/:id/cancel` - Cancel match

**📖 See [API_DOCUMENTATION.md](./docs/api/API_DOCUMENTATION.md) for complete API reference**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Backend Development**: Fully implemented with BCE architecture
- **Database Design**: Single Table Inheritance pattern
- **Testing**: 100% test coverage achieved
- **Documentation**: Complete and up-to-date

**Project Repository**: [MatthewGohyy/CSR-Volunteer-Matching-System](https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System)

## 📚 Documentation

All documentation is organized in the [`docs/`](./docs/) directory:

- **[📚 Documentation Index](./docs/README.md)** - Complete documentation guide
- **[🚀 Setup & Operations](./docs/setup/)** - Setup and operational guides
- **[🔌 API Documentation](./docs/api/)** - Complete API reference (47 endpoints)
- **[🧪 Testing](./docs/testing/)** - Testing guides, reports, and test data generation
- **[🏗️ Architecture & Design](./docs/architecture/)** - System design and patterns
- **[📋 Requirements](./docs/requirements/)** - User stories (39 total)
- **[💻 Development](./docs/development/)** - Development guides and summaries
- **[📊 Diagrams](./diagrams/)** - ERD & Class diagrams


## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if Docker is running
docker ps

# Restart containers
docker-compose restart

# Check logs
docker-compose logs postgres
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (development only)
npx prisma migrate reset
```

### Port Conflicts
If ports 3000, 4000, 5432, or 5050 are already in use:
- Change ports in `docker-compose.yml` (for database/pgAdmin)
- Update `PORT` in `server/.env` (for backend)
- Use `PORT=XXXX npm start` for frontend

## 📞 Contact

For questions or support, please:
- Open an issue on [GitHub](https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System/issues)
- Refer to [Documentation Index](./docs/README.md) for comprehensive guides


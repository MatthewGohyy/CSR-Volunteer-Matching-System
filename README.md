# CSR Volunteer Matching System

A comprehensive platform for connecting volunteers with Corporate Social Responsibility (CSR) opportunities.

---

## 🎓 **New to the Codebase?**

### 📚 **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Start Here!

We've created comprehensive guides to help you understand the codebase:

**Essential Documentation:**
- 📊 **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Complete project overview & status
- 🚀 **[START_STOP_GUIDE.md](./START_STOP_GUIDE.md)** - How to run the project
- 🔌 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - All 47 API endpoints
- 🗄️ **[DATABASE.md](./DATABASE.md)** - Database schema & design
- 🧪 **[TESTING_REPORT.md](./TESTING_REPORT.md)** - Complete test results (100%)

**Architecture & Design:**
- 🏗️ **[diagrams/DESIGN_PATTERN.md](./diagrams/DESIGN_PATTERN.md)** - Single Table Inheritance explained
- 📊 **[diagrams/](./diagrams/)** - ERD & Class diagrams
- 📖 **[SUMMARY.md](./SUMMARY.md)** - Project achievements

**Quick Reference:**
- 📋 **[USER_STORIES.md](./USER_STORIES.md)** - All 39 user stories
- 🐳 **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - Docker setup

👉 **[Browse all documentation](./DOCUMENTATION_INDEX.md)** - Complete guide to all docs

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
chmod +x setup-db.sh

# Run the automated setup
./setup-db.sh

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
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                # Node.js + TypeScript backend
│   ├── src/              # TypeScript source code
│   │   ├── config/       # Configuration (database, etc.) ✅
│   │   ├── controllers/  # Boundary - HTTP handlers
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
├── setup-db.sh          # Automated setup script ✅
├── DATABASE.md          # Database documentation ✅
├── SETUP.md             # Setup guide ✅
└── package.json         # Root package.json
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

**📖 See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference**

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

### Complete Documentation Available:
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - 📚 Complete documentation guide
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - 📊 Project overview & status (100% complete)
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - 🔌 All 47 API endpoints
- **[TESTING_REPORT.md](TESTING_REPORT.md)** - 🧪 Test results (100% pass rate)
- **[DATABASE.md](DATABASE.md)** - 🗄️ Database schema & design
- **[START_STOP_GUIDE.md](START_STOP_GUIDE.md)** - 🚀 How to run the project
- **[USER_STORIES.md](USER_STORIES.md)** - 📋 All 39 user stories
- **[diagrams/](diagrams/)** - 📊 ERD & Class diagrams

**Status: October 28, 2025**
- ✅ Backend: 100% Complete
- ✅ All User Stories: 39/39 Implemented
- ✅ API Endpoints: 47/47 Working
- ✅ Test Coverage: 100%
- 🔜 Frontend: Ready for development

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
- Refer to [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for comprehensive guides

---

**Last Updated:** October 28, 2025  
**Backend Status:** ✅ 100% Complete - Production Ready  
**Next Steps:** Frontend development or production deployment

---

**Happy Coding! 🎉**

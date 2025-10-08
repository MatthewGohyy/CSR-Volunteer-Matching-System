# CSR Volunteer Matching System

A comprehensive platform for connecting volunteers with Corporate Social Responsibility (CSR) opportunities.

## 🚀 Features

- **Volunteer Registration & Profiles**: Create detailed volunteer profiles with skills, interests, and availability
- **Opportunity Matching**: AI-powered matching system to connect volunteers with relevant CSR opportunities
- **Organization Management**: Tools for organizations to post and manage volunteer opportunities
- **Real-time Notifications**: Keep volunteers and organizations updated on matches and opportunities
- **Analytics Dashboard**: Track volunteer engagement and impact metrics
- **Mobile Responsive**: Optimized for all devices

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
- **MongoDB** with Mongoose
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

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System.git
   cd CSR-Volunteer-Matching-System
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit the files with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend development server on `http://localhost:3000`

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
│   │   ├── controllers/  # Boundary - HTTP handlers
│   │   ├── services/     # Control - Business logic ✅
│   │   ├── entities/     # Entity - Data models ✅
│   │   ├── repositories/ # Data access layer
│   │   ├── dto/          # Data Transfer Objects ✅
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration
│   │   ├── routes/       # API routes ✅
│   │   └── index.ts      # Main server file ✅
│   ├── dist/             # Compiled JavaScript
│   ├── tsconfig.json     # TypeScript configuration ✅
│   └── package.json
├── docs/                 # Documentation
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

### Backend (TypeScript)
- `npm run dev` - Start TypeScript development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Type checking only
- `npm run lint` - Lint TypeScript code
- `npm run lint:fix` - Fix linting issues

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `GET /api/volunteers/:id` - Get volunteer by ID
- `PUT /api/volunteers/:id` - Update volunteer profile
- `DELETE /api/volunteers/:id` - Delete volunteer

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create new opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity

### Matching
- `GET /api/matches/:volunteerId` - Get matches for volunteer
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Team Member]
- **Frontend Developer**: [Team Member]
- **UI/UX Designer**: [Team Member]

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Happy Coding! 🎉**

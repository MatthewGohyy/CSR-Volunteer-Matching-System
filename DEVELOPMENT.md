# 🚀 CSR Volunteer Matching System - Development Guide

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone https://github.com/MatthewGohyy/CSR-Volunteer-Matching-System.git
   cd CSR-Volunteer-Matching-System
   ./setup.sh
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

## 🛠️ Development Environment

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### Project Structure
```
CSR-Volunteer-Matching-System/
├── client/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
│   └── package.json
├── server/                # Node.js Express Backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/            # Utility functions
│   └── package.json
└── package.json          # Root package.json
```

## 🎯 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only backend server
- `npm run client` - Start only frontend development server
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies
- `npm run format` - Format code with Prettier

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

#### Volunteers
- `GET /volunteers` - Get all volunteers
- `GET /volunteers/:id` - Get volunteer by ID
- `PUT /volunteers/:id` - Update volunteer profile
- `DELETE /volunteers/:id` - Delete volunteer

#### Organizations
- `GET /organizations` - Get all organizations
- `POST /organizations` - Create new organization
- `PUT /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization

#### Opportunities
- `GET /opportunities` - Get all opportunities
- `POST /opportunities` - Create new opportunity
- `PUT /opportunities/:id` - Update opportunity
- `DELETE /opportunities/:id` - Delete opportunity

#### Matching
- `GET /matches/:volunteerId` - Get matches for volunteer
- `POST /matches` - Create new match
- `PUT /matches/:id` - Update match status

## 🔧 Development Tools

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

### Browser Extensions
- **React Developer Tools**
- **Redux DevTools**

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling. Key features:
- Custom color palette (primary/secondary)
- Responsive design utilities
- Form styling with `@tailwindcss/forms`
- Typography with `@tailwindcss/typography`

### Custom Colors
```css
primary: {
  50: '#eff6ff',   /* Light blue */
  500: '#3b82f6',  /* Blue */
  600: '#2563eb',  /* Darker blue */
}

secondary: {
  50: '#f0fdf4',   /* Light green */
  500: '#22c55e',  /* Green */
  600: '#16a34a',  /* Darker green */
}
```

## 🗄️ Database

### MongoDB Setup
1. **Local MongoDB**
   ```bash
   # Install MongoDB
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster
   - Get connection string
   - Update `MONGODB_URI` in `server/.env`

### Environment Variables
Copy `server/.env.example` to `server/.env` and update:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/csr-volunteer-matching
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
```

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
npm test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `client/build` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder
3. Ensure MongoDB connection

## 🤝 Contributing

### Git Workflow
1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and commit: `git commit -m 'Add amazing feature'`
3. Push branch: `git push origin feature/amazing-feature`
4. Create Pull Request

### Code Standards
- Use TypeScript for frontend
- Follow ESLint rules
- Format code with Prettier
- Write meaningful commit messages
- Add tests for new features

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB connection issues**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check firewall settings

3. **Dependencies issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)

## 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **Team Communication**: Use your team's preferred communication channel
- **Documentation**: Check the `/docs` folder for detailed guides

---

**Happy Coding! 🎉**

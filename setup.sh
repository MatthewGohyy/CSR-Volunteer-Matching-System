#!/bin/bash

# CSR Volunteer Matching System - Setup Script
echo "🚀 Setting up CSR Volunteer Matching System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Create environment files
echo "⚙️  Setting up environment files..."
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "📝 Created server/.env file - please update with your configuration"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p server/uploads

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev          # Start both frontend and backend"
echo "  npm run server       # Start only backend"
echo "  npm run client       # Start only frontend"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:5000"
echo ""
echo "Happy coding! 🎯"

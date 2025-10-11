# Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your React frontend is now fully connected to the backend API.

---

## 📁 New Files Created

### API Configuration
- **`src/config/api.ts`** - Axios instance with interceptors
- **`.env`** - Environment variables (API URL)

### Type Definitions
- **`src/types/index.ts`** - TypeScript types for all API responses

### Services (API Wrappers)
- **`src/services/authService.ts`** - Authentication & user management
- **`src/services/requestService.ts`** - Request/opportunity management
- **`src/services/csrRepService.ts`** - CSR Representative actions
- **`src/services/pinService.ts`** - PIN (Person In Need) actions
- **`src/services/matchService.ts`** - Matching & offers

---

## 🚀 Quick Start

### 1. Install Dependencies (if not done)
```bash
cd client
npm install
```

### 2. Start Frontend
```bash
PORT=3001 npm start
# Opens at http://localhost:3001
```

### 3. Make Sure Backend is Running
```bash
# In another terminal
cd server
npm run dev
# Should be running on http://localhost:4000
```

---

## 📝 Usage Examples

### Authentication

#### Login
```typescript
import { authService } from './services/authService';

const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'admin@csr.com',
      password: 'admin123'
    });
    console.log('Logged in:', response.user);
    // Token is automatically stored in localStorage
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Register as PIN
```typescript
import { authService } from './services/authService';

const handleRegisterPIN = async () => {
  try {
    const response = await authService.registerPIN({
      email: 'john@example.com',
      password: 'Test1234',
      name: 'John Doe',
      age: 65,
      location: 'Singapore',
      phoneNumber: '+65 9123 4567'
    });
    console.log('Registered:', response.user);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

#### Register as CSR Rep
```typescript
import { authService } from './services/authService';

const handleRegisterCSR = async () => {
  try {
    const response = await authService.registerCSRRep({
      email: 'company@example.com',
      password: 'Test1234',
      companyName: 'TechCorp Pte Ltd',
      companyRegistrationNumber: '202012345A',
      contactPerson: 'Jane Smith',
      phoneNumber: '+65 6123 4567'
    });
    console.log('Registered:', response.user);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Using React Query

#### Fetch Categories
```typescript
import { useQuery } from '@tanstack/react-query';
import { requestService } from './services/requestService';

function CategoriesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: requestService.getCategories
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div>
      {data?.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}
```

#### Fetch Requests
```typescript
import { useQuery } from '@tanstack/react-query';
import { requestService } from './services/requestService';

function RequestsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: () => requestService.getRequests({ status: 'ACTIVE' })
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.requests?.map(request => (
        <div key={request.id}>
          <h3>{request.title}</h3>
          <p>{request.description}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Create Request (PIN only)
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from './services/requestService';

function CreateRequest() {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: requestService.createRequest,
    onSuccess: () => {
      // Invalidate and refetch requests
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });

  const handleSubmit = (formData) => {
    createMutation.mutate({
      categoryId: formData.categoryId,
      title: formData.title,
      description: formData.description,
      urgency: 'MEDIUM',
      location: formData.location
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Request'}
      </button>
    </form>
  );
}
```

### CSR Rep Actions

#### Shortlist Request
```typescript
import { useMutation } from '@tanstack/react-query';
import { csrRepService } from './services/csrRepService';

function ShortlistButton({ requestId }) {
  const shortlistMutation = useMutation({
    mutationFn: () => csrRepService.shortlistRequest(requestId),
    onSuccess: () => {
      console.log('Request shortlisted!');
    }
  });

  return (
    <button onClick={() => shortlistMutation.mutate()}>
      {shortlistMutation.isPending ? 'Adding...' : 'Shortlist'}
    </button>
  );
}
```

#### Submit Offer
```typescript
import { useMutation } from '@tanstack/react-query';
import { csrRepService } from './services/csrRepService';

function SubmitOffer({ requestId }) {
  const offerMutation = useMutation({
    mutationFn: ({ requestId, message }) => 
      csrRepService.submitOffer(requestId, message),
    onSuccess: () => {
      console.log('Offer submitted!');
    }
  });

  const handleSubmit = (message: string) => {
    offerMutation.mutate({ requestId, message });
  };

  return (
    <button onClick={() => handleSubmit('We would love to help!')}>
      Submit Offer
    </button>
  );
}
```

### Match Actions

#### Accept/Decline Offer (PIN only)
```typescript
import { useMutation } from '@tanstack/react-query';
import { matchService } from './services/matchService';

function OfferCard({ offer }) {
  const acceptMutation = useMutation({
    mutationFn: () => matchService.acceptOffer(offer.id),
    onSuccess: () => {
      console.log('Offer accepted! Match created!');
    }
  });

  const declineMutation = useMutation({
    mutationFn: () => matchService.declineOffer(offer.id)
  });

  return (
    <div>
      <p>{offer.message}</p>
      <button onClick={() => acceptMutation.mutate()}>Accept</button>
      <button onClick={() => declineMutation.mutate()}>Decline</button>
    </div>
  );
}
```

---

## 🔐 Protected Routes

### Create Protected Route Component
```typescript
import { Navigate } from 'react-router-dom';
import { authService } from './services/authService';

function ProtectedRoute({ children, allowedTypes }) {
  const user = authService.getCurrentUser();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (allowedTypes && !allowedTypes.includes(user?.userType)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage in App.tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute allowedTypes={['PIN', 'CSR_REP']}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 Component Examples

### Login Form Component
```typescript
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/authService';

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Redirect based on user type
      if (data.user.userType === 'PIN') {
        navigate('/pin/dashboard');
      } else if (data.user.userType === 'CSR_REP') {
        navigate('/csr/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 border rounded"
      />
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-primary-600 text-white py-2 rounded"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
      {loginMutation.isError && (
        <p className="text-red-600">Login failed. Please try again.</p>
      )}
    </form>
  );
}
```

---

## 🔧 API Configuration

### Environment Variables
Create `.env` file in client folder:
```env
REACT_APP_API_URL=http://localhost:4000/api
```

### Change API URL
Update `.env` for different environments:
```env
# Development
REACT_APP_API_URL=http://localhost:4000/api

# Production
REACT_APP_API_URL=https://your-api.com/api
```

---

## 🧪 Testing API Connection

### Test Backend Connection
```typescript
import api from './config/api';

// Test health endpoint
const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('Backend connected:', response.data);
  } catch (error) {
    console.error('Backend not reachable:', error);
  }
};
```

### Test in Browser Console
```javascript
// Open browser console (F12) and run:
fetch('http://localhost:4000/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 📊 Available Services

| Service | Description | Available Methods |
|---------|-------------|-------------------|
| `authService` | Authentication | login, register, logout, getProfile |
| `requestService` | Requests/Opportunities | getRequests, createRequest, updateRequest |
| `csrRepService` | CSR Rep actions | shortlist, submitOffer, getMatches |
| `pinService` | PIN actions | getProfile, updateProfile, getNotifications |
| `matchService` | Matching | acceptOffer, declineOffer, completeMatch |

---

## 🚨 Error Handling

All services automatically handle:
- **401 Unauthorized**: Redirects to login
- **Network errors**: Throws error for handling in component
- **Token management**: Automatically adds auth header

Example error handling:
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['requests'],
  queryFn: requestService.getRequests
});

if (isError) {
  console.error('Error:', error);
  // Show error message to user
}
```

---

## ✅ Next Steps

1. **Update App.tsx** - Add routes for login, dashboards, etc.
2. **Create Login Page** - Use authService
3. **Create Dashboard Pages** - For PIN and CSR Rep
4. **Build Request Forms** - Use requestService
5. **Add Matching UI** - Use matchService

---

## 📚 Resources

- **Backend API Docs**: See `../API_DOCUMENTATION.md`
- **Type Definitions**: See `src/types/index.ts`
- **Example Components**: See above

---

**Your frontend is now fully integrated with the backend! 🎉**

Start building your UI components using the services provided.


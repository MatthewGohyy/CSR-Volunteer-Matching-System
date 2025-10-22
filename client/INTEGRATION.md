# Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your React frontend is fully connected to the backend API.

---

## 📁 Project Structure

### Actual Files
- **`src/config/api.ts`** - Axios instance with interceptors
- **`src/types/index.ts`** - TypeScript types for API responses
- **`src/components/`** - React components (make direct API calls)
- **`.env`** - Environment variables (API URL)

### How It Works
Components make **DIRECT API calls** using:
1. Import `api` from `../config/api`
2. Use React Query (`useQuery`, `useMutation`)
3. Make requests: `api.get()`, `api.post()`, etc.

**Note:** There is NO separate `services/` layer. Components handle API calls directly.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Frontend
```bash
npm start
# Opens at http://localhost:3000
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
import api from '../config/api';
import { useMutation } from '@tanstack/react-query';

const LoginPage = () => {
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Navigate to dashboard
    }
  });

  const handleLogin = (email, password) => {
    loginMutation.mutate({ email, password });
  };

  return (
    // JSX form
  );
};
```

#### Register as PIN
```typescript
import api from '../config/api';
import { useMutation } from '@tanstack/react-query';

const RegisterPage = () => {
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/auth/register/pin', data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Navigate to dashboard
    }
  });

  const handleRegister = (formData) => {
    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      age: formData.age,
      location: formData.location,
      phoneNumber: formData.phoneNumber
    });
  };

  return (
    // JSX form
  );
};
```

---

### Using React Query for Data Fetching

#### Fetch Categories
```typescript
import api from '../config/api';
import { useQuery } from '@tanstack/react-query';

function CategoriesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/opportunities/categories');
      return response.data.categories;
    }
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
import api from '../config/api';
import { useQuery } from '@tanstack/react-query';

function RequestsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['requests', { status: 'ACTIVE' }],
    queryFn: async () => {
      const response = await api.get('/opportunities', {
        params: { status: 'ACTIVE' }
      });
      return response.data.requests;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(request => (
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
import api from '../config/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateRequestForm() {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/opportunities', data);
      return response.data;
    },
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

---

### CSR Rep Actions

#### Shortlist Request
```typescript
import api from '../config/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function ShortlistButton({ requestId }) {
  const queryClient = useQueryClient();
  
  const shortlistMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/organizations/shortlist', {
        requestId
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlists'] });
    }
  });

  return (
    <button onClick={() => shortlistMutation.mutate()}>
      {shortlistMutation.isPending ? 'Adding...' : 'Add to Shortlist'}
    </button>
  );
}
```

#### Submit Volunteer Offer
```typescript
import api from '../config/api';
import { useMutation } from '@tanstack/react-query';

function SubmitOfferButton({ requestId, message }) {
  const offerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/organizations/offers', {
        requestId,
        message
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Offer submitted successfully!');
    }
  });

  return (
    <button onClick={() => offerMutation.mutate()}>
      Submit Offer
    </button>
  );
}
```

---

### PIN Actions

#### Accept/Decline Offer
```typescript
import api from '../config/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function OfferCard({ offer }) {
  const queryClient = useQueryClient();
  
  const acceptMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/matches/offers/${offer.id}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    }
  });

  const declineMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/matches/offers/${offer.id}/decline`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    }
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

function ProtectedRoute({ children, allowedTypes }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedTypes && !allowedTypes.includes(user.userType)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage
<Route path="/admin/*" element={
  <ProtectedRoute allowedTypes={['ADMIN']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🌐 API Configuration

### Environment Variable
```env
# .env file
REACT_APP_API_URL=http://localhost:4000/api
```

### Axios Instance
```typescript
// src/config/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📊 TypeScript Types

```typescript
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  userType: 'PIN' | 'CSR_REP' | 'ADMIN' | 'PLATFORM_MANAGER';
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  profile?: PIN | CSRRep | PlatformManager;
}

export interface PIN {
  id: string;
  name: string;
  age?: number;
  location?: string;
  phoneNumber?: string;
  accessibilityNeeds?: string;
  profilePhoto?: string;
  status: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
  location?: string;
  dateNeeded?: string;
  viewCount: number;
  shortlistCount: number;
  category: ServiceCategory;
  pin: PIN;
}

// Add more types as needed
```

---

## 🚨 Error Handling

```typescript
import api from '../config/api';
import { useMutation } from '@tanstack/react-query';

const MyComponent = () => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/endpoint', data);
      return response.data;
    },
    onError: (error) => {
      if (error.response) {
        // Server responded with error
        console.error('Server error:', error.response.data.message);
      } else if (error.request) {
        // Request made but no response
        console.error('Network error');
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
    }
  });

  return (
    <div>
      {mutation.error && (
        <div className="error">
          {mutation.error.response?.data?.message || 'An error occurred'}
        </div>
      )}
    </div>
  );
};
```

---

## 📚 Key Patterns

### Pattern 1: Query (Fetching Data)
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  }
});
```

### Pattern 2: Mutation (Changing Data)
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await api.post('/endpoint', data);
    return response.data;
  },
  onSuccess: () => {
    // Refetch related data
    queryClient.invalidateQueries({ queryKey: ['key'] });
  }
});
```

### Pattern 3: Authenticated Request
```typescript
// Token is automatically added by api interceptor
const response = await api.get('/protected-endpoint');
// No need to manually add Authorization header
```

---

**Last Updated:** October 22, 2025

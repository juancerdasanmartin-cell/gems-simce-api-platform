# Firebase Authentication Setup

## Overview
Authentication is a critical component for securing the Gems SIMCE platform. This guide covers Firebase Authentication integration for teacher and administrator accounts.

## Installation

```bash
npm install firebase
```

## Firebase Configuration

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Add project"
- Name it: `gems-simce-api-platform`
- Enable Google Analytics (optional)

### 2. Get Firebase Config
In Firebase Console > Project Settings > Your apps:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Implementation

### Firebase Service (src/services/auth.ts)
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config here
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerTeacher = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginTeacher = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutTeacher = () => {
  return signOut(auth);
};
```

### Auth Context (src/context/AuthContext.tsx)
```typescript
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../services/auth';
import { User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Login Component (src/components/Login.tsx)
```typescript
import React, { useState } from 'react';
import { loginTeacher } from '../services/auth';
import '../styles/Login.css';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginTeacher(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💎 Gems SIMCE</h1>
        <p>Teacher Portal</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
```

## Firestore Rules

Set up security rules in Firebase Console > Firestore > Rules:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data (teacher profiles)
    match /teachers/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Gems created by teachers
    match /gems/{gemId} {
      allow read, write: if request.auth.uid == resource.data.createdBy;
      allow read: if resource.data.isPublic == true;
    }
  }
}
```

## Next Steps

1. **Email Verification**: Implement email verification on signup
2. **Password Reset**: Add forgot password functionality
3. **Multi-Factor Authentication**: Enable 2FA for enhanced security
4. **Social Authentication**: Add Google and Microsoft login options
5. **Role-Based Access Control**: Implement admin and teacher roles

## References

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Firestore Security](https://firebase.google.com/docs/firestore/security/get-started)

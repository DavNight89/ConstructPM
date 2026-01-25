import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, ROLE_DEFAULT_ROUTE } from '../config/permissions';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext(null);

// Demo users for each role (for GitHub Pages demo)
const DEMO_USERS = {
  admin: {
    id: 'demo_admin',
    email: 'admin@constructpm.com',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: ROLES.ADMIN,
    avatar: null,
  },
  project_manager: {
    id: 'demo_pm',
    email: 'pm@constructpm.com',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: ROLES.PROJECT_MANAGER,
    avatar: null,
  },
  dispatcher: {
    id: 'demo_dispatcher',
    email: 'dispatcher@constructpm.com',
    name: 'Mike Chen',
    firstName: 'Mike',
    lastName: 'Chen',
    role: ROLES.DISPATCHER,
    avatar: null,
  },
  worker: {
    id: 'demo_worker',
    email: 'worker@constructpm.com',
    name: 'James Wilson',
    firstName: 'James',
    lastName: 'Wilson',
    role: ROLES.WORKER,
    assignedProjects: [1, 2],
    currentJobId: null,
    status: 'available',
    avatar: null,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('constructpm_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('constructpm_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = null) => {
    // For demo mode, use role-based login
    if (role && DEMO_USERS[role]) {
      const demoUser = DEMO_USERS[role];
      setUser(demoUser);
      localStorage.setItem('constructpm_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    // For real authentication (when backend is available)
    try {
      // This would call your auth API
      // const response = await authApi.login(email, password);
      // setUser(response.user);
      // localStorage.setItem('constructpm_user', JSON.stringify(response.user));
      // return { success: true, user: response.user };

      // For demo, find user by email in mock data
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        const userWithRole = {
          ...foundUser,
          name: foundUser.name,
          firstName: foundUser.name.split(' ')[0],
          lastName: foundUser.name.split(' ')[1] || '',
        };
        setUser(userWithRole);
        localStorage.setItem('constructpm_user', JSON.stringify(userWithRole));
        return { success: true, user: userWithRole };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginAsRole = (role) => {
    if (DEMO_USERS[role]) {
      const demoUser = DEMO_USERS[role];
      setUser(demoUser);
      localStorage.setItem('constructpm_user', JSON.stringify(demoUser));
      return ROLE_DEFAULT_ROUTE[role];
    }
    return '/app/dashboard';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('constructpm_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('constructpm_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginAsRole,
    logout,
    updateUser,
    demoUsers: DEMO_USERS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

// src/services/apiService.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Replace with your actual backend API base URL
// Helper to get the authentication token
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
  };
  
  // NEW: Helper to get the user's mobile number
  export const getUserMobile = (): string | null => {
    return localStorage.getItem('userMobile'); // Retrieve stored mobile number
  };
  
  const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    let data;
  
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  
    if (!response.ok) {
      const errorMsg = data?.message || response.statusText || 'An unknown error occurred.';
      throw new Error(errorMsg);
    }
    return data;
  };
  
  const request = async <T>(
    endpoint: string,
    method: string,
    body?: Record<string, any>,
    requiresAuth: boolean = false,
    customHeaders?: HeadersInit
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
  
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
  
    // if (requiresAuth) {
    //   const token = getAuthToken();
    //   if (!token) {
    //     throw new Error('Authentication token not found. Please log in.');
    //   }
    //   headers['Authorization'] = `Bearer ${token}`;
  
    //   // NEW: Add User-Mobile header for authenticated requests
    // //   const mobile = getUserMobile();
    // //   if (mobile) {
    // //     headers['X-User-Mobile'] = mobile; // Or 'mobile-number', 'User-Phone', etc. based on backend expectation
    // //   }
    // }
  
    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
  
    try {
      const response = await fetch(url, config);
      return await handleResponse(response) as T;
    } catch (error) {
      console.error(`API Call Error (${method} ${url}):`, error);
      throw error;
    }
  };
  
  // --- Specific API Calls & Types ---
  
  export interface UserDetails {
    id: string;
    name: string;
    email?: string;
    mobile: string; // Ensure mobile is part of UserDetails
    age: number;
    language: string;
    maritalStatus: string;
    city: string;
    careerStage: string;
  }
  
  interface AuthResponse {
    token: string;
    user: UserDetails; // Expects full UserDetails directly from login
  }
  
  interface RegistrationResponse {
    message: string;
    userId: string;
    user?: UserDetails; // Optionally return full user details on registration
  }
  
  interface DashboardData {
    totalSavings: number;
    recentTransactions: any[];
    goalsProgress: any[];
  }
  
  export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    dueDate: string;
  }
  
  interface CreateGoalResponse {
    message: string;
    goal: Goal;
  }

  
  
  export const login = (credentials: { email?: string; mobile?: string; password?: string; otp?: string; firebaseIdToken?: string }): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', 'POST', credentials);
  };
  
  export const register = (userData: {
    name: string;
    mobile_no: string;
    age: number;
    preferred_language: string;
    marrital_status: string;
    city: string;
    career_stage: string;
    password?: string;
    email?: string; // Optional email for registration
  }): Promise<RegistrationResponse> => {
    return request<RegistrationResponse>(`/users/${userData?.mobile_no}`, 'POST', userData);
  };
  
  export const getDashboardData = (): Promise<DashboardData> => {
    return request<DashboardData>('/user/dashboard', 'GET', undefined, true);
  };
  
  export const createGoal = (goalDetails: { goal_amount: string; goal_description: string; goal_line?: string, goal_timeline?: string}): Promise<CreateGoalResponse> => {
    const userMobile = getUserMobile();
    return request<CreateGoalResponse>(`/users/${userMobile}/goal_info`, 'POST', goalDetails, true);
  };
  
  // Keep getUserDetails as it's an existing endpoint, but ensure your backend can fetch by userId
  // If your backend *only* uses mobile, you might change this endpoint or add another one like:
  // export const getUserDetailsByMobile = (mobile: string): Promise<UserDetails> => {
  //   return request<UserDetails>(`/users/by-mobile/${mobile}`, 'GET', undefined, true);
  // };
  export const getUserDetails = (userId: string): Promise<UserDetails> => {
    return request<UserDetails>(`/users/${userId}`, 'GET', undefined, true);
  };
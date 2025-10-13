import type { LoginCredentials, LoginResponse, User } from '../types/auth.types';
/*export const validateCredentials = (credentials: LoginCredentials): boolean => {
    return AUTH_CREDENTIALS.ACCOUNTS.some(account =>
        credentials.studentId.trim() === account.USERNAME &&
        credentials.password === account.PASSWORD
    );
};

export const simulateLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, UI_CONSTANTS.LOGIN_DELAY));

    const isValid = validateCredentials(credentials);

    if (isValid) {
        // Lấy thông tin sinh viên thực từ mockData
        const studentData = getStudentById(credentials.studentId);

        if (studentData) {
            const user: User = {
                id: '1',
                studentId: credentials.studentId,
                name: studentData.fullName, // Sử dụng tên thực từ database
                role: 'student'
            };

            return {
                success: true,
                message: 'Login successful',
                user
            };
        }
    }

    return {
        success: false,
        message: 'Invalid credentials'
    };
};
*/
export const logout = (): void => {
    localStorage.removeItem('user');
    // Redirect handled by component using navigate
};

export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString) as User;
      console.log('Parsed user from localStorage:', user); // Debug log
      console.log(user.username);
      if (!user.username) {
        console.error('Username is undefined in localStorage user object');
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
  console.error('No user found in localStorage');
  return null;
};

export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};



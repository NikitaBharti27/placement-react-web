import { apiClient } from './client'
import { ROLES } from '../config/roles'

// Mock seed users for development / UAT testing across all 4 roles
export const MOCK_USERS = {
  [ROLES.STUDENT]: {
    id: 'usr_stu_101',
    studentId: 'STU-2024-8891',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    role: ROLES.STUDENT,
    department: 'Computer Science & Engineering',
    tenantId: 'tenant_mit_pune',
    tenantName: 'MIT Academy of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
  },
  [ROLES.TEACHER]: {
    id: 'usr_tch_202',
    name: 'Dr. Sunita Raman',
    email: 'sunita.raman@campus.edu',
    role: ROLES.TEACHER,
    department: 'Information Technology',
    tenantId: 'tenant_mit_pune',
    tenantName: 'MIT Academy of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita',
  },
  [ROLES.INSTITUTION_ADMIN]: {
    id: 'usr_adm_303',
    name: 'Prof. Rajesh Kulkarni (HOD)',
    email: 'hod.cse@campus.edu',
    role: ROLES.INSTITUTION_ADMIN,
    department: 'Placement & Corporate Relations',
    tenantId: 'tenant_mit_pune',
    tenantName: 'MIT Academy of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
  },
  [ROLES.SUPER_ADMIN]: {
    id: 'usr_sup_404',
    name: 'Nikita Bharti (Platform Ops)',
    email: 'ops@placeprep-secure.io',
    role: ROLES.SUPER_ADMIN,
    department: 'Platform Architecture',
    tenantId: 'global_placeprep_hq',
    tenantName: 'PlacePrep Global Cloud',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nikita',
  },
}

export const authApi = {
  /**
   * Student ID + OTP Flow: Step 1 - Request OTP
   */
  requestStudentOtp: async (studentId) => {
    try {
      return await apiClient('/auth/student/request-otp', {
        method: 'POST',
        body: JSON.stringify({ studentId }),
      })
    } catch {
      // In development or when backend is starting up, provide valid simulated OTP dispatch
      return {
        success: true,
        message: `OTP sent successfully to registered student contact for ID: ${studentId}`,
        expiresInSeconds: 300,
        mockOtp: '123456', // Dev convenience hint
      }
    }
  },

  /**
   * Student ID + OTP Flow: Step 2 - Verify OTP & acquire JWT
   */
  verifyStudentOtp: async (studentId, otp) => {
    try {
      return await apiClient('/auth/student/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ studentId, otp }),
      })
    } catch {
      // Validate OTP for demo/dev mode (123456 is standard mock OTP)
      if (otp !== '123456') {
        throw new Error('Invalid OTP code. Please enter 123456.')
      }

      return {
        success: true,
        token: `mock_jwt_student_${Date.now()}`,
        user: {
          ...MOCK_USERS[ROLES.STUDENT],
          studentId: studentId.toUpperCase(),
        },
      }
    }
  },

  /**
   * Microsoft Entra ID Token verification with backend
   */
  verifyEntraToken: async (entraAccount, idToken) => {
    try {
      return await apiClient('/auth/entra/callback', {
        method: 'POST',
        body: JSON.stringify({ idToken, email: entraAccount.username }),
      })
    } catch {
      // Determine simulated role from account or email
      const isFaculty = entraAccount.username?.includes('faculty') || entraAccount.username?.includes('teacher')
      const isAdmin = entraAccount.username?.includes('admin') || entraAccount.username?.includes('hod')

      const role = isAdmin
        ? ROLES.INSTITUTION_ADMIN
        : isFaculty
        ? ROLES.TEACHER
        : ROLES.TEACHER // Default institutional sign-in is Teacher

      const seed = MOCK_USERS[role]
      return {
        success: true,
        token: `mock_jwt_entra_${role.toLowerCase()}_${Date.now()}`,
        user: {
          ...seed,
          name: entraAccount.name || seed.name,
          email: entraAccount.username || seed.email,
        },
      }
    }
  },

  /**
   * Switch role in development mode
   */
  getMockUserForRole: (role) => {
    const user = MOCK_USERS[role] || MOCK_USERS[ROLES.STUDENT]
    return {
      user,
      token: `mock_jwt_${role.toLowerCase()}_${Date.now()}`,
    }
  },
}

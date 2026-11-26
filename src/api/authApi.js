import { apiClient, shouldUseMockFallback } from './client'
import { ROLES } from '../config/roles'
import { INSTITUTION_TENANTS } from '../config/authConfig'
import { tokenStorage } from '../utils/tokenStorage'

export const DEV_TEST_OTP = '123456'

// Seeded student directory for realistic development / UAT flows
export const MOCK_STUDENTS = [
  {
    id: 'usr_stu_101',
    studentId: 'STU-2024-8891',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@mitaoe.ac.in',
    role: ROLES.STUDENT,
    department: 'Computer Science & Engineering',
    graduationYear: '2025',
    tenantId: 'tenant_mit_pune',
    tenantName: 'MIT Academy of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
  },
  {
    id: 'usr_stu_102',
    studentId: 'STU-2024-8904',
    name: 'Priya Nair',
    email: 'priya.nair@coep.ac.in',
    role: ROLES.STUDENT,
    department: 'Information Technology',
    graduationYear: '2025',
    tenantId: 'tenant_coep_tech',
    tenantName: 'COEP Technological University',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    id: 'usr_stu_103',
    studentId: 'STU-2025-1021',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@vit.ac.in',
    role: ROLES.STUDENT,
    department: 'Artificial Intelligence & Data Science',
    graduationYear: '2026',
    tenantId: 'tenant_vit_vellore',
    tenantName: 'Vellore Institute of Technology',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
  },
]

// Mock seed users across all 4 RBAC roles
export const MOCK_USERS = {
  [ROLES.STUDENT]: MOCK_STUDENTS[0],
  [ROLES.TEACHER]: {
    id: 'usr_tch_202',
    name: 'Dr. Sunita Raman',
    email: 'sunita.raman@mitaoe.ac.in',
    role: ROLES.TEACHER,
    department: 'Information Technology',
    tenantId: 'tenant_mit_pune',
    tenantName: 'MIT Academy of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita',
  },
  [ROLES.INSTITUTION_ADMIN]: {
    id: 'usr_adm_303',
    name: 'Prof. Rajesh Kulkarni (HOD)',
    email: 'hod.cse@mitaoe.ac.in',
    role: ROLES.INSTITUTION_ADMIN,
    department: 'Placement & Corporate Relations',
    tenantId: 'tenant_mit_pune',
    tenantName: 'MIT Academy of Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
  },
  [ROLES.SUPER_ADMIN]: {
    id: 'usr_sup_404',
    name: 'Muwahid Mir (Platform Ops)',
    email: 'muwahid.mir@placeprep-secure.io',
    role: ROLES.SUPER_ADMIN,
    department: 'Platform Architecture',
    tenantId: 'global_placeprep_hq',
    tenantName: 'PlacePrep Global Cloud',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Muwahid',
  },
}

const VALID_STUDENT_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9_-]{3,23}$/
const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const maskEmail = (email = '') => {
  const [local, domain] = email.split('@')
  if (!local || !domain) return 'registered campus email'
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${'*'.repeat(Math.max(2, local.length - visible.length))}@${domain}`
}

const findStudentRecord = (studentId) => {
  const normalized = studentId.trim().toUpperCase()
  const registered = tokenStorage.getDevRegisteredUsers()
  return (
    registered.find((u) => u.studentId?.toUpperCase() === normalized) ||
    MOCK_STUDENTS.find((u) => u.studentId.toUpperCase() === normalized) ||
    null
  )
}

const resolveTenantName = (tenantId) =>
  INSTITUTION_TENANTS.find((t) => t.id === tenantId)?.name || 'MIT Academy of Engineering'

export const authApi = {
  /**
   * Student ID + OTP Flow: Step 1 - Request OTP
   */
  requestStudentOtp: async (studentId) => {
    const cleanId = (studentId || '').trim().toUpperCase()
    if (!VALID_STUDENT_ID_REGEX.test(cleanId)) {
      throw new Error(
        'Invalid Registration ID format. Use alphanumeric IDs like STU-2024-8891 (min 4 characters, no spaces).',
      )
    }

    try {
      return await apiClient('/auth/student/request-otp', {
        method: 'POST',
        body: JSON.stringify({ studentId: cleanId }),
      })
    } catch (error) {
      if (!shouldUseMockFallback(error)) {
        throw error
      }

      await new Promise((r) => setTimeout(r, 320))
      const matched = findStudentRecord(cleanId)
      const masked = maskEmail(matched?.email || `${cleanId.toLowerCase()}@mitaoe.ac.in`)

      return {
        success: true,
        studentId: cleanId,
        message: `One-time passkey dispatched to ${masked}`,
        maskedContact: masked,
        expiresInSeconds: 300,
        mockOtp: DEV_TEST_OTP,
      }
    }
  },

  /**
   * Student ID + OTP Flow: Step 2 - Verify OTP & acquire JWT
   */
  verifyStudentOtp: async (studentId, otp) => {
    const cleanId = (studentId || '').trim().toUpperCase()
    const cleanOtp = (otp || '').replace(/\s+/g, '').trim()

    if (!VALID_STUDENT_ID_REGEX.test(cleanId)) {
      throw new Error('Invalid Student Registration ID.')
    }
    if (!/^\d{6}$/.test(cleanOtp)) {
      throw new Error('Please enter the complete 6-digit passkey.')
    }

    try {
      return await apiClient('/auth/student/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ studentId: cleanId, otp: cleanOtp }),
      })
    } catch (error) {
      if (!shouldUseMockFallback(error)) {
        throw error
      }

      await new Promise((r) => setTimeout(r, 350))
      if (cleanOtp !== DEV_TEST_OTP) {
        throw new Error(
          `Invalid verification passkey. In development mode, enter ${DEV_TEST_OTP} or use Dev Autofill.`,
          { cause: error },
        )
      }

      const matched = findStudentRecord(cleanId)
      const user = matched || {
        ...MOCK_USERS[ROLES.STUDENT],
        id: `usr_${cleanId.toLowerCase()}`,
        studentId: cleanId,
        name: `Candidate ${cleanId}`,
        email: `${cleanId.toLowerCase()}@mitaoe.ac.in`,
      }

      return {
        success: true,
        token: `mock_jwt_student_${Date.now()}`,
        user,
      }
    }
  },

  /**
   * Student Self-Registration / Account Activation (Passwordless)
   */
  registerStudent: async ({ studentId, name, email, department, tenantId, graduationYear = '2026' }) => {
    const cleanId = (studentId || '').trim().toUpperCase()
    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()

    if (!VALID_STUDENT_ID_REGEX.test(cleanId)) {
      throw new Error('Student Registration ID must be 4-24 characters (letters, numbers, hyphens).')
    }
    if (cleanName.length < 2) {
      throw new Error('Please enter your full legal name.')
    }
    if (!VALID_EMAIL_REGEX.test(cleanEmail)) {
      throw new Error('Please enter a valid institutional email address.')
    }

    try {
      return await apiClient('/auth/student/register', {
        method: 'POST',
        body: JSON.stringify({
          studentId: cleanId,
          name: cleanName,
          email: cleanEmail,
          department,
          tenantId,
          graduationYear,
        }),
      })
    } catch (error) {
      if (!shouldUseMockFallback(error)) {
        throw error
      }

      await new Promise((r) => setTimeout(r, 380))
      const newUser = {
        id: `usr_stu_${Date.now()}`,
        studentId: cleanId,
        name: cleanName,
        email: cleanEmail,
        role: ROLES.STUDENT,
        department: department || 'Computer Science & Engineering',
        graduationYear,
        tenantId: tenantId || 'tenant_mit_pune',
        tenantName: resolveTenantName(tenantId),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      }

      tokenStorage.saveDevRegisteredUser(newUser)

      return {
        success: true,
        studentId: cleanId,
        maskedContact: maskEmail(cleanEmail),
        expiresInSeconds: 300,
        mockOtp: DEV_TEST_OTP,
        message: `Account activated for ${cleanName}. Enter passkey sent to ${maskEmail(cleanEmail)}.`,
      }
    }
  },

  /**
   * Institutional Faculty / Admin Registration (Entra ID directory onboarding)
   */
  registerInstitutional: async ({ name, email, role, department, tenantId }) => {
    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()
    const targetRole = [ROLES.TEACHER, ROLES.INSTITUTION_ADMIN].includes(role)
      ? role
      : ROLES.TEACHER

    if (cleanName.length < 2) {
      throw new Error('Please enter your full name.')
    }
    if (!VALID_EMAIL_REGEX.test(cleanEmail)) {
      throw new Error('Please enter a valid institutional email address.')
    }

    try {
      return await apiClient('/auth/institutional/register', {
        method: 'POST',
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          role: targetRole,
          department,
          tenantId,
        }),
      })
    } catch (error) {
      if (!shouldUseMockFallback(error)) {
        throw error
      }

      await new Promise((r) => setTimeout(r, 420))
      const provisionedUser = {
        id: `usr_inst_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: targetRole,
        department: department || 'Computer Science & Engineering',
        tenantId: tenantId || 'tenant_mit_pune',
        tenantName: resolveTenantName(tenantId),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      }

      tokenStorage.saveDevRegisteredUser(provisionedUser)

      return {
        success: true,
        token: `mock_jwt_entra_${targetRole.toLowerCase()}_${Date.now()}`,
        user: provisionedUser,
      }
    }
  },

  /**
   * Microsoft Entra ID Token verification with backend
   */
  verifyEntraToken: async (entraAccount, idToken, preferredRole = null) => {
    try {
      return await apiClient('/auth/entra/callback', {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          email: entraAccount?.username,
          preferredRole,
        }),
      })
    } catch (error) {
      if (!shouldUseMockFallback(error)) {
        throw error
      }

      await new Promise((r) => setTimeout(r, 380))
      const username = (entraAccount?.username || '').toLowerCase()
      const registered = tokenStorage
        .getDevRegisteredUsers()
        .find((u) => !u.studentId && u.email?.toLowerCase() === username)

      if (registered) {
        return {
          success: true,
          token: `mock_jwt_entra_${registered.role.toLowerCase()}_${Date.now()}`,
          user: registered,
        }
      }

      const inferredRole =
        preferredRole ||
        (username.includes('ops') || username.includes('super')
          ? ROLES.SUPER_ADMIN
          : username.includes('admin') || username.includes('hod')
          ? ROLES.INSTITUTION_ADMIN
          : ROLES.TEACHER)

      const seed = MOCK_USERS[inferredRole] || MOCK_USERS[ROLES.TEACHER]
      return {
        success: true,
        token: `mock_jwt_entra_${inferredRole.toLowerCase()}_${Date.now()}`,
        user: {
          ...seed,
          name: entraAccount?.name || seed.name,
          email: entraAccount?.username || seed.email,
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

import { useState, useCallback } from 'react';
import { USER_ROLES } from '../types/authTypes';

export function useAuthMock() {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState('LOGIN'); // 'LOGIN' | 'OTP_VERIFICATION' | 'REGISTER' | 'AUTHENTICATED'
  const [pendingStudent, setPendingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const requestOtp = useCallback(async ({ studentId, tenantId, tenantName }) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      // Simulate API call to POST /api/auth/student-otp
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPendingStudent({ studentId, tenantId, tenantName });
      setAuthStep('OTP_VERIFICATION');
      setFeedback({
        type: 'success',
        message: `Passcode sent to registered email for student ${studentId}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(
    async (otp) => {
      setIsLoading(true);
      setFeedback(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Accept demo code "123456" or any 6-digit code for testing
        const authenticatedUser = {
          id: pendingStudent?.studentId || 'STU-1001',
          name: 'Student Candidate',
          role: USER_ROLES.STUDENT,
          email: `${(pendingStudent?.studentId || 'student').toLowerCase()}@college.edu`,
          tenantId: pendingStudent?.tenantId || 't-mit',
          tenantName: pendingStudent?.tenantName || 'MIT Institute of Technology',
          token: `fake-jwt-token-${otp}-${pendingStudent?.studentId}`,
          authMethod: 'STUDENT_OTP',
        };

        setUser(authenticatedUser);
        setAuthStep('AUTHENTICATED');
        setFeedback({
          type: 'success',
          message: `Welcome, ${authenticatedUser.name}! Identity verified via Student ID OTP.`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pendingStudent]
  );

  const loginWithEntraId = useCallback(async ({ domain, role = USER_ROLES.TEACHER }) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      // Simulate MSAL PKCE OAuth2 Popup & Token Handshake
      await new Promise((resolve) => setTimeout(resolve, 800));

      const roleDisplayNames = {
        [USER_ROLES.TEACHER]: 'Dr. Rajesh Sen (Faculty)',
        [USER_ROLES.INSTITUTION_ADMIN]: 'Dean Vance (Institution Admin)',
        [USER_ROLES.SUPER_ADMIN]: 'Platform Super Administrator',
      };

      const authenticatedUser = {
        id: `msal-${role.toLowerCase()}-01`,
        name: roleDisplayNames[role] || 'Institutional User',
        role: role,
        email: `faculty@${domain || 'mit.edu'}`,
        tenantId: 'tenant-enterprise-azure',
        tenantName: domain || 'Institutional University',
        token: `entra-pkce-jwt-token-role-${role}`,
        authMethod: 'ENTRA_ID',
      };

      setUser(authenticatedUser);
      setAuthStep('AUTHENTICATED');
      setFeedback({
        type: 'success',
        message: `Authenticated via Microsoft Entra ID (PKCE Verified) as ${role}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerStudent = useCallback(async (formData) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPendingStudent({
        studentId: formData.studentId,
        tenantId: formData.tenantId,
        tenantName: formData.fullName,
      });
      setAuthStep('OTP_VERIFICATION');
      setFeedback({
        type: 'success',
        message: `Profile created! Verification passcode dispatched to ${formData.email}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchRole = useCallback((newRole) => {
    if (!user) {
      setUser({
        id: 'sim-user',
        name: `Simulated ${newRole}`,
        role: newRole,
        email: `user@placeprep.com`,
        tenantId: 't-demo',
        tenantName: 'Demo College',
        token: `sim-token-${newRole}`,
      });
      setAuthStep('AUTHENTICATED');
    } else {
      setUser((prev) => ({
        ...prev,
        role: newRole,
        name: `Simulated ${newRole}`,
      }));
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setPendingStudent(null);
    setAuthStep('LOGIN');
    setFeedback(null);
  }, []);

  return {
    user,
    authStep,
    setAuthStep,
    pendingStudent,
    isLoading,
    feedback,
    setFeedback,
    requestOtp,
    verifyOtp,
    loginWithEntraId,
    registerStudent,
    switchRole,
    logout,
  };
}

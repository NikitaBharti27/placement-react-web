/**
 * PlacePrep Secure - Authentication & Authorization Types
 */

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  INSTITUTION_ADMIN: 'INSTITUTION_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const AUTH_METHODS = {
  STUDENT_OTP: 'STUDENT_OTP',
  ENTRA_ID: 'ENTRA_ID',
};

export const MOCK_TENANTS = [
  { id: 't-mit', name: 'MIT Institute of Technology', domain: 'mit.edu' },
  { id: 't-stanford', name: 'Stanford Engineering Academy', domain: 'stanford.edu' },
  { id: 't-iitb', name: 'IIT Bombay - Placement Cell', domain: 'iitb.ac.in' },
  { id: 't-bits', name: 'BITS Pilani - Corporate Relations', domain: 'bits-pilani.ac.in' },
  { id: 't-demo', name: 'PlacePrep Global Sandbox (Demo College)', domain: 'demo.placeprep.edu' },
];

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Electrical Engineering',
];

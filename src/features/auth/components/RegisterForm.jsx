import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { MOCK_TENANTS, DEPARTMENTS } from '../types/authTypes';
import { User, Mail, IdCard, CheckCircle2 } from 'lucide-react';

export function RegisterForm({ onRegister, onSwitchToLogin, isLoading = false }) {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    tenantId: 't-mit',
    department: DEPARTMENTS[0],
    email: '',
    gradYear: '2025',
  });
  const [error, setError] = useState('');

  const tenantOptions = MOCK_TENANTS.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const departmentOptions = DEPARTMENTS.map((d) => ({
    value: d,
    label: d,
  }));

  const gradYearOptions = ['2025', '2026', '2027', '2028'];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!formData.studentId.trim()) {
      setError('Please provide your university roll number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid institutional email.');
      return;
    }

    onRegister(formData);
  };

  const handleDemoFill = () => {
    setFormData({
      fullName: 'Aarav Sharma',
      studentId: '2024CS108',
      tenantId: 't-mit',
      department: 'Computer Science & Engineering',
      email: 'aarav.sharma@mit.edu',
      gradYear: '2026',
    });
    setError('');
  };

  return (
    <div className="w-full space-y-4 text-left">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Student Onboarding
          </h2>
          <p className="text-xs text-slate-400">
            Create your placement assessment profile for verified testing.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDemoFill}
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 text-[11px] font-medium cursor-pointer"
        >
          Demo Fill
        </button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="e.g. Aarav Sharma"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Roll Number / Student ID"
            placeholder="e.g. 2024CS108"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            leftIcon={<IdCard className="w-4 h-4" />}
            required
          />

          <Select
            label="Graduation Year"
            options={gradYearOptions}
            value={formData.gradYear}
            onChange={(e) => handleChange('gradYear', e.target.value)}
            required
          />
        </div>

        <Select
          label="College / Institution"
          options={tenantOptions}
          value={formData.tenantId}
          onChange={(e) => handleChange('tenantId', e.target.value)}
          required
        />

        <Select
          label="Department / Specialization"
          options={departmentOptions}
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          required
        />

        <Input
          label="Institutional Email Address"
          type="email"
          placeholder="e.g. student@college.edu"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="Used strictly for passwordless 2-factor OTP verification"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Create Profile & Request Code
        </Button>
      </form>

      <div className="pt-3 text-center text-xs text-slate-400 border-t border-slate-800/80">
        Already registered?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
}

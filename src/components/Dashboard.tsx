import React from 'react';
import { useApp } from '../context/AppContext';
import { AppLayout } from './layout/AppLayout';
import { AdminViews } from './roles/admin/AdminViews';
import { ClassTeacherViews } from './roles/classteacher/ClassTeacherViews';
import { TeacherViews } from './roles/teacher/TeacherViews';
import { StudentViews } from './roles/student/StudentViews';

interface DashboardProps {
  onLogout?: () => void;
  onExitToLanding?: () => void;
}

export function Dashboard({ onLogout, onExitToLanding }: DashboardProps) {
  const { currentRole } = useApp();

  return (
    <AppLayout onLogout={onLogout} onExitToLanding={onExitToLanding}>
      {currentRole === 'admin' && <AdminViews onLogout={onLogout} />}
      {currentRole === 'class_teacher' && <ClassTeacherViews onLogout={onLogout} />}
      {currentRole === 'teacher' && <TeacherViews onLogout={onLogout} />}
      {currentRole === 'student' && <StudentViews onLogout={onLogout} />}
    </AppLayout>
  );
}

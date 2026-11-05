import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  GraduationCap,
  FolderTree,
  Shield,
  Sliders,
  History,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Check,
  X,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Eye,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Info,
  BookOpen,
  ChevronRight,
  Award,
  LogOut
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserAccount, UserRole, ClassTeacher, AuditLogItem } from '../../../types/academic';
import { AdminTeacherManagement } from './AdminTeacherManagement';
import { AdminStudentManagement } from './AdminStudentManagement';

export const AdminViews: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    userAccounts,
    classTeachers,
    subjectTeachers,
    students,
    classes,
    auditLogs,
    academicConfig,
    updateAcademicConfig,
    addUserAccount,
    updateUserAccount,
    toggleUserStatus,
    changeUserRole,
    createClassTeacherAccount,
    promoteTeacherToClassTeacher,
    assignClassTeacherToClass,
    removeClassTeacherAssignment,
    toggleClassTeacherStatus,
    showToast,
    searchTerm,
    setSearchTerm
  } = useApp();

  // --- Local Search & Filters ---
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [classTeacherFilter, setClassTeacherFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');

  useEffect(() => {
    if (currentPage === 'role-access' || currentPage === 'system-overview') {
      setCurrentPage('dashboard');
    }
  }, [currentPage, setCurrentPage]);

  // --- Modals State ---
  // User Management Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [statusConfirmUser, setStatusConfirmUser] = useState<UserAccount | null>(null);
  const [changingRoleUser, setChangingRoleUser] = useState<UserAccount | null>(null);

  // Class Teacher Modals
  const [isCreateCTModalOpen, setIsCreateCTModalOpen] = useState(false);
  const [isPromoteTeacherModalOpen, setIsPromoteTeacherModalOpen] = useState(false);
  const [assigningCT, setAssigningCT] = useState<ClassTeacher | null>(null);
  const [viewingCT, setViewingCT] = useState<ClassTeacher | null>(null);
  const [ctStatusConfirm, setCtStatusConfirm] = useState<ClassTeacher | null>(null);

  // Classes Overview Modal
  const [inspectingClass, setInspectingClass] = useState<any | null>(null);

  // Forms State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    identifier: '',
    role: 'student' as UserRole,
    department: 'Computer Science & Engineering',
    status: 'active' as 'active' | 'inactive',
    phone: '+91 98765 00000',
    assignedClass: ''
  });

  const [newCTForm, setNewCTForm] = useState({
    name: '',
    email: '',
    identifier: '',
    phone: '+91 98450 00000',
    department: 'Computer Science & Engineering',
    status: 'active' as 'active' | 'inactive',
    assignedClassId: ''
  });

  const [promoteForm, setPromoteForm] = useState({
    teacherId: subjectTeachers[0]?.id || '',
    assignedClassId: ''
  });

  const [selectedClassIdToAssign, setSelectedClassIdToAssign] = useState<string>('');
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>('student');

  // Academic Config Form State
  const [configForm, setConfigForm] = useState(academicConfig);

  // Derived counts
  const totalUsers = userAccounts.length;
  const totalClassTeachers = classTeachers.length;
  const totalTeachers = subjectTeachers.length;
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const inactiveUsersCount = userAccounts.filter((u) => u.status === 'inactive').length;

  // Filtered Users
  const filteredUsers = userAccounts.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filtered Class Teachers
  const filteredClassTeachers = classTeachers.filter((ct) => {
    const matchesSearch =
      ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ct.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ct.assignedClass && ct.assignedClass.toLowerCase().includes(searchTerm.toLowerCase()));
    const isAssigned = ct.assignedClassId && ct.assignedClassId.length > 0 && ct.assignedClass !== 'Unassigned';
    const matchesFilter =
      classTeacherFilter === 'all' ||
      (classTeacherFilter === 'assigned' && isAssigned) ||
      (classTeacherFilter === 'unassigned' && !isAssigned);
    return matchesSearch && matchesFilter;
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesQuery =
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesStatus = auditStatusFilter === 'all' || log.status === auditStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // Helper for role styling
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">Admin</span>;
      case 'class_teacher':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Class Teacher</span>;
      case 'teacher':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Teacher</span>;
      case 'student':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Student</span>;
    }
  };

  // =========================================================================
  // 1. DASHBOARD VIEW (Clean, High-Density Institutional ERP)
  // =========================================================================
  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Visual Admin Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-900">Admin Console</span>
            <span aria-hidden="true">·</span>
            <span>RVCE Autonomous</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">System Administration</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{totalUsers} Active Accounts</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700">{auditLogs.length} audit events</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCreateCTModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <UserPlus size={14} /> + Class Teacher
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-2xs"
          >
            <Plus size={14} /> + User
          </button>
        </div>
      </div>

      {/* Compact Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        <div
          onClick={() => setCurrentPage('user-management')}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-1 rounded bg-slate-100 text-slate-700">
              <Users size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{totalUsers}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">4 Roles Enrolled</div>
        </div>

        <div
          onClick={() => setCurrentPage('teacher-management')}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Class Teachers</span>
            <div className="p-1 rounded bg-blue-50 text-blue-600">
              <UserCheck size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{totalClassTeachers}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">
            {classTeachers.filter((c) => c.assignedClassId).length} Assigned
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('teacher-management')}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Subject Teachers</span>
            <div className="p-1 rounded bg-emerald-50 text-emerald-600">
              <BookOpen size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{totalTeachers}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">6 Core Subjects</div>
        </div>

        <div
          onClick={() => setCurrentPage('student-management')}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Students</span>
            <div className="p-1 rounded bg-amber-50 text-amber-600">
              <GraduationCap size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{totalStudents}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">5th Semester</div>
        </div>

        <div
          onClick={() => setCurrentPage('classes-overview')}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Classrooms</span>
            <div className="p-1 rounded bg-purple-50 text-purple-600">
              <FolderTree size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{totalClasses}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">All Monitored</div>
        </div>
      </div>

      {/* Account Status Alert Badge (Compact Strip) */}
      {inactiveUsersCount > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle size={15} className="text-amber-600 shrink-0" />
            <span className="font-semibold">
              {inactiveUsersCount} Inactive Account{inactiveUsersCount > 1 ? 's' : ''} require administrator review
            </span>
          </div>
          <button
            onClick={() => {
              setUserStatusFilter('inactive');
              setCurrentPage('user-management');
            }}
            className="text-xs font-bold text-amber-900 hover:underline shrink-0 flex items-center gap-1"
          >
            Review <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Two-Column Grid: Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Administrative Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History size={15} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Audit Stream</h3>
            </div>
            <button
              onClick={() => setCurrentPage('audit-logs')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Full Log ({auditLogs.length}) <ChevronRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`size-6 rounded-md flex items-center justify-center shrink-0 ${
                      log.status === 'success'
                        ? 'bg-emerald-50 text-emerald-600'
                        : log.status === 'warning'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {log.status === 'success' ? (
                      <CheckCircle2 size={13} />
                    ) : log.status === 'warning' ? (
                      <AlertTriangle size={13} />
                    ) : (
                      <Info size={13} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 truncate">{log.action}</span>
                      <span className="text-[10px] text-slate-400">·</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">{log.targetResource}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{log.details}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[10px] text-slate-400 block">{log.timestamp}</span>
                  <span className="text-[10px] font-medium text-slate-600 capitalize">{log.performerRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts & Role Distribution */}
        <div className="space-y-4">
          {/* Quick Shortcuts Grid */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-slate-600" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setCurrentPage('user-management')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-2 font-semibold text-slate-800"
              >
                <Users size={14} className="text-purple-600 shrink-0" />
                <span className="truncate">Users</span>
              </button>
              <button
                onClick={() => setIsCreateCTModalOpen(true)}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-2 font-semibold text-slate-800"
              >
                <UserPlus size={14} className="text-blue-600 shrink-0" />
                <span className="truncate">Coordinators</span>
              </button>
              <button
                onClick={() => setCurrentPage('teacher-management')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-2 font-semibold text-slate-800"
              >
                <UserCheck size={14} className="text-emerald-600 shrink-0" />
                <span className="truncate">Faculty</span>
              </button>
              <button
                onClick={() => setCurrentPage('student-management')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-2 font-semibold text-slate-800"
              >
                <GraduationCap size={14} className="text-amber-600 shrink-0" />
                <span className="truncate">Students</span>
              </button>
              <button
                onClick={() => setCurrentPage('classes-overview')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-2 font-semibold text-slate-800"
              >
                <FolderTree size={14} className="text-indigo-600 shrink-0" />
                <span className="truncate">Classrooms</span>
              </button>
              <button
                onClick={() => setCurrentPage('audit-logs')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center gap-2 font-semibold text-slate-800"
              >
                <History size={14} className="text-slate-600 shrink-0" />
                <span className="truncate">Audit Trail</span>
              </button>
            </div>
          </div>

          {/* Role Distribution & System Health (Compact Visual Representation) */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Role Distribution
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Operational
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
              <div style={{ width: `${(1 / totalUsers) * 100}%` }} className="bg-slate-400 h-full" title="Admin" />
              <div style={{ width: `${(totalClassTeachers / totalUsers) * 100}%` }} className="bg-blue-500 h-full" title="Class Teachers" />
              <div style={{ width: `${(totalTeachers / totalUsers) * 100}%` }} className="bg-emerald-500 h-full" title="Subject Teachers" />
              <div style={{ width: `${(totalStudents / totalUsers) * 100}%` }} className="bg-amber-500 h-full" title="Students" />
            </div>

            {/* Legend Chips */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="size-2 rounded-full bg-blue-500" />
                <span>Class Coordinators: <strong className="font-mono text-white">{totalClassTeachers}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Subject Teachers: <strong className="font-mono text-white">{totalTeachers}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="size-2 rounded-full bg-amber-500" />
                <span>Enrolled Students: <strong className="font-mono text-white">{totalStudents}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="size-2 rounded-full bg-slate-400" />
                <span>Admin Authority: <strong className="font-mono text-white">1</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 2. USER MANAGEMENT VIEW (Section 5)
  // =========================================================================
  const renderUserManagement = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">User Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage accounts, configure user roles, activate or suspend access, and inspect profile information.
            </p>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <UserPlus size={15} /> Create User Account
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or USN/ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Role Filter */}
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Roles ({userAccounts.length})</option>
              <option value="admin">Administrator</option>
              <option value="class_teacher">Class Teacher</option>
              <option value="teacher">Subject Teacher</option>
              <option value="student">Student</option>
            </select>

            {/* Status Filter */}
            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* User Table (Desktop) */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10.5px] font-extrabold uppercase text-gray-400 tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Identifier</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Last Activity</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                      No user accounts match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-[11px] text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-gray-700">
                        {user.identifier}
                      </td>
                      <td className="px-4 py-3.5">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-3.5 text-gray-600 truncate max-w-[140px]">{user.department}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-[11px]">{user.lastLogin}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingUser(user)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                            title="View Profile Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setChangingRoleUser(user);
                              setNewSelectedRole(user.role);
                            }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-bold text-[11px]"
                            title="Change Role"
                          >
                            Role
                          </button>
                          <button
                            onClick={() => setStatusConfirmUser(user)}
                            className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-colors ${
                              user.status === 'active'
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Card Layout (Mobile) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
                    <p className="text-[11px] text-gray-400">{user.email}</p>
                    <span className="font-mono text-[10px] text-gray-500 font-semibold">{user.identifier}</span>
                  </div>
                </div>
                <div>{getRoleBadge(user.role)}</div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    user.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="text-gray-400 text-[10px]">{user.department}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setViewingUser(user)}
                  className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 text-center"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setChangingRoleUser(user);
                    setNewSelectedRole(user.role);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs text-center"
                >
                  Change Role
                </button>
                <button
                  onClick={() => setStatusConfirmUser(user)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs text-center ${
                    user.status === 'active' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // =========================================================================
  // 3. CLASS TEACHER MANAGEMENT VIEW (Section 6)
  // =========================================================================
  const renderClassTeacherManagement = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Class Teacher Management
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Appoint Class Teachers, assign or reassign classrooms, and oversee class leadership across departments.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPromoteTeacherModalOpen(true)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Award size={15} className="text-blue-600" /> Promote Teacher
            </button>
            <button
              onClick={() => setIsCreateCTModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus size={15} /> Create Class Teacher
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Class Teachers</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Shield size={14} />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 block">{classTeachers.length}</span>
            <span className="text-[11px] text-gray-500">Authorized faculty</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Assigned</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <UserCheck size={14} />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-blue-600 block">
              {classTeachers.filter((ct) => ct.assignedClassId && ct.assignedClass !== 'Unassigned').length}
            </span>
            <span className="text-[11px] text-gray-500">Active class mentors</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Unassigned</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertCircle size={14} />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-amber-600 block">
              {classTeachers.filter((ct) => !ct.assignedClassId || ct.assignedClass === 'Unassigned').length}
            </span>
            <span className="text-[11px] text-amber-700">Available to assign</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Monitored Students</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <GraduationCap size={14} />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 block">
              {classTeachers.reduce((acc, ct) => acc + (ct.totalStudents || 0), 0)}
            </span>
            <span className="text-[11px] text-gray-500">Under appointed mentors</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Class Teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setClassTeacherFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                classTeacherFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({classTeachers.length})
            </button>
            <button
              onClick={() => setClassTeacherFilter('assigned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                classTeacherFilter === 'assigned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setClassTeacherFilter('unassigned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                classTeacherFilter === 'unassigned'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unassigned
            </button>
          </div>
        </div>

        {/* Class Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClassTeachers.map((ct) => {
            const isAssigned = ct.assignedClassId && ct.assignedClass !== 'Unassigned';
            return (
              <div
                key={ct.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ct.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={ct.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-black text-gray-900 text-sm leading-tight">{ct.name}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">{ct.email}</p>
                        <span className="text-[10px] text-gray-500 font-semibold">{ct.phone}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        ct.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {ct.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Classroom Assignment Status Box */}
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      isAssigned
                        ? 'bg-blue-50/70 border-blue-200/80 text-blue-950'
                        : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                    }`}
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-0.5">
                      Classroom Assignment
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="truncate">{ct.assignedClass}</span>
                      {isAssigned && (
                        <span className="text-[10px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full shadow-2xs border border-blue-200">
                          {ct.totalStudents} Students
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAssigningCT(ct);
                        setSelectedClassIdToAssign(ct.assignedClassId || '');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-[11px] transition-colors"
                    >
                      {isAssigned ? 'Reassign' : 'Assign Class'}
                    </button>
                    {isAssigned && (
                      <button
                        onClick={() => removeClassTeacherAssignment(ct.id)}
                        className="px-2 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-[11px]"
                        title="Remove classroom assignment"
                      >
                        Unassign
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingCT(ct)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => setCtStatusConfirm(ct)}
                      className={`text-[10.5px] font-bold px-2 py-1 rounded-lg ${
                        ct.status === 'active'
                          ? 'text-amber-700 hover:bg-amber-50'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {ct.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  // =========================================================================
  // 4. CLASSES OVERVIEW VIEW (Section 7 - Read-Only for Administrator)
  // =========================================================================
  const renderClassesOverview = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Classes Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Read-only institutional classroom directory. Inspect assigned mentors, enrolled student counts, and subject allocations.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('class-teacher-management')}
            className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserCheck size={14} /> Manage Class Teachers
          </button>
        </div>

        {/* Delegation Note */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-blue-900 font-medium">
          <div className="flex items-center gap-2">
            <Shield size={15} className="text-blue-600 shrink-0" />
            <span>Classroom attendance, IA marks, and assignments are managed directly by appointed faculty.</span>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full shrink-0">
            Read-Only
          </span>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const hasCT = cls.classTeacherId && cls.classTeacherName && cls.classTeacherName !== 'Unassigned';
            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                        Semester {cls.semester} • {cls.department}
                      </span>
                      <h4 className="text-base font-black text-gray-900 mt-0.5">{cls.name}</h4>
                      <p className="text-[11px] text-gray-400">
                        {cls.collegeName || 'RV College of Engineering'}
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                      In Session
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    {/* Assigned Class Teacher */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck size={15} className={hasCT ? 'text-blue-600' : 'text-amber-500'} />
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Assigned Class Teacher</div>
                          <div className="font-bold text-gray-900 text-xs">
                            {cls.classTeacherName || 'Unassigned'}
                          </div>
                        </div>
                      </div>
                      {!hasCT && (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          Action Needed
                        </span>
                      )}
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-base font-black text-gray-900">{cls.totalStudents}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Enrolled Students</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-base font-black text-gray-900">{cls.roomNumber || 'CS-201'}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Room / Block</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-semibold">AY {cls.academicYear}</span>
                  <button
                    onClick={() => setInspectingClass(cls)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Class Info</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  // =========================================================================
  // 7. AUDIT LOGS VIEW (Section 9)
  // =========================================================================
  const renderAuditLogs = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Audit Logs</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review chronological record of administrative actions, role assignments, and account modifications.
            </p>
          </div>
          <button
            onClick={() => showToast('Audit logs exported to demonstration report (PDF/CSV)', 'info')}
            className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw size={14} /> Export Audit Trail
          </button>
        </div>

        {/* Demo Audit Notice (Section 9 requirement) */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
          <Info size={18} className="text-gray-600 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700">
            <span className="font-bold text-gray-900 uppercase tracking-wide text-[10.5px] block">
              Demonstration Audit Record
            </span>
            <p className="mt-0.5 text-[11px] text-gray-600">
              Administrative events are tracked in local session memory for this academic demonstration. No passwords, tokens, or private credentials are exposed in audit records.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit events, users, or targets..."
              value={auditSearchQuery}
              onChange={(e) => setAuditSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={auditStatusFilter}
              onChange={(e) => setAuditStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses ({auditLogs.length})</option>
              <option value="success">Success Events</option>
              <option value="warning">Warning Events</option>
              <option value="info">Info / Updates</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {filteredAuditLogs.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-xs">
              No audit events match your search criteria.
            </div>
          ) : (
            <>
              {/* Mobile Audit Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 text-xs">{log.action}</span>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          By <span className="font-semibold text-gray-700">{log.performedBy}</span> ({log.performerRole})
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.status === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <span className="font-semibold text-gray-800 text-[11px] block mb-0.5">
                        Target: {log.targetResource}
                      </span>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{log.details}</p>
                    </div>

                    <div className="text-[10px] text-gray-400 font-mono pt-1 border-t border-gray-50">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-[10.5px] font-extrabold uppercase text-gray-400 tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5">Performed By</th>
                      <th className="px-4 py-3.5">Action</th>
                      <th className="px-4 py-3.5">Affected Account / Resource</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px] shrink-0">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-gray-900">{log.performedBy}</div>
                          <div className="text-[10px] text-gray-400">{log.performerRole}</div>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-gray-900">{log.action}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md text-[11px]">
                            {log.targetResource}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : log.status === 'warning'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 max-w-sm truncate text-[11.5px]">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    );

  // =========================================================================
  // 8. SETTINGS VIEW
  // =========================================================================
  const renderSettings = () => (
    <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Administrator Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage administrator profile details, platform alert thresholds, and demo environment settings.
          </p>
        </div>

        {/* Administrator Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Shield size={16} className="text-purple-600" />
            Administrator Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value="Rehan (Administrator)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Official Email</label>
              <input
                type="email"
                disabled
                value="admin@college.edu"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Administrative Identifier</label>
              <input
                type="text"
                disabled
                value="ADM-2025-01"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Assigned Department</label>
              <input
                type="text"
                disabled
                value="Central Academic Affairs"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Academic Threshold Settings */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Sliders size={16} className="text-blue-600" />
            Early Alert Policy Parameters
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-bold">
                <span className="text-gray-800">Minimum Mandatory Attendance Cutoff</span>
                <span className="text-rose-600 font-black">{configForm.minAttendancePercent}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={configForm.minAttendancePercent}
                onChange={(e) =>
                  setConfigForm({ ...configForm, minAttendancePercent: Number(e.target.value) })
                }
                className="w-full accent-black cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">VTU regulation mandates 75% minimum attendance to write end-semester examinations.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-bold">
                <span className="text-gray-800">Early Warning Attendance Bar</span>
                <span className="text-amber-600 font-black">{configForm.attendanceWarningPercent}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="90"
                value={configForm.attendanceWarningPercent}
                onChange={(e) =>
                  setConfigForm({ ...configForm, attendanceWarningPercent: Number(e.target.value) })
                }
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  updateAcademicConfig(configForm);
                  showToast('Academic configurations saved successfully', 'success');
                }}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-xs"
              >
                Save Threshold Policies
              </button>
            </div>
          </div>
        </div>

        {/* Demo Data Reset */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Demonstration Session Controls</h4>
            <p className="text-[11px] text-gray-500">Reset local frontend state or trigger session sync.</p>
          </div>
          <button
            onClick={() => showToast('Session demo state refreshed', 'info')}
            className="px-3 py-1.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-white shadow-2xs"
          >
            Refresh Session
          </button>
        </div>

        {/* Account Session & Sign Out */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <LogOut size={16} />
              </span>
              <h4 className="text-sm font-bold text-gray-900">Account Session & Logout</h4>
            </div>
            <p className="text-xs text-gray-500 max-w-xl">
              Sign out of the Academio Administrator Console on this workstation. You will need to re-authenticate with your administrator credentials to manage college users, role allocations, and audit logs.
            </p>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 transition-colors border border-rose-200 shrink-0"
          >
            <LogOut size={14} />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </div>
    );

  // =========================================================================
  // VIEW ROUTER & MODALS ROOT
  // =========================================================================
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'user-management':
        return renderUserManagement();
      case 'teacher-management':
        return <AdminTeacherManagement />;
      case 'student-management':
        return <AdminStudentManagement />;
      case 'class-teacher-management':
        return renderClassTeacherManagement();
      case 'classes-overview':
        return renderClassesOverview();
      case 'audit-logs':
        return renderAuditLogs();
      case 'settings':
      case 'profile':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div>
      {renderCurrentView()}

      {/* 1. Create User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Create User Account</h3>
                  <p className="text-[10px] text-gray-400">Add an authorized platform user</p>
                </div>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUserForm.name || !newUserForm.email || !newUserForm.identifier) {
                  showToast('Please fill all required fields', 'error');
                  return;
                }
                addUserAccount({
                  name: newUserForm.name,
                  email: newUserForm.email,
                  identifier: newUserForm.identifier,
                  role: newUserForm.role,
                  department: newUserForm.department,
                  status: newUserForm.status,
                  phone: newUserForm.phone,
                  assignedClass: newUserForm.assignedClass || undefined
                });
                setIsAddUserModalOpen(false);
                setNewUserForm({
                  name: '',
                  email: '',
                  identifier: '',
                  role: 'student',
                  department: 'Computer Science & Engineering',
                  status: 'active',
                  phone: '+91 98765 00000',
                  assignedClass: ''
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.k@college.edu"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">User Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="USN or Emp ID"
                    value={newUserForm.identifier}
                    onChange={(e) => setNewUserForm({ ...newUserForm, identifier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Platform Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Subject Teacher</option>
                    <option value="class_teacher">Class Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department</label>
                <select
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Science & Engineering">Information Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Management & Humanities">Management & Humanities</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Initial Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newUserForm.status === 'active'}
                      onChange={() => setNewUserForm({ ...newUserForm, status: 'active' })}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newUserForm.status === 'inactive'}
                      onChange={() => setNewUserForm({ ...newUserForm, status: 'inactive' })}
                    />
                    <span>Inactive (Suspended)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create Class Teacher Modal (Section 6) */}
      {isCreateCTModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <UserCheck size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Create Class Teacher Account</h3>
                  <p className="text-[10px] text-gray-400">Assign classroom mentor authority</p>
                </div>
              </div>
              <button onClick={() => setIsCreateCTModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCTForm.name || !newCTForm.email || !newCTForm.identifier) {
                  showToast('Please provide name, email, and employee identifier', 'error');
                  return;
                }
                const success = createClassTeacherAccount({
                  name: newCTForm.name,
                  email: newCTForm.email,
                  identifier: newCTForm.identifier,
                  phone: newCTForm.phone,
                  department: newCTForm.department,
                  status: newCTForm.status,
                  assignedClassId: newCTForm.assignedClassId || undefined
                });
                if (success) {
                  setIsCreateCTModalOpen(false);
                  setNewCTForm({
                    name: '',
                    email: '',
                    identifier: '',
                    phone: '+91 98450 00000',
                    department: 'Computer Science & Engineering',
                    status: 'active',
                    assignedClassId: ''
                  });
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajeshwari S."
                  value={newCTForm.name}
                  onChange={(e) => setNewCTForm({ ...newCTForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajeshwari.s@rvce.edu.in"
                  value={newCTForm.email}
                  onChange={(e) => setNewCTForm({ ...newCTForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Employee Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-CSE-045"
                    value={newCTForm.identifier}
                    onChange={(e) => setNewCTForm({ ...newCTForm, identifier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newCTForm.phone}
                    onChange={(e) => setNewCTForm({ ...newCTForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Classroom Assignment (Optional)</label>
                <select
                  value={newCTForm.assignedClassId}
                  onChange={(e) => setNewCTForm({ ...newCTForm, assignedClassId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="">Leave Unassigned (Assign Later)</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalStudents} Students)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  If left unassigned, the Class Teacher can manage or be linked to a classroom later.
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCTModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Create Class Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Promote Existing Teacher to Class Teacher Modal */}
      {isPromoteTeacherModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Award size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Promote Teacher to Class Teacher</h3>
                  <p className="text-[10px] text-gray-400">Elevate role with classroom leadership</p>
                </div>
              </div>
              <button onClick={() => setIsPromoteTeacherModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                promoteTeacherToClassTeacher(promoteForm.teacherId, promoteForm.assignedClassId || undefined);
                setIsPromoteTeacherModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Eligible Subject Teacher</label>
                <select
                  value={promoteForm.teacherId}
                  onChange={(e) => setPromoteForm({ ...promoteForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  {subjectTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Assign Classroom (Optional)</label>
                <select
                  value={promoteForm.assignedClassId}
                  onChange={(e) => setPromoteForm({ ...promoteForm, assignedClassId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="">Leave Unassigned for now</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoteTeacherModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Confirm Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Assign Classroom Modal */}
      {assigningCT && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-1">Assign Classroom</h3>
            <p className="text-xs text-gray-500 mb-4">
              Select an authorized classroom for <strong>{assigningCT.name}</strong>.
            </p>

            <div className="space-y-3 text-xs mb-5">
              <label className="font-bold text-gray-700 block">Classroom</label>
              <select
                value={selectedClassIdToAssign}
                onChange={(e) => setSelectedClassIdToAssign(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              >
                <option value="">-- Choose Classroom --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.totalStudents} students)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAssigningCT(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!selectedClassIdToAssign}
                onClick={() => {
                  assignClassTeacherToClass(assigningCT.id, selectedClassIdToAssign);
                  setAssigningCT(null);
                }}
                className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs disabled:opacity-40"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. View User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={viewingUser.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-black text-gray-900">{viewingUser.name}</h3>
                  <p className="text-xs text-gray-400">{viewingUser.email}</p>
                  <span className="font-mono text-[10px] text-gray-500 font-bold">{viewingUser.identifier}</span>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Role</span>
                <div className="mt-1">{getRoleBadge(viewingUser.role)}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                <div className="mt-1 font-bold capitalize text-gray-800">{viewingUser.status}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Department</span>
                <div className="mt-1 font-bold text-gray-800">{viewingUser.department}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Created On</span>
                <div className="mt-1 font-bold text-gray-800">{viewingUser.createdAt}</div>
              </div>
            </div>

            {viewingUser.assignedClass && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Associated Classroom</span>
                <span className="font-bold">{viewingUser.assignedClass}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. View Class Teacher Details Modal */}
      {viewingCT && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingCT.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={viewingCT.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-black text-gray-900">{viewingCT.name}</h3>
                  <p className="text-xs text-gray-400">{viewingCT.email}</p>
                  <span className="text-[11px] text-gray-500">{viewingCT.phone}</span>
                </div>
              </div>
              <button onClick={() => setViewingCT(null)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Institution:</span>
                <span className="font-semibold text-gray-800">{viewingCT.collegeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Department:</span>
                <span className="font-semibold text-gray-800">{viewingCT.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Assigned Class:</span>
                <span className="font-bold text-blue-700">{viewingCT.assignedClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Students Monitored:</span>
                <span className="font-bold text-gray-900">{viewingCT.totalStudents}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingCT(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Status Confirmation Dialog (Deactivate / Activate Account) */}
      {statusConfirmUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-black text-gray-900 mb-1">
              Confirm {statusConfirmUser.status === 'active' ? 'Deactivation' : 'Reactivation'}
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Are you sure you want to {statusConfirmUser.status === 'active' ? 'deactivate' : 'activate'} the account for <strong>{statusConfirmUser.name}</strong> ({statusConfirmUser.identifier})?
              {statusConfirmUser.status === 'active' && ' The user will be unable to log in until reactivated.'}
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setStatusConfirmUser(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleUserStatus(statusConfirmUser.id);
                  setStatusConfirmUser(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-white ${
                  statusConfirmUser.status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {statusConfirmUser.status === 'active' ? 'Deactivation' : 'Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Change Role Modal */}
      {changingRoleUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-1">Change User Role</h3>
            <p className="text-xs text-gray-500 mb-4">
              Update authorization role for <strong>{changingRoleUser.name}</strong>.
            </p>

            <div className="space-y-2 text-xs mb-5">
              {(['admin', 'class_teacher', 'teacher', 'student'] as UserRole[]).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    newSelectedRole === r
                      ? 'bg-blue-50/60 border-blue-400 font-bold text-blue-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="capitalize">{r.replace('_', ' ')}</span>
                  <input
                    type="radio"
                    name="newRole"
                    checked={newSelectedRole === r}
                    onChange={() => setNewSelectedRole(r)}
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setChangingRoleUser(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  changeUserRole(changingRoleUser.id, newSelectedRole);
                  setChangingRoleUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold"
              >
                Save Role Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Class Teacher Status Confirmation */}
      {ctStatusConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-1">
              {ctStatusConfirm.status === 'active' ? 'Deactivate' : 'Activate'} Class Teacher?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Toggle access status for <strong>{ctStatusConfirm.name}</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setCtStatusConfirm(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleClassTeacherStatus(ctStatusConfirm.id);
                  setCtStatusConfirm(null);
                }}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Inspect Classroom Modal */}
      {inspectingClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  Semester {inspectingClass.semester} • {inspectingClass.department}
                </span>
                <h3 className="text-base font-black text-gray-900 mt-0.5">{inspectingClass.name}</h3>
                <p className="text-xs text-gray-400">{inspectingClass.collegeName}</p>
              </div>
              <button onClick={() => setInspectingClass(null)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Appointed Class Teacher</div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">
                  {inspectingClass.classTeacherName || 'Unassigned'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-base font-black text-gray-900">{inspectingClass.totalStudents}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Enrolled Students</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-base font-black text-gray-900">{inspectingClass.roomNumber || 'CS-201'}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Room Allocation</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                Attendance records, IA evaluations, and assignment submissions for this section are maintained directly by the appointed Class Teacher.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingClass(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Logout Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-3">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">Confirm Administrator Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your session as <strong>Administrator (Prof. Rehan)</strong>? You will be safely signed out and redirected to the login screen.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    showToast('Logged out of Academio Administrator Console', 'info');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <LogOut size={14} />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

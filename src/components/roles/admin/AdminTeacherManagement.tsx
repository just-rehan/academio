import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Check,
  X,
  Phone,
  Mail,
  RefreshCw,
  Shield,
  Layers,
  ArrowRight,
  UserPlus,
  Trash2,
  FolderTree
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserAccount, SubjectTeacher, ClassTeacher, UserRole } from '../../../types/academic';

interface UnifiedTeacher {
  id: string; // userAccount id or teacher id
  userAccountId?: string;
  name: string;
  email: string;
  identifier: string;
  phone: string;
  department: string;
  role: 'teacher' | 'class_teacher';
  status: 'active' | 'inactive';
  assignedClass?: string;
  assignedClassId?: string;
  assignedSubjects?: { code: string; name: string; classId?: string; className?: string }[];
  lastLogin?: string;
  createdAt?: string;
}

export const AdminTeacherManagement: React.FC = () => {
  const {
    userAccounts,
    subjectTeachers,
    classTeachers,
    classes,
    departments,
    subjects,
    addUserAccount,
    updateUserAccount,
    toggleUserStatus,
    changeUserRole,
    addSubjectTeacher,
    addClassTeacher,
    assignClassTeacherToClass,
    removeClassTeacherAssignment,
    showToast,
    addAuditLog
  } = useApp();

  // Local state for tabs, search, and filters
  const [activeTab, setActiveTab] = useState<'all' | 'subject' | 'class'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<UnifiedTeacher | null>(null);
  const [roleChangeTeacher, setRoleChangeTeacher] = useState<UnifiedTeacher | null>(null);
  const [statusConfirmTeacher, setStatusConfirmTeacher] = useState<UnifiedTeacher | null>(null);

  // Add Teacher Form
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    identifier: '',
    phone: '+91 98450 00000',
    department: 'Computer Science & Engineering',
    role: 'teacher' as 'teacher' | 'class_teacher',
    status: 'active' as 'active' | 'inactive',
    assignedClassId: '',
    selectedSubjectCodes: ['21CS52']
  });

  // Edit Teacher Form
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    identifier: '',
    phone: '',
    department: '',
    status: 'active' as 'active' | 'inactive',
    assignedClassId: '',
    subjectCode: ''
  });

  // Role Change Form
  const [newRoleSelection, setNewRoleSelection] = useState<'teacher' | 'class_teacher'>('teacher');
  const [roleAssignedClassId, setRoleAssignedClassId] = useState('');

  // Combine userAccounts (teachers) with subjectTeachers & classTeachers details
  const allTeachers: UnifiedTeacher[] = useMemo(() => {
    const list: UnifiedTeacher[] = [];
    const processedEmails = new Set<string>();

    // 1. Process from userAccounts where role === 'teacher' or 'class_teacher'
    userAccounts
      .filter((u) => u.role === 'teacher' || u.role === 'class_teacher')
      .forEach((u) => {
        processedEmails.add(u.email.toLowerCase());
        const ct = classTeachers.find((c) => c.email.toLowerCase() === u.email.toLowerCase());
        const st = subjectTeachers.find((s) => s.email.toLowerCase() === u.email.toLowerCase());

        list.push({
          id: u.id,
          userAccountId: u.id,
          name: u.name,
          email: u.email,
          identifier: u.identifier,
          phone: u.phone || ct?.phone || st?.phone || '+91 98450 00000',
          department: u.department || ct?.department || st?.department || 'Computer Science & Engineering',
          role: u.role as 'teacher' | 'class_teacher',
          status: u.status,
          assignedClass: u.assignedClass || ct?.assignedClass,
          assignedClassId: u.assignedClassId || ct?.assignedClassId,
          assignedSubjects: st?.assignedSubjects || [],
          lastLogin: u.lastLogin,
          createdAt: u.createdAt
        });
      });

    // 2. Include any subjectTeachers or classTeachers not yet in userAccounts
    classTeachers.forEach((ct) => {
      if (!processedEmails.has(ct.email.toLowerCase())) {
        processedEmails.add(ct.email.toLowerCase());
        list.push({
          id: ct.id,
          name: ct.name,
          email: ct.email,
          identifier: `EMP-CT-${ct.id.slice(-3)}`,
          phone: ct.phone,
          department: ct.department,
          role: 'class_teacher',
          status: ct.status,
          assignedClass: ct.assignedClass,
          assignedClassId: ct.assignedClassId
        });
      }
    });

    subjectTeachers.forEach((st) => {
      if (!processedEmails.has(st.email.toLowerCase())) {
        processedEmails.add(st.email.toLowerCase());
        list.push({
          id: st.id,
          name: st.name,
          email: st.email,
          identifier: `EMP-T-${st.id.slice(-3)}`,
          phone: st.phone,
          department: st.department,
          role: 'teacher',
          status: st.status,
          assignedSubjects: st.assignedSubjects
        });
      }
    });

    return list;
  }, [userAccounts, classTeachers, subjectTeachers]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return allTeachers.filter((t) => {
      // Tab filter
      if (activeTab === 'subject' && t.role !== 'teacher') return false;
      if (activeTab === 'class' && t.role !== 'class_teacher') return false;

      // Department filter
      if (deptFilter !== 'all' && t.department !== deptFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesEmail = t.email.toLowerCase().includes(query);
        const matchesId = t.identifier.toLowerCase().includes(query);
        const matchesDept = t.department.toLowerCase().includes(query);
        const matchesClass = t.assignedClass?.toLowerCase().includes(query);
        const matchesSubject = t.assignedSubjects?.some((s) =>
          s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesEmail && !matchesId && !matchesDept && !matchesClass && !matchesSubject) {
          return false;
        }
      }

      return true;
    });
  }, [allTeachers, activeTab, deptFilter, statusFilter, searchQuery]);

  // Summary counts
  const totalCount = allTeachers.length;
  const subjectCount = allTeachers.filter((t) => t.role === 'teacher').length;
  const classTeacherCount = allTeachers.filter((t) => t.role === 'class_teacher').length;
  const activeCount = allTeachers.filter((t) => t.status === 'active').length;
  const inactiveCount = allTeachers.filter((t) => t.status === 'inactive').length;

  // Handlers
  const handleOpenAddModal = () => {
    setAddForm({
      name: '',
      email: '',
      identifier: `EMP-${Date.now().toString().slice(-4)}`,
      phone: '+91 98450 00000',
      department: 'Computer Science & Engineering',
      role: 'teacher',
      status: 'active',
      assignedClassId: classes[0]?.id || '',
      selectedSubjectCodes: ['21CS52']
    });
    setIsAddModalOpen(true);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.identifier) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const exists = allTeachers.some(
      (t) => t.email.toLowerCase() === addForm.email.toLowerCase() || t.identifier.toLowerCase() === addForm.identifier.toLowerCase()
    );
    if (exists) {
      showToast(`Teacher with email or employee ID already exists`, 'error');
      return;
    }

    const assignedCls = classes.find((c) => c.id === addForm.assignedClassId);

    if (addForm.role === 'class_teacher') {
      addClassTeacher({
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        collegeId: 'col-1',
        collegeName: 'RV College of Engineering',
        department: addForm.department,
        assignedClass: assignedCls ? assignedCls.name : 'Unassigned',
        assignedClassId: addForm.assignedClassId || '',
        totalStudents: assignedCls ? assignedCls.totalStudents : 0,
        status: addForm.status,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      });
      if (assignedCls) {
        assignClassTeacherToClass(`ct-${Date.now()}`, assignedCls.id);
      }
    } else {
      const selectedSubs = subjects.filter((s) => addForm.selectedSubjectCodes.includes(s.code));
      addSubjectTeacher({
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        collegeId: 'col-1',
        collegeName: 'RV College of Engineering',
        department: addForm.department,
        status: addForm.status,
        assignedSubjects: selectedSubs.map((s) => ({
          code: s.code,
          name: s.name,
          classId: 'cls-1',
          className: '5th Sem CSE-A'
        })),
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
      });
    }

    setIsAddModalOpen(false);
    showToast(`Teacher ${addForm.name} added successfully!`, 'success');
  };

  const handleOpenEdit = (teacher: UnifiedTeacher) => {
    setEditingTeacher(teacher);
    setEditForm({
      name: teacher.name,
      email: teacher.email,
      identifier: teacher.identifier,
      phone: teacher.phone,
      department: teacher.department,
      status: teacher.status,
      assignedClassId: teacher.assignedClassId || '',
      subjectCode: teacher.assignedSubjects?.[0]?.code || '21CS52'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    // Update corresponding userAccount if found
    if (editingTeacher.userAccountId) {
      const matchedUser = userAccounts.find((u) => u.id === editingTeacher.userAccountId);
      if (matchedUser) {
        const assignedCls = classes.find((c) => c.id === editForm.assignedClassId);
        updateUserAccount({
          ...matchedUser,
          name: editForm.name,
          email: editForm.email,
          identifier: editForm.identifier,
          phone: editForm.phone,
          department: editForm.department,
          status: editForm.status,
          assignedClass: assignedCls?.name,
          assignedClassId: editForm.assignedClassId
        });
      }
    }

    // If Class Teacher, update classroom assignment if changed
    if (editingTeacher.role === 'class_teacher' && editForm.assignedClassId) {
      assignClassTeacherToClass(editingTeacher.id, editForm.assignedClassId);
    }

    addAuditLog('Teacher Profile Updated', `${editForm.name} (${editForm.identifier})`, `Admin updated teacher details and assignment.`, 'info');
    showToast(`Updated profile for ${editForm.name}`, 'success');
    setEditingTeacher(null);
  };

  const handleOpenRoleChange = (teacher: UnifiedTeacher) => {
    setRoleChangeTeacher(teacher);
    setNewRoleSelection(teacher.role === 'teacher' ? 'class_teacher' : 'teacher');
    setRoleAssignedClassId(teacher.assignedClassId || classes[0]?.id || '');
  };

  const handleConfirmRoleChange = () => {
    if (!roleChangeTeacher) return;

    if (roleChangeTeacher.userAccountId) {
      changeUserRole(roleChangeTeacher.userAccountId, newRoleSelection);
    }

    if (newRoleSelection === 'class_teacher') {
      const cls = classes.find((c) => c.id === roleAssignedClassId);
      addClassTeacher({
        name: roleChangeTeacher.name,
        email: roleChangeTeacher.email,
        phone: roleChangeTeacher.phone,
        collegeId: 'col-1',
        collegeName: 'RV College of Engineering',
        department: roleChangeTeacher.department,
        assignedClass: cls ? cls.name : 'Unassigned',
        assignedClassId: roleAssignedClassId,
        totalStudents: cls ? cls.totalStudents : 0,
        status: roleChangeTeacher.status
      });
      if (cls) {
        assignClassTeacherToClass(roleChangeTeacher.id, cls.id);
      }
    } else {
      addSubjectTeacher({
        name: roleChangeTeacher.name,
        email: roleChangeTeacher.email,
        phone: roleChangeTeacher.phone,
        collegeId: 'col-1',
        collegeName: 'RV College of Engineering',
        department: roleChangeTeacher.department,
        status: roleChangeTeacher.status,
        assignedSubjects: [
          { code: '21CS52', name: 'Computer Networks', classId: 'cls-1', className: '5th Sem CSE-A' }
        ]
      });
      if (roleChangeTeacher.assignedClassId) {
        removeClassTeacherAssignment(roleChangeTeacher.id);
      }
    }

    addAuditLog(
      'Faculty Role Reassigned',
      `${roleChangeTeacher.name}`,
      `Switched role to ${newRoleSelection === 'class_teacher' ? 'Class Teacher' : 'Subject Teacher'}.`,
      'success'
    );
    showToast(
      `${roleChangeTeacher.name} reassigned to ${newRoleSelection === 'class_teacher' ? 'Class Teacher' : 'Subject Teacher'}`,
      'success'
    );
    setRoleChangeTeacher(null);
  };

  const handleConfirmStatusToggle = () => {
    if (!statusConfirmTeacher) return;

    if (statusConfirmTeacher.userAccountId) {
      toggleUserStatus(statusConfirmTeacher.userAccountId);
    } else {
      // Direct toggle
      const newStatus = statusConfirmTeacher.status === 'active' ? 'inactive' : 'active';
      showToast(`${statusConfirmTeacher.name} status updated to ${newStatus.toUpperCase()}`, 'info');
      addAuditLog(
        newStatus === 'active' ? 'Account Activated' : 'Account Deactivated',
        statusConfirmTeacher.name,
        `Admin switched status to ${newStatus}.`
      );
    }
    setStatusConfirmTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Teacher Management</h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Directory of Subject Teachers and Class Coordinators across departments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus size={15} />
            <span>Add Teacher Account</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Faculty</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Teaching & class mentors</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subject Teachers</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{subjectCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Course instructors</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Class Teachers</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{classTeacherCount}</div>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Section coordinators</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Status</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{activeCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Authorized for login</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Inactive / Suspended</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">{inactiveCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Access disabled</p>
        </div>
      </div>

      {/* 3. Tab Navigation & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-4">
        {/* Top bar: Tabs + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={13} />
              <span>All Teachers</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('subject')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'subject'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen size={13} />
              <span>Subject Teachers</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'subject' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {subjectCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('class')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'class'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserCheck size={13} />
              <span>Class Teachers</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'class' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {classTeacherCount}
              </span>
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredTeachers.length}</strong> of {totalCount} faculty members
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty by name, email, employee ID, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Inactive / Suspended</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-center gap-2">
            {(searchQuery || deptFilter !== 'all' || statusFilter !== 'all' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDeptFilter('all');
                  setStatusFilter('all');
                  setActiveTab('all');
                }}
                className="w-full py-2 text-xs font-bold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Teachers Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredTeachers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Users size={24} />
            </div>
            <h4 className="text-sm font-bold text-gray-900">No teachers found</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              No faculty member matches your current search or filter parameters. Try clearing filters or creating a new teacher account.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDeptFilter('all');
                setStatusFilter('all');
                setActiveTab('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Teacher Cards */}
            <div className="md:hidden divide-y divide-gray-100">
          {filteredTeachers.map((teacher) => {
            const isClassTeacher = teacher.role === 'class_teacher';

            return (
              <div key={teacher.id} className="p-3.5 space-y-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isClassTeacher ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="font-bold text-xs text-gray-900 truncate">{teacher.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{teacher.identifier}</p>
                      <p className="text-[10px] text-gray-500 truncate">{teacher.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStatusConfirmTeacher(teacher)}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      teacher.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${teacher.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="capitalize">{teacher.status}</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-semibold text-gray-800 truncate max-w-[180px]">{teacher.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Role:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isClassTeacher ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isClassTeacher ? 'Class Teacher' : 'Subject Teacher'}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-gray-200/60 text-[11px]">
                    <span className="text-gray-500 block mb-0.5">Allotment:</span>
                    {isClassTeacher ? (
                      <span className="font-semibold text-gray-900">{teacher.assignedClass || 'Classroom Unassigned'}</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignedSubjects && teacher.assignedSubjects.length > 0 ? (
                          teacher.assignedSubjects.map((sub, idx) => (
                            <span key={idx} className="text-[9.5px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                              {sub.code}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No assigned subjects</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-0.5">
                  <button
                    onClick={() => handleOpenRoleChange(teacher)}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-purple-100 hover:text-purple-800 text-gray-700 text-xs font-bold text-center transition-colors"
                  >
                    Role / Assign
                  </button>
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Teachers Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role & Allotment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map((teacher) => {
                const isClassTeacher = teacher.role === 'class_teacher';

                return (
                  <tr key={teacher.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isClassTeacher ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{teacher.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 truncate mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail size={11} className="text-gray-400" />
                              {teacher.email}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone size={11} className="text-gray-400" />
                              {teacher.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800 text-[11px]">
                      {teacher.identifier}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-[11px]">
                        {teacher.department}
                      </span>
                    </td>

                    {/* Role & Allotment */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {isClassTeacher ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <UserCheck size={11} /> Class Teacher
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <BookOpen size={11} /> Subject Teacher
                            </span>
                          )}
                        </div>

                        {/* Specific Allotment Details */}
                        {isClassTeacher ? (
                          <p className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
                            <FolderTree size={11} className="text-gray-400" />
                            <span>{teacher.assignedClass || 'Classroom Unassigned'}</span>
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {teacher.assignedSubjects && teacher.assignedSubjects.length > 0 ? (
                              teacher.assignedSubjects.map((sub, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-medium"
                                >
                                  {sub.code}: {sub.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">No assigned subjects</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setStatusConfirmTeacher(teacher)}
                        title="Click to toggle account activation"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                          teacher.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${teacher.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="capitalize">{teacher.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenRoleChange(teacher)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-purple-100 hover:text-purple-800 text-gray-700 text-[11px] font-bold transition-colors"
                          title="Assign or change role"
                        >
                          Role / Assign
                        </button>
                        <button
                          onClick={() => handleOpenEdit(teacher)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                          title="Edit Teacher Profile"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>

      {/* =========================================================================
          MODALS
      ========================================================================= */}

      {/* 1. Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Add Teacher Account</h3>
                  <p className="text-[10px] text-gray-400">Register new faculty member and assign responsibilities</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Rao"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-CSE-045"
                    value={addForm.identifier}
                    onChange={(e) => setAddForm({ ...addForm, identifier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.rao@rvce.edu.in"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98450 00000"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department *</label>
                <select
                  value={addForm.department}
                  onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Selection */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Teacher Role *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, role: 'teacher' })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      addForm.role === 'teacher'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black">
                      <BookOpen size={14} className="text-emerald-700" />
                      <span>Subject Teacher</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Teaches specific subjects, records attendance & evaluates marks
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, role: 'class_teacher' })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      addForm.role === 'class_teacher'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black">
                      <UserCheck size={14} className="text-blue-700" />
                      <span>Class Teacher</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Coordinates an entire class section, handles rosters & approvals
                    </p>
                  </button>
                </div>
              </div>

              {/* Dynamic allotment based on role */}
              {addForm.role === 'class_teacher' ? (
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assign Classroom (Optional)</label>
                  <select
                    value={addForm.assignedClassId}
                    onChange={(e) => setAddForm({ ...addForm, assignedClassId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    <option value="">Leave unassigned for now</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.department} - Sem {c.semester})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assign Primary Subject</label>
                  <select
                    value={addForm.selectedSubjectCodes[0] || '21CS52'}
                    onChange={(e) => setAddForm({ ...addForm, selectedSubjectCodes: [e.target.value] })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.code}>
                        {s.code}: {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Activation Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={addForm.status === 'active'}
                      onChange={() => setAddForm({ ...addForm, status: 'active' })}
                      className="text-black focus:ring-black"
                    />
                    <span>Active (Login Allowed)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={addForm.status === 'inactive'}
                      onChange={() => setAddForm({ ...addForm, status: 'inactive' })}
                      className="text-black focus:ring-black"
                    />
                    <span>Inactive (Suspended)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold transition-all shadow-xs"
                >
                  Create Teacher Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Teacher Profile Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Edit Teacher Profile</h3>
                  <p className="text-[10px] text-gray-400">Update faculty details and academic mapping</p>
                </div>
              </div>
              <button
                onClick={() => setEditingTeacher(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={editForm.identifier}
                    onChange={(e) => setEditForm({ ...editForm, identifier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department</label>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              {editingTeacher.role === 'class_teacher' ? (
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assigned Classroom</label>
                  <select
                    value={editForm.assignedClassId}
                    onChange={(e) => setEditForm({ ...editForm, assignedClassId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    <option value="">Unassigned</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                >
                  <option value="active">Active (Full Access)</option>
                  <option value="inactive">Inactive (Suspended)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold transition-all shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Role / Allotment Assignment Modal */}
      {roleChangeTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Shield size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Assign / Switch Faculty Role</h3>
                  <p className="text-[10px] text-gray-400">Change authority for {roleChangeTeacher.name}</p>
                </div>
              </div>
              <button
                onClick={() => setRoleChangeTeacher(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Role</div>
                <div className="text-sm font-black text-gray-900 capitalize mt-0.5">
                  {roleChangeTeacher.role.replace('_', ' ')}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Identifier: {roleChangeTeacher.identifier} • {roleChangeTeacher.department}
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Select New Role</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewRoleSelection('teacher')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newRoleSelection === 'teacher'
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <BookOpen size={14} className="text-emerald-700 mb-1" />
                    <div className="font-bold text-xs">Subject Teacher</div>
                    <div className="text-[10px] text-gray-500">Subject syllabus & marks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRoleSelection('class_teacher')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newRoleSelection === 'class_teacher'
                        ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <UserCheck size={14} className="text-blue-700 mb-1" />
                    <div className="font-bold text-xs">Class Teacher</div>
                    <div className="text-[10px] text-gray-500">Classroom coordinator</div>
                  </button>
                </div>
              </div>

              {newRoleSelection === 'class_teacher' && (
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assign Class Section *</label>
                  <select
                    value={roleAssignedClassId}
                    onChange={(e) => setRoleAssignedClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleChangeTeacher(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRoleChange}
                  className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold transition-all shadow-xs"
                >
                  Apply Role Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Status Toggle Confirmation Modal */}
      {statusConfirmTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold mb-3 ${
              statusConfirmTeacher.status === 'active' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              {statusConfirmTeacher.status === 'active' ? 'Deactivate Teacher Account?' : 'Reactivate Teacher Account?'}
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to {statusConfirmTeacher.status === 'active' ? 'deactivate' : 'activate'} the account for{' '}
              <strong>{statusConfirmTeacher.name}</strong> ({statusConfirmTeacher.identifier})?
              {statusConfirmTeacher.status === 'active'
                ? ' This will immediately suspend their sign-in privileges and lock access to taking attendance and publishing marks.'
                : ' This will restore full portal access and permit the faculty member to log in.'}
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setStatusConfirmTeacher(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusToggle}
                className={`px-4 py-2 rounded-xl font-bold text-white transition-all shadow-xs ${
                  statusConfirmTeacher.status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Yes, {statusConfirmTeacher.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

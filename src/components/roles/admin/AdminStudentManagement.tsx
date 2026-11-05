import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
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
  Eye,
  Award,
  AlertCircle,
  Calendar,
  FolderTree,
  UserPlus,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Student } from '../../../types/academic';

export const AdminStudentManagement: React.FC = () => {
  const {
    students,
    classes,
    departments,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleUserStatus,
    userAccounts,
    showToast,
    addAuditLog
  } = useApp();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // all | safe | warning

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [assigningClassStudent, setAssigningClassStudent] = useState<Student | null>(null);
  const [statusConfirmStudent, setStatusConfirmStudent] = useState<Student | null>(null);

  // Add Student Form
  const [addForm, setAddForm] = useState({
    name: '',
    usn: '',
    email: '',
    phone: '+91 98765 00000',
    branch: 'CSE',
    semester: 5,
    classId: classes[0]?.id || 'cls-1',
    mentorName: 'Dr. K. Srinivas',
    overallAttendance: 85,
    avgIA: 24.5,
    status: 'active' as 'active' | 'inactive'
  });

  // Edit Student Form
  const [editForm, setEditForm] = useState({
    name: '',
    usn: '',
    email: '',
    phone: '',
    branch: '',
    semester: 5,
    classId: '',
    mentorName: '',
    overallAttendance: 80,
    avgIA: 22,
    status: 'active' as 'active' | 'inactive'
  });

  // Assign Class Form
  const [targetClassId, setTargetClassId] = useState('');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Semester filter
      if (semesterFilter !== 'all' && s.semester.toString() !== semesterFilter) return false;

      // Branch filter
      if (branchFilter !== 'all' && s.branch !== branchFilter) return false;

      // Class filter
      if (classFilter !== 'all' && s.classId !== classFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;

      // Attendance filter
      if (attendanceFilter === 'safe' && s.overallAttendance < 75) return false;
      if (attendanceFilter === 'warning' && s.overallAttendance >= 75) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesUsn = s.usn.toLowerCase().includes(query);
        const matchesEmail = s.email.toLowerCase().includes(query);
        const matchesClass = s.className.toLowerCase().includes(query);
        if (!matchesName && !matchesUsn && !matchesEmail && !matchesClass) return false;
      }

      return true;
    });
  }, [students, semesterFilter, branchFilter, classFilter, statusFilter, attendanceFilter, searchQuery]);

  // Stat metrics
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter((s) => s.status === 'active').length;
  const classesCoveredCount = new Set(students.map((s) => s.classId)).size;
  const avgAttendanceAll =
    students.length > 0
      ? (students.reduce((acc, s) => acc + s.overallAttendance, 0) / students.length).toFixed(1)
      : '0.0';
  const atRiskCount = students.filter((s) => s.overallAttendance < 75).length;

  // Handlers
  const handleOpenAddModal = () => {
    setAddForm({
      name: '',
      usn: `1RV22CS${Math.floor(100 + Math.random() * 900)}`,
      email: '',
      phone: '+91 98765 00000',
      branch: 'CSE',
      semester: 5,
      classId: classes[0]?.id || 'cls-1',
      mentorName: 'Dr. K. Srinivas',
      overallAttendance: 85,
      avgIA: 24,
      status: 'active'
    });
    setIsAddModalOpen(true);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.usn || !addForm.email) {
      showToast('Please fill all required student details', 'error');
      return;
    }

    const exists = students.some(
      (s) => s.usn.toLowerCase() === addForm.usn.toLowerCase() || s.email.toLowerCase() === addForm.email.toLowerCase()
    );
    if (exists) {
      showToast(`Student with USN "${addForm.usn}" or email already exists`, 'error');
      return;
    }

    const selectedCls = classes.find((c) => c.id === addForm.classId) || classes[0];

    addStudent({
      usn: addForm.usn.toUpperCase(),
      name: addForm.name,
      email: addForm.email,
      phone: addForm.phone,
      collegeId: 'col-1',
      collegeName: 'RV College of Engineering',
      classId: selectedCls ? selectedCls.id : 'cls-1',
      className: selectedCls ? selectedCls.name : '5th Sem CSE - Section A',
      semester: Number(addForm.semester),
      branch: addForm.branch,
      overallAttendance: Number(addForm.overallAttendance),
      totalClassesAttended: Math.round((Number(addForm.overallAttendance) / 100) * 120),
      totalClassesHeld: 120,
      avgIA: Number(addForm.avgIA),
      alertsCount: Number(addForm.overallAttendance) < 75 ? 1 : 0,
      status: addForm.status,
      mentorName: addForm.mentorName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      usn: student.usn,
      email: student.email,
      phone: student.phone,
      branch: student.branch,
      semester: student.semester,
      classId: student.classId,
      mentorName: student.mentorName || 'Dr. K. Srinivas',
      overallAttendance: student.overallAttendance,
      avgIA: student.avgIA,
      status: student.status
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const selectedCls = classes.find((c) => c.id === editForm.classId) || classes.find((c) => c.name === editingStudent.className);

    updateStudent({
      ...editingStudent,
      name: editForm.name,
      usn: editForm.usn.toUpperCase(),
      email: editForm.email,
      phone: editForm.phone,
      branch: editForm.branch,
      semester: Number(editForm.semester),
      classId: selectedCls ? selectedCls.id : editingStudent.classId,
      className: selectedCls ? selectedCls.name : editingStudent.className,
      mentorName: editForm.mentorName,
      overallAttendance: Number(editForm.overallAttendance),
      avgIA: Number(editForm.avgIA),
      status: editForm.status
    });

    setEditingStudent(null);
  };

  const handleOpenAssignClass = (student: Student) => {
    setAssigningClassStudent(student);
    setTargetClassId(student.classId || classes[0]?.id || '');
  };

  const handleSaveAssignClass = () => {
    if (!assigningClassStudent) return;
    const targetCls = classes.find((c) => c.id === targetClassId);
    if (!targetCls) return;

    updateStudent({
      ...assigningClassStudent,
      classId: targetCls.id,
      className: targetCls.name,
      semester: targetCls.semester,
      branch: targetCls.department
    });

    showToast(`Assigned ${assigningClassStudent.name} to ${targetCls.name}`, 'success');
    addAuditLog(
      'Class Assignment Modified',
      `${assigningClassStudent.name} (${assigningClassStudent.usn})`,
      `Reassigned from ${assigningClassStudent.className} to ${targetCls.name}`,
      'info'
    );
    setAssigningClassStudent(null);
  };

  const handleConfirmStatusToggle = () => {
    if (!statusConfirmStudent) return;

    const newStatus = statusConfirmStudent.status === 'active' ? 'inactive' : 'active';
    updateStudent({
      ...statusConfirmStudent,
      status: newStatus
    });

    // Also toggle corresponding userAccount
    const matchedUser = userAccounts.find(
      (u) => u.identifier.toLowerCase() === statusConfirmStudent.usn.toLowerCase() || u.email.toLowerCase() === statusConfirmStudent.email.toLowerCase()
    );
    if (matchedUser) {
      toggleUserStatus(matchedUser.id);
    }

    showToast(
      `Student ${statusConfirmStudent.name} account is now ${newStatus.toUpperCase()}`,
      newStatus === 'active' ? 'success' : 'warning'
    );
    setStatusConfirmStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Student Management</h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Directory of enrolled students across class sections and semesters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus size={15} />
            <span>Add Student Account</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <GraduationCap size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalStudentsCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Students in directory</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Status</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{activeStudentsCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Active accounts</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Classes Covered</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FolderTree size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">{classesCoveredCount}</div>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Active class sections</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg. Attendance</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award size={15} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{avgAttendanceAll}%</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Institute average</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Below 75% (At Risk)</span>
            <div className={`p-2 rounded-xl ${atRiskCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className={`text-2xl font-black ${atRiskCount > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
            {atRiskCount}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">Attendance critical</p>
        </div>
      </div>

      {/* 3. Search and Multi-Filter Controls */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="lg:col-span-4 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, USN, email, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
            />
          </div>

          {/* Semester Filter */}
          <div className="lg:col-span-2">
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
            >
              <option value="all">All Semesters</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
              <option value="7">7th Semester</option>
              <option value="8">8th Semester</option>
            </select>
          </div>

          {/* Department / Branch */}
          <div className="lg:col-span-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
            >
              <option value="all">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
            </select>
          </div>

          {/* Class Section */}
          <div className="lg:col-span-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
            >
              <option value="all">All Class Sections</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attendance Health / Status */}
          <div className="lg:col-span-2">
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
            >
              <option value="all">All Attendance</option>
              <option value="safe">Safe (≥ 75%)</option>
              <option value="warning">At Risk (&lt; 75%)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          <div className="text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredStudents.length}</strong> of {totalStudentsCount} registered students
          </div>

          {(searchQuery || semesterFilter !== 'all' || branchFilter !== 'all' || classFilter !== 'all' || statusFilter !== 'all' || attendanceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSemesterFilter('all');
                setBranchFilter('all');
                setClassFilter('all');
                setStatusFilter('all');
                setAttendanceFilter('all');
              }}
              className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw size={12} />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Students Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <GraduationCap size={24} />
            </div>
            <h4 className="text-sm font-bold text-gray-900">No students match your criteria</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Try adjusting your search query, semester, or class section filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSemesterFilter('all');
                setBranchFilter('all');
                setClassFilter('all');
                setStatusFilter('all');
                setAttendanceFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Student Cards */}
            <div className="md:hidden divide-y divide-gray-100">
          {filteredStudents.map((student) => {
            const isSafeAttendance = student.overallAttendance >= 75;

            return (
              <div key={student.id} className="p-3.5 space-y-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                      {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="font-bold text-xs text-gray-900 truncate" onClick={() => setViewingStudent(student)}>
                        {student.name}
                      </p>
                      <p className="font-mono text-[10.5px] text-gray-600 font-semibold">{student.usn}</p>
                      <p className="text-[10px] text-gray-400 truncate">{student.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStatusConfirmStudent(student)}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      student.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="capitalize">{student.status}</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Enrolled Class:</span>
                    <span className="font-semibold text-gray-800 truncate max-w-[190px]">{student.className}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Attendance:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        isSafeAttendance
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {!isSafeAttendance && <AlertCircle size={10} />}
                      {student.overallAttendance}% ({student.totalClassesAttended}/{student.totalClassesHeld || 120})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Avg. IA Score:</span>
                    <span className="font-bold text-gray-900">{student.avgIA} / 30</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-0.5">
                  <button
                    onClick={() => setViewingStudent(student)}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold text-center flex items-center justify-center gap-1"
                  >
                    <Eye size={13} /> Profile
                  </button>
                  <button
                    onClick={() => handleOpenAssignClass(student)}
                    className="flex-1 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold text-center"
                  >
                    Assign Class
                  </button>
                  <button
                    onClick={() => handleOpenEdit(student)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100"
                    title="Edit Record"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Students Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">USN</th>
                <th className="py-3 px-4">Class & Sem</th>
                <th className="py-3 px-4">Overall Attendance</th>
                <th className="py-3 px-4">Avg. IA Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const isSafeAttendance = student.overallAttendance >= 75;

                return (
                  <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate hover:text-blue-600 cursor-pointer" onClick={() => setViewingStudent(student)}>
                            {student.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 truncate mt-0.5">
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* USN */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                        {student.usn}
                      </span>
                    </td>

                    {/* Class & Semester */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-800">{student.className}</p>
                      <p className="text-[10px] text-gray-500">{student.branch} • Semester {student.semester}</p>
                    </td>

                    {/* Attendance % */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSafeAttendance
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {!isSafeAttendance && <AlertCircle size={10} />}
                          {student.overallAttendance}%
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({student.totalClassesAttended}/{student.totalClassesHeld || 120})
                        </span>
                      </div>
                    </td>

                    {/* Avg IA Score */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900">{student.avgIA} / 30</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setStatusConfirmStudent(student)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                          student.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="capitalize">{student.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                          title="View Student Profile"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenAssignClass(student)}
                          className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-800 text-gray-700 text-[11px] font-bold transition-colors"
                          title="Assign to another class"
                        >
                          Assign Class
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                          title="Edit Student Record"
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

      {/* 1. Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Add Student Account</h3>
                  <p className="text-[10px] text-gray-400">Enroll new student into academic records</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">USN (University Seat No) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1RV22CS095"
                    value={addForm.usn}
                    onChange={(e) => setAddForm({ ...addForm, usn: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.cs22@rvce.edu.in"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Branch / Dept *</label>
                  <select
                    value={addForm.branch}
                    onChange={(e) => setAddForm({ ...addForm, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ISE">ISE</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Semester *</label>
                  <select
                    value={addForm.semester}
                    onChange={(e) => setAddForm({ ...addForm, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    <option value={1}>1st Sem</option>
                    <option value={2}>2nd Sem</option>
                    <option value={3}>3rd Sem</option>
                    <option value={4}>4th Sem</option>
                    <option value={5}>5th Sem</option>
                    <option value={6}>6th Sem</option>
                    <option value={7}>7th Sem</option>
                    <option value={8}>8th Sem</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Class Section *</label>
                  <select
                    value={addForm.classId}
                    onChange={(e) => setAddForm({ ...addForm, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initial Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={addForm.overallAttendance}
                    onChange={(e) => setAddForm({ ...addForm, overallAttendance: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initial Avg IA (Max 30)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    step={0.5}
                    value={addForm.avgIA}
                    onChange={(e) => setAddForm({ ...addForm, avgIA: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assigned Mentor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Srinivas"
                    value={addForm.mentorName}
                    onChange={(e) => setAddForm({ ...addForm, mentorName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

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
                    <span>Active (Permit Portal Access)</span>
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
                  Create Student Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. View Student Profile Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  {viewingStudent.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{viewingStudent.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                      {viewingStudent.usn}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      viewingStudent.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {viewingStudent.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Academic & Personal Overview */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Class Section</div>
                  <div className="font-bold text-gray-900 text-xs mt-0.5 truncate">{viewingStudent.className}</div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Semester & Dept</div>
                  <div className="font-bold text-gray-900 text-xs mt-0.5">Sem {viewingStudent.semester} • {viewingStudent.branch}</div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Overall Attendance</div>
                  <div className={`font-black text-xs mt-0.5 ${viewingStudent.overallAttendance >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {viewingStudent.overallAttendance}%
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Avg. IA Marks</div>
                  <div className="font-black text-gray-900 text-xs mt-0.5">{viewingStudent.avgIA} / 30</div>
                </div>
              </div>

              {/* Attendance Breakdown Bar */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">Attendance Compliance</span>
                  <span className={`font-black ${viewingStudent.overallAttendance >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {viewingStudent.overallAttendance}% ({viewingStudent.totalClassesAttended} / {viewingStudent.totalClassesHeld || 120} sessions)
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${viewingStudent.overallAttendance >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, viewingStudent.overallAttendance)}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  VTU minimum threshold is 75.0%. {viewingStudent.overallAttendance >= 75 ? 'Student is eligible for examinations.' : 'Student is in the attendance deficit zone.'}
                </p>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                <h4 className="font-bold text-gray-900 text-xs mb-2">Contact & Mentorship Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Email Address</span>
                      <span className="font-medium text-gray-800">{viewingStudent.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Mobile Phone</span>
                      <span className="font-medium text-gray-800">{viewingStudent.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-gray-400" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Faculty Mentor</span>
                      <span className="font-medium text-gray-800">{viewingStudent.mentorName || 'Dr. K. Srinivas'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderTree size={14} className="text-gray-400" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">Affiliated College</span>
                      <span className="font-medium text-gray-800">{viewingStudent.collegeName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const stu = viewingStudent;
                    setViewingStudent(null);
                    handleOpenEdit(stu);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit2 size={13} />
                  <span>Edit Student Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingStudent(null)}
                  className="px-5 py-2 rounded-xl bg-black text-white font-bold text-xs"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Student Record Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Edit Student Record</h3>
                  <p className="text-[10px] text-gray-400">Update academic details and student metadata</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
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
                  <label className="font-bold text-gray-700 block mb-1">USN *</label>
                  <input
                    type="text"
                    required
                    value={editForm.usn}
                    onChange={(e) => setEditForm({ ...editForm, usn: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono uppercase"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Department / Branch</label>
                  <select
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ISE">ISE</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Semester</label>
                  <select
                    value={editForm.semester}
                    onChange={(e) => setEditForm({ ...editForm, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    <option value={1}>1st Sem</option>
                    <option value={2}>2nd Sem</option>
                    <option value={3}>3rd Sem</option>
                    <option value={4}>4th Sem</option>
                    <option value={5}>5th Sem</option>
                    <option value={6}>6th Sem</option>
                    <option value={7}>7th Sem</option>
                    <option value={8}>8th Sem</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Class Section</label>
                  <select
                    value={editForm.classId}
                    onChange={(e) => setEditForm({ ...editForm, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Overall Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.overallAttendance}
                    onChange={(e) => setEditForm({ ...editForm, overallAttendance: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Avg. IA Score (Max 30)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    step={0.5}
                    value={editForm.avgIA}
                    onChange={(e) => setEditForm({ ...editForm, avgIA: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mentor Name</label>
                  <input
                    type="text"
                    value={editForm.mentorName}
                    onChange={(e) => setEditForm({ ...editForm, mentorName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Activation Status</label>
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
                  onClick={() => setEditingStudent(null)}
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

      {/* 4. Assign Class Modal */}
      {assigningClassStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <FolderTree size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Assign Classroom</h3>
                  <p className="text-[10px] text-gray-400">Move student to a new section</p>
                </div>
              </div>
              <button
                onClick={() => setAssigningClassStudent(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Selected Student</div>
                <div className="text-sm font-black text-gray-900 mt-0.5">{assigningClassStudent.name}</div>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  USN: {assigningClassStudent.usn} • Current Class: {assigningClassStudent.className}
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Select New Class Section *</label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.department} - Sem {c.semester})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Reallocating the student will update their attendance and IA evaluation tracking to the appointed Class Teacher of that section.
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningClassStudent(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignClass}
                  className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold transition-all shadow-xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Status Toggle Confirmation Dialog */}
      {statusConfirmStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold mb-3 ${
              statusConfirmStudent.status === 'active' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">
              {statusConfirmStudent.status === 'active' ? 'Deactivate Student Account?' : 'Reactivate Student Account?'}
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to {statusConfirmStudent.status === 'active' ? 'deactivate' : 'activate'} the account for{' '}
              <strong>{statusConfirmStudent.name}</strong> ({statusConfirmStudent.usn})?
              {statusConfirmStudent.status === 'active'
                ? ' This will suspend their portal access, preventing them from viewing marks and checking attendance.'
                : ' This will restore full portal access and permit the student to log in.'}
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setStatusConfirmStudent(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusToggle}
                className={`px-4 py-2 rounded-xl font-bold text-white transition-all shadow-xs ${
                  statusConfirmStudent.status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Yes, {statusConfirmStudent.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

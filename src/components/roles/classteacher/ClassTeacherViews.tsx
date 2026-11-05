import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  BarChart3,
  User,
  Upload,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  FolderTree,
  UserCheck,
  Download,
  Check,
  X,
  FileText,
  Mail,
  Phone,
  Trash2,
  Edit3,
  Shield,
  ArrowRight,
  Eye,
  ChevronRight,
  UserPlus,
  Sliders,
  RefreshCw,
  Send,
  Building2,
  CheckSquare,
  LogOut,
  Lock,
  Unlock,
  RotateCcw,
  Save,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Student, AcademicAlert, CorrectionRequest, SubjectTeacher, Assignment, SubjectAssessmentConfig } from '../../../types/academic';

export const ClassTeacherViews: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    alerts,
    resolveAlert,
    correctionRequests,
    resolveCorrectionRequest,
    subjects,
    subjectTeachers,
    addSubjectTeacher,
    assignTeacherToSubject,
    assignments,
    createAssignment,
    studentJoinRequests,
    approveStudentJoinRequest,
    rejectStudentJoinRequest,
    showToast,
    searchTerm,
    setSearchTerm,
    academicConfig,
    updateAcademicConfig,
    subjectConfigs,
    getSubjectConfig,
    updateSubjectConfig,
    resetSubjectConfig,
    logActivity
  } = useApp();

  // Class Scope: 5th Sem CSE - Section A
  const classStudents = students.filter((s) => s.classId === 'cls-1');
  const classAlerts = alerts.filter((a) => a.classId === 'cls-1');

  // Sub-tabs state for grouped menus
  const [studentTab, setStudentTab] = useState<'all' | 'add' | 'requests'>('all');
  const [studentRiskFilter, setStudentRiskFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [teacherTab, setTeacherTab] = useState<'view' | 'assign' | 'add'>('view');
  const [academicTab, setAcademicTab] = useState<'attendance' | 'ia' | 'assignments'>('attendance');
  const [settingsTab, setSettingsTab] = useState<'academic-config' | 'profile'>('academic-config');

  // Academic Configuration state for Class Teacher (covers all classroom subjects)
  const [activeConfigSubjectCode, setActiveConfigSubjectCode] = useState<string>('21CS52');
  const [configForm, setConfigForm] = useState<SubjectAssessmentConfig>(() => getSubjectConfig('21CS52'));

  useEffect(() => {
    setConfigForm(getSubjectConfig(activeConfigSubjectCode));
  }, [activeConfigSubjectCode, subjectConfigs]);

  // Sync sub-tabs if opened via legacy route/links
  useEffect(() => {
    if (currentPage === 'import-students') {
      setStudentTab('add');
    } else if (currentPage === 'assign-teachers') {
      setTeacherTab('assign');
    } else if (currentPage === 'attendance-overview') {
      setAcademicTab('attendance');
    } else if (currentPage === 'ia-overview') {
      setAcademicTab('ia');
    } else if (currentPage === 'assignments-overview') {
      setAcademicTab('assignments');
    } else if (
      currentPage === 'communication-monitoring' ||
      currentPage === 'academic-alerts' ||
      currentPage === 'correction-requests' ||
      currentPage === 'reports' ||
      currentPage === 'announcements'
    ) {
      setCurrentPage('dashboard');
    }
  }, [currentPage, setCurrentPage]);

  // Modals state
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Rejection modal
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Assign modal
  const [assignSubjectCode, setAssignSubjectCode] = useState('21CS52');
  const [assignTeacherName, setAssignTeacherName] = useState('Prof. Ananya Sharma');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // New teacher modal
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'CSE',
    designation: 'Assistant Professor',
    employeeId: ''
  });

  // New assignment modal
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    title: '',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    teacherName: 'Dr. K. Srinivas',
    dueDate: '2026-10-30',
    maxMarks: 20,
    description: ''
  });

  // Resolve alert modal
  const [resolvingAlert, setResolvingAlert] = useState<AcademicAlert | null>(null);
  const [counselingNotes, setCounselingNotes] = useState('');

  // Profile details form
  const [teacherProfile, setTeacherProfile] = useState({
    name: 'Dr. K. Srinivas',
    designation: 'Associate Professor & Class Coordinator',
    employeeId: 'FAC-CSE-042',
    email: 'srinivas.k@rvce.edu.in',
    phone: '+91 98450 44321',
    cabin: 'Room CS-304, 3rd Floor, CSE Block',
    officeHours: 'Mon-Fri: 2:00 PM - 4:00 PM',
    qualification: 'Ph.D. in Computer Science & Engineering (VTU)'
  });

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    usn: '',
    email: '',
    phone: '',
    branch: 'CSE',
    semester: 5,
    className: '5th Sem CSE - Section A',
    classId: 'cls-1',
    collegeId: 'col-1',
    collegeName: 'RV College of Engineering',
    overallAttendance: 85.0,
    totalClassesAttended: 156,
    totalClassesHeld: 184,
    avgIA: 78.0,
    alertsCount: 0,
    status: 'active' as const,
    mentorName: 'Dr. K. Srinivas'
  });

  // Filter students
  const filteredClassStudents = classStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (studentRiskFilter === 'all') return true;
    if (studentRiskFilter === 'safe') return s.overallAttendance >= 80;
    if (studentRiskFilter === 'warning') return s.overallAttendance >= 75 && s.overallAttendance < 80;
    if (studentRiskFilter === 'critical') return s.overallAttendance < 75;
    return true;
  });

  // Pending join requests
  const pendingRequests = studentJoinRequests.filter((r) => r.status === 'pending');
  const filteredRequests = studentJoinRequests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  // =========================================================================
  // 1. DASHBOARD
  // =========================================================================
  if (currentPage === 'dashboard') {
    const belowThreshold = classStudents.filter((s) => s.overallAttendance < 75).length;
    const warningStudents = classStudents.filter((s) => s.overallAttendance >= 75 && s.overallAttendance < 80).length;
    const safeStudents = classStudents.filter((s) => s.overallAttendance >= 80).length;
    const avgAttendance = classStudents.length > 0
      ? (classStudents.reduce((acc, s) => acc + s.overallAttendance, 0) / classStudents.length).toFixed(1)
      : '0.0';
    const avgIA = classStudents.length > 0
      ? (classStudents.reduce((acc, s) => acc + s.avgIA, 0) / classStudents.length).toFixed(1)
      : '0.0';
    const activeAlerts = classAlerts.filter((a) => a.status === 'open');

    return (
      <div className="space-y-4">
        {/* Class Overview Banner */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-900">Class Coordinator</span>
              <span aria-hidden="true">·</span>
              <span>{teacherProfile.name}</span>
              <span aria-hidden="true">·</span>
              <span>Room CS-302</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              5th Semester CSE — Section A
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{classStudents.length} Students</span>
              <span aria-hidden="true">·</span>
              <span>Attendance: <strong className="font-mono tabular-nums text-slate-900">{avgAttendance}%</strong></span>
              <span aria-hidden="true">·</span>
              <span>CIE Average: <strong className="font-mono tabular-nums text-slate-900">{avgIA}/50</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 md:pt-0 shrink-0">
            <button
              onClick={() => {
                setCurrentPage('student-management');
                setStudentTab('add');
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} /> + Student
            </button>
            <button
              onClick={() => {
                setCurrentPage('student-management');
                setStudentTab('requests');
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
            >
              <UserPlus size={14} /> Requests ({pendingRequests.length})
            </button>
          </div>
        </div>

        {/* 5 Compact Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          <div
            onClick={() => setCurrentPage('student-management')}
            className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Students</span>
              <div className="p-1 rounded bg-blue-50 text-blue-600">
                <Users size={13} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-slate-900">{classStudents.length}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Section A Roster</p>
          </div>

          <div
            onClick={() => setCurrentPage('assign-teachers')}
            className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Faculty</span>
              <div className="p-1 rounded bg-purple-50 text-purple-600">
                <UserCheck size={13} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-slate-900">{subjects.length}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Assigned Teachers</p>
          </div>

          <div
            onClick={() => {
              setCurrentPage('student-management');
              setStudentTab('requests');
            }}
            className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Requests</span>
              <div className="p-1 rounded bg-amber-50 text-amber-600">
                <Clock size={13} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-amber-600">{pendingRequests.length}</p>
            <p className="text-[10px] text-amber-700 font-medium mt-0.5">Join Requests</p>
          </div>

          <div
            onClick={() => {
              setCurrentPage('academic-management');
              setAcademicTab('attendance');
            }}
            className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Attendance</span>
              <div className="p-1 rounded bg-emerald-50 text-emerald-600">
                <CalendarCheck size={13} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-emerald-600">{avgAttendance}%</p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Class Average</p>
          </div>

          <div
            onClick={() => {
              setCurrentPage('student-management');
              setStudentRiskFilter('critical');
            }}
            className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Shortage</span>
              <div className="p-1 rounded bg-rose-50 text-rose-600">
                <AlertCircle size={13} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-rose-600">{belowThreshold}</p>
            <p className="text-[10px] text-rose-700 font-medium mt-0.5">&lt; 75% Attendance</p>
          </div>
        </div>

        {/* Pending Student Join Requests Notification Strip */}
        {pendingRequests.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <UserPlus size={15} className="text-amber-600 shrink-0" />
              <span className="font-semibold">
                {pendingRequests.length} Student Join Request{pendingRequests.length > 1 ? 's' : ''} awaiting coordinator approval
              </span>
            </div>
            <button
              onClick={() => {
                setCurrentPage('student-management');
                setStudentTab('requests');
              }}
              className="text-xs font-bold text-amber-900 hover:underline shrink-0 flex items-center gap-1"
            >
              Review ({pendingRequests.length}) <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Attendance Compliance & Visual Distribution Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Attendance Compliance Breakdown
            </h3>
            <button
              onClick={() => {
                setCurrentPage('academic-management');
                setAcademicTab('attendance');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Detailed Roster <ChevronRight size={12} />
            </button>
          </div>

          {/* Visual Stacked Progress Bar */}
          <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
            <div
              style={{ width: `${classStudents.length > 0 ? (safeStudents / classStudents.length) * 100 : 0}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Safe: ${safeStudents}`}
            />
            <div
              style={{ width: `${classStudents.length > 0 ? (warningStudents / classStudents.length) * 100 : 0}%` }}
              className="bg-amber-400 h-full transition-all"
              title={`Warning: ${warningStudents}`}
            />
            <div
              style={{ width: `${classStudents.length > 0 ? (belowThreshold / classStudents.length) * 100 : 0}%` }}
              className="bg-rose-500 h-full transition-all"
              title={`Critical: ${belowThreshold}`}
            />
          </div>

          {/* Compact Legend & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-900">Safe (≥ 80%)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span>{safeStudents}</span>
                <span className="text-[10px] text-emerald-600">({classStudents.length > 0 ? Math.round((safeStudents / classStudents.length) * 100) : 0}%)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span className="font-semibold text-amber-900">Warning (75–79%)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <span>{warningStudents}</span>
                <span className="text-[10px] text-amber-600">({classStudents.length > 0 ? Math.round((warningStudents / classStudents.length) * 100) : 0}%)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                <span className="font-semibold text-rose-900">Critical (&lt; 75%)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <span>{belowThreshold}</span>
                <span className="text-[10px] text-rose-600">({classStudents.length > 0 ? Math.round((belowThreshold / classStudents.length) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Academic Alerts Feed */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Priority Academic Alerts</h3>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {activeAlerts.length} Unresolved
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {classAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[9.5px] font-black uppercase px-1.5 py-0.2 rounded ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-bold text-slate-900">{alert.studentName}</span>
                    <span className="font-mono text-[11px] text-slate-400">({alert.studentUsn})</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-600 truncate">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="text-rose-600 font-semibold">{alert.reason}</span>
                    <span>·</span>
                    <span>{alert.recommendedAction}</span>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  {alert.status === 'open' ? (
                    <button
                      onClick={() => {
                        setResolvingAlert(alert);
                        setCounselingNotes('');
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MY CLASSROOM
  // =========================================================================
  if (currentPage === 'my-classroom' || currentPage === 'my-classes') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">My Classroom — Academic Details</h2>
          <p className="text-xs text-gray-500">Official section details, VTU syllabus scheme, assigned subject teachers, and timetable schedule.</p>
        </div>

        {/* Classroom Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Department of Computer Science & Engineering
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">5th Semester CSE — Section A</h3>
              <p className="text-xs text-gray-500">Academic Year 2025-2026 (Odd Semester)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Classroom
              </span>
              <button
                onClick={() => showToast('Classroom timetable downloaded in PDF format', 'info')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download size={14} /> Timetable
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class Room</span>
              <p className="text-base font-black text-gray-900 mt-0.5">CS-302 (3rd Floor)</p>
              <p className="text-[11px] text-gray-500">Computer Science Block</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class Strength</span>
              <p className="text-base font-black text-blue-600 mt-0.5">{classStudents.length} Students</p>
              <p className="text-[11px] text-gray-500">All registered & active</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Curriculum Scheme</span>
              <p className="text-base font-black text-purple-600 mt-0.5">VTU 2021 Scheme</p>
              <p className="text-[11px] text-gray-500">Choice Based Credit System</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class Teacher</span>
              <p className="text-base font-black text-gray-900 mt-0.5">{teacherProfile.name}</p>
              <p className="text-[11px] text-gray-500">Cabin: CS-304</p>
            </div>
          </div>
        </div>

        {/* Assigned Subjects Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-gray-900">Assigned Subjects & Teaching Faculty</h3>
              <p className="text-xs text-gray-500">6 core VTU curriculum subjects allocated for 5th Sem CSE-A</p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('teacher-management');
                setTeacherTab('assign');
              }}
              className="px-3 py-1.5 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <UserCheck size={14} /> Manage Assignments
            </button>
          </div>

          {/* Mobile Subject Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {subjects.map((s) => (
              <div key={s.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      {s.code}
                    </span>
                    <h4 className="font-bold text-gray-900 text-xs mt-1">{s.name}</h4>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-50">
                  <span>{s.credits} Credits • {s.type}</span>
                  <span className="font-semibold text-gray-800">
                    {s.assignedTeacherName || <span className="text-rose-500 font-semibold">Unassigned</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subject Code & Name</th>
                  <th className="py-3 px-4">Credits & Type</th>
                  <th className="py-3 px-4">Allocated Teacher</th>
                  <th className="py-3 px-4">Faculty Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-[10px] text-blue-600 font-bold">{s.code}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {s.credits} Credits • {s.type}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      {s.assignedTeacherName || <span className="text-rose-500 font-semibold">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {s.assignedTeacherName === 'Dr. K. Srinivas'
                        ? 'srinivas.k@rvce.edu.in'
                        : s.assignedTeacherName === 'Prof. Ananya Sharma'
                        ? 'ananya.sharma@rvce.edu.in'
                        : s.assignedTeacherName === 'Prof. Prakash Rao'
                        ? 'prakash.rao@rvce.edu.in'
                        : 'faculty@rvce.edu.in'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Progress
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class Representatives & Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-black text-gray-900">Class Representatives (CRs)</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Rahul Sharma (1RV22CS084)</p>
                  <p className="text-gray-500 text-[11px]">CR (Boys) • rahul.cs22@rvce.edu.in</p>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">CR-1</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Ananya Deshmukh (1RV22CS085)</p>
                  <p className="text-gray-500 text-[11px]">CR (Girls) • ananya.cs22@rvce.edu.in</p>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">CR-2</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-black text-gray-900">Class Information & Schedule</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• <strong>Working Days:</strong> Monday through Friday, 09:00 AM to 04:30 PM</p>
              <p>• <strong>Laboratory Sessions:</strong> Tuesday afternoon (CN Lab) & Thursday afternoon (DBMS Lab)</p>
              <p>• <strong>Mentorship Hour:</strong> Every Wednesday 03:30 PM - 04:30 PM in Room CS-302</p>
              <p>• <strong>CIE Evaluation Scheme:</strong> Best 2 of 3 Internal Assessments + Lab CIE + 2 Assignments</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. STUDENT MANAGEMENT (Grouped with Tabs)
  // =========================================================================
  if (currentPage === 'student-management' || currentPage === 'import-students') {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Student Management — 5th Sem CSE-A</h2>
            <p className="text-xs text-gray-500">Manage enrolled student rosters, handle join requests, and register new students.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudentTab('add')}
              className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} /> Add Student
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setStudentTab('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              studentTab === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Students ({classStudents.length})
          </button>
          <button
            onClick={() => setStudentTab('add')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              studentTab === 'add'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Add Student / CSV Import
          </button>
          <button
            onClick={() => setStudentTab('requests')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              studentTab === 'requests'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Student Join Requests
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: ALL STUDENTS */}
        {studentTab === 'all' && (
          <div className="space-y-4">
            {/* Search & Risk Filters */}
            <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-gray-500 text-[10px] sm:text-[11px] uppercase tracking-wider block sm:inline w-full sm:w-auto">Attendance:</span>
                {(['all', 'safe', 'warning', 'critical'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setStudentRiskFilter(risk)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold text-[10.5px] sm:text-[11px] capitalize transition-all ${
                      studentRiskFilter === risk
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {risk === 'all'
                      ? 'All'
                      : risk === 'safe'
                      ? 'Safe (>=80%)'
                      : risk === 'warning'
                      ? 'Warning (75-79%)'
                      : 'Critical (<75%)'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name or USN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
                <span className="text-gray-400 text-[11px] shrink-0 font-medium">
                  {filteredClassStudents.length} student{filteredClassStudents.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Students Roster (Mobile Cards + Desktop Table) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              {filteredClassStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs font-medium">
                  No students matched your search or filter.
                </div>
              ) : (
                <>
                  {/* Mobile Student Cards */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {filteredClassStudents.map((s) => (
                      <div key={s.id} className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                              {s.name.charAt(0)}
                            </div>
                            <div className="min-w-0 truncate">
                              <p className="font-bold text-xs text-gray-900 truncate">{s.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                              <span className="font-mono text-[10px] text-gray-600 font-semibold">{s.usn}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                s.overallAttendance < 75
                                  ? 'bg-rose-100 text-rose-800'
                                  : s.overallAttendance < 80
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {s.overallAttendance}%
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              {s.totalClassesAttended}/{s.totalClassesHeld}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] bg-gray-50 p-2 rounded-xl border border-gray-100">
                          <div>
                            <span className="text-gray-500">IA Avg: </span>
                            <strong className="text-gray-900 font-black">{s.avgIA}%</strong>
                          </div>
                          <div>
                            {s.alertsCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                                {s.alertsCount} Alert{s.alertsCount > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-medium text-[10px]">No alerts</span>
                            )}
                          </div>
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                              {s.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-0.5">
                          <button
                            onClick={() => setSelectedStudentDetail(s)}
                            className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Eye size={13} /> Profile
                          </button>
                          <button
                            onClick={() => setEditingStudent(s)}
                            className="px-3 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => setStudentToDelete(s)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove student"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Full Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Student</th>
                          <th className="py-3 px-4">USN</th>
                          <th className="py-3 px-4 text-center">Attendance %</th>
                          <th className="py-3 px-4 text-center">IA Average</th>
                          <th className="py-3 px-4 text-center">Active Alerts</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredClassStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/70">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                                  {s.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{s.name}</p>
                                  <p className="text-[10px] text-gray-400">{s.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-700">{s.usn}</td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`font-black ${
                                  s.overallAttendance < 75
                                    ? 'text-rose-600'
                                    : s.overallAttendance < 80
                                    ? 'text-amber-600'
                                    : 'text-emerald-600'
                                }`}
                              >
                                {s.overallAttendance}%
                              </span>
                              <span className="block text-[10px] text-gray-400 font-normal">
                                {s.totalClassesAttended}/{s.totalClassesHeld}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-black text-gray-900">{s.avgIA}%</td>
                            <td className="py-3.5 px-4 text-center">
                              {s.alertsCount > 0 ? (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                                  {s.alertsCount} Alert{s.alertsCount > 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-medium">None</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedStudentDetail(s)}
                                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg"
                                  title="View Academic Profile"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => setEditingStudent(s)}
                                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Edit Student"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => setStudentToDelete(s)}
                                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                  title="Remove from Classroom"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
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
        )}

        {/* TAB 2: ADD STUDENT & CSV IMPORT */}
        {studentTab === 'add' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct Add Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                <h3 className="text-sm font-black text-gray-900">Enroll New Student into CSE-5A</h3>
              </div>
              <p className="text-xs text-gray-500">
                Register an individual student directly into 5th Semester Section A.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addStudent(studentForm);
                  showToast(`Student ${studentForm.name} (${studentForm.usn}) enrolled successfully`, 'success');
                  setStudentForm({
                    ...studentForm,
                    name: '',
                    usn: '',
                    email: '',
                    phone: ''
                  });
                  setStudentTab('all');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="e.g. Vikram Raghavan"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">University USN *</label>
                    <input
                      type="text"
                      required
                      value={studentForm.usn}
                      onChange={(e) => setStudentForm({ ...studentForm, usn: e.target.value.toUpperCase() })}
                      placeholder="e.g. 1RV22CS095"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      placeholder="+91 98450 00000"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="student@rvce.edu.in"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Branch</label>
                    <input
                      type="text"
                      disabled
                      value="Computer Science & Engineering"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Assigned Class</label>
                    <input
                      type="text"
                      disabled
                      value="5th Sem CSE - Section A"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentTab('all')}
                    className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold shadow-xs"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>

            {/* CSV Import Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-purple-600" />
                <h3 className="text-sm font-black text-gray-900">Bulk CSV Roster Import</h3>
              </div>
              <p className="text-xs text-gray-500">
                Upload batch registration or VTU admission allotment CSV list.
              </p>

              <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-800 text-xs">Click or drag .csv or .xlsx roster file here</p>
                <p className="text-[11px] text-gray-400 mt-1">Columns: USN, Student Name, Email, Phone</p>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 space-y-1">
                <p className="font-bold">Sample CSV Format Preview:</p>
                <p className="font-mono text-[10px] text-gray-700">USN, Name, Email, Phone</p>
                <p className="font-mono text-[10px] text-gray-700">1RV22CS084, Rahul Sharma, rahul@rvce.edu.in, 9876543210</p>
                <p className="font-mono text-[10px] text-gray-700">1RV22CS085, Ananya Deshmukh, ananya@rvce.edu.in, 9876543211</p>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => showToast('Sample roster template downloaded', 'info')}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Download size={14} /> Download CSV Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Simulation: Verified 64 student records and synced to Section A', 'success');
                    setStudentTab('all');
                  }}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Simulate Batch Import
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT JOIN REQUESTS */}
        {studentTab === 'requests' && (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-500 text-[11px]">Filter by Status:</span>
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setRequestFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] capitalize transition-all ${
                      requestFilter === st
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'All Requests'
                      : st === 'pending'
                      ? `Pending (${pendingRequests.length})`
                      : st === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </button>
                ))}
              </div>
              <span className="text-gray-400 text-[11px]">
                Showing {filteredRequests.length} join request{filteredRequests.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  No join requests found for this filter.
                </div>
              ) : (
                <>
                  {/* Mobile Requests Cards */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {filteredRequests.map((req) => (
                      <div key={req.id} className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs truncate">{req.studentName}</h4>
                            <p className="text-[11px] text-gray-500 truncate">{req.email}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                                {req.usn}
                              </span>
                              <span className="text-[10px] text-gray-400">{req.branch} • Sem {req.semester}</span>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        {req.rejectionReason && (
                          <p className="text-[10px] text-rose-600 bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                            Reason: {req.rejectionReason}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                          <span className="text-gray-400">{req.requestDate}</span>
                          {req.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => approveStudentJoinRequest(req.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingRequestId(req.id);
                                  setRejectionReasonInput('');
                                }}
                                className="px-3 py-1 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium">Completed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Student Details</th>
                          <th className="py-3 px-4">USN & Branch</th>
                          <th className="py-3 px-4">Target Classroom</th>
                          <th className="py-3 px-4">Request Date</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-gray-50/70">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-gray-900">{req.studentName}</p>
                              <p className="text-[10px] text-gray-500">{req.email} • {req.phone}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-mono font-bold text-gray-900">{req.usn}</p>
                              <p className="text-[10px] text-gray-500">{req.branch} • Sem {req.semester}</p>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-gray-700">
                              {req.section}
                            </td>
                            <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                              {req.requestDate}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  req.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : req.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {req.status}
                              </span>
                              {req.rejectionReason && (
                                <p className="text-[10px] text-rose-600 mt-1 max-w-xs mx-auto truncate" title={req.rejectionReason}>
                                  {req.rejectionReason}
                                </p>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {req.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => approveStudentJoinRequest(req.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectingRequestId(req.id);
                                      setRejectionReasonInput('');
                                    }}
                                    className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-gray-400 font-medium">Completed</span>
                              )}
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
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. TEACHER MANAGEMENT (Grouped with Tabs)
  // =========================================================================
  if (currentPage === 'teacher-management' || currentPage === 'assign-teachers') {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Teacher Management — Subject Allotment</h2>
            <p className="text-xs text-gray-500">View teaching faculty, map teachers to 5th Sem CSE courses, and add new instructors.</p>
          </div>
          <button
            onClick={() => setIsAddTeacherOpen(true)}
            className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus size={15} /> Add Faculty Member
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setTeacherTab('view')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              teacherTab === 'view'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            View Teachers ({subjectTeachers.length})
          </button>
          <button
            onClick={() => setTeacherTab('assign')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              teacherTab === 'assign'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Assign Teachers to Subjects
          </button>
        </div>

        {/* TAB 1: VIEW TEACHERS */}
        {teacherTab === 'view' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center shrink-0">
                    {teacher.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{teacher.name}</h4>
                    <p className="text-[11px] text-gray-500">{teacher.department} • {teacher.collegeName}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-800">{teacher.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-semibold text-gray-800">{teacher.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Courses:</span>
                    <span className="font-bold text-blue-600">
                      {teacher.assignedSubjects && teacher.assignedSubjects.length > 0
                        ? teacher.assignedSubjects.map((s) => s.code).join(', ')
                        : (teacher as any).subjects && Array.isArray((teacher as any).subjects)
                        ? (teacher as any).subjects.join(', ')
                        : 'None assigned'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    Active Faculty
                  </span>
                  <button
                    onClick={() => {
                      setTeacherTab('assign');
                      setAssignTeacherName(teacher.name);
                    }}
                    className="text-blue-600 font-bold hover:underline text-[11px]"
                  >
                    Allot Course &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ASSIGN TEACHERS TO SUBJECTS */}
        {teacherTab === 'assign' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Course Allotment Table</h3>
                  <p className="text-xs text-gray-500">Map certified instructors to syllabus modules for 5th Sem Section A</p>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus size={15} /> Allot Faculty
                </button>
              </div>

              {/* Mobile Course Allotment Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {subjects.map((sub) => (
                  <div key={sub.id} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {sub.code}
                        </span>
                        <h4 className="font-bold text-gray-900 text-xs mt-1">{sub.name}</h4>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] text-gray-400">{sub.credits} Credits • {sub.type}</p>
                        <p className="font-semibold text-gray-800 mt-0.5">
                          {sub.assignedTeacherName || <span className="text-rose-500 font-semibold">Unassigned</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAssignSubjectCode(sub.code);
                          setIsAssignModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Allotment Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Subject Code & Course</th>
                      <th className="py-3 px-4">Credits & Scheme</th>
                      <th className="py-3 px-4">Allocated Faculty</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {subjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/70">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900">{sub.name}</p>
                          <p className="text-[10px] text-blue-600 font-bold">{sub.code}</p>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {sub.credits} Credits • {sub.type}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800">
                          {sub.assignedTeacherName || <span className="text-rose-500 font-semibold">Unassigned</span>}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setAssignSubjectCode(sub.code);
                              setIsAssignModalOpen(true);
                            }}
                            className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Change Faculty
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 5. ACADEMIC MANAGEMENT (Grouped Attendance, IA Marks, Assignments)
  // =========================================================================
  if (
    currentPage === 'academic-management' ||
    currentPage === 'attendance-overview' ||
    currentPage === 'ia-overview' ||
    currentPage === 'assignments-overview'
  ) {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Academic Management — 5th Sem CSE-A</h2>
            <p className="text-xs text-gray-500">Monitor class attendance, internal assessment CIE performance, and assignment coursework.</p>
          </div>
          {academicTab === 'assignments' && (
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} /> Create Assignment Notice
            </button>
          )}
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setAcademicTab('attendance')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              academicTab === 'attendance'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarCheck size={14} /> Attendance Management
          </button>
          <button
            onClick={() => setAcademicTab('ia')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              academicTab === 'ia'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award size={14} /> Internal Assessment (IA) Marks
          </button>
          <button
            onClick={() => setAcademicTab('assignments')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              academicTab === 'assignments'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ClipboardList size={14} /> Assignments & Deadlines
          </button>
        </div>

        {/* TAB 1: ATTENDANCE MANAGEMENT */}
        {academicTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Subject-wise Attendance Distribution</h3>
                  <p className="text-xs text-gray-500">Live lecture attendance stats across all subjects for Section A</p>
                </div>
                <button
                  onClick={() => showToast('Attendance register exported in VTU compliance format', 'success')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download size={14} /> Export Register
                </button>
              </div>

              {/* Mobile Subject Attendance Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {[
                  { code: '21CS51', name: 'Management & Entrepreneurship', teacher: 'Prof. Mohan K.', sessions: 32, avg: '88.5%', count: 2 },
                  { code: '21CS52', name: 'Computer Networks', teacher: 'Prof. Ananya Sharma', sessions: 35, avg: '76.2%', count: 6 },
                  { code: '21CS53', name: 'Database Management Systems', teacher: 'Dr. K. Srinivas', sessions: 36, avg: '83.4%', count: 3 },
                  { code: '21CS54', name: 'Theory of Computation', teacher: 'Prof. Prakash Rao', sessions: 34, avg: '78.0%', count: 5 },
                  { code: '21CSL57', name: 'Computer Networks Lab', teacher: 'Prof. Ananya Sharma', sessions: 24, avg: '91.2%', count: 1 },
                  { code: '21CSL58', name: 'DBMS Lab with Mini Project', teacher: 'Dr. K. Srinivas', sessions: 23, avg: '87.0%', count: 2 }
                ].map((row, i) => (
                  <div key={i} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {row.code}
                        </span>
                        <h4 className="font-bold text-gray-900 text-xs mt-1">{row.name}</h4>
                        <p className="text-[11px] text-gray-500">{row.teacher}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-gray-900">{row.avg}</span>
                        <p className="text-[10px] text-gray-400 font-medium">{row.sessions} sessions</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-gray-50">
                      <span className="text-gray-500">Shortage (&lt;75%):</span>
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[10px]">
                        {row.count} Students
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Subject Teacher</th>
                      <th className="py-3 px-4 text-center">Sessions Held</th>
                      <th className="py-3 px-4 text-center">Class Avg %</th>
                      <th className="py-3 px-4 text-center">Shortage (&lt;75%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {[
                      { code: '21CS51', name: 'Management & Entrepreneurship', teacher: 'Prof. Mohan K.', sessions: 32, avg: '88.5%', count: 2 },
                      { code: '21CS52', name: 'Computer Networks', teacher: 'Prof. Ananya Sharma', sessions: 35, avg: '76.2%', count: 6 },
                      { code: '21CS53', name: 'Database Management Systems', teacher: 'Dr. K. Srinivas', sessions: 36, avg: '83.4%', count: 3 },
                      { code: '21CS54', name: 'Theory of Computation', teacher: 'Prof. Prakash Rao', sessions: 34, avg: '78.0%', count: 5 },
                      { code: '21CSL57', name: 'Computer Networks Lab', teacher: 'Prof. Ananya Sharma', sessions: 24, avg: '91.2%', count: 1 },
                      { code: '21CSL58', name: 'DBMS Lab with Mini Project', teacher: 'Dr. K. Srinivas', sessions: 23, avg: '87.0%', count: 2 }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/70">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900">{row.name}</p>
                          <p className="text-[10px] text-blue-600 font-bold">{row.code}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{row.teacher}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-gray-700">{row.sessions}</td>
                        <td className="py-3.5 px-4 text-center font-black text-gray-900">{row.avg}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            {row.count} Students
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Attendance Watch-List */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">Attendance Shortage Watch-List (&lt; 75%)</h4>
                  <p className="text-xs text-gray-500">Students at risk of VTU examination detention</p>
                </div>
                <button
                  onClick={() => showToast('Dispatched shortage intimations to parent SMS/email portals', 'success')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Send Parent Warning Letters
                </button>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {classStudents.filter(s => s.overallAttendance < 75).map(s => (
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{s.name} ({s.usn})</p>
                      <p className="text-gray-500 text-[11px]">{s.totalClassesAttended} attended of {s.totalClassesHeld} total sessions held</p>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-600 font-black text-sm">{s.overallAttendance}%</span>
                      <p className="text-[10px] text-rose-500 font-bold uppercase">Severe Shortage</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERNAL ASSESSMENT (IA) MARKS */}
        {academicTab === 'ia' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { subject: 'Computer Networks', code: '21CS52', ia1Score: 23.4, ia2Score: 21.8, passRate: '92%' },
                { subject: 'Database Management Systems', code: '21CS53', ia1Score: 24.8, ia2Score: 25.2, passRate: '96%' },
                { subject: 'Theory of Computation', code: '21CS54', ia1Score: 21.0, ia2Score: 20.4, passRate: '88%' }
              ].map((item, i) => {
                const subCfg = getSubjectConfig(item.code);
                return (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600">{item.code}</span>
                      <span className="text-[10px] font-bold text-gray-500">Max {subCfg.iaMaxMarks} Marks</span>
                    </div>
                    <h3 className="text-sm font-black text-gray-900 mt-0.5 mb-3">{item.subject}</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">IA-1 Average:</span>
                        <span className="font-bold text-gray-800">{item.ia1Score} / {subCfg.iaMaxMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">IA-2 Average:</span>
                        <span className="font-bold text-gray-800">{item.ia2Score} / {subCfg.iaMaxMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Passing Threshold:</span>
                        <span className="font-bold text-gray-700">{subCfg.passingMarksPercent}% ({Math.round(subCfg.iaMaxMarks * (subCfg.passingMarksPercent / 100))}m)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pass Rate:</span>
                        <span className="font-black text-emerald-600">{item.passRate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Continuous Evaluation Performance Ledger</h3>
                  <p className="text-xs text-gray-500">Summary of student averages across all Continuous Internal Evaluation (CIE) components</p>
                </div>
                <button
                  onClick={() => showToast('CIE Ledger exported in university Excel format', 'success')}
                  className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Download CIE Sheet
                </button>
              </div>

              {/* Mobile CIE Ledger Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {classStudents.slice(0, 8).map((s) => (
                  <div key={s.id} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{s.name}</h4>
                        <span className="font-mono text-[10px] text-gray-500">{s.usn}</span>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          s.avgIA >= 80
                            ? 'bg-emerald-50 text-emerald-700'
                            : s.avgIA >= 60
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {s.avgIA >= 80 ? 'Distinction' : s.avgIA >= 60 ? 'First Class' : 'Remedial Needed'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-gray-50">
                      <div className="bg-gray-50 p-1.5 rounded-lg">
                        <span className="text-[9px] text-gray-400 block font-bold">IA-1</span>
                        <span className="font-bold text-gray-800">24/30</span>
                      </div>
                      <div className="bg-gray-50 p-1.5 rounded-lg">
                        <span className="text-[9px] text-gray-400 block font-bold">IA-2</span>
                        <span className="font-bold text-gray-800">23/30</span>
                      </div>
                      <div className="bg-blue-50/60 p-1.5 rounded-lg">
                        <span className="text-[9px] text-blue-600 block font-bold">CIE %</span>
                        <span className="font-black text-blue-700">{s.avgIA}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop CIE Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4 text-center">IA-1 (Avg)</th>
                      <th className="py-3 px-4 text-center">IA-2 (Avg)</th>
                      <th className="py-3 px-4 text-center">Total CIE %</th>
                      <th className="py-3 px-4 text-center">CIE Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {classStudents.slice(0, 8).map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/70">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{s.name}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">{s.usn}</td>
                        <td className="py-3.5 px-4 text-center font-semibold">24 / 30</td>
                        <td className="py-3.5 px-4 text-center font-semibold">23 / 30</td>
                        <td className="py-3.5 px-4 text-center font-black text-blue-600">{s.avgIA}%</td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.avgIA >= 80
                                ? 'bg-emerald-50 text-emerald-700'
                                : s.avgIA >= 60
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {s.avgIA >= 80 ? 'Distinction' : s.avgIA >= 60 ? 'First Class' : 'Remedial Needed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS & DEADLINES */}
        {academicTab === 'assignments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {asg.subjectCode}
                      </span>
                      <h4 className="text-sm font-black text-gray-900">{asg.title}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded-full ${
                          asg.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 max-w-xl">{asg.description}</p>
                    <p className="text-[11px] text-gray-400">
                      Due: <strong>{asg.dueDate}</strong> • Faculty: {asg.teacherName} • Max Marks: {asg.maxMarks}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-gray-900">
                      {asg.submissionsCount} / {asg.totalStudents}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Submissions Received</p>
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{
                          width: `${Math.round((asg.submissionsCount / asg.totalStudents) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }



  // =========================================================================
  // 7. SETTINGS & ACADEMIC CONFIGURATION
  // =========================================================================
  if (currentPage === 'settings' || currentPage === 'profile') {
    // 5th Sem CSE Section A Subjects list for coordinator configuration
    const classroomSubjectsList = [
      { code: '21CS51', name: 'Management & Entrepreneurship', type: 'Theory', credits: 3, faculty: 'Prof. Priya N', room: 'CS-302' },
      { code: '21CS52', name: 'Computer Networks', type: 'Theory', credits: 3, faculty: 'Prof. Ananya Sharma', room: 'CS-302' },
      { code: '21CS53', name: 'Database Management Systems', type: 'Theory', credits: 4, faculty: 'Dr. Ramesh Babu', room: 'CS-302' },
      { code: '21CS54', name: 'Theory of Computation', type: 'Theory', credits: 3, faculty: 'Dr. K. Srinivas', room: 'CS-302' },
      { code: '21CSL57', name: 'Computer Networks Laboratory', type: 'Lab', credits: 2, faculty: 'Prof. Ananya Sharma', room: 'CS-204 (Net Lab)' },
      { code: '21CSL58', name: 'DBMS Laboratory with Mini Project', type: 'Lab', credits: 2, faculty: 'Dr. Ramesh Babu', room: 'CS-205 (DB Lab)' }
    ];

    const currentSubjectMeta = classroomSubjectsList.find(s => s.code === activeConfigSubjectCode) || classroomSubjectsList[1];

    const handleSaveConfig = () => {
      updateSubjectConfig(activeConfigSubjectCode, {
        ...configForm,
        lastUpdatedBy: teacherProfile.name,
        lastUpdatedAt: 'Just now'
      });
      logActivity(
        'Academic Configuration Updated',
        teacherProfile.name,
        'Class Teacher',
        `Configured ${activeConfigSubjectCode} (${configForm.subjectName}) for 5th Sem CSE-A: IA Max=${configForm.iaMaxMarks}, Pass=${configForm.passingMarksPercent}%, Attendance=${configForm.attendanceShortageThreshold}%`
      );
      showToast(`Saved academic configuration for ${activeConfigSubjectCode} (${configForm.subjectName})`, 'success');
    };

    const handleResetConfig = () => {
      resetSubjectConfig(activeConfigSubjectCode);
      const standardCfg = getSubjectConfig(activeConfigSubjectCode);
      setConfigForm(standardCfg);
      logActivity(
        'Academic Configuration Reset',
        teacherProfile.name,
        'Class Teacher',
        `Reset ${activeConfigSubjectCode} configuration to standard VTU 2021 guidelines`
      );
      showToast(`Reset ${activeConfigSubjectCode} to VTU 2021 CBCS standard configuration`, 'info');
    };

    return (
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                  5th Sem CSE — Section A
                </span>
                <span className="text-xs font-bold text-gray-500">Class Coordinator Academic Workspace</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mt-1">
                Class Teacher Settings & Academic Configuration
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure classroom assessment schemes, IA & assignment maximum marks, passing rules, attendance thresholds, and coordinator profile.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Shield size={14} /> Coordinator Authority Active
              </span>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={() => setSettingsTab('academic-config')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                settingsTab === 'academic-config'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sliders size={14} /> Academic Configuration
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${settingsTab === 'academic-config' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                6 Subjects
              </span>
            </button>

            <button
              onClick={() => setSettingsTab('profile')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                settingsTab === 'profile'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={14} /> Profile & Classroom Subjects
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: ACADEMIC CONFIGURATION (Class Coordinator Classroom Subjects)
            ========================================================================= */}
        {settingsTab === 'academic-config' && (
          <div className="space-y-6">
            {/* Subject Selector Bar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Select Classroom Subject to Configure</h3>
                  <p className="text-xs text-gray-500">
                    As Class Teacher, you can configure grading rules, IA weightages, and deadlines for any subject in Section A.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  VTU 2021 CBCS Scheme
                </span>
              </div>

              {/* Subject Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {classroomSubjectsList.map(sub => {
                  const isSelected = activeConfigSubjectCode === sub.code;
                  const cfg = getSubjectConfig(sub.code);
                  return (
                    <button
                      key={sub.code}
                      onClick={() => setActiveConfigSubjectCode(sub.code)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span className="font-mono">{sub.code}</span>
                      <span className="line-clamp-1">{sub.name}</span>
                      <span
                        className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {cfg.iaMaxMarks}m
                      </span>
                      {cfg.isLocked ? (
                        <Lock size={11} className={isSelected ? 'text-blue-200' : 'text-amber-500'} />
                      ) : (
                        <Unlock size={11} className={isSelected ? 'text-blue-200' : 'text-gray-400'} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Subject Configuration Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              {/* Active Subject Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono bg-blue-600 text-white px-2 py-0.5 rounded">
                      {configForm.subjectCode}
                    </span>
                    <span className="text-xs font-bold text-blue-900">{configForm.subjectName}</span>
                    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {currentSubjectMeta.type} • {currentSubjectMeta.credits} Credits
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Faculty In-Charge: <strong className="text-gray-900">{currentSubjectMeta.faculty}</strong> • Room: {currentSubjectMeta.room}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                      configForm.isLocked
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {configForm.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    {configForm.isLocked ? 'Marks Locked' : 'Ledger Editable'}
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* 1. IA Test Configuration */}
                <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
                    <Award size={15} className="text-blue-600" />
                    <h4 className="font-bold text-gray-900 text-sm">Internal Assessment (IA) Rules</h4>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      IA Maximum Marks per Test
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={configForm.iaMaxMarks}
                        onChange={e => setConfigForm({ ...configForm, iaMaxMarks: Number(e.target.value) })}
                        className="w-24 px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <span className="text-gray-500 font-medium">Marks per assessment test</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      VTU standard: 30 marks for theory courses, 50 marks for laboratory continuous tests.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Number of Scheduled IA Tests
                    </label>
                    <select
                      value={configForm.numberOfIATests}
                      onChange={e => setConfigForm({ ...configForm, numberOfIATests: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value={2}>2 IA Tests (VTU Standard — Average computed)</option>
                      <option value={3}>3 IA Tests (Best of 2 averaged)</option>
                      <option value={1}>1 Comprehensive Continuous Test (Lab)</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
                    <span className="font-bold text-gray-700">Scheme: </span>
                    Continuous Internal Evaluation (CIE) with marks entered directly by {currentSubjectMeta.faculty}.
                  </div>
                </div>

                {/* 2. Assignment & Criteria Configuration */}
                <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
                    <FileText size={15} className="text-purple-600" />
                    <h4 className="font-bold text-gray-900 text-sm">Assignment & Continuous Evaluation</h4>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Assignment Maximum Marks
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={configForm.assignmentMaxMarks}
                        onChange={e => setConfigForm({ ...configForm, assignmentMaxMarks: Number(e.target.value) })}
                        className="w-24 px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <span className="text-gray-500 font-medium">Marks per continuous assignment</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Assessment Criteria & Rubric
                    </label>
                    <textarea
                      rows={2}
                      value={configForm.assessmentCriteria}
                      onChange={e => setConfigForm({ ...configForm, assessmentCriteria: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    />
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Grading rubric shared with faculty and students for CIE transparency.
                    </p>
                  </div>
                </div>

                {/* 3. Passing Marks & Attendance Shortage Threshold */}
                <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
                    <Shield size={15} className="text-emerald-600" />
                    <h4 className="font-bold text-gray-900 text-sm">Passing Marks & Attendance Rules</h4>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Minimum Passing Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={30}
                        max={75}
                        value={configForm.passingMarksPercent}
                        onChange={e => setConfigForm({ ...configForm, passingMarksPercent: Number(e.target.value) })}
                        className="w-24 px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <span className="text-gray-500 font-medium">%</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                        Pass: {Math.round(configForm.iaMaxMarks * (configForm.passingMarksPercent / 100))} / {configForm.iaMaxMarks} marks
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Attendance Shortage Threshold
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={60}
                        max={90}
                        value={configForm.attendanceShortageThreshold}
                        onChange={e => setConfigForm({ ...configForm, attendanceShortageThreshold: Number(e.target.value) })}
                        className="w-24 px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <span className="text-gray-500 font-medium">% (VTU statutory minimum 75%)</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Students below {configForm.attendanceShortageThreshold}% in {configForm.subjectCode} trigger automatic NSAR alerts.
                    </p>
                  </div>

                  {/* Grading Scale Preview */}
                  <div className="p-2.5 bg-white rounded-lg border border-gray-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Grading Scale Rule:</span>
                    <div className="grid grid-cols-4 gap-1 text-[10.5px] font-bold text-center">
                      <span className="p-1 bg-emerald-50 text-emerald-800 rounded">O: ≥ 85%</span>
                      <span className="p-1 bg-blue-50 text-blue-800 rounded">A+: 70-84%</span>
                      <span className="p-1 bg-amber-50 text-amber-800 rounded">B: {configForm.passingMarksPercent}-69%</span>
                      <span className="p-1 bg-rose-50 text-rose-800 rounded">F: &lt; {configForm.passingMarksPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* 4. Marks Entry Deadlines & Permissions */}
                <div className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
                    <Clock size={15} className="text-amber-600" />
                    <h4 className="font-bold text-gray-900 text-sm">Marks Entry Deadlines & Permissions</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">IA Entry Deadline</label>
                      <input
                        type="date"
                        value={configForm.iaDeadline}
                        onChange={e => setConfigForm({ ...configForm, iaDeadline: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Assignment Deadline</label>
                      <input
                        type="date"
                        value={configForm.assignmentDeadline}
                        onChange={e => setConfigForm({ ...configForm, assignmentDeadline: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-200/60">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.isLocked}
                        onChange={e => setConfigForm({ ...configForm, isLocked: e.target.checked })}
                        className="rounded text-black focus:ring-0"
                      />
                      <span className="font-bold text-gray-900">
                        Lock Marks Ledger for this Subject
                      </span>
                    </label>
                    <p className="text-[11px] text-gray-500 pl-6">
                      When locked, subject teachers cannot alter entered marks without class coordinator approval.
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={configForm.allowEditAfterLock}
                        onChange={e => setConfigForm({ ...configForm, allowEditAfterLock: e.target.checked })}
                        className="rounded text-black focus:ring-0"
                      />
                      <span className="font-bold text-gray-900">
                        Allow Faculty Correction Requests After Lockdown
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={14} /> Reset {configForm.subjectCode} to VTU Standard
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="w-full sm:w-auto px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Save size={14} /> Save Configuration for {configForm.subjectCode}
                  </button>
                </div>
              </div>
            </div>

            {/* Classroom Subjects Assessment Matrix (Summary of all 6 subjects) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Section A Assessment Configuration Matrix</h3>
                  <p className="text-xs text-gray-500">
                    Consolidated view of all 6 courses configured for 5th Sem CSE - Section A.
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-500">6 of 6 Courses Active</span>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Subject</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Faculty In-Charge</th>
                      <th className="py-3 px-3 text-center">IA Max Marks</th>
                      <th className="py-3 px-3 text-center">Tests</th>
                      <th className="py-3 px-3 text-center">Asg Max</th>
                      <th className="py-3 px-3 text-center">Pass %</th>
                      <th className="py-3 px-3 text-center">Att. Min</th>
                      <th className="py-3 px-3 text-center">Ledger Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {classroomSubjectsList.map(sub => {
                      const cfg = getSubjectConfig(sub.code);
                      const isCurrent = activeConfigSubjectCode === sub.code;
                      return (
                        <tr key={sub.code} className={isCurrent ? 'bg-blue-50/40 font-semibold' : 'hover:bg-gray-50/70'}>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-gray-900">{sub.code}</span>
                            <div className="text-[11px] text-gray-600 line-clamp-1">{sub.name}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.type === 'Lab' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                              {sub.type}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-700 font-medium">{sub.faculty}</td>
                          <td className="py-3 px-3 text-center font-bold text-gray-900">{cfg.iaMaxMarks}m</td>
                          <td className="py-3 px-3 text-center">{cfg.numberOfIATests}</td>
                          <td className="py-3 px-3 text-center font-bold text-gray-900">{cfg.assignmentMaxMarks}m</td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700">{cfg.passingMarksPercent}%</td>
                          <td className="py-3 px-3 text-center font-bold text-blue-700">{cfg.attendanceShortageThreshold}%</td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                cfg.isLocked ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {cfg.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                              {cfg.isLocked ? 'Locked' : 'Open'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setActiveConfigSubjectCode(sub.code);
                                window.scrollTo({ top: 120, behavior: 'smooth' });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                isCurrent
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              {isCurrent ? 'Editing' : 'Configure'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ACADEMIC PROFILE & ASSIGNED SUBJECTS
            ========================================================================= */}
        {settingsTab === 'profile' && (
          <div className="space-y-6">
            {/* Faculty Coordinator Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                  KS
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900">{teacherProfile.name}</h3>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-bold">
                      Class Coordinator
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{teacherProfile.designation}</p>
                  <p className="text-xs font-bold text-gray-700">
                    Department of Computer Science & Engineering • Cabin {teacherProfile.cabin}
                  </p>
                </div>
              </div>

              {/* Editable Coordinator Details Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  logActivity('Profile Updated', teacherProfile.name, 'Class Teacher', 'Updated faculty contact details');
                  showToast('Class Teacher coordinator profile updated successfully', 'success');
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Faculty Name</label>
                    <input
                      type="text"
                      value={teacherProfile.name}
                      onChange={(e) => setTeacherProfile({ ...teacherProfile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Faculty ID (Fixed)</label>
                    <input
                      type="text"
                      disabled
                      value={teacherProfile.employeeId}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={teacherProfile.email}
                      onChange={(e) => setTeacherProfile({ ...teacherProfile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={teacherProfile.phone}
                      onChange={(e) => setTeacherProfile({ ...teacherProfile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Cabin Location</label>
                    <input
                      type="text"
                      value={teacherProfile.cabin}
                      onChange={(e) => setTeacherProfile({ ...teacherProfile, cabin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Office Counseling Hours</label>
                    <input
                      type="text"
                      value={teacherProfile.officeHours}
                      onChange={(e) => setTeacherProfile({ ...teacherProfile, officeHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Assigned Classroom & Subjects Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Assigned Classroom & Curriculum Roster</h3>
                  <p className="text-xs text-gray-500">
                    Coordinator jurisdiction covers all students and courses in 5th Sem CSE - Section A.
                  </p>
                </div>
                <span className="font-mono text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">
                  42 Active Students Enrolled
                </span>
              </div>

              {/* Subjects in Section A */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {classroomSubjectsList.map((sub) => {
                  const cfg = getSubjectConfig(sub.code);
                  return (
                    <div key={sub.code} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="font-mono text-[11px] font-black text-blue-600">{sub.code}</span>
                          <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{sub.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${sub.type === 'Lab' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {sub.type}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-gray-600 pt-1 border-t border-gray-200/60">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Teacher:</span>
                          <span className="font-bold text-gray-900">{sub.faculty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Credits / Room:</span>
                          <span className="font-medium text-gray-700">{sub.credits} Cr • {sub.room}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Assessment:</span>
                          <span className="font-bold text-emerald-700">IA Max {cfg.iaMaxMarks}m • Pass {cfg.passingMarksPercent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Account Session & Sign Out Card */}
        <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <LogOut size={16} />
              </span>
              <h4 className="text-sm font-bold text-gray-900">Account Session & Logout</h4>
            </div>
            <p className="text-xs text-gray-500 max-w-xl">
              Sign out of the Academio Class Teacher workspace on this device. You will need to re-authenticate with your faculty credentials to manage student rosters, attendance ledgers, and parent intimations.
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
  }

  // =========================================================================
  // MODALS (Shared across views)
  // =========================================================================
  return (
    <div>
      {/* View Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                  {selectedStudentDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{selectedStudentDetail.name}</h3>
                  <p className="text-xs text-blue-600 font-bold">{selectedStudentDetail.usn} • {selectedStudentDetail.className}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Attendance</span>
                  <p className={`text-base font-black ${selectedStudentDetail.overallAttendance < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedStudentDetail.overallAttendance}%
                  </p>
                  <p className="text-[10px] text-gray-500">{selectedStudentDetail.totalClassesAttended} of {selectedStudentDetail.totalClassesHeld} classes</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase">IA Performance</span>
                  <p className="text-base font-black text-blue-600">{selectedStudentDetail.avgIA}%</p>
                  <p className="text-[10px] text-gray-500">Continuous Assessment Average</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Subject Attendance Breakdown (Demonstration)</h4>
                <div className="space-y-1.5">
                  {subjects.map((sub, i) => (
                    <div key={sub.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50/70 border border-gray-100 text-[11px]">
                      <div>
                        <span className="font-bold text-gray-800">{sub.name}</span>
                        <span className="text-gray-400 ml-1">({sub.code})</span>
                      </div>
                      <span className={`font-black ${i === 1 && selectedStudentDetail.usn === '1RV22CS084' ? 'text-rose-600' : 'text-gray-800'}`}>
                        {i === 1 && selectedStudentDetail.usn === '1RV22CS084' ? '71.4% (Shortage)' : '84.0%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  showToast(`Parent counseling intimation dispatched for ${selectedStudentDetail.name}`, 'info');
                  setSelectedStudentDetail(null);
                }}
                className="px-3.5 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs hover:bg-rose-100"
              >
                Send Parent Notice
              </button>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-1.5 bg-black text-white font-bold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Edit Student Details</h3>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStudent(editingStudent);
                showToast(`Student record for ${editingStudent.name} updated`, 'success');
                setEditingStudent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">USN</label>
                <input
                  type="text"
                  required
                  value={editingStudent.usn}
                  onChange={(e) => setEditingStudent({ ...editingStudent, usn: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-black text-gray-900">Remove Student from Section A?</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> ({studentToDelete.usn}) from the 5th Sem CSE-A roster?
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 border border-gray-200 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudent(studentToDelete.id);
                  showToast(`Removed ${studentToDelete.name} from classroom`, 'info');
                  setStudentToDelete(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Join Request Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <h3 className="text-sm font-black text-gray-900 mb-2">Specify Reason for Rejection</h3>
            <p className="text-xs text-gray-500 mb-3">
              Please enter the reason for rejecting this student join request (e.g., incorrect branch or mismatched section).
            </p>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Student belongs to Section B / Branch mismatch"
              className="w-full p-2.5 border border-gray-200 rounded-xl text-xs mb-3 focus:outline-none focus:border-black"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectingRequestId(null)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectStudentJoinRequest(rejectingRequestId, rejectionReasonInput || 'Verification criteria not satisfied');
                  setRejectingRequestId(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <h3 className="text-sm font-black text-gray-900 mb-3">Allot Faculty to Course</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject</label>
                <select
                  value={assignSubjectCode}
                  onChange={(e) => setAssignSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-bold"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Qualified Faculty</label>
                <select
                  value={assignTeacherName}
                  onChange={(e) => setAssignTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-bold"
                >
                  {subjectTeachers.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    assignTeacherToSubject(assignSubjectCode, 'cls-1', assignTeacherName);
                    showToast(`Assigned ${assignTeacherName} to ${assignSubjectCode}`, 'success');
                    setIsAssignModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Confirm Allotment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Add Faculty Member</h3>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSubjectTeacher({
                  name: newTeacherForm.name,
                  email: newTeacherForm.email,
                  phone: newTeacherForm.phone,
                  collegeId: 'col-1',
                  collegeName: 'RV College of Engineering',
                  department: newTeacherForm.department,
                  subjects: ['21CS52 - Computer Networks']
                });
                showToast(`Faculty member ${newTeacherForm.name} registered`, 'success');
                setIsAddTeacherOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Babu"
                  value={newTeacherForm.name}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh.cs@rvce.edu.in"
                  value={newTeacherForm.email}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={newTeacherForm.phone}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Register Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {isNewAssignmentOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Create Assignment Notice</h3>
              <button onClick={() => setIsNewAssignmentOpen(false)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAssignment({
                  title: newAssignmentForm.title,
                  subjectCode: newAssignmentForm.subjectCode,
                  subjectName: newAssignmentForm.subjectName,
                  teacherName: newAssignmentForm.teacherName,
                  collegeId: 'col-1',
                  classId: 'cls-1',
                  className: '5th Sem CSE - Section A',
                  assignedDate: new Date().toISOString().split('T')[0],
                  dueDate: newAssignmentForm.dueDate,
                  maxMarks: Number(newAssignmentForm.maxMarks),
                  description: newAssignmentForm.description,
                  submissionsCount: 0,
                  totalStudents: classStudents.length,
                  status: 'active'
                });
                setIsNewAssignmentOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireshark Packet Analysis Lab Report"
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
                  <select
                    value={newAssignmentForm.subjectCode}
                    onChange={(e) => {
                      const sub = subjects.find(s => s.code === e.target.value);
                      setNewAssignmentForm({
                        ...newAssignmentForm,
                        subjectCode: e.target.value,
                        subjectName: sub ? sub.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-semibold"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAssignmentForm.dueDate}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Instructions for students regarding submission guidelines..."
                  value={newAssignmentForm.description}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Resolve Alert Counseling Dialog */}
      {resolvingAlert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in">
            <h3 className="text-sm font-black text-gray-900 mb-2">Remediate & Resolve Early Alert</h3>
            <p className="text-xs text-gray-500 mb-3">
              Student: <strong>{resolvingAlert.studentName}</strong> ({resolvingAlert.studentUsn})
            </p>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs mb-3 space-y-1">
              <p className="font-bold text-gray-800">{resolvingAlert.title}</p>
              <p className="text-gray-600">{resolvingAlert.reason}</p>
              <p className="text-blue-700 font-semibold">Recommended: {resolvingAlert.recommendedAction}</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 text-xs mb-1">Class Teacher Mentoring Notes</label>
              <textarea
                rows={3}
                value={counselingNotes}
                onChange={(e) => setCounselingNotes(e.target.value)}
                placeholder="e.g. Conducted counseling session; agreed on remedial attendance recovery plan..."
                className="w-full p-2.5 border border-gray-200 rounded-xl text-xs mb-3 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setResolvingAlert(null)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveAlert(resolvingAlert.id);
                  showToast(`Alert for ${resolvingAlert.studentName} marked as resolved`, 'success');
                  setResolvingAlert(null);
                }}
                className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
              >
                Complete & Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your session as <span className="font-semibold text-gray-800">Class Teacher (Prof. Rajesh Kulkarni - CSE 5th Sem &apos;A&apos;)</span>? You will need your faculty credentials to sign back in.
            </p>
            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    showToast('Logged out of Academio Class Teacher session', 'info');
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <LogOut size={13} />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Download,
  Check,
  X,
  Lock,
  Unlock,
  Shield,
  Key,
  Layers,
  ChevronRight,
  LogOut,
  Sliders,
  User,
  FolderTree,
  AlertTriangle,
  RotateCcw,
  Save,
  FileText,
  Calendar,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Student, CorrectionRequest } from '../../../types/academic';

type MainSection =
  | 'dashboard'
  | 'my-classes-subjects'
  | 'academic-management'
  | 'settings';

interface TeacherViewsProps {
  onLogout?: () => void;
}

export const TeacherViews: React.FC<TeacherViewsProps> = ({ onLogout }) => {
  const {
    currentPage,
    setCurrentPage,
    students,
    alerts,
    correctionRequests,
    resolveCorrectionRequest,
    showToast,
    logActivity,
    searchTerm,
    setSearchTerm,
    subjectConfigs,
    getSubjectConfig,
    updateSubjectConfig,
    resetSubjectConfig
  } = useApp();

  // Subject Teacher Scope: Prof. Ananya Sharma (Computer Networks 21CS52 & Networks Lab 21CSL57 for 5th Sem CSE-A & B)
  const teacherName = 'Prof. Ananya Sharma';
  const facultyId = 'RVCE-FAC-048';
  const department = 'Department of Computer Science & Engineering';
  const collegeName = 'R.V. College of Engineering (RVCE), Bengaluru';

  const assignedSubjects = [
    {
      code: '21CS52',
      name: 'Computer Networks',
      classId: 'cls-1',
      className: '5th Sem CSE - Section A',
      credits: 4,
      studentsCount: 64
    },
    {
      code: '21CS52',
      name: 'Computer Networks',
      classId: 'cls-2',
      className: '5th Sem CSE - Section B',
      credits: 4,
      studentsCount: 62
    },
    {
      code: '21CSL57',
      name: 'Computer Networks Laboratory',
      classId: 'cls-1',
      className: '5th Sem CSE - Section A',
      credits: 2,
      studentsCount: 64
    }
  ];

  // Active Subject Selection
  const [selectedSubject, setSelectedSubject] = useState(assignedSubjects[0]);

  // Tab State for Grouped Menus
  const [classesSubjectsTab, setClassesSubjectsTab] = useState<'classes' | 'directory'>('classes');
  const [academicMgmtTab, setAcademicMgmtTab] = useState<'attendance' | 'ia-marks' | 'assignment-marks' | 'corrections'>('attendance');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Guard against deleted routes and sync valid internal tabs
  useEffect(() => {
    if (['academic-insights', 'insights', 'communication', 'announcements', 'notifications', 'syllabus', 'allotment'].includes(currentPage)) {
      setCurrentPage('dashboard');
    } else if (currentPage === 'student-directory') {
      setClassesSubjectsTab('directory');
    } else if (currentPage === 'attendance') {
      setAcademicMgmtTab('attendance');
    } else if (currentPage === 'ia-marks') {
      setAcademicMgmtTab('ia-marks');
    } else if (currentPage === 'assignments' || currentPage === 'assignment-marks') {
      setAcademicMgmtTab('assignment-marks');
    } else if (currentPage === 'correction-requests') {
      setAcademicMgmtTab('corrections');
    }
  }, [currentPage, setCurrentPage]);

  // Filtered items based on teacher's subjects
  const teacherAlerts = alerts.filter(a => a.subjectCode === '21CS52' || a.subjectCode === '21CSL57');
  const teacherCorrectionRequests = correctionRequests.filter(r => r.subjectCode === '21CS52' || r.subjectCode === '21CSL57');

  // Modals & Forms State
  const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendancePeriod, setAttendancePeriod] = useState(2);
  const [attendanceTopic, setAttendanceTopic] = useState('Network Layer Routing & Distance Vector Protocol');
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    students.filter(s => s.classId === 'cls-1').forEach(s => {
      map[s.id] = s.usn !== '1RV22CS086'; // Everyone present except Karthik by default
    });
    return map;
  });

  // Recent Past Attendance Sessions Log
  const [attendanceSessions, setAttendanceSessions] = useState([
    { id: 'att-1', date: '2026-10-15', period: 'Period 2 (10:00 AM)', topic: 'TCP Sliding Window & Flow Control', present: 58, absent: 6, rate: 90.6, locked: true },
    { id: 'att-2', date: '2026-10-13', period: 'Period 1 (09:00 AM)', topic: 'Go-Back-N vs Selective Repeat ARQ Protocols', present: 56, absent: 8, rate: 87.5, locked: true },
    { id: 'att-3', date: '2026-10-10', period: 'Period 4 (12:15 PM)', topic: 'Subnet Masking & CIDR Hierarchical Routing', present: 54, absent: 10, rate: 84.3, locked: true },
    { id: 'att-4', date: '2026-10-08', period: 'Period 2 (10:00 AM)', topic: 'Distance Vector vs Link State Routing Algorithms', present: 59, absent: 5, rate: 92.1, locked: true },
    { id: 'att-5', date: '2026-10-05', period: 'Period 3 (11:15 AM)', topic: 'IPv6 Header Format & Dual Stack Translation', present: 52, absent: 12, rate: 81.2, locked: true }
  ]);

  // IA Marks State
  const [selectedIAType, setSelectedIAType] = useState<'IA-1' | 'IA-2' | 'Lab Internal'>('IA-2');
  const [, setIsMarksLocked] = useState(false);
  const [studentIAMarksMap, setStudentIAMarksMap] = useState<Record<string, number>>({
    'stu-1': 19, // Rahul Sharma
    'stu-2': 28, // Priya
    'stu-3': 14, // Karthik
    'stu-4': 25, // Sneha
    'stu-5': 20, // Zaid
  });

  // Student Inspect Modal
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);

  // Dispute Resolution State
  const [selectedDispute, setSelectedDispute] = useState<CorrectionRequest | null>(null);
  const [disputeResolutionText, setDisputeResolutionText] = useState('');

  // Assignment Marks State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('asg-1');
  const [isAssignmentMarksLocked, setIsAssignmentMarksLocked] = useState(false);
  const [assignmentMarksSearch, setAssignmentMarksSearch] = useState('');
  const [assignmentMarksBatch, setAssignmentMarksBatch] = useState<
    Record<string, Record<string, { marks: number; remarks: string; submitted: boolean; submissionDate: string }>>
  >({
    'asg-1': {
      'stu-1': { marks: 18, remarks: 'Well documented Wireshark capture traces & TCP handshake analysis', submitted: true, submissionDate: '2026-10-14 11:20 PM' },
      'stu-2': { marks: 20, remarks: 'Exemplary report with complete sliding window & RTT flow diagrams', submitted: true, submissionDate: '2026-10-14 06:15 PM' },
      'stu-3': { marks: 14, remarks: 'Submitted late; missing retransmission time graph', submitted: true, submissionDate: '2026-10-15 08:30 AM' },
      'stu-4': { marks: 19, remarks: 'Clean packet analysis with accurate sequence number explanation', submitted: true, submissionDate: '2026-10-14 09:45 PM' },
      'stu-5': { marks: 17, remarks: 'Good work on DNS and HTTP protocol headers', submitted: true, submissionDate: '2026-10-15 10:10 PM' }
    },
    'asg-2': {
      'stu-1': { marks: 19, remarks: 'Multi-threaded socket server implemented cleanly in Python', submitted: true, submissionDate: '2026-10-22 04:30 PM' },
      'stu-2': { marks: 20, remarks: 'Flawless BSD socket client-server implementation with error recovery', submitted: true, submissionDate: '2026-10-21 08:15 PM' },
      'stu-3': { marks: 12, remarks: 'Connection timeout bug in concurrent client handler', submitted: true, submissionDate: '2026-10-23 11:00 AM' },
      'stu-4': { marks: 18, remarks: 'Well-tested select/poll multiplexing loop', submitted: true, submissionDate: '2026-10-22 09:20 PM' },
      'stu-5': { marks: 16, remarks: 'Basic TCP echo server functional; clean code style', submitted: true, submissionDate: '2026-10-22 11:45 PM' }
    },
    'asg-3': {
      'stu-1': { marks: 22, remarks: 'OpenFlow controller rules correctly routing packets through Mininet topology', submitted: true, submissionDate: '2026-10-28 02:10 PM' },
      'stu-2': { marks: 25, remarks: 'Exceptional SDN topology with reactive flow forwarding and QoS policies', submitted: true, submissionDate: '2026-10-27 10:45 PM' },
      'stu-3': { marks: 18, remarks: 'Mininet script executed; switch flow table entries verified', submitted: true, submissionDate: '2026-10-29 09:15 AM' },
      'stu-4': { marks: 23, remarks: 'Detailed Ryu controller handler with packet-in/out logic', submitted: true, submissionDate: '2026-10-28 06:30 PM' },
      'stu-5': { marks: 21, remarks: 'Good demonstration of flow table modifications and latency benchmarks', submitted: true, submissionDate: '2026-10-28 11:20 PM' }
    },
    'asg-4': {
      'stu-1': { marks: 18, remarks: 'Detailed congestion window simulation analysis', submitted: true, submissionDate: '2026-11-01 03:20 PM' },
      'stu-2': { marks: 20, remarks: 'Accurate cubic vs reno throughput graphs', submitted: true, submissionDate: '2026-11-01 01:10 PM' },
      'stu-3': { marks: 15, remarks: 'Completed simulation with minor discrepancy in fast recovery', submitted: true, submissionDate: '2026-11-02 09:00 AM' },
      'stu-4': { marks: 19, remarks: 'Thorough packet loss mathematical model', submitted: true, submissionDate: '2026-11-01 07:45 PM' },
      'stu-5': { marks: 17, remarks: 'Good trace analysis and fair-share verification', submitted: true, submissionDate: '2026-11-01 11:15 PM' }
    }
  });

  const availableAssignmentsList = [
    { id: 'asg-1', code: 'ASG-1', title: 'Assignment 1: Wireshark Packet Analysis', maxMarks: 20, dueDate: '2026-10-15', evaluatedCount: 5, totalCount: 5, weightage: '10%' },
    { id: 'asg-2', code: 'ASG-2', title: 'Assignment 2: Socket Programming in C/Python', maxMarks: 20, dueDate: '2026-10-24', evaluatedCount: 5, totalCount: 5, weightage: '10%' },
    { id: 'asg-3', code: 'ASG-3', title: 'Lab Project: Software Defined Network Controller', maxMarks: 25, dueDate: '2026-11-05', evaluatedCount: 5, totalCount: 5, weightage: '15%' },
    { id: 'asg-4', code: 'ASG-4', title: 'Assignment 3: TCP Congestion Control & Simulation', maxMarks: 20, dueDate: '2026-11-12', evaluatedCount: 5, totalCount: 5, weightage: '10%' }
  ];

  const currentAssignmentInfo = availableAssignmentsList.find(a => a.id === selectedAssignmentId) || availableAssignmentsList[0];

  const updateStudentAssignmentMark = (studentId: string, mark: number) => {
    setAssignmentMarksBatch(prev => ({
      ...prev,
      [selectedAssignmentId]: {
        ...(prev[selectedAssignmentId] || {}),
        [studentId]: {
          ...(prev[selectedAssignmentId]?.[studentId] || { remarks: '', submitted: true, submissionDate: '2026-10-14' }),
          marks: Math.max(0, Math.min(currentAssignmentInfo.maxMarks, mark))
        }
      }
    }));
  };

  const updateStudentAssignmentRemark = (studentId: string, remarkText: string) => {
    setAssignmentMarksBatch(prev => ({
      ...prev,
      [selectedAssignmentId]: {
        ...(prev[selectedAssignmentId] || {}),
        [studentId]: {
          ...(prev[selectedAssignmentId]?.[studentId] || { marks: 0, submitted: true, submissionDate: '2026-10-14' }),
          remarks: remarkText
        }
      }
    }));
  };

  const handleSaveAssignmentMarks = () => {
    showToast(`Assignment marks for "${currentAssignmentInfo.title}" updated and verified!`, 'success');
    logActivity('Assignment Marks Updated', teacherName, 'Subject Teacher', `Updated assignment marks ledger for ${currentAssignmentInfo.title}`);
  };

  // Filtered Students for the directory
  const [directoryClassFilter, setDirectoryClassFilter] = useState<'all' | 'cls-1' | 'cls-2'>('all');
  const classAStudents = students.filter(s => s.classId === 'cls-1');
  const displayStudents = directoryClassFilter === 'all' 
    ? classAStudents 
    : classAStudents.filter(s => s.classId === directoryClassFilter);

  const filteredStudents = displayStudents.filter(s =>
    searchTerm ? (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.usn.toLowerCase().includes(searchTerm.toLowerCase())) : true
  );

  // Profile Edit State
  // Helpers
  const toggleStudentAttendance = (studentId: string) => {
    setStudentAttendanceMap(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAllAttendance = (status: boolean) => {
    const updated: Record<string, boolean> = {};
    classAStudents.forEach(s => {
      updated[s.id] = status;
    });
    setStudentAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const presentCount = Object.values(studentAttendanceMap).filter(Boolean).length;
    const absentCount = classAStudents.length - presentCount;
    const rate = Math.round((presentCount / classAStudents.length) * 1000) / 10;

    const newSession = {
      id: `att-${Date.now()}`,
      date: attendanceDate,
      period: `Period ${attendancePeriod} (${attendancePeriod === 1 ? '09:00 AM' : attendancePeriod === 2 ? '10:00 AM' : attendancePeriod === 3 ? '11:15 AM' : '02:00 PM'})`,
      topic: attendanceTopic,
      present: presentCount,
      absent: absentCount,
      rate: rate,
      locked: true
    };

    setAttendanceSessions(prev => [newSession, ...prev]);
    showToast(`Recorded attendance for ${selectedSubject.name} (${attendanceDate}, Period ${attendancePeriod}): ${presentCount}/${classAStudents.length} Present`, 'success');
    logActivity('Attendance Submitted', teacherName, 'Subject Teacher', `Recorded session attendance for ${selectedSubject.name} - ${presentCount}/${classAStudents.length} present`);
    setIsTakeAttendanceOpen(false);
  };

  const handleSaveIAMarks = () => {
    showToast(`Successfully saved and locked ${selectedIAType} marks for ${selectedSubject.name}`, 'success');
    logActivity('IA Marks Updated', teacherName, 'Subject Teacher', `Updated ${selectedIAType} marks for ${selectedSubject.name} (${selectedSubject.className})`);
    setIsMarksLocked(true);
  };

  const handleResolveDispute = (action: 'approved' | 'rejected') => {
    if (!selectedDispute) return;
    const resolutionNote = disputeResolutionText || (action === 'approved' ? 'Verified lecture slip. Attendance register updated.' : 'Verified against physical register. Record correct.');
    resolveCorrectionRequest(selectedDispute.id, action, resolutionNote);
    showToast(`Dispute #${selectedDispute.id} has been ${action}.`, action === 'approved' ? 'success' : 'info');
    logActivity('Correction Resolved', teacherName, 'Subject Teacher', `${action.toUpperCase()} dispute for ${selectedDispute.studentName}`);
    setSelectedDispute(null);
    setDisputeResolutionText('');
  };

  // Determine current active section
  const currentSection: MainSection =
    currentPage === 'my-classes-subjects' || currentPage === 'student-directory'
      ? 'my-classes-subjects'
      : currentPage === 'academic-management' || ['attendance', 'ia-marks', 'assignments', 'assignment-marks', 'correction-requests'].includes(currentPage)
      ? 'academic-management'
      : ['settings', 'settings-profile', 'profile'].includes(currentPage)
      ? 'settings'
      : 'dashboard';

  /* =========================================================================================
     PAGE 1: DASHBOARD
  ========================================================================================= */
  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-900">Faculty Instructor</span>
            <span aria-hidden="true">·</span>
            <span>{department}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700">21CS52 & 21CSL57</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {teacherName}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>3 Teaching Batches</span>
            <span aria-hidden="true">·</span>
            <span>126 Students</span>
            <span aria-hidden="true">·</span>
            <span>Attendance: <strong className="font-mono text-emerald-600">81.4% Avg</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsTakeAttendanceOpen(true)}
            className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <CalendarCheck size={14} /> Attendance
          </button>
          <button
            onClick={() => {
              setCurrentPage('academic-management');
              setAcademicMgmtTab('ia-marks');
            }}
            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Award size={14} /> IA Marks
          </button>
          <button
            onClick={() => {
              setCurrentPage('academic-management');
              setAcademicMgmtTab('assignment-marks');
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
          >
            <ClipboardList size={14} /> Assignments
          </button>
        </div>
      </div>

      {/* 5 Compact Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        <div
          onClick={() => {
            setCurrentPage('my-classes-subjects');
            setClassesSubjectsTab('classes');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Batches</span>
            <div className="p-1 rounded bg-blue-50 text-blue-600">
              <BookOpen size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">3 Batches</div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">126 Enrolled</p>
        </div>

        <div
          onClick={() => setIsTakeAttendanceOpen(true)}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Attendance</span>
            <div className="p-1 rounded bg-emerald-50 text-emerald-600">
              <CalendarCheck size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">81.4%</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Above 75% Cutoff</p>
        </div>

        <div
          onClick={() => {
            setCurrentPage('academic-management');
            setAcademicMgmtTab('ia-marks');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">CIE Marks</span>
            <div className="p-1 rounded bg-purple-50 text-purple-600">
              <Award size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">74.2%</div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Avg: 22.3 / 30m</p>
        </div>

        <div
          onClick={() => {
            setCurrentPage('my-classes-subjects');
            setClassesSubjectsTab('directory');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Shortages</span>
            <div className="p-1 rounded bg-rose-50 text-rose-600">
              <AlertCircle size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-600">{teacherAlerts.length} Students</div>
          <p className="text-[10px] text-rose-700 font-medium mt-0.5">&lt; 75% in 21CS52</p>
        </div>

        <div
          onClick={() => {
            setCurrentPage('academic-management');
            setAcademicMgmtTab('disputes');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Pending Tasks</span>
            <div className="p-1 rounded bg-amber-50 text-amber-600">
              <Clock size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{teacherCorrectionRequests.length + 1} Items</div>
          <p className="text-[10px] text-amber-700 font-medium mt-0.5">{teacherCorrectionRequests.length} Disputes · 1 IA</p>
        </div>
      </div>

      {/* Assigned Subjects Compact Grid */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Layers size={14} className="text-blue-600" /> Assigned Teaching Courses
          </h2>
          <button
            onClick={() => {
              setCurrentPage('my-classes-subjects');
              setClassesSubjectsTab('classes');
            }}
            className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Courses ({assignedSubjects.length}) <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {assignedSubjects.map((sub, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-200/90 hover:border-slate-300 transition-colors bg-slate-50/40 flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono">
                    {sub.code}
                  </span>
                  <span className="text-[10.5px] font-medium text-slate-600">
                    {sub.credits} Credits · {sub.code.includes('L') ? 'Lab' : 'Theory'}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{sub.name}</h3>
                <p className="text-xs text-blue-700 font-medium">{sub.className} · {sub.studentsCount} Students</p>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setCurrentPage('my-classes-subjects');
                    setClassesSubjectsTab('directory');
                  }}
                  className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1"
                >
                  <Users size={12} /> Roster
                </button>
                <button
                  onClick={() => {
                    setSelectedSubject(sub);
                    setIsTakeAttendanceOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors shadow-2xs"
                >
                  Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Grid: Watchlist & Dispute Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Watchlist in 21CS52 */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={15} className="text-rose-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Attendance Watchlist (21CS52)</h2>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {teacherAlerts.length} Below 75%
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {teacherAlerts.map(alert => (
              <div key={alert.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{alert.studentName}</span>
                    <span className="font-mono text-[10.5px] text-slate-400">({alert.studentUsn})</span>
                    <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                      {alert.currentValue}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{alert.recommendedAction}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      showToast(`Sent reminder email to ${alert.studentName}`, 'info');
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Email Student"
                  >
                    <Mail size={13} />
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Remedial counseling initiated for ${alert.studentName}`, 'success');
                      logActivity('Remedial Counseling', teacherName, 'Subject Teacher', `Scheduled remedial counseling session for ${alert.studentName}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                  >
                    Counsel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Correction Requests */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={15} className="text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Student Dispute Requests</h2>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {teacherCorrectionRequests.length} Open
            </span>
          </div>

          {teacherCorrectionRequests.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <CheckCircle2 size={24} className="mx-auto text-emerald-400 mb-1" />
              <p className="text-xs font-bold text-slate-700">No pending student disputes</p>
              <p className="text-[11px] text-slate-400">All attendance & IA marks records verified</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {teacherCorrectionRequests.map(req => (
                <div key={req.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{req.studentName}</span>
                      <span className="font-mono text-[10.5px] text-slate-400">({req.studentUsn})</span>
                      <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {req.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>Rec: {req.originalValue}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">Claim: {req.requestedValue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedDispute(req)}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold transition-colors"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => resolveCorrectionRequest(req.id, 'approved', 'Verified guest lecture attendance slip. Updated to present.')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* =========================================================================================
     PAGE 2: MY CLASSES & SUBJECTS
  ========================================================================================= */
  const renderMyClasses = () => (
    <div className="space-y-6">
        {/* Header & Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                My Classes & Assigned Subjects
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Review assigned teaching batches and enrolled student directories.
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full self-start sm:self-auto">
              Teaching Load: 10 Hours / Week
            </span>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setClassesSubjectsTab('classes')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                classesSubjectsTab === 'classes'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FolderTree size={14} />
              My Classes ({assignedSubjects.length})
            </button>
            <button
              onClick={() => setClassesSubjectsTab('directory')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                classesSubjectsTab === 'directory'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users size={14} />
              Student Directory ({filteredStudents.length})
            </button>
          </div>
        </div>

        {/* TAB 1: MY CLASSES */}
        {classesSubjectsTab === 'classes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assignedSubjects.map((sub, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between hover:border-gray-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black bg-gray-900 text-white px-2.5 py-1 rounded-md">
                      {sub.code}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Active Teaching
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-gray-900">{sub.name}</h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">{sub.className}</p>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Course Credits:</span>
                      <span className="font-bold text-gray-900">{sub.credits} Credits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Total Enrolled Strength:</span>
                      <span className="font-bold text-gray-900">{sub.studentsCount} Students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Subject Category:</span>
                      <span className="font-semibold text-gray-700">{sub.code.includes('L') ? 'Laboratory Course' : 'Theory Core'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setClassesSubjectsTab('directory');
                    }}
                    className="font-bold text-gray-700 hover:text-black flex items-center gap-1"
                  >
                    <Users size={14} /> Student List
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubject(sub);
                      setIsTakeAttendanceOpen(true);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Mark Attendance <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: STUDENT DIRECTORY */}
        {classesSubjectsTab === 'directory' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Filter Class:</span>
                <select
                  value={directoryClassFilter}
                  onChange={e => setDirectoryClassFilter(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">All Assigned Students (Section A & B)</option>
                  <option value="cls-1">5th Sem CSE - Section A (64 Students)</option>
                  <option value="cls-2">5th Sem CSE - Section B (62 Students)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or USN..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black w-56 sm:w-64"
                  />
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  {filteredStudents.length} Students
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">21CS52 Attendance</th>
                      <th className="py-3 px-4">IA-1</th>
                      <th className="py-3 px-4">IA-2</th>
                      <th className="py-3 px-4">VTU Standing</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {filteredStudents.map(student => {
                      const isCritical = student.usn === '1RV22CS084' || student.usn === '1RV22CS086';
                      const attPercent = student.usn === '1RV22CS084' ? 71.4 : student.usn === '1RV22CS086' ? 62.5 : 88.0;

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                            <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[10px]">
                              {student.name.charAt(0)}
                            </div>
                            <span>{student.name}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-500">{student.usn}</td>
                          <td className="py-3 px-4 text-gray-600 font-semibold">{student.className}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  attPercent < 75 ? 'text-rose-600' : attPercent < 80 ? 'text-amber-600' : 'text-emerald-600'
                                }`}
                              >
                                {attPercent}%
                              </span>
                              <span className="text-[10px] text-gray-400">
                                ({student.usn === '1RV22CS084' ? '25/35' : student.usn === '1RV22CS086' ? '22/35' : '31/35'})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {student.usn === '1RV22CS084' ? '22/30' : student.usn === '1RV22CS086' ? '18/30' : '26/30'}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {student.usn === '1RV22CS084' ? '19/30' : student.usn === '1RV22CS086' ? '14/30' : '28/30'}
                          </td>
                          <td className="py-3 px-4">
                            {isCritical ? (
                              <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                Shortage Warning
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                Eligible
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setInspectStudent(student)}
                              className="text-blue-600 hover:text-blue-900 font-bold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Subject Card
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
      </div>
    );

  /* =========================================================================================
     PAGE 3: ACADEMIC MANAGEMENT
  ========================================================================================= */
  const renderAcademicManagement = () => (
    <div className="space-y-6">
        {/* Header with Sub-Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <CalendarCheck size={20} className="text-blue-600" />
                Academic Management Portal
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage lecture attendance sessions, Continuous Internal Evaluation (IA) marks, and course assignment marks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTakeAttendanceOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <CalendarCheck size={14} />
                Record Lecture
              </button>
              <button
                onClick={() => setAcademicMgmtTab('assignment-marks')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Award size={14} />
                Assignment Marks
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setAcademicMgmtTab('attendance')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                academicMgmtTab === 'attendance'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <CalendarCheck size={14} />
              Attendance
            </button>
            <button
              onClick={() => setAcademicMgmtTab('ia-marks')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                academicMgmtTab === 'ia-marks'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Award size={14} />
              IA Marks
            </button>
            <button
              onClick={() => setAcademicMgmtTab('assignment-marks')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                academicMgmtTab === 'assignment-marks'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <ClipboardList size={14} />
              Assignments
            </button>
            <button
              onClick={() => setAcademicMgmtTab('corrections')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                academicMgmtTab === 'corrections'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <HelpCircle size={14} />
              Corrections
              {teacherCorrectionRequests.length > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {teacherCorrectionRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: ATTENDANCE MANAGEMENT */}
        {academicMgmtTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Classes</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen size={14} />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900">35 Lectures</div>
                <p className="text-[11px] text-gray-500">70% of 50 prescribed hours</p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject Rate</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <CalendarCheck size={14} />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600">81.4%</div>
                <p className="text-[11px] text-emerald-700 font-medium">59 of 64 students eligible</p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shortage Alerts</span>
                  <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                    <AlertTriangle size={14} />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600">2 Students</div>
                <p className="text-[11px] text-rose-700 font-medium">&lt; 75% attendance cutoff</p>
              </div>
            </div>

            {/* Attendance Sessions Ledger */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Lecture Session Registers (21CS52)</h2>
                  <p className="text-xs text-gray-500">Recorded sessions locked for audit compliance.</p>
                </div>
                <button
                  onClick={() => setIsTakeAttendanceOpen(true)}
                  className="bg-black text-white hover:bg-gray-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  New Session
                </button>
              </div>

              {/* Mobile Lecture Session Cards */}
              <div className="md:hidden space-y-2.5">
                {attendanceSessions.map((row) => (
                  <div key={row.id} className="p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-gray-950">{row.date}</span>
                        <span className="text-[10px] text-gray-400">• {row.period}</span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                        <Lock size={10} /> Locked
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2">{row.topic}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200/60">
                      <span className="text-emerald-700 font-bold">{row.present} Present</span>
                      <span className="text-rose-700 font-bold">{row.absent} Absent</span>
                      <span className="text-gray-900 font-black">{row.rate}% Rate</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Lecture Sessions Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Topic Covered</th>
                      <th className="py-3 px-4">Present</th>
                      <th className="py-3 px-4">Absent</th>
                      <th className="py-3 px-4">Attendance %</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {attendanceSessions.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{row.date}</td>
                        <td className="py-3 px-4 text-gray-600">{row.period}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{row.topic}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">{row.present}</td>
                        <td className="py-3 px-4 text-rose-600 font-bold">{row.absent}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{row.rate}%</td>
                        <td className="py-3 px-4 text-right">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                            <Lock size={10} /> Locked
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

        {/* TAB 2: IA MARKS */}
        {academicMgmtTab === 'ia-marks' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Continuous Assessment Marks Entry</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter, compute percentage grades, and submit VTU Continuous Internal Evaluation (CIE) scores.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedIAType}
                  onChange={e => setSelectedIAType(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800"
                >
                  <option value="IA-1">Continuous Assessment IA-1 (Max {getSubjectConfig(selectedSubject.code).iaMaxMarks})</option>
                  <option value="IA-2">Continuous Assessment IA-2 (Max {getSubjectConfig(selectedSubject.code).iaMaxMarks})</option>
                  <option value="Lab Internal">Laboratory Continuous Test (Max {selectedSubject.type === 'Lab' ? getSubjectConfig(selectedSubject.code).iaMaxMarks : 50})</option>
                </select>
                <button
                  onClick={handleSaveIAMarks}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <Lock size={14} />
                  Save & Lock Marks
                </button>
              </div>
            </div>

            {/* Marks Entry Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <span className="font-bold text-gray-600">
                  Editing: <strong className="text-gray-900">{selectedIAType}</strong> for {selectedSubject.className} ({selectedSubject.name})
                </span>
                <div className="flex items-center gap-4 text-gray-500">
                  {(() => {
                    const cfg = getSubjectConfig(selectedSubject.code);
                    const maxMarks = selectedIAType === 'Lab Internal' ? (selectedSubject.type === 'Lab' ? cfg.iaMaxMarks : 50) : cfg.iaMaxMarks;
                    const estimatedAvg = (maxMarks * 0.75).toFixed(1);
                    return (
                      <>
                        <span>Class Average: <strong className="text-gray-900 font-bold">{estimatedAvg} / {maxMarks}</strong></span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          Configured Passing: {cfg.passingMarksPercent}% ({Math.round(maxMarks * (cfg.passingMarksPercent / 100))}m)
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Mobile IA Marks Entry Cards */}
              <div className="md:hidden space-y-3">
                {classAStudents.map(student => {
                  const currentScore = studentIAMarksMap[student.id] ?? 24;
                  const cfg = getSubjectConfig(selectedSubject.code);
                  const maxMarks = selectedIAType === 'Lab Internal' ? (selectedSubject.type === 'Lab' ? cfg.iaMaxMarks : 50) : cfg.iaMaxMarks;
                  const passScore = Math.round(maxMarks * (cfg.passingMarksPercent / 100));
                  const percent = Math.round((currentScore / maxMarks) * 100);

                  return (
                    <div key={student.id} className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 pr-2">
                          <h4 className="font-bold text-xs text-gray-900 truncate">{student.name}</h4>
                          <span className="font-mono text-[10.5px] text-gray-500 font-medium">{student.usn}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                            percent >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : percent >= 70
                              ? 'bg-blue-100 text-blue-800'
                              : percent >= cfg.passingMarksPercent
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {percent >= 85 ? 'O' : percent >= 70 ? 'A+' : percent >= cfg.passingMarksPercent ? 'B' : 'F'} ({percent}%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                        <span className="text-xs font-semibold text-gray-600">Marks Obtained:</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            max={maxMarks}
                            min={0}
                            value={currentScore}
                            onChange={e => {
                              const val = Math.min(maxMarks, Math.max(0, Number(e.target.value)));
                              setStudentIAMarksMap(prev => ({
                                ...prev,
                                [student.id]: val
                              }));
                            }}
                            className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 font-bold text-center text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                          />
                          <span className="text-xs text-gray-400 font-bold">/ {maxMarks}</span>
                        </div>
                      </div>

                      {currentScore < passScore && (
                        <p className="text-[10.5px] text-rose-600 font-semibold bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                          ⚠️ Remedial coaching required (Score &lt; {passScore} / {maxMarks})
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop IA Marks Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Max Marks</th>
                      <th className="py-3 px-4">Marks Obtained</th>
                      <th className="py-3 px-4">Percentage</th>
                      <th className="py-3 px-4">Evaluation Grade</th>
                      <th className="py-3 px-4 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {classAStudents.map(student => {
                      const currentScore = studentIAMarksMap[student.id] ?? 24;
                      const cfg = getSubjectConfig(selectedSubject.code);
                      const maxMarks = selectedIAType === 'Lab Internal' ? (selectedSubject.type === 'Lab' ? cfg.iaMaxMarks : 50) : cfg.iaMaxMarks;
                      const passScore = Math.round(maxMarks * (cfg.passingMarksPercent / 100));
                      const percent = Math.round((currentScore / maxMarks) * 100);

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{student.usn}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{student.name}</td>
                          <td className="py-3 px-4 font-bold text-gray-500">{maxMarks}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              max={maxMarks}
                              min={0}
                              value={currentScore}
                              onChange={e => {
                                const val = Math.min(maxMarks, Math.max(0, Number(e.target.value)));
                                setStudentIAMarksMap(prev => ({
                                  ...prev,
                                  [student.id]: val
                                }));
                              }}
                              className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-bold text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                            />
                          </td>
                          <td className="py-3 px-4 font-bold">
                            <span className={percent < cfg.passingMarksPercent ? 'text-rose-600' : 'text-gray-900'}>{percent}%</span>
                          </td>
                          <td className="py-3 px-4 font-black">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                percent >= 85
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : percent >= 70
                                  ? 'bg-blue-100 text-blue-800'
                                  : percent >= cfg.passingMarksPercent
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {percent >= 85 ? 'O (Distinction)' : percent >= 70 ? 'A+ (Very Good)' : percent >= cfg.passingMarksPercent ? 'B (Average)' : 'F (Needs Remedial)'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-[11px] text-gray-400">
                            {currentScore < passScore ? `Remedial coaching required (< ${passScore}m)` : 'Satisfactory progress'}
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

        {/* TAB 3: ASSIGNMENT MARKS (Section for managing assignment marks) */}
        {academicMgmtTab === 'assignment-marks' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                      21CS52 • 5th Sem CSE-A
                    </span>
                    <span className="text-xs font-bold text-gray-500">Continuous Evaluation Component (10% CIE)</span>
                  </div>
                  <h2 className="text-lg font-black text-gray-900 mt-1">Assignment Marks Management</h2>
                  <p className="text-xs text-gray-500">
                    Grade student assignments, record marks, add qualitative feedback, and commit official course marks.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setIsAssignmentMarksLocked(!isAssignmentMarksLocked);
                      showToast(
                        isAssignmentMarksLocked ? 'Assignment marks register unlocked for editing.' : 'Assignment marks ledger locked and verified.',
                        isAssignmentMarksLocked ? 'info' : 'success'
                      );
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isAssignmentMarksLocked
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {isAssignmentMarksLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    {isAssignmentMarksLocked ? 'Marks Locked' : 'Lock Register'}
                  </button>

                  <button
                    onClick={() => showToast(`Exported "${currentAssignmentInfo.title}" marks ledger to CSV`, 'info')}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Download size={14} /> Export Marks Sheet
                  </button>

                  <button
                    onClick={handleSaveAssignmentMarks}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <CheckCircle2 size={14} /> Save All Marks
                  </button>
                </div>
              </div>

              {/* Assignment Selector Pills */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Select Assignment:</span>
                {availableAssignmentsList.map(asg => {
                  const isSelected = selectedAssignmentId === asg.id;
                  return (
                    <button
                      key={asg.id}
                      onClick={() => setSelectedAssignmentId(asg.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="font-mono">{asg.code}:</span>
                      <span className="line-clamp-1">{asg.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        Max {asg.maxMarks}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Bar for Selected Assignment Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Current Assignment</span>
                <div className="font-black text-sm text-gray-900 line-clamp-1">{currentAssignmentInfo.title}</div>
                <p className="text-[11px] text-gray-500 font-medium">Due Date: {currentAssignmentInfo.dueDate} • Weightage: {currentAssignmentInfo.weightage}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Evaluation Status</span>
                <div className="text-2xl font-black text-emerald-600">100% Evaluated</div>
                <p className="text-[11px] text-emerald-700 font-medium">All students graded in ledger</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Batch Marks Average</span>
                <div className="text-2xl font-black text-blue-600">
                  {selectedAssignmentId === 'asg-3' ? '21.8 / 25' : '17.6 / 20'}
                </div>
                <p className="text-[11px] text-blue-700 font-medium">
                  {selectedAssignmentId === 'asg-3' ? '87.2% overall performance' : '88.0% overall performance'}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Maximum Marks</span>
                <div className="text-2xl font-black text-gray-900">{currentAssignmentInfo.maxMarks} Marks</div>
                <p className="text-[11px] text-gray-500 font-medium">Passing threshold: {Math.round(currentAssignmentInfo.maxMarks * (getSubjectConfig(selectedSubject.code).passingMarksPercent / 100))} Marks ({getSubjectConfig(selectedSubject.code).passingMarksPercent}%)</p>
              </div>
            </div>

            {/* Student Marks Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-blue-600" />
                  <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                    Student Marks Ledger — {currentAssignmentInfo.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search student or USN..."
                      value={assignmentMarksSearch}
                      onChange={e => setAssignmentMarksSearch(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black w-48 sm:w-56"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {classAStudents.length} Students
                  </span>
                </div>
              </div>

              {/* Mobile Assignment Marks Ledger Cards */}
              <div className="md:hidden space-y-3 p-3 bg-gray-50/40">
                {classAStudents
                  .filter(s =>
                    assignmentMarksSearch
                      ? s.name.toLowerCase().includes(assignmentMarksSearch.toLowerCase()) ||
                        s.usn.toLowerCase().includes(assignmentMarksSearch.toLowerCase())
                      : true
                  )
                  .map(student => {
                    const batchMarks = assignmentMarksBatch[selectedAssignmentId] || {};
                    const studentRecord = batchMarks[student.id] || {
                      marks: selectedAssignmentId === 'asg-3' ? 20 : 16,
                      remarks: 'Good submission',
                      submitted: true,
                      submissionDate: '2026-10-14 05:00 PM'
                    };
                    const currentScore = studentRecord.marks;
                    const maxScore = currentAssignmentInfo.maxMarks;
                    const percentage = Math.round((currentScore / maxScore) * 100);

                    return (
                      <div key={student.id} className="p-3.5 bg-white border border-gray-200/80 rounded-2xl space-y-3 shadow-2xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div className="min-w-0 truncate">
                              <span className="font-bold text-xs text-gray-900 block truncate">{student.name}</span>
                              <span className="text-[10px] font-mono text-gray-400">{student.usn}</span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              student.usn === '1RV22CS086'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {student.usn === '1RV22CS086' ? 'Late' : 'On Time'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div>
                            <span className="text-xs font-semibold text-gray-600 block">Marks Awarded:</span>
                            <span className="text-[10px] text-gray-400 font-mono">Passing: {Math.round(maxScore * 0.4)}m</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={maxScore}
                              disabled={isAssignmentMarksLocked}
                              value={currentScore}
                              onChange={e => updateStudentAssignmentMark(student.id, Number(e.target.value))}
                              className={`w-16 rounded-xl border px-2.5 py-1.5 text-xs font-bold text-center ${
                                isAssignmentMarksLocked
                                  ? 'bg-gray-100 text-gray-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black'
                              }`}
                            />
                            <span className="text-xs text-gray-500 font-bold">/ {maxScore}</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10.5px] font-bold text-gray-500">Remarks / Feedback</label>
                            <span className={`text-[10px] font-bold ${percentage >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {percentage}% • {percentage >= 90 ? 'Grade O' : percentage >= 80 ? 'Grade A+' : percentage >= 70 ? 'Grade A' : 'Grade B'}
                            </span>
                          </div>
                          <input
                            type="text"
                            disabled={isAssignmentMarksLocked}
                            value={studentRecord.remarks}
                            onChange={e => updateStudentAssignmentRemark(student.id, e.target.value)}
                            placeholder="Add faculty feedback..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>

                        <div className="pt-1 flex justify-end">
                          <button
                            disabled={isAssignmentMarksLocked}
                            onClick={() => {
                              showToast(`Saved marks for ${student.name}: ${currentScore}/${maxScore}`, 'success');
                              logActivity('Marks Saved', teacherName, 'Subject Teacher', `Updated score for ${student.name}`);
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all text-center ${
                              isAssignmentMarksLocked
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black hover:bg-gray-800 text-white active:scale-95'
                            }`}
                          >
                            Save Score
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Desktop Assignment Marks Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student Name & USN</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Max Marks</th>
                      <th className="py-3 px-4">Marks Awarded</th>
                      <th className="py-3 px-4">Percentage & Grade</th>
                      <th className="py-3 px-4">Faculty Remarks & Feedback</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {classAStudents
                      .filter(s =>
                        assignmentMarksSearch
                          ? s.name.toLowerCase().includes(assignmentMarksSearch.toLowerCase()) ||
                            s.usn.toLowerCase().includes(assignmentMarksSearch.toLowerCase())
                          : true
                      )
                      .map(student => {
                        const batchMarks = assignmentMarksBatch[selectedAssignmentId] || {};
                        const studentRecord = batchMarks[student.id] || {
                          marks: selectedAssignmentId === 'asg-3' ? 20 : 16,
                          remarks: 'Good submission',
                          submitted: true,
                          submissionDate: '2026-10-14 05:00 PM'
                        };
                        const currentScore = studentRecord.marks;
                        const maxScore = currentAssignmentInfo.maxMarks;
                        const percentage = Math.round((currentScore / maxScore) * 100);

                        return (
                          <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                              <div className="flex items-center gap-2.5">
                                <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[10px]">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="block leading-tight">{student.name}</span>
                                  <span className="text-[10px] font-mono text-gray-400 font-normal">{student.usn}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  student.usn === '1RV22CS086'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {student.usn === '1RV22CS086' ? 'Late Submission' : 'Submitted on Time'}
                              </span>
                              <span className="block text-[10px] text-gray-400 mt-0.5 font-mono">
                                {studentRecord.submissionDate}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-500">
                              {maxScore}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={maxScore}
                                  disabled={isAssignmentMarksLocked}
                                  value={currentScore}
                                  onChange={e => updateStudentAssignmentMark(student.id, Number(e.target.value))}
                                  className={`w-16 rounded-xl border px-2.5 py-1 text-xs font-bold text-center transition-all ${
                                    isAssignmentMarksLocked
                                      ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                                      : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black'
                                  }`}
                                />
                                <span className="text-gray-400 font-bold">/ {maxScore}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono font-bold ${
                                    percentage >= 85
                                      ? 'text-emerald-600'
                                      : percentage >= 70
                                      ? 'text-blue-600'
                                      : percentage >= 50
                                      ? 'text-amber-600'
                                      : 'text-rose-600'
                                  }`}
                                >
                                  {percentage}%
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    percentage >= 85
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : percentage >= 70
                                      ? 'bg-blue-100 text-blue-800'
                                      : percentage >= 50
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {percentage >= 90 ? 'Grade O' : percentage >= 80 ? 'Grade A+' : percentage >= 70 ? 'Grade A' : percentage >= 60 ? 'Grade B' : 'Grade C'}
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <input
                                type="text"
                                disabled={isAssignmentMarksLocked}
                                value={studentRecord.remarks}
                                onChange={e => updateStudentAssignmentRemark(student.id, e.target.value)}
                                placeholder="Add faculty remarks..."
                                className={`w-full max-w-sm rounded-xl border px-3 py-1 text-xs transition-all ${
                                  isAssignmentMarksLocked
                                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-white border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-black'
                                }`}
                              />
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                disabled={isAssignmentMarksLocked}
                                onClick={() => {
                                  showToast(`Marks saved for ${student.name}: ${currentScore}/${maxScore}`, 'success');
                                  logActivity('Marks Saved', teacherName, 'Subject Teacher', `Updated ${currentAssignmentInfo.code} score for ${student.name}`);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  isAssignmentMarksLocked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 hover:bg-black text-white active:scale-95'
                                }`}
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Summary & Action */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-gray-500 font-medium">
                  Continuous Internal Evaluation (CIE) rule: Assignment marks account for 10% of total course marks.
                </span>
                <button
                  onClick={handleSaveAssignmentMarks}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Check size={14} /> Commit All Assignment Marks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CORRECTION REQUESTS */}
        {academicMgmtTab === 'corrections' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Student Correction Requests & Disputes</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review student claims for missing attendance marks or IA test paper re-evaluations for 21CS52.
                </p>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                {teacherCorrectionRequests.length} Total Open
              </span>
            </div>

            {teacherCorrectionRequests.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
                <h3 className="font-black text-base text-gray-900">Zero Pending Disputes</h3>
                <p className="text-xs text-gray-500 mt-1">All attendance & marks disputes have been adjudicated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teacherCorrectionRequests.map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">{req.studentName}</h3>
                        <p className="text-xs font-mono text-gray-500">{req.studentUsn} • {req.subjectName}</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 bg-gray-50 p-3.5 rounded-xl font-medium leading-relaxed">
                      {req.details}
                    </p>

                    <div className="flex items-center gap-6 text-xs font-mono bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      <span className="text-gray-500">Currently in Portal: <strong className="text-gray-800">{req.originalValue}</strong></span>
                      <span className="text-emerald-700 font-bold">Claimed Value: {req.requestedValue}</span>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedDispute(req);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"
                      >
                        Provide Detailed Adjudication
                      </button>
                      <button
                        onClick={() => resolveCorrectionRequest(req.id, 'rejected', 'Dispute rejected upon verification with physical attendance register.')}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => resolveCorrectionRequest(req.id, 'approved', 'Dispute accepted. Official register updated.')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Approve Correction
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );

  /* =========================================================================================
     PAGE 4: TEACHER SETTINGS & ACADEMIC CONFIGURATION
  ========================================================================================= */
  const [teacherSettingsTab, setTeacherSettingsTab] = useState<'academic-config' | 'profile'>('academic-config');
  const [selectedConfigSubjectCode, setSelectedConfigSubjectCode] = useState<string>('21CS52');

  const [facultyProfile, setFacultyProfile] = useState({
    name: 'Prof. Ananya Sharma',
    employeeId: 'RVCE-FAC-048',
    department: 'Department of Computer Science & Engineering',
    designation: 'Assistant Professor & Course Lead',
    email: 'ananya.sharma@rvce.edu.in',
    phone: '+91 98450 12345',
    cabin: 'CS-204, 2nd Floor, CSE Department Block',
    officeHours: 'Tuesdays & Thursdays, 3:30 PM – 5:00 PM'
  });

  // Local academic config form synced with selected subject
  const currentSubjectCfg = getSubjectConfig(selectedConfigSubjectCode);
  const [configForm, setConfigForm] = useState(currentSubjectCfg);

  // Sync when selected subject changes
  useEffect(() => {
    setConfigForm(getSubjectConfig(selectedConfigSubjectCode));
  }, [selectedConfigSubjectCode, subjectConfigs]);

  const handleSaveAcademicConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSubjectConfig({
      ...configForm,
      updatedBy: `${facultyProfile.name} (Subject Teacher)`
    });
  };

  const handleResetAcademicConfig = () => {
    resetSubjectConfig(selectedConfigSubjectCode);
    setConfigForm(getSubjectConfig(selectedConfigSubjectCode));
  };

  const renderSettings = () => (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <Sliders size={15} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Teacher Settings & Academic Configuration
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure subject-wise CIE rules, IA test cutoffs, assignment rubrics, attendance thresholds, and faculty credentials.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md">
            Subject Faculty • 2 Allotted Courses
          </span>
        </div>
      </div>

      {/* Settings Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-bold">
        <button
          onClick={() => setTeacherSettingsTab('academic-config')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            teacherSettingsTab === 'academic-config'
              ? 'bg-black text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sliders size={14} /> Academic Configuration
        </button>
        <button
          onClick={() => setTeacherSettingsTab('profile')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            teacherSettingsTab === 'profile'
              ? 'bg-black text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User size={14} /> Academic Profile & Courses
        </button>
      </div>

      {/* TAB 1: ACADEMIC CONFIGURATION */}
      {teacherSettingsTab === 'academic-config' && (
        <div className="space-y-4">
          {/* Subject Switcher & Authorization Scope */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Select Allotted Course to Configure:
                </label>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedConfigSubjectCode('21CS52')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                      selectedConfigSubjectCode === '21CS52'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>21CS52: Computer Networks (Theory)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">3 Credits</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedConfigSubjectCode('21CSL57')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                      selectedConfigSubjectCode === '21CSL57'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>21CSL57: Networks Laboratory (Lab)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">2 Credits</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 sm:text-right">
                <span className="font-semibold text-gray-700 block">Section: 5th Sem CSE - Section A</span>
                <span>Active Scope: <strong className="text-gray-900">{configForm.subjectCode}</strong></span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
              <Shield size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>Subject Teacher Authorization Scope:</strong> You have full administrative authority to configure internal assessments, passing rules, assignment criteria, and marks locking for your allotted subjects. Changes apply directly to student marks calculations and VTU ledger exports.
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveAcademicConfig} className="space-y-4">
            {/* Grid 1: IA Tests & Assignment Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: IA Tests & Max Marks */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-blue-600" />
                    <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                      Internal Assessment (IA) Tests
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    CIE Theory Component
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Number of Mandatory IA Tests</label>
                    <select
                      value={configForm.iaTestCount}
                      onChange={(e) => setConfigForm({ ...configForm, iaTestCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 font-semibold focus:outline-none focus:border-black"
                    >
                      <option value={2}>2 IA Tests (Standard VTU Scheme)</option>
                      <option value={3}>3 IA Tests (Best 2 Averaged)</option>
                    </select>
                    <p className="text-[10.5px] text-gray-400 mt-1">Both IA-1 and IA-2 schedules will be active in student portal.</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      IA Maximum Marks per Test
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="20"
                        max="100"
                        value={configForm.iaMaxMarks}
                        onChange={(e) => setConfigForm({ ...configForm, iaMaxMarks: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 font-mono font-bold focus:outline-none focus:border-black"
                      />
                      <span className="text-gray-500 font-bold shrink-0">Marks</span>
                    </div>
                    <p className="text-[10.5px] text-gray-400 mt-1">
                      Marks entry and student score percentages will scale against <strong className="text-gray-700">{configForm.iaMaxMarks} marks</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      Live CIE Calculation Formula:
                    </span>
                    <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                      CIE Scale = Average of top {configForm.iaTestCount} IA tests scaled to {configForm.iaMaxMarks} marks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Assignment Maximum Marks & Assessment Criteria */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                      Assignment & Coursework Criteria
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                    Continuous Evaluation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Number of Assignments</label>
                      <select
                        value={configForm.assignmentCount}
                        onChange={(e) => setConfigForm({ ...configForm, assignmentCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 font-semibold focus:outline-none focus:border-black"
                      >
                        <option value={1}>1 Assignment</option>
                        <option value={2}>2 Assignments</option>
                        <option value={3}>3 Assignments</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Max Marks / Assignment</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="10"
                          max="50"
                          value={configForm.assignmentMaxMarks}
                          onChange={(e) => setConfigForm({ ...configForm, assignmentMaxMarks: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 font-mono font-bold focus:outline-none focus:border-black"
                        />
                        <span className="text-gray-500 font-bold shrink-0">m</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Assessment Criteria & Evaluation Rubric
                    </label>
                    <textarea
                      rows={3}
                      value={configForm.assessmentCriteria}
                      onChange={(e) => setConfigForm({ ...configForm, assessmentCriteria: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:border-black"
                      placeholder="Specify grading rubric, case study requirements, code execution criteria..."
                    />
                    <p className="text-[10.5px] text-gray-400 mt-1">This rubric is displayed to students on assignment submission pages.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Passing Marks & Attendance Thresholds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 3: Passing Marks and Grading Rules */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                      Passing Marks & Grading Rules
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    VTU Passing Scale
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-gray-700 font-bold">Minimum Passing CIE Percentage</label>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {configForm.passingMarksPercent}% Minimum
                      </span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="50"
                      value={configForm.passingMarksPercent}
                      onChange={(e) => setConfigForm({ ...configForm, passingMarksPercent: Number(e.target.value) })}
                      className="w-full accent-black cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                      <span>IA Pass Cutoff: <strong className="text-gray-900">{Math.round((configForm.iaMaxMarks * configForm.passingMarksPercent) / 100)} / {configForm.iaMaxMarks} m</strong></span>
                      <span>Asg Pass Cutoff: <strong className="text-gray-900">{Math.round((configForm.assignmentMaxMarks * configForm.passingMarksPercent) / 100)} / {configForm.assignmentMaxMarks} m</strong></span>
                    </div>
                  </div>

                  {/* Grading Cutoffs Table */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 block">
                      Grade Classification Cutoffs (% Score):
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <span className="font-bold text-emerald-900 block">Grade A+</span>
                        <span className="text-emerald-700 font-mono font-bold">&ge; {configForm.gradingRules.gradeAPlus}%</span>
                      </div>
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-bold text-blue-900 block">Grade A</span>
                        <span className="text-blue-700 font-mono font-bold">&ge; {configForm.gradingRules.gradeA}%</span>
                      </div>
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="font-bold text-amber-900 block">Grade B</span>
                        <span className="text-amber-700 font-mono font-bold">&ge; {configForm.gradingRules.gradeB}%</span>
                      </div>
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg">
                        <span className="font-bold text-rose-900 block">Grade F</span>
                        <span className="text-rose-700 font-mono font-bold">&lt; {configForm.passingMarksPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Attendance Thresholds, Deadlines & Lock Permissions */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-amber-600" />
                    <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                      Thresholds, Deadlines & Locking
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                    Compliance & Control
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Attendance Shortage Threshold */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-gray-700 font-bold">Attendance Shortage Cutoff</label>
                      <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {configForm.attendanceShortageThreshold}% Minimum
                      </span>
                    </div>
                    <input
                      type="range"
                      min="65"
                      max="90"
                      value={configForm.attendanceShortageThreshold}
                      onChange={(e) => setConfigForm({ ...configForm, attendanceShortageThreshold: Number(e.target.value) })}
                      className="w-full accent-black cursor-pointer"
                    />
                    <p className="text-[10.5px] text-gray-500 mt-1">
                      VTU mandates {configForm.subjectCode.includes('L') ? '85%' : '75%'} minimum attendance. Students below this cutoff receive automated early warning alerts.
                    </p>
                  </div>

                  {/* Marks Entry Deadline */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Marks Entry & Ledger Freeze Deadline</label>
                    <input
                      type="date"
                      value={configForm.marksEntryDeadline}
                      onChange={(e) => setConfigForm({ ...configForm, marksEntryDeadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 font-mono text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Lock & Edit Permissions */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-gray-50/60 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className={configForm.isMarksLocked ? 'text-rose-600' : 'text-gray-400'} />
                        <div>
                          <span className="font-bold text-gray-900 block text-xs">Lock Marks Ledger</span>
                          <span className="text-[10px] text-gray-500">Prevent further score modifications by faculty</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={configForm.isMarksLocked}
                        onChange={(e) => setConfigForm({ ...configForm, isMarksLocked: e.target.checked })}
                        className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-gray-50/60 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className={configForm.allowEditingAfterLock ? 'text-emerald-600' : 'text-gray-400'} />
                        <div>
                          <span className="font-bold text-gray-900 block text-xs">Allow Dispute Corrections</span>
                          <span className="text-[10px] text-gray-500">Permit student correction adjudication even while locked</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={configForm.allowEditingAfterLock}
                        onChange={(e) => setConfigForm({ ...configForm, allowEditingAfterLock: e.target.checked })}
                        className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar: Save & Reset */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-gray-500">
                <span>Last Updated: <strong className="text-gray-800">{configForm.lastUpdated}</strong></span>
                <span className="mx-2">•</span>
                <span>Configured by: <strong className="text-gray-800">{configForm.updatedBy}</strong></span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetAcademicConfig}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to official VTU autonomous defaults"
                >
                  <RotateCcw size={13} />
                  <span>Reset to VTU Baseline</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Save size={13} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ACADEMIC PROFILE & ASSIGNED COURSES */}
      {teacherSettingsTab === 'profile' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
                      Subject Faculty
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {facultyProfile.employeeId}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">{facultyProfile.name}</h3>
                  <p className="text-xs text-gray-500">{facultyProfile.designation} • {facultyProfile.department}</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Faculty profile updated successfully', 'success')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs self-start sm:self-auto cursor-pointer"
              >
                Save Profile
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Faculty profile saved successfully', 'success');
              }}
              className="space-y-4 text-xs font-medium"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Full Faculty Name</label>
                  <input
                    type="text"
                    value={facultyProfile.name}
                    onChange={(e) => setFacultyProfile({ ...facultyProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Employee / Faculty ID</label>
                  <input
                    type="text"
                    disabled
                    value={facultyProfile.employeeId}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={facultyProfile.email}
                    onChange={(e) => setFacultyProfile({ ...facultyProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={facultyProfile.phone}
                    onChange={(e) => setFacultyProfile({ ...facultyProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Cabin Location</label>
                  <input
                    type="text"
                    value={facultyProfile.cabin}
                    onChange={(e) => setFacultyProfile({ ...facultyProfile, cabin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Office Counseling Hours</label>
                  <input
                    type="text"
                    value={facultyProfile.officeHours}
                    onChange={(e) => setFacultyProfile({ ...facultyProfile, officeHours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>
              </div>
            </form>

            {/* Assigned Courses Summary */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                Officially Allotted Courses (VTU 2022 Scheme)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">21CS52 • Computer Networks</span>
                    <p className="text-[11px] text-slate-500">5th Sem CSE-A (64 Enrolled) • Theory (3 Credits)</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Lead Faculty</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">21CSL57 • Computer Networks Lab</span>
                    <p className="text-[11px] text-slate-500">5th Sem CSE-A (64 Enrolled) • Lab (2 Credits)</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Lab Incharge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Session & Sign Out Card */}
          <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <LogOut size={16} />
                </span>
                <h4 className="text-sm font-bold text-gray-900">Faculty Session & Sign Out</h4>
              </div>
              <p className="text-xs text-gray-500 max-w-xl">
                Sign out of the Academio Faculty Workspace on this device. You will need your faculty login credentials to mark attendance and grade assessments.
              </p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 transition-colors border border-rose-200 shrink-0 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out / Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     MODALS: ATTENDANCE, STUDENT CARD, DISPUTE RESOLUTION, LOGOUT
  ========================================================================================= */
  return (
    <div>
      {currentSection === 'my-classes-subjects' && renderMyClasses()}
      {currentSection === 'academic-management' && renderAcademicManagement()}
      {currentSection === 'settings' && renderSettings()}
      {currentSection === 'dashboard' && renderDashboard()}
      {/* Attendance Modal */}
      {isTakeAttendanceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-4 sm:p-5 shadow-xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="min-w-0 pr-2">
                <h3 className="font-bold text-base text-slate-900 truncate">Mark Class Attendance</h3>
                <p className="text-xs text-slate-500 truncate">
                  {selectedSubject.code} · {selectedSubject.name} · {selectedSubject.className}
                </p>
              </div>
              <button
                onClick={() => setIsTakeAttendanceOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-800 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-3 sm:py-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Session Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Timetable Period</label>
                  <select
                    value={attendancePeriod}
                    onChange={e => setAttendancePeriod(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value={1}>Period 1 (09:00 AM – 10:00 AM)</option>
                    <option value={2}>Period 2 (10:00 AM – 11:00 AM)</option>
                    <option value={3}>Period 3 (11:15 AM – 12:15 PM)</option>
                    <option value={4}>Period 4 (12:15 PM – 01:15 PM)</option>
                    <option value={5}>Period 5 (02:00 PM – 03:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Selected Batch</label>
                  <select
                    value={selectedSubject.code}
                    onChange={e => {
                      const found = assignedSubjects.find(s => s.code === e.target.value);
                      if (found) setSelectedSubject(found);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    {assignedSubjects.map((s, i) => (
                      <option key={i} value={s.code}>{s.code} · {s.className}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Lecture Topic Covered</label>
                <input
                  type="text"
                  placeholder="e.g. Distance Vector Routing & Bellman-Ford equation"
                  value={attendanceTopic}
                  onChange={e => setAttendanceTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Attendance Quick Toggle Header */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-slate-800">
                  Student Roll Call ({classAStudents.length} Students)
                </span>
                <div className="flex items-center gap-1.5 w-full xs:w-auto">
                  <button
                    type="button"
                    onClick={() => markAllAttendance(true)}
                    className="flex-1 xs:flex-initial px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors text-center"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAllAttendance(false)}
                    className="flex-1 xs:flex-initial px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors text-center"
                  >
                    All Absent
                  </button>
                </div>
              </div>

              {/* Roll Call List */}
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                {classAStudents.map(student => {
                  const isPresent = studentAttendanceMap[student.id] ?? true;
                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudentAttendance(student.id)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors select-none ${
                        isPresent ? 'bg-white hover:bg-emerald-50/20' : 'bg-rose-50/40 hover:bg-rose-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`size-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPresent ? <Check size={13} /> : <X size={13} />}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="font-semibold text-xs text-slate-900 truncate">{student.name}</div>
                          <div className="font-mono tabular-nums text-[11px] text-slate-400">{student.usn}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-xs text-gray-600 font-semibold flex items-center justify-between sm:justify-start gap-2">
                <span>Summary:</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                    {Object.values(studentAttendanceMap).filter(Boolean).length} Present
                  </span>
                  <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                    {classAStudents.length - Object.values(studentAttendanceMap).filter(Boolean).length} Absent
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsTakeAttendanceOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-black text-xs shadow-xs"
                >
                  Save & Lock Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Inspect Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Subject Academic Card</h3>
              <button
                onClick={() => setInspectStudent(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-black">
                  {inspectStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{inspectStudent.name}</h4>
                  <p className="font-mono text-gray-500">{inspectStudent.usn}</p>
                  <p className="text-[11px] text-gray-400">{inspectStudent.className}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Course Code:</span>
                  <span className="text-gray-900">Computer Networks (21CS52)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Subject Attendance:</span>
                  <span className={inspectStudent.usn === '1RV22CS084' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {inspectStudent.usn === '1RV22CS084' ? '71.4% (25 of 35 lectures)' : '88.6% (31 of 35 lectures)'}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">IA-1 Score:</span>
                  <span className="text-gray-900 font-bold">22 / 30</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">IA-2 Score:</span>
                  <span className="text-gray-900 font-bold">19 / 30</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Lab Continuous Evaluation:</span>
                  <span className="text-emerald-600 font-bold">36 / 50</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900">
                <p className="font-bold text-[11px]">Faculty Recommendation:</p>
                <p className="text-[11px] mt-0.5 font-medium">
                  {inspectStudent.usn === '1RV22CS084'
                    ? 'Advise student to attend next 5 consecutive lectures to reach VTU 75% exam threshold.'
                    : 'Performance is on track. Advise participation in advanced socket programming mini-project.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectStudent(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Review & Adjudication Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Adjudicate Student Dispute</h3>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{selectedDispute.studentName}</span>
                  <span className="font-mono text-gray-500">{selectedDispute.studentUsn}</span>
                </div>
                <p className="text-gray-700 font-medium">{selectedDispute.details}</p>
                <div className="text-[11px] font-mono pt-1 text-gray-600">
                  Recorded: <strong>{selectedDispute.originalValue}</strong> → Claimed: <strong>{selectedDispute.requestedValue}</strong>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Faculty Reason & Verification Ledger Note</label>
                <textarea
                  rows={3}
                  placeholder="Enter remarks explaining whether physical register matched the claim..."
                  value={disputeResolutionText}
                  onChange={e => setDisputeResolutionText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleResolveDispute('rejected')}
                className="px-4 py-2 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
              >
                Reject Claim
              </button>
              <button
                onClick={() => handleResolveDispute('approved')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs"
              >
                Approve & Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Faculty Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your session as <span className="font-semibold text-gray-800">Subject Faculty (Prof. Ananya Sharma)</span>? You will need your faculty credentials to sign back in.
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
                    showToast('Logged out of Academio Subject Faculty session', 'info');
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

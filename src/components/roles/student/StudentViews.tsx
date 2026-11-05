import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Award,
  ClipboardList,
  User,
  AlertTriangle,
  Clock,
  HelpCircle,
  X,
  Upload,
  ChevronRight,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { studentRahulAttendance, studentRahulIAMarks } from '../../../data/mockData';

interface StudentViewsProps {
  onLogout?: () => void;
}

export const StudentViews: React.FC<StudentViewsProps> = ({ onLogout }) => {
  const {
    currentPage,
    setCurrentPage,
    alerts,
    assignments,
    showToast,
    logActivity
  } = useApp();

  // Student Persona: Rahul Sharma (1RV22CS084, 5th Sem CSE-A, RVCE)
  // Consolidated profile with guardian, address, admission category, and campus ID removed
  const [studentProfile, setStudentProfile] = useState({
    name: 'Rahul Sharma',
    usn: '1RV22CS084',
    college: 'RV College of Engineering (RVCE)',
    branch: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
    classroom: 'CR-304 (Alan Turing Block)',
    email: 'rahul.cs22@rvce.edu.in',
    phone: '+91 98450 12345',
    bloodGroup: 'O+ve',
    dob: '14 August 2004',
    overallAttendance: 82.4,
    attendedClasses: 151,
    totalClasses: 184,
    avgIA: 78.5,
    cgpa: '8.43',
    mentorName: 'Dr. K. Srinivas',
    mentorDesignation: 'Assoc. Professor, Dept. of CSE',
    mentorEmail: 'srinivas.k@rvce.edu.in',
    academicYear: '2025-2026'
  });

  // State for sub-navigation tabs within academics
  const [academicsTab, setAcademicsTab] = useState<'attendance' | 'ia-marks' | 'assignments'>('attendance');

  // Deep-linking synchronization: automatically activate corresponding sub-tab
  useEffect(() => {
    if (currentPage === 'attendance') setAcademicsTab('attendance');
    else if (currentPage === 'ia-marks') setAcademicsTab('ia-marks');
    else if (currentPage === 'assignments') setAcademicsTab('assignments');
  }, [currentPage]);

  const studentAlerts = alerts.filter(a => a.studentUsn === '1RV22CS084');

  // Attendance & Correction State
  const [subjectAttendance] = useState(studentRahulAttendance);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeForm, setDisputeForm] = useState({
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    type: 'attendance' as 'attendance' | 'ia_marks',
    originalValue: 'Absent on Oct 11, Period 2',
    requestedValue: 'Present (Attended Lecture)',
    details: ''
  });

  // Assignment Submission State
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedAssignmentToSubmit, setSelectedAssignmentToSubmit] = useState<any | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Session & Logout Dialog State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    phone: studentProfile.phone
  });

  // Submit dispute handler
  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.details.trim()) {
      showToast('Please describe your correction reason', 'error');
      return;
    }
    const ticketId = Math.floor(1000 + Math.random() * 9000);
    showToast(`Correction ticket #${ticketId} submitted to faculty for ${disputeForm.subjectName}.`, 'success');
    logActivity('Correction Request Filed', studentProfile.name, 'Student', `Disputed ${disputeForm.type} in ${disputeForm.subjectCode}`);
    setIsDisputeModalOpen(false);
    setDisputeForm({
      subjectCode: '21CS52',
      subjectName: 'Computer Networks',
      type: 'attendance',
      originalValue: 'Absent on Oct 11, Period 2',
      requestedValue: 'Present (Attended Lecture)',
      details: ''
    });
  };

  // Submit assignment handler
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName) {
      showToast('Please choose or upload a solution file', 'error');
      return;
    }
    showToast(`Successfully submitted "${selectedAssignmentToSubmit.title}" to ${selectedAssignmentToSubmit.teacherName}!`, 'success');
    logActivity('Assignment Submitted', studentProfile.name, 'Student', `Submitted solution for ${selectedAssignmentToSubmit.title}`);
    setSelectedAssignmentToSubmit(null);
    setUploadedFileName('');
    setSubmissionNotes('');
  };

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentProfile(prev => ({
      ...prev,
      phone: profileEditForm.phone
    }));
    setIsEditProfileOpen(false);
    showToast('Contact phone number updated successfully', 'success');
  };

  /* =========================================================================================
     1. DASHBOARD VIEW (Clean, Information-Dense SaaS ERP)
  ========================================================================================= */
  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Student Profile Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-900">{studentProfile.college}</span>
            <span aria-hidden="true">·</span>
            <span>Sem 5-A</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700">{studentProfile.usn}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {studentProfile.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-500" /> VTU Exam Eligible
            </span>
            <span aria-hidden="true">·</span>
            <span>{studentProfile.branch}</span>
            <span aria-hidden="true">·</span>
            <span>CGPA: <strong className="font-mono text-slate-900">{studentProfile.cgpa}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
          <div className="px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-center min-w-[90px]">
            <span className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider block">Attendance</span>
            <span className="text-base font-bold font-mono tabular-nums text-emerald-600">
              {studentProfile.overallAttendance}%
            </span>
          </div>
          <div className="px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-center min-w-[90px]">
            <span className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider block">Avg CIE</span>
            <span className="text-base font-bold font-mono tabular-nums text-blue-600">
              {studentProfile.avgIA}%
            </span>
          </div>
        </div>
      </div>

      {/* Early Alert Notification Strip (if any alert) */}
      {studentAlerts.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded bg-rose-600 text-white shrink-0">
              <AlertTriangle size={14} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-rose-950 font-mono mr-1.5">21CS52</span>
              <span className="text-rose-900 font-medium">{studentAlerts[0].title}</span>
              <span className="text-rose-600 text-[11px] ml-1.5">({studentAlerts[0].recommendedAction})</span>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentPage('my-academics');
              setAcademicsTab('attendance');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1 shadow-2xs"
          >
            <span>What-If Plan</span> <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* 4 Compact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div
          onClick={() => {
            setCurrentPage('my-academics');
            setAcademicsTab('attendance');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Attendance</span>
            <div className="p-1 rounded bg-emerald-50 text-emerald-600">
              <CalendarCheck size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{studentProfile.overallAttendance}%</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            <span className="font-mono">{studentProfile.attendedClasses}/{studentProfile.totalClasses}</span> lectures
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${studentProfile.overallAttendance}%` }} />
          </div>
        </div>

        <div
          onClick={() => {
            setCurrentPage('my-academics');
            setAcademicsTab('ia-marks');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">IA Average</span>
            <div className="p-1 rounded bg-blue-50 text-blue-600">
              <Award size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">{studentProfile.avgIA}%</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Passing: Above 40%</div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${studentProfile.avgIA}%` }} />
          </div>
        </div>

        <div
          onClick={() => {
            setCurrentPage('my-academics');
            setAcademicsTab('assignments');
          }}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Assignments</span>
            <div className="p-1 rounded bg-purple-50 text-purple-600">
              <ClipboardList size={13} />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">2 Pending</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Due in next 6 days</div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '66%' }} />
          </div>
        </div>

        <div
          onClick={() => setCurrentPage('profile')}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Mentor</span>
            <div className="p-1 rounded bg-slate-100 text-slate-700">
              <User size={13} />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 line-clamp-1">{studentProfile.mentorName}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Cabin CS-304 · Wed 3–4 PM</div>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-blue-600 font-semibold">
            <span>View Profile</span> <ChevronRight size={10} />
          </div>
        </div>
      </div>

      {/* Course-Wise Attendance Grid */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            Course-Wise Attendance Status
          </h2>
          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <HelpCircle size={12} />
            <span>Dispute Record</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {subjectAttendance.map((sub) => {
            const isCritical = sub.percentage < 75;
            const isWarning = sub.percentage >= 75 && sub.percentage < 80;

            return (
              <div
                key={sub.subjectCode}
                className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-colors space-y-2 flex flex-col justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                      {sub.subjectCode}
                    </span>
                    <span
                      className={`text-[11px] font-bold font-mono tabular-nums px-1.5 py-0.2 rounded ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{sub.subjectName}</h3>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500">
                    <span className="font-mono">{sub.attended} / {sub.total} classes</span>
                    <span className="truncate max-w-[110px]">{sub.teacherName}</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* =========================================================================================
     2. MY PROFILE VIEW (CONSOLIDATED)
     - Consolidates all student information into one complete profile
     - Removed Admission Category option
     - Removed Guardian Details, Address, and Campus ID fields
  ========================================================================================= */
  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              RS
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Undergraduate Student
                </span>
                <span className="text-xs text-slate-400 font-mono">USN: {studentProfile.usn}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{studentProfile.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Bachelor of Engineering in {studentProfile.branch} · Semester {studentProfile.semester}, Section {studentProfile.section}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setProfileEditForm({
                phone: studentProfile.phone
              });
              setIsEditProfileOpen(true);
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
          >
            Edit Contact
          </button>
        </div>

        {/* Section 1: Academic & University Registration */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Academic & University Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">College Affiliation</span>
              <p className="text-slate-900 font-semibold">{studentProfile.college}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">University Scheme</span>
              <p className="text-slate-900 font-semibold">VTU Belagavi (2022 Scheme)</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Classroom Assigned</span>
              <p className="text-slate-900 font-semibold">{studentProfile.classroom}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Academic Term</span>
              <p className="text-slate-900 font-semibold">2025–2026 (Odd Semester)</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Student Email</span>
              <p className="text-slate-900 font-semibold truncate">{studentProfile.email}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Contact Mobile</span>
              <p className="text-slate-900 font-mono font-semibold">{studentProfile.phone}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Assigned Faculty Mentor */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Assigned Faculty Mentor</span>
              <p className="text-sm font-bold text-slate-900">{studentProfile.mentorName}</p>
              <p className="text-xs text-slate-500">{studentProfile.mentorDesignation} · {studentProfile.mentorEmail}</p>
            </div>
          </div>
          <button
            onClick={() => showToast(`Drafting email to mentor: ${studentProfile.mentorEmail}`, 'info')}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors self-start sm:self-auto shadow-2xs"
          >
            Message Mentor
          </button>
        </div>

        {/* Section 3: VTU CGPA & Academic History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">VTU Grade Point Progression</h3>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded">
              Cumulative CGPA: {studentProfile.cgpa}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Sem 1 SGPA</span>
              <span className="text-slate-900 font-mono font-bold text-sm mt-0.5 block">8.42</span>
              <span className="text-[10px] text-emerald-700 font-medium">Distinction</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Sem 2 SGPA</span>
              <span className="text-slate-900 font-mono font-bold text-sm mt-0.5 block">8.65</span>
              <span className="text-[10px] text-emerald-700 font-medium">Distinction</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Sem 3 SGPA</span>
              <span className="text-slate-900 font-mono font-bold text-sm mt-0.5 block">8.15</span>
              <span className="text-[10px] text-emerald-700 font-medium">Distinction</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
              <span className="text-blue-600 block text-[10px] font-semibold uppercase">Sem 4 SGPA</span>
              <span className="text-blue-950 font-mono font-bold text-sm mt-0.5 block">8.50</span>
              <span className="text-[10px] text-blue-700 font-medium">Distinction</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
            <h4 className="font-semibold text-slate-900">University Examination Standing</h4>
            <p className="text-slate-600 leading-relaxed">
              VTU Belagavi criteria mandates zero active backlogs to remain eligible for 7th-semester campus placements.
              Current record shows <strong className="text-emerald-700">0 backlogs</strong> with 100% credit completion (88/88 earned credits).
            </p>
          </div>
        </div>
      </div>

      {/* Account Session & Sign Out Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-600">
              <LogOut size={14} />
            </span>
            <h4 className="text-xs font-bold text-slate-900">Account Session & Logout</h4>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Sign out of the Academio Student Portal on this device. You will need your USN credentials to sign back in.
          </p>
        </div>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="px-3.5 py-1.5 rounded-md bg-white hover:bg-rose-50 text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-rose-200 shrink-0 cursor-pointer shadow-2xs"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Update Contact Details</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Student Mobile Number</label>
                <input
                  type="text"
                  required
                  value={profileEditForm.phone}
                  onChange={e => setProfileEditForm({ ...profileEditForm, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 font-black text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     3. MY ACADEMICS (Attendance, IA Marks, Assignments)
     - Assignments display ONLY the assignment deadline in the relevant section
  ========================================================================================= */
  const renderMyAcademics = () => (
    <div className="space-y-6">
      {/* Header and Sub-Tab Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">My Academics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage attendance records, internal assessments, coursework assignments, and correction disputes.
          </p>
        </div>

        {/* Action Button depending on active tab */}
        {academicsTab === 'attendance' && (
          <button
            onClick={() => {
              setDisputeForm({
                subjectCode: '21CS52',
                subjectName: 'Computer Networks',
                type: 'attendance',
                originalValue: 'Absent on Oct 11, Period 2',
                requestedValue: 'Present (Attended Lecture)',
                details: ''
              });
              setIsDisputeModalOpen(true);
            }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <HelpCircle size={14} /> Raise Attendance Dispute
          </button>
        )}
        {academicsTab === 'ia-marks' && (
          <button
            onClick={() => {
              setDisputeForm({
                subjectCode: '21CS52',
                subjectName: 'Computer Networks',
                type: 'ia_marks',
                originalValue: 'CIE-1: 14/20',
                requestedValue: '17/20 (Recalculated Question 3b)',
                details: ''
              });
              setIsDisputeModalOpen(true);
            }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <HelpCircle size={14} /> Dispute IA Score
          </button>
        )}
      </div>

      {/* Sub-Tabs: Attendance, IA Marks, Assignments */}
      <div className="flex border-b border-gray-200 bg-white px-3 sm:px-6 rounded-2xl shadow-sm gap-3 sm:gap-6 text-xs font-bold overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setAcademicsTab('attendance')}
          className={`py-3.5 sm:py-4 border-b-2 transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
            academicsTab === 'attendance'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <CalendarCheck size={16} />
          <span>Attendance Ledger</span>
        </button>
        <button
          onClick={() => setAcademicsTab('ia-marks')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            academicsTab === 'ia-marks'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Award size={16} />
          <span>Internal Assessment (CIE) Marks</span>
        </button>
        <button
          onClick={() => setAcademicsTab('assignments')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            academicsTab === 'assignments'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ClipboardList size={16} />
          <span>Assignments & Deadlines</span>
          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            2 Due
          </span>
        </button>
      </div>

      {/* TAB 1: ATTENDANCE LEDGER */}
      {academicsTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-emerald-500 text-white flex flex-col items-center justify-center font-black">
                <span className="text-lg leading-tight">{studentProfile.overallAttendance}%</span>
                <span className="text-[9px] uppercase font-bold text-emerald-100">Overall</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Semester 5 Cumulative Attendance Record</h3>
                <p className="text-xs text-gray-500">
                  {studentProfile.attendedClasses} attended out of {studentProfile.totalClasses} total lectures held
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Above 75.0% Mandatory Cutoff
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-xs font-medium max-w-sm">
              <ShieldCheck size={16} className="text-blue-600 mb-1" />
              VTU regulations mandate minimum 75% attendance in theory and 85% in laboratory subjects to sit for SEE.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectAttendance.map((sub) => {
              const isShortage = sub.percentage < 75;
              const isBorderline = sub.percentage >= 75 && sub.percentage < 80;

              return (
                <div
                  key={sub.subjectCode}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                        {sub.subjectCode}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isShortage
                            ? 'bg-rose-100 text-rose-800'
                            : isBorderline
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {sub.percentage}%
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{sub.subjectName}</h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">Faculty: {sub.teacherName}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-gray-600 font-semibold">
                        <span>Attendance Count:</span>
                        <span>{sub.attended} / {sub.total} classes</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isShortage ? 'bg-rose-500' : isBorderline ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400">Ledger: Live</span>
                    <button
                      onClick={() => {
                        setDisputeForm({
                          subjectCode: sub.subjectCode,
                          subjectName: sub.subjectName,
                          type: 'attendance',
                          originalValue: `Attendance: ${sub.percentage}% (${sub.attended}/${sub.total})`,
                          requestedValue: 'Attendance re-check requested',
                          details: ''
                        });
                        setIsDisputeModalOpen(true);
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Dispute Record
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERNAL ASSESSMENT (CIE) MARKS */}
      {academicsTab === 'ia-marks' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-gray-900">Continuous Internal Evaluation (CIE) Record</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Evaluations conducted in accordance with VTU 2022 Scheme (Out of 50 per course).
              </p>
            </div>
            <div className="text-xs font-bold text-gray-500">
              Department Average: <strong className="text-gray-900">37.1 / 50</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentRahulIAMarks.map((ia) => (
              <div key={ia.subjectCode} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-mono text-xs font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                      {ia.subjectCode}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">{ia.subjectName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-600">
                      {ia.totalMarks} <span className="text-xs text-gray-400 font-normal">/ {ia.maxTotal}</span>
                    </span>
                    <span className="block text-[10px] font-bold text-emerald-600">
                      {ia.percentage}% • Grade {ia.grade}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 text-[10px] font-bold block">IA-1 ({ia.ia1Max})</span>
                    <span className="font-black text-gray-900 text-sm">{ia.ia1}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 text-[10px] font-bold block">IA-2 ({ia.ia2Max})</span>
                    <span className="font-black text-gray-900 text-sm">{ia.ia2}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 text-[10px] font-bold block">Assignment</span>
                    <span className="font-black text-gray-900 text-sm">{ia.assignmentScore}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 text-[10px] font-bold block">Class Avg</span>
                    <span className="font-black text-gray-900 text-sm">{ia.classAverage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & DEADLINES (ONLY DEADLINE DISPLAYED) */}
      {academicsTab === 'assignments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Filter By Status:</span>
              {(['all', 'pending', 'submitted', 'graded'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAssignmentFilter(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                    assignmentFilter === f
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              Showing {assignments.length} Total Coursework Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assignments
              .filter(asg => {
                if (assignmentFilter === 'all') return true;
                if (assignmentFilter === 'pending') return asg.studentSubmissionStatus !== 'submitted' && asg.studentSubmissionStatus !== 'graded';
                return asg.studentSubmissionStatus === assignmentFilter;
              })
              .map((asg) => {
                const isSubmitted = asg.studentSubmissionStatus === 'submitted' || asg.studentSubmissionStatus === 'graded';
                return (
                  <div key={asg.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                          {asg.subjectCode}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            asg.studentSubmissionStatus === 'graded'
                              ? 'bg-purple-100 text-purple-800'
                              : isSubmitted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asg.studentSubmissionStatus || 'Pending'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-gray-900">{asg.title}</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{asg.description}</p>
                    </div>

                    {/* Meta section: Displays ONLY the assignment deadline */}
                    <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-gray-400">Deadline:</span>
                        <span className="text-gray-900 font-bold flex items-center gap-1.5">
                          <Clock size={13} className="text-amber-600" />
                          {asg.dueDate}
                        </span>
                      </div>

                      {!isSubmitted ? (
                        <button
                          onClick={() => setSelectedAssignmentToSubmit(asg)}
                          className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Upload Solution
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-gray-100 text-gray-500 font-bold text-xs rounded-xl cursor-default"
                        >
                          Submitted ✓
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  // Top-Level Router based on currentPage
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
      case 'settings':
        return renderProfile();
      case 'my-academics':
      case 'attendance':
      case 'ia-marks':
      case 'assignments':
        return renderMyAcademics();
      default:
        return renderDashboard();
    }
  };

  return (
    <div>
      {renderCurrentView()}

      {/* Global Correction Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Raise Academic Correction / Dispute</h3>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Dispute Type</label>
                <select
                  value={disputeForm.type}
                  onChange={e => setDisputeForm({ ...disputeForm, type: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="attendance">Attendance Ledger Discrepancy</option>
                  <option value="ia_marks">Internal Assessment Marks Re-check</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Subject</label>
                <select
                  value={disputeForm.subjectCode}
                  onChange={e => {
                    const code = e.target.value;
                    const sub = subjectAttendance.find(s => s.subjectCode === code);
                    setDisputeForm({
                      ...disputeForm,
                      subjectCode: code,
                      subjectName: sub?.subjectName || ''
                    });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {subjectAttendance.map(s => (
                    <option key={s.subjectCode} value={s.subjectCode}>
                      {s.subjectCode} - {s.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Current Portal Record</label>
                  <input
                    type="text"
                    value={disputeForm.originalValue}
                    onChange={e => setDisputeForm({ ...disputeForm, originalValue: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Claimed Correct Value</label>
                  <input
                    type="text"
                    value={disputeForm.requestedValue}
                    onChange={e => setDisputeForm({ ...disputeForm, requestedValue: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Justification & Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide lecture date, period, medical certificate details, or test question paper question number..."
                  value={disputeForm.details}
                  onChange={e => setDisputeForm({ ...disputeForm, details: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 font-black text-xs"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Assignment Submission Modal */}
      {selectedAssignmentToSubmit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Upload Assignment Solution</h3>
              <button
                onClick={() => setSelectedAssignmentToSubmit(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px]">Assignment</label>
                <p className="font-bold text-sm text-gray-900">{selectedAssignmentToSubmit.title}</p>
                <p className="text-gray-500">{selectedAssignmentToSubmit.subjectName}</p>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-200 hover:border-black rounded-2xl text-center cursor-pointer transition-colors">
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-700">Click to choose or drag submission PDF / ZIP</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Maximum file size: 25MB</p>
                <input
                  type="file"
                  className="hidden"
                  id="solution-upload"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <label
                  htmlFor="solution-upload"
                  className="mt-3 inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-xs cursor-pointer"
                >
                  Select File
                </label>
                {uploadedFileName && (
                  <p className="mt-2 text-emerald-600 font-bold">Selected: {uploadedFileName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Student Comments (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add GitHub repo link, test setup notes, or execution commands..."
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentToSubmit(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 font-black text-xs"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
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
            <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Student Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your student portal session as <span className="font-semibold text-gray-800">Rahul Sharma (1RV22CS084)</span>? You will be safely signed out and returned to the login screen.
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
                    showToast('Logged out of Academio Student Portal', 'info');
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

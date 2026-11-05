export type UserRole = 'admin' | 'class_teacher' | 'teacher' | 'student';

export interface College {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  totalClasses: number;
  totalTeachers: number;
  totalStudents: number;
  status: 'active' | 'suspended';
  affiliation: string;
  establishedYear: number;
}

export interface ClassTeacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  collegeName: string;
  department: string;
  assignedClass: string;
  assignedClassId: string;
  totalStudents: number;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface SubjectTeacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  collegeName: string;
  department: string;
  assignedSubjects: {
    code: string;
    name: string;
    classId: string;
    className: string;
  }[];
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Student {
  id: string;
  usn: string;
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  collegeName: string;
  classId: string;
  className: string;
  semester: number;
  branch: string;
  overallAttendance: number;
  totalClassesAttended: number;
  totalClassesHeld: number;
  avgIA: number;
  alertsCount: number;
  status: 'active' | 'inactive';
  avatar?: string;
  mentorName?: string;
}

export interface ClassSection {
  id: string;
  collegeId: string;
  collegeName: string;
  name: string; // e.g. "5th Sem CSE - Section A"
  semester: number;
  department: string;
  section: string;
  totalStudents: number;
  classTeacherId: string;
  classTeacherName: string;
  roomNumber: string;
  academicYear: string;
}

export interface Department {
  id: string;
  collegeId: string;
  name: string;
  code: string;
  hodName: string;
  totalStudents: number;
  totalTeachers: number;
}

export interface Subject {
  id: string;
  collegeId: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  type: 'Theory' | 'Lab' | 'Integrated';
  syllabusHours: number;
  assignedTeacherName?: string;
}

export interface SubjectAttendanceSummary {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  teacherName: string;
  status: 'safe' | 'warning' | 'critical';
}

export interface SubjectIAMarks {
  subjectCode: string;
  subjectName: string;
  ia1: number;
  ia1Max: number;
  ia2: number;
  ia2Max: number;
  labInternal?: number;
  labMax?: number;
  assignmentScore: number;
  totalMarks: number;
  maxTotal: number;
  percentage: number;
  classAverage: number;
  grade: string;
}

export interface AttendanceSession {
  id: string;
  collegeId: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  period: number;
  totalStudents: number;
  presentCount: number;
  records: {
    studentId: string;
    usn: string;
    name: string;
    isPresent: boolean;
  }[];
}

export interface IAMarksEntry {
  id: string;
  collegeId: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  teacherId: string;
  assessmentType: 'IA-1' | 'IA-2' | 'Lab Test';
  maxMarks: number;
  date: string;
  records: {
    studentId: string;
    usn: string;
    name: string;
    marks: number;
  }[];
}

export interface Assignment {
  id: string;
  collegeId: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  submissionsCount: number;
  totalStudents: number;
  status: 'active' | 'closed' | 'evaluating';
  studentSubmissionStatus?: 'pending' | 'submitted' | 'graded' | 'overdue';
  studentScore?: number;
}

export interface AcademicAlert {
  id: string;
  studentId: string;
  studentUsn: string;
  studentName: string;
  collegeId: string;
  classId: string;
  className: string;
  subjectCode?: string;
  subjectName?: string;
  type: 'attendance_critical' | 'attendance_warning' | 'ia_decline' | 'overdue_assignment';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  reason: string;
  thresholdValue: number;
  currentValue: number;
  recommendedAction: string;
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
}

export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentUsn: string;
  studentName: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  type: 'attendance' | 'ia_marks';
  details: string;
  requestedValue: string;
  originalValue: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  resolutionNote?: string;
}

export interface Announcement {
  id: string;
  collegeId: string | 'all';
  title: string;
  content: string;
  targetRole: 'all' | 'students' | 'teachers' | 'class_teachers';
  priority: 'urgent' | 'high' | 'normal';
  authorName: string;
  authorRole: string;
  date: string;
  category: 'Circular' | 'Exam' | 'Academic' | 'General';
}

export interface ActivityLog {
  id: string;
  collegeId?: string;
  action: string;
  performedBy: string;
  role: string;
  timestamp: string;
  details: string;
}

export interface AcademicConfig {
  minAttendancePercent: number;
  attendanceWarningPercent: number;
  attendanceCriticalPercent: number;
  iaWarningThresholdPercent: number;
  academicYear: string;
  semesterType: 'Odd' | 'Even';
  alertEvaluationFrequency: 'Daily' | 'Weekly' | 'Realtime';
  autoNotifyMentors: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  identifier: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  assignedClass?: string;
  assignedClassId?: string;
  phone?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  performedBy: string;
  performerRole: string;
  action: string;
  targetResource: string;
  status: 'success' | 'warning' | 'info';
  details: string;
}

export interface StudentJoinRequest {
  id: string;
  studentName: string;
  usn: string;
  email: string;
  phone: string;
  branch: string;
  semester: number;
  section: string;
  classId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface SubjectAssessmentConfig {
  id: string;
  subjectCode: string;
  subjectName: string;
  classId: string;
  className: string;
  department: string;
  iaTestCount: number; // e.g. 2 or 3
  iaMaxMarks: number; // e.g. 30 (or 25 for labs)
  assignmentCount: number; // e.g. 2
  assignmentMaxMarks: number; // e.g. 20
  passingMarksPercent: number; // e.g. 40
  gradingRules: {
    gradeAPlus: number;
    gradeA: number;
    gradeB: number;
    gradeC: number;
    gradeF: number;
  };
  attendanceShortageThreshold: number; // e.g. 75% or 85%
  marksEntryDeadline: string;
  isMarksLocked: boolean;
  allowEditingAfterLock: boolean;
  assessmentCriteria: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface AssessmentHistoryRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  type: 'IA-1' | 'IA-2' | 'IA-3' | 'Assignment' | 'Lab Internal';
  maxMarks: number;
  evaluatedCount: number;
  totalStudents: number;
  classAverage: number;
  highestScore: number;
  passPercentage: number;
  date: string;
  isLocked: boolean;
  status: 'Published' | 'Draft';
}


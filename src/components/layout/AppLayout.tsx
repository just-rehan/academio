import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  FolderTree,
  Sliders,
  BarChart3,
  FileSpreadsheet,
  History,
  Settings,
  User,
  Bell,
  ChevronDown,
  Menu,
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  Award,
  CalendarCheck,
  LogOut,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/academic';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  onExitToLanding?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onLogout, onExitToLanding }) => {
  const {
    currentRole,
    selectedCollegeId,
    currentPage,
    setCurrentPage,
    colleges,
    alerts,
    announcements,
    auditLogs,
    toasts,
    dismissToast,
    showToast,
    studentJoinRequests,
    correctionRequests
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'alerts' | 'audit'>('alerts');
  const [navHistory, setNavHistory] = useState<string[]>(['dashboard']);

  useEffect(() => {
    setNavHistory((prev) => {
      if (prev[prev.length - 1] === currentPage) return prev;
      return [...prev, currentPage];
    });
  }, [currentPage]);

  const handleBack = () => {
    setIsMobileSidebarOpen(false);
    if (onExitToLanding) {
      onExitToLanding();
    }
    try {
      window.history.pushState(null, '', '/');
    } catch {
      // ignore
    }
  };

  const activeCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];
  const pendingRequestsCount = studentJoinRequests?.filter((r) => r.status === 'pending').length || 0;
  const teacherCorrectionsCount = (correctionRequests || []).filter((r) => (r.subjectCode === '21CS52' || r.subjectCode === '21CSL57') && r.status === 'pending').length;

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'Users', icon: Users },
    { id: 'teacher-management', label: 'Teachers', icon: UserCheck },
    { id: 'student-management', label: 'Students', icon: GraduationCap },
    { id: 'class-teacher-management', label: 'Class Teachers', icon: Shield },
    { id: 'classes-overview', label: 'Classes', icon: FolderTree },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const classTeacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-classroom', label: 'Classroom', icon: FolderTree },
    { id: 'student-management', label: 'Students', icon: Users, badge: pendingRequestsCount },
    { id: 'teacher-management', label: 'Teachers', icon: UserCheck },
    { id: 'academic-management', label: 'Academics', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-classes-subjects', label: 'Classes', icon: BookOpen },
    { id: 'academic-management', label: 'Academics', icon: CalendarCheck, badge: teacherCorrectionsCount > 0 ? teacherCorrectionsCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-academics', label: 'Academics', icon: CalendarCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentNavItems =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'class_teacher'
      ? classTeacherNavItems
      : currentRole === 'teacher'
      ? teacherNavItems
      : studentNavItems;

  const getRoleDetails = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Admin (Platform Owner)',
          badgeText: 'Admin',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
          userName: 'Prof. Rehan (Admin)',
          sub: 'Platform Controller • All Colleges'
        };
      case 'class_teacher':
        return {
          title: 'Class Teacher',
          badgeText: 'Class Teacher',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          userName: 'Dr. K. Srinivas',
          sub: '5th Sem CSE-A Coordinator • RVCE'
        };
      case 'teacher':
        return {
          title: 'Subject Teacher',
          badgeText: 'Teacher',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          userName: 'Prof. Ananya Sharma',
          sub: 'Computer Networks & DBMS • RVCE'
        };
      case 'student':
        return {
          title: 'Student',
          badgeText: 'Student',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          userName: 'Rahul Sharma',
          sub: 'USN: 1RV22CS084 • 5th Sem CSE-A'
        };
    }
  };

  const roleInfo = getRoleDetails(currentRole);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* 1. Left Sidebar (Role-Specific Desktop Sidebar & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 h-screen bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-150 ease-out md:static md:translate-x-0 md:w-60 md:h-screen shadow-xl md:shadow-none shrink-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header: Academio Logo Only (Clickable, navigates directly to landing page /) + Mobile Close */}
        <div className="p-3 border-b border-slate-200/80 bg-white flex items-center justify-between gap-2 h-13 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Academio - Return to Landing Page"
            className="flex items-center gap-2.5 min-w-0 text-left group cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0 transition-colors">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-none block">
                Academio
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-0.5 truncate">
                VTU Academic ERP
              </span>
            </div>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md md:hidden shrink-0"
            aria-label="Close menu"
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Persona Card (Click to open Settings & Profile) */}
        <button
          type="button"
          onClick={() => {
            setCurrentPage('settings');
            setIsMobileSidebarOpen(false);
          }}
          className="p-2.5 mx-2.5 mt-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-lg text-left transition-colors cursor-pointer group"
          title="Open Settings & Profile"
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${roleInfo.badgeColor}`}>
              {roleInfo.badgeText}
            </span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
              Settings &rarr;
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">{roleInfo.userName}</p>
          <p className="text-[10.5px] text-slate-500 font-medium truncate">{roleInfo.sub}</p>
        </button>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-0.5 custom-scrollbar">
          <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {currentRole.replace('_', ' ')} Navigation
          </div>
          {currentNavItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'settings' && ['settings', 'settings-profile', 'profile'].includes(currentPage)) ||
              (currentRole === 'admin' && (
                (item.id === 'teacher-management' && ['teacher-management', 'teachers'].includes(currentPage)) ||
                (item.id === 'student-management' && ['student-management', 'students'].includes(currentPage)) ||
                (item.id === 'user-management' && ['user-management', 'users'].includes(currentPage))
              )) ||
              (currentRole === 'teacher' && (
                (item.id === 'my-classes-subjects' && ['my-classes-subjects', 'student-directory'].includes(currentPage)) ||
                (item.id === 'academic-management' && ['academic-management', 'attendance', 'ia-marks', 'assignments', 'assignment-marks', 'correction-requests'].includes(currentPage))
              )) ||
              (currentRole === 'class_teacher' && (
                (item.id === 'student-management' && ['student-management', 'student-requests'].includes(currentPage)) ||
                (item.id === 'academic-management' && ['academic-management', 'attendance', 'ia-marks', 'assignments'].includes(currentPage))
              )) ||
              (currentRole === 'student' && (
                (item.id === 'my-academics' && ['my-academics', 'attendance', 'ia-marks', 'assignments'].includes(currentPage))
              ));
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    if (onLogout) {
                      onLogout();
                    } else {
                      showToast(`Logged out from ${roleInfo.title}`, 'info');
                    }
                    return;
                  }
                  setCurrentPage(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon size={15} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium truncate">VTU BE CSE • 5th Sem</span>
            <button
              onClick={() => showToast('Session logs synced for demonstration', 'info')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sync
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* 2. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Streamlined Workspace Header (Breadcrumbs, Notifications & Settings Profile) */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 sm:px-6 h-13 shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 -ml-1 rounded-md text-slate-700 hover:bg-slate-100 md:hidden shrink-0 flex items-center justify-center transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb & Section Title */}
            <div className="min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-400 truncate">
                <span>{activeCollege.code}</span>
                <span>/</span>
                <span className="capitalize">{currentRole.replace('_', ' ')}</span>
                <span>/</span>
                <span className="text-slate-700 capitalize font-semibold">{currentPage.replace('-', ' ')}</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight capitalize truncate">
                {currentPage.replace('-', ' ')}
              </h1>
            </div>
          </div>

          {/* Header Right Actions: Notifications & Settings Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                title="Notifications & Alerts"
                aria-label="Notifications"
              >
                <Bell size={15} />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-xl z-50 p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Notifications & Audit Center</h4>
                        <p className="text-[10px] text-gray-400">Alerts, broadcasts, and system event logs</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {notificationTab === 'alerts' ? (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
                            {alerts.filter((a) => a.severity === 'critical').length} Critical
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                            {auditLogs.length} Events
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Section Switcher Tabs */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mb-3">
                      <button
                        onClick={() => setNotificationTab('alerts')}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all text-center ${
                          notificationTab === 'alerts'
                            ? 'bg-white text-black shadow-2xs'
                            : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        Alerts & Notices ({alerts.length})
                      </button>
                      <button
                        onClick={() => setNotificationTab('audit')}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                          notificationTab === 'audit'
                            ? 'bg-white text-black shadow-2xs'
                            : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        <History size={12} className={notificationTab === 'audit' ? 'text-purple-600' : ''} />
                        Audit Logs ({auditLogs.length})
                      </button>
                    </div>

                    {/* Tab 1: Alerts & Notices */}
                    {notificationTab === 'alerts' && (
                      <div className="py-1 space-y-2 max-h-72 overflow-y-auto">
                        {alerts.slice(0, 3).map((alert) => (
                          <div key={alert.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-left">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-900 truncate">{alert.title}</span>
                              <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-2">{alert.reason}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{alert.studentName} ({alert.studentUsn})</p>
                          </div>
                        ))}
                        {announcements.slice(0, 1).map((ann) => (
                          <div key={ann.id} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-left">
                            <p className="font-bold text-blue-900 truncate">{ann.title}</p>
                            <p className="text-[11px] text-blue-700/80 line-clamp-2">{ann.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tab 2: Audit Logs */}
                    {notificationTab === 'audit' && (
                      <div className="py-1 space-y-2 max-h-72 overflow-y-auto">
                        {auditLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-left hover:border-gray-300 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-900 truncate">{log.action}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                log.status === 'warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-600 line-clamp-2">{log.details}</p>
                            <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 pt-1 border-t border-gray-200/50">
                              <span className="font-medium text-gray-500">{log.performedBy} ({log.performerRole})</span>
                              <span>{log.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                      {notificationTab === 'alerts' ? (
                        <button
                          onClick={() => {
                            setCurrentPage(
                              currentRole === 'student' ? 'my-academics' : 'dashboard'
                            );
                            setIsNotificationsOpen(false);
                          }}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          View All Alerts
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setCurrentPage('audit-logs');
                            setIsNotificationsOpen(false);
                          }}
                          className="text-purple-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <History size={12} /> Open Full Audit Logs
                        </button>
                      )}
                      <div className="flex items-center gap-2">
                        {notificationTab === 'alerts' && (
                          <button
                            onClick={() => setNotificationTab('audit')}
                            className="text-purple-700 font-semibold hover:underline flex items-center gap-1"
                          >
                            <History size={11} /> Audit Logs
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-gray-500 hover:text-black font-semibold"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile & Account shortcut -> Navigates to Settings */}
            <button
              onClick={() => setCurrentPage('settings')}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs group cursor-pointer"
              title="Go to Settings & Profile"
              aria-label="Settings and user profile"
            >
              <div className="w-6 h-6 rounded-md bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs transition-colors">
                {roleInfo.userName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[110px] group-hover:text-blue-600 transition-colors">
                  {roleInfo.userName.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-400 leading-none capitalize">{currentRole.replace('_', ' ')}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Main Page Workspace */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-7 max-w-7xl mx-auto w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Floating Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const typeColors = {
            success: 'bg-gray-950 text-white border-gray-800',
            info: 'bg-blue-900 text-white border-blue-700',
            warning: 'bg-amber-900 text-white border-amber-700',
            error: 'bg-rose-950 text-white border-rose-800'
          };
          const icons = {
            success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
            info: <Info size={16} className="text-blue-300 shrink-0" />,
            warning: <AlertCircle size={16} className="text-amber-300 shrink-0" />,
            error: <AlertCircle size={16} className="text-rose-400 shrink-0" />
          };
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${typeColors[toast.type]}`}
            >
              <div className="flex items-center gap-2">
                {icons[toast.type]}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-400 hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

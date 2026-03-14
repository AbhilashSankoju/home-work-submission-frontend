import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider }        from './context/ToastContext'
import { SearchProvider }       from './context/SearchContext'

import DashboardLayout   from './layouts/DashboardLayout'
import Landing           from './pages/Landing'
import Login             from './pages/Login'
import Register          from './pages/Register'
import TeacherDashboard  from './pages/teacher/TeacherDashboard'
import CreateAssignment  from './pages/teacher/CreateAssignment'
import ViewSubmissions   from './pages/teacher/ViewSubmissions'
import StudentDashboard  from './pages/student/StudentDashboard'
import Assignments       from './pages/student/Assignments'
import MySubmissions     from './pages/student/MySubmissions'
import UploadSubmission  from './pages/student/UploadSubmission'
import Spinner           from './components/Spinner'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><Spinner size="lg" /></div>
  if (!user)   return <Navigate to="/login" replace />
  return children
}
function RequireTeacher({ children }) {
  const { user, loading, isTeacher } = useAuth()
  if (loading)    return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><Spinner size="lg" /></div>
  if (!user)      return <Navigate to="/login" replace />
  if (!isTeacher) return <Navigate to="/student/dashboard" replace />
  return children
}
function RequireStudent({ children }) {
  const { user, loading, isStudent } = useAuth()
  if (loading)    return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><Spinner size="lg" /></div>
  if (!user)      return <Navigate to="/login" replace />
  if (!isStudent) return <Navigate to="/teacher/dashboard" replace />
  return children
}
function GuestOnly({ children }) {
  const { user, loading, isTeacher } = useAuth()
  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><Spinner size="lg" /></div>
  if (user)    return <Navigate to={isTeacher ? '/teacher/dashboard' : '/student/dashboard'} replace />
  return children
}

function AppRoutes() {
  return (
    <SearchProvider>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route path="/teacher" element={<RequireTeacher><DashboardLayout /></RequireTeacher>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<TeacherDashboard />} />
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="submissions"       element={<ViewSubmissions />} />
        </Route>
        <Route path="/student" element={<RequireStudent><DashboardLayout /></RequireStudent>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<StudentDashboard />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="submissions" element={<MySubmissions />} />
          <Route path="upload"      element={<UploadSubmission />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SearchProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

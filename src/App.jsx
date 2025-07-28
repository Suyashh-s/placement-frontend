
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import RoleHome from './Home/RoleHome'
import Login from './student/components/Login'
import Register from './student/components/Register'
import Dashboard from './student/components/Dashboard'
import TnpCoordinator from './TnpCO/pages/TnpCoordinator'
import ChangePassword from './student/components/ChangePassword'
import StudentDashboard from './student/pages/StudentDashboard'

import ViewProfile from './student/pages/ViewProfile'
import UnderDevelopmentPage from './student/pages/UnderDevelopmentPage'
import ViewOpportunities from './student/pages/ViewOpportunities'
import FullViewOpportunities from './student/pages/FullViewOpportunities'
import ForgotPassword from './student/components/forgotPassword'
import CompanyLogin from './company/Login/CompanyLogin'
import CompanyRegister from './company/CompanyRegister'
import CompanyDashboard from './company/CompanyDashboard'
import CompanySidebar from './company/Jobposting/CompanySidebar'
import CompanyChangePassword from './company/Login/ChangePassword'
import CompanyForgotPassword from './company/Login/forgotPassword'

import ViewApplicants from './company/ViewApplicants/ViewApplicants'
import ViewApplicationStatus from './student/pages/ViewApplicationStatus'
import UpdateViewProfile from './student/pages/UpdateViewProfile'
import ViewJobListings from './company/ViewJobListing/ViewJobListings'
import TPOLogin from './TnpCO/components/TPOLogin'
import StudentTerms from './student/components/StudentTerms'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<RoleHome />} />
          <Route path="/student-login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          
          {/* Semi-Protected Route - For password updates (uses existing auth from login) */}
          <Route path="/update-pass" element={<ChangePassword />} />
          <Route path='/tpo-login' element={<TPOLogin/>}/>

           <Route path='/terms' element={<StudentTerms/>}/>

        <Route path="/companyRegi" element={<CompanyRegister />} />
        <Route path='/company/update-pass' element={<CompanyChangePassword/>}/>
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company/create-job" element={<CompanySidebar />} />
        <Route path="/company/forgot-pass" element={<CompanyForgotPassword />} />
        
        <Route path="/company-dashboard/view-applicants" element={<ViewApplicants />} />

        <Route path='/company-dashboard/view-job-listings' element={<ViewJobListings/>}/>
          {/* Protected Routes - Authentication required */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ViewProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
            
                <TnpCoordinator />
             
            } 
          />
          <Route 
            path="/under-dev" 
            element={
              <ProtectedRoute>
                <UnderDevelopmentPage />
              </ProtectedRoute>
            } 
          />
          {/* ✅ New Opportunities Routes */}
          <Route
            path="/view-opportunities"
            element={
              <ProtectedRoute>
                <ViewOpportunities />
              </ProtectedRoute>
            }
          />
          
           <Route
            path="/profile/update"
            element={
              <ProtectedRoute>
                <UpdateViewProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-application-status"
            element={
              <ProtectedRoute>
                <ViewApplicationStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunity/:id"
            element={
              <ProtectedRoute>
                <FullViewOpportunities />
              </ProtectedRoute>
            }
          />
        </Routes>
         
      </Router>
    </AuthProvider>
  )
}

export default App
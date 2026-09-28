import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { PageLoader } from './components/common/States';
import { ROLES } from './utils/constants';

import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import BusinessesPage from './pages/businesses/BusinessesPage';
import UsersPage from './pages/users/UsersPage';
import BusinessProfilePage from './pages/business-profile/BusinessProfilePage';
import StoriesPage from './pages/content/StoriesPage';
import StrategiesPage from './pages/content/StrategiesPage';
import AchievementsPage from './pages/content/AchievementsPage';
import ProductsPage from './pages/content/ProductsPage';
import VideosPage from './pages/content/VideosPage';
import EnquiriesPage from './pages/content/EnquiriesPage';
import QuestionsPage from './pages/qa/QuestionsPage';
import ResourceCategoriesPage from './pages/resources/ResourceCategoriesPage';
import ResourcePostsPage from './pages/resources/ResourcePostsPage';
import ModerationPage from './pages/moderation/ModerationPage';
import NotFound from './pages/errors/NotFound';

import './styles/variables.css';
import './styles/base.css';

function RootRedirect() {
  const { initializing, isAuthenticated } = useAuth();
  if (initializing) return <PageLoader />;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Content shared by both roles */}
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/strategies" element={<StrategiesPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/enquiries" element={<EnquiriesPage />} />
              <Route path="/qa" element={<QuestionsPage />} />

              {/* Business Admin only */}
              <Route
                path="/business-profile"
                element={
                  <ProtectedRoute roles={[ROLES.BUSINESS_ADMIN]}>
                    <BusinessProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin only */}
              <Route
                path="/businesses"
                element={
                  <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
                    <BusinessesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-categories"
                element={
                  <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
                    <ResourceCategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resource-posts"
                element={
                  <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
                    <ResourcePostsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moderation"
                element={
                  <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>
                    <ModerationPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/" element={<RootRedirect />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

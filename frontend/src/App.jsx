import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import PublicFeedbacks from './pages/PublicFeedbacks';
import MyFeedbacks from './pages/MyFeedbacks';
import AllFeedbacks from './pages/AllFeedbacks';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedbacks" element={<PublicFeedbacks />} />
        <Route path="/login" element={<AuthPage  />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/my-feedbacks" element={<MyFeedbacks />} />
        <Route path="/all-feedbacks" element={<AllFeedbacks />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;

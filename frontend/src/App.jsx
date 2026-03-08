
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import AuthPage from './features/auth/pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatRoom from './components/ChatRoom';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/" element={<AuthPage />} />
          <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
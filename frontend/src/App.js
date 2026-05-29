import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import SearchPage from "./pages/SearchPage";
import BookingPage from "./pages/BookingPage";
import TicketsPage from "./pages/TicketsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";

// Bảo vệ route cần đăng nhập
function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/movie/:id"  element={<MovieDetailPage />} />
        <Route path="/search"     element={<SearchPage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/booking/:id" element={
          <PrivateRoute><BookingPage /></PrivateRoute>
        } />
        <Route path="/tickets" element={
          <PrivateRoute><TicketsPage /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute adminOnly><AdminPage /></PrivateRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

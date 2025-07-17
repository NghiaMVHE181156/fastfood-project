import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/user/NotFoundPage";
import UserMenuPage from "./pages/user/UserMenuPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import ShipperDashboardPage from "./pages/shipper/ShipperDashboardPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/" element={<UserMenuPage />} />
          <Route path="/user/profile" element={<UserProfilePage />} />
          <Route path="/shipper/dashboard" element={<ShipperDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ListingDetail } from './pages/ListingDetail';
import { Checkout } from './pages/Checkout';
import { Favorites } from './pages/Favorites';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { MainLayout } from './components/MainLayout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminListings } from './pages/admin/AdminListings';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAmenities } from './pages/admin/AdminAmenities';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="amenities" element={<AdminAmenities />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

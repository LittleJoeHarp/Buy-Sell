import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import CASCallback from './pages/CASCallback';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import AddItem from './pages/AddItem';
// Adding the missing imports based on your file structure
import MyCart from './pages/MyCart';
import OrdersHistory from './pages/OrdersHistory';
import DeliverItems from './pages/DeliverItems';
import ItemPage from './pages/ItemPage';
import Chat from './pages/Chat';

function App() {
  // Check if token exists to determine if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar only shows if user is logged in */}
        {isAuthenticated && <Navbar />}
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/cas-callback" element={<CASCallback />} />

            {/* Protected Routes */}
            <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/sell" element={isAuthenticated ? <AddItem /> : <Navigate to="/login" />} />
            
            {/* Wiring up the "Blank" pages */}
            <Route path="/cart" element={isAuthenticated ? <MyCart /> : <Navigate to="/login" />} />
            <Route path="/history" element={isAuthenticated ? <OrdersHistory /> : <Navigate to="/login" />} />
            <Route path="/deliver" element={isAuthenticated ? <DeliverItems /> : <Navigate to="/login" />} />
            <Route path="/item/:id" element={isAuthenticated ? <ItemPage /> : <Navigate to="/login" />} />
            <Route path="/support" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/search" : "/login"} />} />
          </Routes>
        </main>

        {/* Footer always shows */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
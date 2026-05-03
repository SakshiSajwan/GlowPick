import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SkinProfile from './pages/SkinProfile';
import UploadSelfie from './pages/UploadSelfie';
import Results from './pages/Results';
import CheckoutScreen from './pages/CheckoutScreen';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse    from './pages/TermsOfUse';
import RefundPolicy  from './pages/RefundPolicy';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


function AppContent() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            {/* LoginModal is mounted globally — triggered via context */}
            <LoginModal />

            {/* ⚠️ NO container/padding here — pages control their own width */}
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/"                     element={<Home />} />
                    <Route path="/products"             element={<ProductList />} />
                    <Route path="/product/:id"          element={<ProductDetail />} />
                    <Route path="/cart"                 element={<Cart />} />
                    <Route path="/forgot-password"      element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/recommend"            element={<SkinProfile />} />
                    <Route path="/upload-selfie"        element={<UploadSelfie />} />
                    <Route path="/results"              element={<Results />} />
                    <Route path="/privacy"       element={<PrivacyPolicy />} />
                    <Route path="/terms"         element={<TermsOfUse />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/checkout" element={<CheckoutScreen />} />
                </Routes>
            </main>

            <Footer />

            <ToastContainer
                position="bottom-right"
                autoClose={2800}
                hideProgressBar={false}
                pauseOnHover
                theme="light"
                toastStyle={{ fontFamily: 'var(--font-body)', fontSize: 14 }}
            />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import { Toaster } from 'sonner'
// Product listing and product detail are the most common entry pages
// (search results, shared links), so they ship in the main bundle: no
// extra chunk round-trip before they can render.
import Products from './Components/Product/Product'
import ProductDetail from './Pages/ProductDetail/ProductDetail'

// Route-level code splitting: every other page (and the chatbot) is
// downloaded only when first needed.
const Register = lazy(() => import('./Pages/Register/Register'))
const Login = lazy(() => import('./Pages/Login/Login'))
const VerifyOTP = lazy(() => import('./Pages/Verify-OTP/Verify-OTP'))
const Wishlist = lazy(() => import('./Pages/Wishlist/Wishlist'))
const Cart = lazy(() => import('./Pages/Cart/Cart'))
const Checkout = lazy(() => import('./Pages/Checkout/Checkout'))
const OrderSuccess = lazy(() => import('./Pages/OrderSuccess/OrderSuccess'))
const Orders = lazy(() => import('./Components/Orders/Orders'))
const Contact = lazy(() => import('./Pages/Contact/Contact'))
const Profile = lazy(() => import('./Pages/Profile/Profile'))
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword/ForgotPassword'))
const ForgotPasswordOTP = lazy(() => import('./Pages/ForgotPasswordOTP/ForgotPasswordOTP'))
const ResetPassword = lazy(() => import('./Pages/ResetPassword/ResetPassword'))
const OrderDetails = lazy(() => import('./Components/Orders/OrderDetails'))
const ReturnRequest = lazy(() => import('./Pages/Return/Return'))
const Exchange = lazy(() => import('./Pages/Exchange/Exchange'))
const Exchanges = lazy(() => import('./Pages/Exchange/Exchanges'))
const Returns = lazy(() => import('./Pages/Return/Returns'))
const ReturnDetails = lazy(() => import('./Pages/Return/ReturnDetails'))
const ExchangeDetails = lazy(() => import('./Pages/Exchange/ExchangeDetails'))
const Offers = lazy(() => import('./Pages/Offers/Offers'))
const Bundles = lazy(() => import('./Pages/Bundle/Bundle'))
const ShippingPolicy = lazy(() => import('./Pages/ShippingPolicy/ShippingPolicy'))
const ReturnAndRefund = lazy(() => import('./Pages/ReturnAndRefund/ReturnAndRefund'))
const Chatbot = lazy(() => import('./Components/Chatbot/Chatbot'))

// Shown only for the brief moment a page chunk is downloading.
const RouteFallback = () => (
  <div className="min-h-screen bg-white" aria-busy="true" />
)

function App() {

  return (
    <>
    <Toaster position='top-right' richColors/> {/*for give to response on every success and error*/}
    <Suspense fallback={<RouteFallback/>}>
    <Routes>
      {/* <Route path='/' element={<MainLayout/>}> */}

      <Route
          path="/"
          element={<MainLayout/>}
        />
      {/* </Route> */}

      <Route
      path='/register'
      element={<Register/>}
      />

      <Route
      path='/login'
      element={<Login/>}
      />

      <Route
      path='/verify-otp'
      element={<VerifyOTP/>}
      />

      <Route
      path='/wishlist'
      element={<Wishlist/>}
      />

      <Route
      path='/cart'
      element={<Cart/>}
      />

      <Route
      path='/checkout'
      element={<Checkout/>}
      />

      <Route
      path='/order-success/:orderId'
      element={<OrderSuccess/>}
      />

      <Route
      path='/products'
      element={<Products/>}
      />

      <Route
      path='/orders'
      element={<Orders/>}
      />

      <Route
      path='/product/:id'
      element={<ProductDetail/>}
      />

      <Route
      path='/contact'
      element={<Contact/>}
      />

      <Route
      path='/profile'
      element={<Profile/>}
      />

      <Route
      path='/forgot-password'
      element={<ForgotPassword/>}
      />

      <Route
      path='/forgot-password-otp'
      element={<ForgotPasswordOTP/>}
      />

      <Route
      path='/reset-password'
      element={<ResetPassword/>}
      />

      <Route
      path='/orders/:id'
      element={<OrderDetails/>}
      />

      <Route
      path='/orders/:orderId/return/:itemId'
      element={<ReturnRequest/>}
      />

      <Route
      path='/returns'
      element={<Returns/>}
      />

      <Route
      path='/returns/:id'
      element={<ReturnDetails/>}
      />

      <Route
      path='/orders/:orderId/exchange/:itemId'
      element={<Exchange/>}
      />

      <Route
      path='/exchanges'
      element={<Exchanges/>}
      />

      <Route
      path='/exchanges/:id'
      element={<ExchangeDetails/>}
      />

      <Route
      path='/offers'
      element={<Offers/>}
      />

      <Route
      path='/bundles'
      element={<Bundles/>}
      />

    <Route
      path='/shippingPolicy'
      element={<ShippingPolicy/>}
      />

    <Route
      path='/return&refund'
      element={<ReturnAndRefund/>}
      />
    </Routes>
    </Suspense>

    {/* Customer AI shopping assistant: mounted once at app level so it stays
        available (and keeps its conversation) across all customer routes. */}
    <Suspense fallback={null}>
      <Chatbot/>
    </Suspense>
    </>
  )
}

export default App

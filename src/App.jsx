import { Routes, Route } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import Register from './Pages/Register/Register'
import { Toaster } from 'sonner'
import Login from './Pages/Login/Login'
import VerifyOTP from './Pages/Verify-OTP/Verify-OTP'
import Wishlist from './Pages/Wishlist/Wishlist'
import Cart from './Pages/Cart/Cart'
import Checkout from './Pages/Checkout/Checkout'
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess'
import Products from './Components/Product/Product'
import Orders from './Components/Orders/Orders'
import ProductDetail from './Pages/ProductDetail/ProductDetail'
import Contact from './Pages/Contact/Contact'
import Profile from './Pages/Profile/Profile'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import ForgotPasswordOTP from './Pages/ForgotPasswordOTP/ForgotPasswordOTP'
import ResetPassword from './Pages/ResetPassword/ResetPassword'

function App() {

  return (
    <>
    <Toaster position='top-right' richColors/> {/*for give to response on every success and error*/}
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
      path='/forgot-password/otp'
      element={<ForgotPasswordOTP/>}
      />

      <Route
      path='/reset-password'
      element={<ResetPassword/>}
      />
    </Routes>
    </>
  )
}

export default App

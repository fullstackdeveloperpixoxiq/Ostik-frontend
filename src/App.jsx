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
import OrderDetails from './Components/Orders/OrderDetails'
import ReturnRequest from './Pages/Return/Return'
import Exchange from './Pages/Exchange/Exchange'
import Exchanges from './Pages/Exchange/Exchanges'
import Returns from './Pages/Return/Returns'
import ReturnDetails from './Pages/Return/ReturnDetails'
import ExchangeDetails from './Pages/Exchange/ExchangeDetails'
import Offers from './Pages/Offers/Offers'
import Bundles from './Pages/Bundle/Bundle'
import ShippingPolicy from './Pages/ShippingPolicy/ShippingPolicy'
import ReturnAndRefund from './Pages/ReturnAndRefund/ReturnAndRefund'

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
    </>
  )
}

export default App

import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer"
import SuperBanner from "../Components/Banner/Banner"
import PromoCarousel from "../Components/PromoCarousel/PromoCarousel";
import Category from "../Components/Categories/Categories";
import HotSelling from "../Components/HotSelling/HotSelling";
import LatestProducts from "../Components/Latest/LatestProduct";
import WhyOstik from "../Components/WhyOstik/WhyOstik";
import LimitedStock from "../Components/LimitedStock/LimitedStock";
import VideoSection from "../Components/VideoSection/VideoSection";


const MainLayout = () => {
  return (
    <>
      <Navbar />

      <main>
        <PromoCarousel/>
        <SuperBanner/>
        <Category/>
        <HotSelling/>
        <LatestProducts/>
        <WhyOstik/>
        <LimitedStock/>
        <VideoSection/>
        <Outlet />
      </main>

      <Footer/>
    </>
  );
};

export default MainLayout;
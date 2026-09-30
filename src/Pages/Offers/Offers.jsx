import { Tag, ArrowLeft } from "lucide-react";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";


const offers= ()=>{
    const navigate= useNavigate();

    return(
        <>
        <Navbar/>
        <main className="min-h-[70vh] bg-[#F8F9F6]">
            <section className="flex min-h-[600px] items-center justify-center px-5 py-16">
                <div className="w-full max-w-[650px] text-center">

                    {/* icon */}
                    <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaffea]">
                        <Tag 
                        size={30}
                        strokeWidth={1.7}
                        className="text-[#72c500]"
                        />
                    </div>

                    {/* label */}
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-[#72c500]"> 
                        OSTIK OFFERS 
                        </p>

                        {/* TITLE */} 
                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl"> 
                            Offers are coming soon 
                            </h1>

                            {/* description */}
                            <p className="mx-auto mt-5 max-w-[520px] text-sm leading-7 text-gray-500 sm:text-base">
                                We are working on some existing offers for you.
                                Please check back soon for special deals and 
                                limited-time savings from ostik
                            </p>

                            {/* BUTTON */} 
                            <button type="button" onClick={() => 
                                navigate("/products")} 
                                className=" mt-8 inline-flex items-center gap-2 rounded-full bg-[#00ff03] px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:bg-[#00c800] hover:text-white " > 
                                <ArrowLeft size={16} 
                                /> 
                                Explore Products 
                                </button> 
                </div>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default offers
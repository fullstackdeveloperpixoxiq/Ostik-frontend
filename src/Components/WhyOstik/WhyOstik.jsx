import React from "react";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

const WhyOstik = () => {
  const features = [
    {
      number: "01",
      icon: ShieldCheck,
      title: "Quality You Can Trust",
      description:
        "Carefully selected electronics built to deliver reliable performance and lasting value.",
    },
    {
      number: "02",
      icon: Truck,
      title: "Fast & Reliable Delivery",
      description:
        "Get your favourite gadgets delivered safely and quickly, right to your doorstep.",
    },
    {
      number: "03",
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Shop confidently with secure and convenient payment options designed for peace of mind.",
    },
    {
      number: "04",
      icon: Headphones,
      title: "Here When You Need Us",
      description:
        "Our support team is always ready to help you before, during and after your purchase.",
    },
  ];

  return (
    <section className="w-full bg-white py-14 sm:py-20 md:py-28">
      <div className="mx-auto w-[92%] max-w-[1200px]">

        {/* Header */}
        <div className="mb-8 max-w-[720px] sm:mb-12 md:mb-16">

          <span className="mb-4 inline-block text-xs font-semibold tracking-[2.5px] text-[#00ff03]">
            WHY OSTIK
          </span>

          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-1.5px] text-[#111] sm:text-[48px] md:text-[60px]">
            More than gadgets.
            <span className="block text-[#00ff03]">
              A better way to shop.
            </span>
          </h2>

          <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-[#666] md:text-[17px]">
            We believe great technology should be simple to discover,
            easy to trust and enjoyable to use.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group relative min-h-[230px] overflow-hidden rounded-[22px] border border-[#e9e9e9] bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00e603] hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] sm:min-h-[250px] sm:p-7 md:min-h-[270px] md:p-8"
              >

                {/* Background Circle */}
                <div className="absolute -bottom-[75px] -right-[75px] h-[170px] w-[170px] rounded-full bg-[#1c8c5a]/5 transition-transform duration-500 group-hover:scale-[1.35]" />

                {/* Top */}
                <div className="relative z-10 mb-7 flex items-center justify-between sm:mb-10 md:mb-12">

                  <span className="text-[13px] font-semibold tracking-wider text-[#aaa]">
                    {feature.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00ff03] text-[#FFFFFF] transition-all duration-300 group-hover:rotate-[-5deg] group-hover:bg-[#76b900] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mb-3 text-[19px] font-semibold tracking-[-0.3px] text-[#151515] sm:text[21px] md:text-[23px]">
                    {feature.title}
                  </h3>

                  <p className="max-w-[430px] text-[14px] leading-7 text-[#707070] md:text-[15px]">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-7 right-7 z-10 translate-x-2 translate-y-2 text-xl text-[#1c8c5a] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={21} strokeWidth={1.8} />
                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom Brand Statement */}
        <div className="mt-10 flex flex-col items-start gap-3 border-t border-[#eeeeee] pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:gap-0 md:mt-16">

          <span className="text-[13px] font-bold tracking-[3px] text-[#1c8c5a]">
            OSTIK
          </span>

          <p className="text-sm text-[#888]">
            Technology that fits your everyday life.
          </p>

        </div>

      </div>
    </section>
  );
};

export default WhyOstik;
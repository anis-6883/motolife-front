const CouponCodeSection = ({
  discount = 39,
  code = "FREE15FIRST",
  title = "Super Discount for your first purchase",
  subtitle = "Use discount code in checkout page.",
  variant = "light",
}) => {
  return (
    <section className={`${variant === "light" ? "gap60" : ""}`}>
      <div
        className={`relative flex items-center justify-evenly overflow-hidden rounded-lg border-2 border-dashed px-10 max-md:flex-wrap md:max-h-21 ${variant === "light" ? "border-primary text-primary bg-[#F7E8E8]" : "border-[#DE9B9C] bg-[#1D1E26] text-[#DE9B9C]"}`}
      >
        {/* Left discount */}
        <p className="p-text-36 pr-6 leading-12 font-bold tracking-[0.72px] md:py-4">-{discount}%</p>

        {/* Text content */}
        <div className="md:py-4">
          <p className="p-text-20 font-semibold">{title}</p>
          <p className={`p-text-16 leading-5.5 ${variant === "light" ? "text-black" : "text-light-gray"}`}>{subtitle}</p>
        </div>

        {/* Background discount */}
        <div className="flex flex-1 items-center overflow-hidden text-center max-lg:hidden">
          <p
            className={`text-[120px] xl:text-[150px] xl:font-bold 2xl:text-[180px] ${variant === "light" ? "opacity-20" : "text-[#2C282F]"}`}
          >
            -{discount}%
          </p>
        </div>

        {/* Coupon code */}
        <p className="p-text-24 font-semibold -tracking-[0.24px] md:py-4">{code}</p>
      </div>
    </section>
  );
};

export default CouponCodeSection;

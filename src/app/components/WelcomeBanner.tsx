function WelcomeBanner(){
return(
<div className="bg-blue-600 text-white p-8 rounded-x2 shadow-lg mb-1">
      {/* Tailwind classes applied directly for styling */}

      <h1 className="text-3xl font-bold mb-2">Welcome to Our Digital Menu</h1>
      <p className="text-lg opacity-90">
        Browse our chef's daily specials and place your order.
      </p>
  </div>
);
}

export default WelcomeBanner;
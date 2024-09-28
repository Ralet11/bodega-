import { useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  HiOutlineDownload,
  HiOutlineLocationMarker,
  HiOutlineShoppingBag,
  HiOutlineClipboardCheck,
  HiOutlineLightningBolt,
  HiOutlineEmojiHappy,
} from "react-icons/hi";
import { FaApple, FaGooglePlay } from "react-icons/fa"; // Apple and Google Play icons
import bgImage from "./../../assets/bgimage.jpg";
import foodImage from "./../../assets/food.jpg";
import deliveryImage from "./../../assets/deliveryImage.jpg";
import "animate.css"; // Import Animate.css

const Landing = () => {
  // Function to scroll to the download section
  const scrollToDownloadSection = () => {
    const downloadSection = document.getElementById("download-section");
    if (downloadSection) {
      downloadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");

    // Function to apply animation when the element is in the viewport
    const handleScroll = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
          entry.target.classList.remove("invisible"); // Remove the invisible class
          observer.unobserve(entry.target); // Stop observing after the animation
        }
      });
    };

    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.1, // Trigger when 10% of the element is visible
    });

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const goGooglePlay = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.khtech.bodega",
      "_blank"
    );
  };

  const goAppStore = () => {
    window.open("https://apps.apple.com/ar/app/bodega/id6557032901", "_blank");
  };

  return (
    <div className="bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 fade-in-section invisible">
        <nav className="bg-[#F3BA25] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div>
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1726357397/logo_oe3idx.jpg"
                    alt="Logo"
                    className="h-16 w-auto"
                  />
                </Link>
              </div>

              {/* Buttons */}
              <div className="hidden sm:flex space-x-4">
                <Link to="/login">
                  <Button className="border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 text-sm">
                    Get Your Business Listed
                  </Button>
                </Link>
                <Button
                  onClick={scrollToDownloadSection}
                  className="bg-[#f09a1a] text-black hover:bg-yellow-700 text-sm"
                >
                  Download the App
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      {/* Mobile View */}
      <section className="relative bg-white fade-in-section invisible lg:hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-center py-32 sm:py-48">
          {/* Text Section */}
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
              One App for All Your Food Needs
            </h1>
            <p className="text-base sm:text-lg mb-6">
              Find top places to eat in your city and enjoy special offers
              available only through our app.
            </p>
            <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Button
                onClick={scrollToDownloadSection}
                className="bg-[#f09a1a] text-white hover:bg-yellow-700 text-sm"
              >
                Download the App
              </Button>
              <Link to="/login">
                <Button className="border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 text-sm">
                  Partner with Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center fade-in-section invisible hidden lg:flex"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="relative max-w-7xl mx-auto ml-20 px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row justify-between items-center">
          {/* Sección de Texto */}
          <div className="flex-1 max-w-xl text-left lg:max-w-lg lg:pl-16">
            <h1 className="text-4xl font-semibold text-black mb-4 drop-shadow-lg">
              One App for All Your Food Needs
            </h1>
            <p className="text-base text-black-200 mb-4 drop-shadow-lg">
              Find top places to eat in your city and enjoy special offers
              available only through our app.
            </p>
            <div className="flex justify-start space-x-4">
              <Button
                onClick={scrollToDownloadSection}
                className="bg-[#f09a1a] text-white hover:bg-yellow-700 text-sm"
              >
                Download the App
              </Button>
              <Link to="/login">
                <Button className="border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 text-sm">
                  Partner with Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Gastronomy Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-20 fade-in-section invisible">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start">
          {/* Image on the Left */}
          <div className="flex-1 lg:order-1">
            <div className="relative bg-[#f09a1a] rounded-lg p-4 sm:p-6 md:p-10 lg:p-10 w-full max-w-md mx-auto lg:max-w-lg">
              <img
                src={foodImage}
                alt="App Preview"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="flex-1 lg:order-2 mt-10 lg:mt-0 lg:pl-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              A Modern Dining Experience
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Unlock the full potential of Bodega+ to enhance both your dining
              and delivery experiences.
            </p>
            <ul className="space-y-8">
              <li className="flex items-start">
                <span className="bg-[#f09a1a] p-3 rounded-full">
                  <HiOutlineDownload className="h-6 w-6 text-yellow-600" />
                </span>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Install Bodega+
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download the app in seconds and start discovering exclusive
                    restaurant listings and deals.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="bg-[#f09a1a] p-3 rounded-full">
                  <HiOutlineLocationMarker className="h-6 w-6 text-yellow-600" />
                </span>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Browse & Select
                  </h3>
                  <p className="text-sm text-gray-600">
                    Discover a variety of dining options, from popular hotspots
                    to hidden local gems. There's something for every palate.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="bg-[#f09a1a] p-3 rounded-full">
                  <HiOutlineShoppingBag className="h-6 w-6 text-yellow-600" />
                </span>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Save & Relish
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enjoy great meals while saving money with our exclusive
                    offers. Plus, earn points with each order and redeem rewards.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-20 fade-in-section invisible">
        <div className="max-w-7xl mx-auto flex flex-col gap-10 lg:flex-row items-center lg:items-start">
          {/* Text Section for Delivery */}
          <div className="flex-1 lg:order-1 lg:pl-10">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Delivery Made Simple
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Order your favorite meals from the comfort of your home with
              Bodega+’s delivery service.
            </p>
            <ul className="space-y-8">
              <li className="flex items-start">
                <span className="bg-[#f09a1a] p-3 rounded-full">
                  <HiOutlineClipboardCheck className="h-6 w-6 text-yellow-600" />
                </span>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Choose your Restaurant
                  </h3>
                  <p className="text-sm text-gray-600">
                    Browse through our curated list of top-rated local
                    restaurants and choose your favorite one. Bodega+ brings the
                    best dining options straight to your phone.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="bg-[#f09a1a] p-3 rounded-full">
                  <HiOutlineLightningBolt className="h-6 w-6 text-yellow-600" />
                </span>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Track your Order
                  </h3>
                  <p className="text-sm text-gray-600">
                    Stay informed with real-time updates on your order. From the
                    kitchen to your door, know exactly when your meal will
                    arrive.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="bg-[#f09a1a] p-3 rounded-full">
                  <HiOutlineEmojiHappy className="h-6 w-6 text-yellow-600" />
                </span>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enjoy your Meal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sit back and relax as your delicious meal arrives right at
                    your doorstep. All you need to do is enjoy every bite!
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Image for Delivery */}
          <div className="flex-1 lg:order-2">
            <div className="relative bg-[#f09a1a] rounded-lg p-4 sm:p-6 md:p-10 lg:p-10 w-full max-w-md mx-auto lg:max-w-lg">
              <img
                src={deliveryImage}
                alt="Delivery Service"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section
        id="download-section"
        className="bg-[#f09a1a] py-20 px-4 sm:px-6 lg:px-20 lg:mx-20 rounded-xl text-center fade-in-section invisible"
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Savor Every Moment with Bodega+
        </h2>
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
          <Button
            onClick={goGooglePlay}
            className="bg-[#1a1a1a] text-white text-sm px-6 py-2 rounded-full hover:bg-gray-800"
          >
            <FaGooglePlay className="inline mr-2" />
            <span>Google Play</span>
          </Button>
          <Button
            onClick={goAppStore}
            className="bg-[#1a1a1a] text-white text-sm px-6 py-2 rounded-full hover:bg-gray-800"
          >
            <FaApple className="inline mr-2" />
            <span>App Store</span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 fade-in-section invisible">
        <div className="border-t border-gray-200 mb-6"></div>
        {/* Thin black line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
            <img
              src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1726357959/bodegasolologo1_fakhf8.jpg"
              alt="Logo"
              className="h-20 w-28 mb-4 rounded-full object-cover"
            />
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link to="/" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link to="/" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-facebook"></i>
              </Link>
              <Link to="/" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-linkedin"></i>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-20">
            <div className="flex flex-col space-y-2 text-center lg:text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                About Bodega+
              </h3>
              <Link to="/about" className="text-gray-500 hover:text-gray-900">
                Learn About Us
              </Link>
              <Link to="/features" className="text-gray-500 hover:text-gray-900">
                Our Features
              </Link>
              <Link to="/careers" className="text-gray-500 hover:text-gray-900">
                Careers
              </Link>
            </div>
            <div className="flex flex-col space-y-2 text-center lg:text-left">
              <h3 className="text-lg font-semibold text-gray-900">Help</h3>
              <Link to="/contact" className="text-gray-500 hover:text-gray-900">
                Contact Us
              </Link>
              <Link to="/faq" className="text-gray-500 hover:text-gray-900">
                FAQ
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-900">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

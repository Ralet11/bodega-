"use client"

import { useState, useEffect } from "react"
import {
  ChefHat,
  BarChart4,
  ClipboardList,
  Bell,
  Wallet,
  Users,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ShoppingBag,
  Smartphone,
} from "lucide-react"

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      // Animation for sections
      const sections = document.querySelectorAll(".animate-section")
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        if (sectionTop < windowHeight * 0.75) {
          section.classList.add("animate-fade-in")
        }
      })

      // Highlight active section in navigation
      const featuresSec = document.getElementById("features")
      const benefitsSec = document.getElementById("benefits")
      const testimonialsSec = document.getElementById("testimonials")

      const scrollPosition = window.scrollY + 100 // Offset for better detection

      if (testimonialsSec && scrollPosition >= testimonialsSec.offsetTop) {
        setActiveSection("testimonials")
      } else if (benefitsSec && scrollPosition >= benefitsSec.offsetTop) {
        setActiveSection("benefits")
      } else if (featuresSec && scrollPosition >= featuresSec.offsetTop) {
        setActiveSection("features")
      } else {
        setActiveSection("")
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#F3BA25] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-1 shadow-md transform -rotate-3 mr-2">
                    <ShoppingBag className="h-6 w-6 text-[#f09a1a]" />
                  </div>
                  <div className="logo-text relative">
                    <span
                      className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase"
                      style={{ textShadow: "1px 1px 0 white" }}
                    >
                      BODEGA
                      <span
                        className="text-gray-900 font-black relative"
                        style={{ top: "-2px", fontSize: "28px", marginLeft: "1px" }}
                      >
                        +
                      </span>
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-white rounded-full opacity-70"></div>
                  </div>
                </div>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-800 hover:text-gray-600 p-2 rounded-full hover:bg-yellow-400 transition-colors duration-300"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center justify-center">
              <nav className="flex space-x-2">
                <button
                  onClick={() => scrollToSection("features")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === "features" ? "bg-white text-gray-900" : "text-gray-800 hover:bg-white/30"
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === "benefits" ? "bg-white text-gray-900" : "text-gray-800 hover:bg-white/30"
                  }`}
                >
                  Benefits
                </button>
                
              </nav>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={handleLoginClick}
                className="bg-[#f09a1a] hover:bg-[#e08a0a] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center"
              >
                <span>Login to Your Shop</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 md:hidden">
          <div className="flex flex-col items-center space-y-6 p-6">
            <button
              onClick={() => scrollToSection("features")}
              className={`w-full py-3 px-6 rounded-md text-center transition-all duration-300 ${
                activeSection === "features"
                  ? "bg-[#F3BA25] text-gray-900 font-semibold"
                  : "bg-gray-100 text-gray-800 hover:bg-[#F3BA25]/50"
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className={`w-full py-3 px-6 rounded-md text-center transition-all duration-300 ${
                activeSection === "benefits"
                  ? "bg-[#F3BA25] text-gray-900 font-semibold"
                  : "bg-gray-100 text-gray-800 hover:bg-[#F3BA25]/50"
              }`}
            >
              Benefits
            </button>
            {/* <button
              onClick={() => scrollToSection("testimonials")}
              className={`w-full py-3 px-6 rounded-md text-center transition-all duration-300 ${
                activeSection === "testimonials"
                  ? "bg-[#F3BA25] text-gray-900 font-semibold"
                  : "bg-gray-100 text-gray-800 hover:bg-[#F3BA25]/50"
              }`}
            >
              Testimonials
            </button> */}
            <button
              onClick={handleLoginClick}
              className="bg-[#f09a1a] hover:bg-[#e08a0a] text-white px-6 py-3 rounded-md font-medium transition-all duration-300 w-full text-center shadow-md flex items-center justify-center"
            >
              <span>Login to Your Shop</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left side - Text content */}
            <div className="lg:w-1/2 lg:pr-12 animate-section">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Grow Your Business with Bodega+</h1>
              <p className="text-lg text-gray-700 mb-8">
                Join our platform and receive orders directly from customers using the Bodega+ app. Manage your
                restaurant, track performance, and grow your business all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleLoginClick}
                  className="bg-[#f09a1a] hover:bg-[#e08a0a] text-white px-6 py-2.5 rounded-md font-medium text-center transition-all duration-200 flex items-center"
                >
                  <span>Login to Your Shop</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="lg:w-1/2 mt-12 lg:mt-0 animate-section">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#f09a1a] rounded-lg transform rotate-2"></div>
                <img
                  src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1743563056/dashboard_hi11hr.png"
                  alt="Restaurant Dashboard"
                  className="relative rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App to Restaurant Flow Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Receive Orders Directly From The App</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Connect with customers through the Bodega+ app and grow your business with a seamless ordering experience.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 animate-section">
            <div className="bg-[#F3BA25]/10 p-8 rounded-xl text-center max-w-xs">
              <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-10 w-10 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Orders</h3>
              <p className="text-gray-700">Customers browse and place orders through the Bodega+ mobile app</p>
            </div>

            <ArrowRight className="h-10 w-10 text-[#f09a1a] transform rotate-90 md:rotate-0" />

            <div className="bg-[#F3BA25]/10 p-8 rounded-xl text-center max-w-xs">
              <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Notification</h3>
              <p className="text-gray-700">You receive real-time notifications for new orders on your dashboard</p>
            </div>

            <ArrowRight className="h-10 w-10 text-[#f09a1a] transform rotate-90 md:rotate-0" />

            <div className="bg-[#F3BA25]/10 p-8 rounded-xl text-center max-w-xs">
              <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fulfill Orders</h3>
              <p className="text-gray-700">Prepare orders for pickup or dine-in and track status through completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-section">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Tools for Restaurant Owners</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our platform provides everything you need to manage your restaurant efficiently and grow your customer
              base.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-section">
              <div className="bg-[#F3BA25]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <ClipboardList className="h-7 w-7 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Management</h3>
              <p className="text-gray-700">
                Easily manage incoming orders from the Bodega+ app, track status, and organize your kitchen workflow
                efficiently.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-section">
              <div className="bg-[#F3BA25]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Bell className="h-7 w-7 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Notifications</h3>
              <p className="text-gray-700">
                Get instant alerts when customers place orders through the app, along with messages and important
                updates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-section">
              <div className="bg-[#F3BA25]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <BarChart4 className="h-7 w-7 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Analytics</h3>
              <p className="text-gray-700">
                Access detailed reports and insights to understand your business performance and growth from app orders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-section">
              <div className="bg-[#F3BA25]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <ChefHat className="h-7 w-7 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Menu Management</h3>
              <p className="text-gray-700">
                Update your menu items, prices, and availability in real-time so customers always see accurate
                information in the app.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-section">
              <div className="bg-[#F3BA25]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Wallet className="h-7 w-7 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Processing</h3>
              <p className="text-gray-700">
                Secure and fast payment processing for all app orders with detailed transaction history and reporting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-section">
              <div className="bg-[#F3BA25]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-[#f09a1a]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Management</h3>
              <p className="text-gray-700">
                Build relationships with your app customers through profiles, order history, and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 animate-section">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Powerful Dashboard for Your Business
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our intuitive dashboard gives you complete control over your restaurant operations. Monitor sales, track
                orders from the app, and analyze customer data all in one place.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#f09a1a] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Real-time tracking of orders coming from the Bodega+ app</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#f09a1a] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Comprehensive sales and revenue reports from app orders</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#f09a1a] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Customer insights and feedback management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#f09a1a] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Inventory tracking and management tools</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 animate-section">
          
            <div className="relative">
                <div className="absolute -inset-4 bg-[#f09a1a] rounded-lg transform rotate-2"></div>
                <img
                  src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1743980772/dash2_ste9mp.png"
                  alt="Restaurant Dashboard"
                  className="relative rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-section">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Restaurant Owners Choose Bodega+</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Join thousands of successful restaurants that have grown their business by receiving orders through our
              app.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-section">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Increased Revenue</h3>
              <p className="text-gray-700 mb-4">
                Our platform helps you reach more customers through the app and increase your order volume, leading to
                higher revenue.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-section">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Streamlined Operations</h3>
              <p className="text-gray-700 mb-4">
                Simplify your restaurant management with our all-in-one platform, saving time and reducing errors when
                processing app orders.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-section">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Customer Insights</h3>
              <p className="text-gray-700 mb-4">
                Gain valuable data about your app customers' preferences and ordering habits to improve your offerings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3BA25]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-section">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Restaurant Owners Say</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Hear from restaurant owners who have transformed their business with Bodega+.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md animate-section">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Taco Express</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Since joining Bodega+, we've seen a 30% increase in orders through the app. The platform is easy to use
                and the analytics help us make better business decisions."
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md animate-section">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Smith</h4>
                  <p className="text-gray-600 text-sm">Burger House</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The order management system has streamlined how we handle app orders. We can process more customer
                requests with less stress and fewer mistakes."
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md animate-section">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Pasta Palace</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The customer insights from app orders have been invaluable. We've adjusted our menu based on the data
                and our sales have increased significantly."
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f09a1a]">
        <div className="max-w-4xl mx-auto text-center animate-section">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Receive Orders Through Our App?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of restaurant owners who are already succeeding with Bodega+.
          </p>
          <button
            onClick={handleLoginClick}
            className="bg-white text-[#f09a1a] hover:bg-gray-100 px-8 py-3 rounded-md font-medium inline-block transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login to Your Shop
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              {/* Enhanced Footer Logo */}
              <div className="flex items-center mb-4">
                <div className="bg-[#F3BA25] rounded-lg p-2 shadow-md transform -rotate-3 mr-2">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <div className="logo-text">
                  <span className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase">
                    BODEGA
                    <span
                      className="text-gray-900 font-black relative"
                      style={{ top: "-2px", fontSize: "28px", marginLeft: "1px" }}
                    >
                      +
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-gray-600 max-w-xs">
                Connecting restaurants with customers for a better dining experience through our mobile app.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-gray-600 hover:text-gray-900">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-gray-600 hover:text-gray-900">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-600 hover:text-gray-900">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/blog" className="text-gray-600 hover:text-gray-900">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/guides" className="text-gray-600 hover:text-gray-900">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="/support" className="text-gray-600 hover:text-gray-900">
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/terms" className="text-gray-600 hover:text-gray-900">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center md:text-left">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Bodega+. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Landing


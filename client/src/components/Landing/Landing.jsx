import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";

const Landing = () => {

  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state?.client?.token);
  const navigate = useNavigate()



  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
    console.log("holaaa useffect")
    setLoading(false);  // Finish loading after checking the token
  }, []);

  if (loading) {
    return <Loader />;  // Mostrar el Loader mientras se verifica el token
  }

  return (
    <section>
      <div
        id="home"
        className="relative bg-[url('https://i.pinimg.com/564x/37/4e/36/374e36b250c56063c6013b31c2e44d82.jpg')] bg-cover bg-center flex flex-col justify-between h-screen lg:py-0"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-600 opacity-80 z-10">
          <nav className="sticky top-0 bg-yellow-600 opacity-80 z-50 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <Link to="/" className="text-xl font-bold text-gray-800">
                <img
                  src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1708765727/Bodega_Logo_sw3tog.png"
                  alt="app"
                  className="rounded-full w-16 sm:w-24 md:w-32 lg:w-40"
                />
              </Link>
            </div>
          </nav>
        </div>
        <div className="relative w-full h-full pt-56 md:pt-1 z-20 flex flex-col lg:flex-row justify-center items-center gap-10 px-6 lg:px-0 overflow-hidden">
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left p-6 lg:p-10 lg:ml-[150px]">
            <p className="text-white font-bold text-xl sm:text-2xl mb-5">
              Get More, Pay Less
            </p>
            <p className="text-white font-bold text-3xl sm:text-4xl md:text-5xl">
              Bodega+, your app for getting out
            </p>
            <p className="text-white font-bold text-base sm:text-lg mt-5">
              The best restaurants for dining out and ordering delivery with
              discounts, all in one app. Download it now!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-5">
              <Button className="px-6 py-2 font-bold rounded-full bg-white text-yellow-600 hover:bg-yellow-600 border border-white hover:text-white">
                Google Play
              </Button>
              <Button className="px-6 py-2 font-bold rounded-full bg-white text-yellow-600 hover:bg-yellow-600 border border-white hover:text-white">
                App Store
              </Button>
              <Link to="/login">
                <Button className="px-6 py-2 font-bold rounded-full bg-white text-yellow-600 hover:bg-yellow-600 border border-white hover:text-white">
                  Partner's Portal
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center p-6 lg:p-0">
            <img
              src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1708764119/celphones-removebg-preview_imjgnr.png"
              alt="app"
              className="w-3/4 sm:w-2/3 md:w-full lg:w-3/4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './login/Login';
import SignUpForm from './SignUp';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';

const NuevoLogin = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [logged, setLogged] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (logged) {
      toast.success("User created successfully. Please log in.");
    }
  }, [logged]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const backgroundImage = "https://i.pinimg.com/564x/37/4e/36/374e36b250c56063c6013b31c2e44d82.jpg";

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-yellow-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Fondo de imagen fija */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Capa semitransparente para mejorar la visibilidad del contenido */}
      <div className="absolute inset-0 z-10 bg-yellow-600 opacity-80" />

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 w-full max-w-lg md:max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <AnimatePresence mode="wait">
            {isLoginView ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 md:p-8 flex flex-col justify-center items-center text-white"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Welcome Back!</h2>
                <p className="text-center text-base md:text-lg">
                  Log in to access your account and continue enjoying Bodega+ services.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 font-sm flex flex-col justify-center items-center text-white"
              >
                <h2 className="text-base md:text-3xl font-bold mb-2 md:mb-4">Join Bodega+ Community!</h2>
                <p className="text-center text-sm md:text-lg">
                  Create an account today and start experiencing our exclusive services and benefits.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 overflow-y-auto h-[80vh]">
            <AnimatePresence mode="wait">
              {isLoginView ? (
                <Login key="login-form" setSelected={setIsLoginView} setError={setError} />
              ) : (
                <SignUpForm key="signup-form" setLogged={setLogged} setSelected={setIsLoginView} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Botón de regreso */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-30 bg-white rounded-full p-2 shadow-md"
        onClick={() => window.history.back()}
      >
        <ChevronLeft className="w-6 h-6 text-yellow-600" />
      </motion.button>

      <Toaster position="top-center" />
    </div>
  );
};

export default NuevoLogin;

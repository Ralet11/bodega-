import React, { useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Login from './login/Login';
import SignUpForm from './SignUp';
import ToasterConfig from '../ui_bodega/Toaster';
import toast from 'react-hot-toast';
import './animation.css'

const NuevoLogin = () => {
    const [selected, setSelected] = useState(true);
    const [logged, setLogged] = useState(null);
    const [error, setError] = useState(null);
    const [newError, setNewError] = useState(true);

    useEffect(() => {
        if (logged) {
            toast.success("User created correctly, please log in");
        }
    }, [logged]);

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
        }
    }, [newError]);

    return (
        <>
            <div className="relative bg-[url('https://i.pinimg.com/564x/37/4e/36/374e36b250c56063c6013b31c2e44d82.jpg')] bg-cover bg-center flex flex-col justify-center items-center h-screen">
                <div className="absolute top-0 left-0 w-full h-full bg-yellow-600 opacity-80 z-10"></div>
                <div className="relative w-full max-w-lg md:max-w-4xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden z-20">
                    {selected ? (
                        <div className="w-full md:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 flex flex-col justify-center items-center text-white">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Welcome Back!</h2>
                            <p className="text-center">Log in to access your account and continue enjoying Bodega+ services.</p>
                        </div>
                    ) : (
                        <div className="w-full md:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 flex flex-col justify-center items-center text-white">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Welcome to Bodega+ Community!</h2>
                            <p className="text-center">Join us today and start experiencing our exclusive services and benefits.</p>
                        </div>
                    )}
                    <div className="w-full md:w-1/2 bg-white p-8">
                        <SwitchTransition>
                            <CSSTransition
                                key={selected ? 'login' : 'signup'}
                                addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                                classNames="slide"
                            >
                                {selected ? (
                                    <Login newError={newError} setNewError={setNewError} setError={setError} setSelected={setSelected} />
                                ) : (
                                    <SignUpForm newError={newError} setNewError={setNewError} setError={setError} setLogged={setLogged} setSelected={setSelected} />
                                )}
                            </CSSTransition>
                        </SwitchTransition>
                    </div>
                </div>
            </div>
            <ToasterConfig />
        </>
    );
};

export default NuevoLogin;

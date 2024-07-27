import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { changeShop, getCategories, loginSuccess } from "../../redux/actions/actions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { getParamsEnv } from "../../functions/getParamsEnv";
import Input from "../../ui_bodega/Input";
import ToasterConfig from "../../ui_bodega/Toaster";

const { API_URL_BASE } = getParamsEnv()

const Login = ({ setSelected, setError, newError, setNewError }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const client = useSelector(state => state.client);

  const handleInputChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);

    try {
      const response = await axios.post(`${API_URL_BASE}/api/auth/login`, {
        email,
        password,
        credentials: true,
      });

      if (response.data.error === false) {
        console.log('Inicio de sesión exitoso');
        console.log(response.data.data, "login info");
        const clientData = response.data.data;

        console.log(clientData.locals);

        if (clientData.locals.length === 0) {
          dispatch(loginSuccess(clientData));
          dispatch(getCategories());
          navigate(`/create-shop`);
        } else {
          const shopId = clientData.locals[0].id;
          dispatch(loginSuccess(clientData));
          dispatch(changeShop(shopId));
          dispatch(getCategories());
          navigate(`/dashboard`);
        }
      } else {
        console.log('Error en la respuesta del servidor:', response.data);
        setError('Usuario o contraseña incorrectos');
        setNewError(!newError);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Usuario o contraseña incorrectos');
      setNewError(!newError);
    }
  }

  const goRegister = async (e) => {
    e.preventDefault();

    setSelected(false);
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label className="text-gray-600" htmlFor="email">Email</label>
          <Input onChange={handleInputChange} id="email" placeholder="Enter your email" type="email" name="email" className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500" />
        </div>
        <div className="mb-4 relative">
          <label className="text-gray-600" htmlFor="password">Password</label>
          <Input onChange={handleInputChange} id="password" placeholder="Enter your password" type="password" name="password" className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500" />
        </div>
        <div className="text-center relative">
          <button className="w-full bg-yellow-500 text-white px-3 py-2 rounded-md focus:outline-none hover:bg-yellow-600 transition duration-200">
            <span className="hover:text-black">
              Log in
            </span>
          </button>
        </div>
        <p className="mt-4 mb-0 leading-normal text-gray-600 text-sm">Don't have an account? <a className="font-bold cursor-pointer text-yellow-500 hover:text-yellow-600" onClick={goRegister}>Sign up</a></p>
      </form>
    </>
  );
};

export default Login;
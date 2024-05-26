
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { changeShop, getCategories, loginSuccess } from "../../redux/actions/actions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { getParamsEnv } from "../../functions/getParamsEnv";
import Input from "../../ui_bodega/Input";
import ToasterConfig from "../../ui_bodega/Toaster";

const { API_URL_BASE } = getParamsEnv()

const Login = ({setSelected, setError, newError, setNewError}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const location = useLocation();
  const dispatch = useDispatch()
  const client = useSelector(state => state.client)


  const handleInputChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value)
    } else if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
  }

  

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(email)
    console.log(password)

    try {
      const response = await axios.post(`${API_URL_BASE}/api/auth/login`, {
        email,
        password,
        credentials: true,
      })

      if (response.data.error === false) {
        console.log('Inicio de sesión exitoso')
        console.log(response.data.data, "login info")
        const clientData = response.data.data

        console.log(clientData.locals)

        if(clientData.locals.length === 0) {
          dispatch(loginSuccess(clientData))
          dispatch(getCategories())
          navigate(`/create-shop`)
        } else {
          const shopId = clientData.locals[0].id
          dispatch(loginSuccess(clientData))
          dispatch(changeShop(shopId))
          dispatch(getCategories())
          navigate(`/dashboard`)
        }

        
      } else {
        console.log('Error en la respuesta del servidor:', response.data)
        setError('Usuario o contraseña incorrectos')
        setNewError(!newError)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Usuario o contraseña incorrectos')
      setNewError(!newError)
    }
  }

  const goRegister = async (e) => {
    e.preventDefault()

    setSelected(false)
    
/*     navigate("/register") */

  /*   try {
      const response = await axios.post(`${API_URL_BASE}/api/auth/register`, {
        name: "Cliente1",
        email: 'usuario1@gmail.com',
        address: "street 123456",
        password: "123456",
        credentials: true,
        phone: "1545485855"
      })

      console.log(response)

    } catch (error) {
      console.error('Error:', error)
      setError('Usuario o contraseña incorrectos')
    } */
  }
  return (
    <>    <div className="w-full h-full bg-yellow-400">
  <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-yellow-400 md:ml-10">
    <div className="w-full max-w-full px-4 md:px-3 mx-auto mt-0 md:flex-0 shrink-0">
      <div className="flex flex-col rounded-lg overflow-hidden justify-center items-center min-h-screen bg-yellow-400 bg-custom-img-login" style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>

        <div className="relative bg-black bg-opacity-20 z-0 min-w-0 break-words border-0 shadow-soft-xl rounded-2xl bg-clip-border w-full md:w-4/12 h-auto md:h-[600px] filter brightness-75 contrast-125 p-4 md:p-0">
          <div className="p-6 mb-0 text-center border-b-0 rounded-t-2xl">
            <h5 className="text-center text-3xl md:text-6xl font-bold leading-9 tracking-tight text-white p-6 md:p-12 filter brightness-110">Login with</h5>
          </div>
          <div className="flex flex-wrap hidden justify-center md:px-3 -mx-3 sm:px-6 xl:px-12">
            <div className="w-6/12 md:w-3/12 max-w-full px-1 ml-auto flex-0 mb-2 md:mb-0">
              <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-white uppercase align-middle transition-all bg-white rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-yellow-400 flex justify-center items-center">
                <svg xmlnsXlink="http://www.w3.org/1999/xlink32" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                  <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                    <g fillRule="nonzero" transform="translate(3.000000, 3.000000)">
                      <circle r="29.4882047" cy="29.4927506" cx="29.5091719" fill="#3C5A9A"></circle>
                      <path fill="#FFFFFF" d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
            <div className="w-6/12 md:w-3/12 max-w-full px-1 flex-0 mb-2 md:mb-0">
              <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-white uppercase align-middle transition-all bg-white rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-yellow-400 flex justify-center items-center">
                <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                  <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                    <g fillRule="nonzero" fill="#000000" transform="translate(7.000000, 0.564551)">
                      <path d="M40.9233048,32.8428307 C41.0078713,42.0741676 48.9124247,45.146088 49,45.1851909 C48.9331634,45.4017274 47.7369821,49.5628653 44.835501,53.8610269 C42.3271952,57.5771105 39.7241148,61.2793611 35.6233362,61.356042 C31.5939073,61.431307 30.2982233,58.9340578 25.6914424,58.9340578 C21.0860585,58.9340578 19.6464932,61.27947 15.8321878,61.4314159 C11.8738936,61.5833617 8.85958554,57.4131833 6.33064852,53.7107148 C1.16284874,46.1373849 -2.78641926,32.3103122 2.51645059,22.9768066 C5.15080028,18.3417501 9.85858819,15.4066355 14.9684701,15.3313705 C18.8554146,15.2562145 22.5241194,17.9820905 24.9003639,17.9820905 C27.275104,17.9820905 31.733383,14.7039812 36.4203248,15.1854154 C38.3824403,15.2681959 43.8902255,15.9888223 47.4267616,21.2362369 C47.1417927,21.4153043 40.8549638,25.1251794 40.9233048,32.8428307 M33.3504628,10.1750144 C35.4519466,7.59650964 36.8663676,4.00699306 36.4804992,0.435448578 C33.4513624,0.558856931 29.7884601,2.48154382 27.6157341,5.05863265 C25.6685547,7.34076135 23.9632549,10.9934525 24.4233742,14.4943068 C27.7996959,14.7590956 31.2488715,12.7551531 33.3504628,10.1750144"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
            <div className="w-6/12 md:w-3/12 max-w-full px-1 mr-auto flex-0 mb-2 md:mb-0">
              <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-white uppercase align-middle transition-all bg-white rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-yellow-400 flex justify-center items-center">
                <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                  <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                    <g fillRule="nonzero" transform="translate(3.000000, 2.000000)">
                      <path fill="#4285F4" d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"></path>
                      <path fill="#34A853" d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"></path>
                      <path fill="#FBBC05" d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"></path>
                      <path fill="#EB4335" d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
            <div className="relative w-full max-w-full px-3 mt-2 text-center shrink-0">
              <p className="text-center text-2xl font-bold leading-9 tracking-tight text-white">or</p>
            </div>
          </div>
          <div className="flex-auto p-6">
            <form onSubmit={handleSubmit} role=" form text-left">
              <div className="w-full md:px-10 mb-4">
                <label className="text-white" htmlFor="email">Email</label>
                <Input onChange={handleInputChange} id="email" placeholder="Enter your email" type="email" name="email" />
              </div>
              <div className="w-full md:px-10 mb-4">
                <label className="text-white" htmlFor="password">Password</label>
                <Input onChange={handleInputChange} id="password" placeholder="Enter your password" type="password" name="password" />
              </div>
              <div className="md:px-10 text-center relative">
                <button className="w-full bg-yellow-500 text-white px-3 rounded-md focus:outline-none hover:bg-indigo-600">
                  <span className="hover:text-black">
                    Log in
                  </span>
                </button>
              </div>
              <p className="mt-4 mb-0 md:px-10 leading-normal text-white text-sm">Don't have an account? <a className="font-bold cursor-pointer text-white hover:text-indigo-600" onClick={goRegister}>Sign up</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</div>
<ToasterConfig/>
</>


  );

};


export default Login;

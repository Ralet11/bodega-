import React, { useEffect, useState } from 'react'
import Login from './login/Login'
import SignUp from './SignUp'
import ToasterConfig from '../ui_bodega/Toaster'
import toast from 'react-hot-toast'


const NuevoLogin = () => {

    const [selected, setSelected] = useState(true)
    const [logged, setLogged] = useState(null)

    useEffect(() => {
        if(logged) {
            toast.success("User created correctly, please log in")
        }
    },[logged])




    if (selected) {
        return (
            <>
                <Login setSelected={setSelected} />
                <ToasterConfig />
            </>
        )
    } else {
        return (
            <>
                <SignUp setLogged={setLogged} setSelected={setSelected} />
                <ToasterConfig />
            </>
        )

    }

}

export default NuevoLogin

import React, { useEffect, useState } from 'react'
import Login from './login/Login'
import SignUp from './SignUp'
import ToasterConfig from '../ui_bodega/Toaster'
import toast from 'react-hot-toast'
import { Newspaper } from 'lucide-react'


const NuevoLogin = () => {

    const [selected, setSelected] = useState(true)
    const [logged, setLogged] = useState(null)
    const [error, setError] = useState(null)
    const [newError, setNewError] = useState(true)

    useEffect(() => {
        if(logged) {
            toast.success("User created correctly, please log in")
        }
    },[logged])

    useEffect(() => {
        if (error !== null) {
            toast.error(error)
        }
        
        
    },[newError])




    if (selected) {
        return (
            <>
                <Login newError={newError} setNewError={setNewError} setError={setError} setSelected={setSelected} />
                <ToasterConfig />
            </>
        )
    } else {
        return (
            <>
                <SignUp newError={newError} setNewError={setNewError} setError={setError} setLogged={setLogged} setSelected={setSelected} />
                <ToasterConfig />
            </>
        )

    }

}

export default NuevoLogin

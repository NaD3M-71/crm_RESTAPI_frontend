// imports React
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//Librerias
import Swal from 'sweetalert2';
// Mi codigo
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

function Login() {
    // Auth y token
    const [ auth, guardarAuth] = useContext(CRMContext);
    // redireccion
    const navigate = useNavigate();

    // State con los datos del formulario
    const [datos,guardarDatos] = useState({
        email:'',
        password:''
    });

    // Iniciar sesion en el servido
    const iniciarSesion = async e =>{
        e.preventDefault();

        // autenticar usuario
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', datos)
            
            // extraer el token, colocarlo en localstorage
            const token = respuesta.data.token;
            localStorage.setItem('token', token);

            //colocar token en el state
            guardarAuth({
                token,
                auth:true
            })

            //alerta
            Swal.fire({
                icon: 'success',
                title: 'Sesion Iniciada'
            })

            navigate('/', {replace: true});
            
        } catch (error) {
            // console.log(error);

            // Separar mensajes de errores de autenticacion o de servidor
            if(error.response){
                Swal.fire({
                    icon:'error',
                    title: 'Hubo un error',
                    text: error.response.data.mensaje
                })
            } else {
                Swal.fire({
                    icon:'error',
                    title: 'Hubo un error',
                    text: 'Hubo un error'
                })
            }
        }

    }
    

    
    const leerDatos = e =>{
        guardarDatos({
            ...datos,
            [e.target.name]: e.target.value
        })
    }
    
    return (
      <>
        <div className="login">
          <h2> Login </h2>
          <div className="contenedor-formulario">
            <form onSubmit={iniciarSesion}>
                <div className="campo">
                    <label htmlFor="email">Email</label>
                    <input
                    type="text"
                    name="email"
                    placeholder="Ingresa tu Email"
                    required
                    onChange={leerDatos}
                    />
                </div>
                <div className='campo'>
                    <label htmlFor="password">Contraseña</label>
                    <input
                    type="password"
                    name="password"
                    placeholder="Ingresa tu Cosntraseña"
                    required
                    onChange={leerDatos}
                    />
                </div>
            <input
            type="submit"
            value="Iniciar Sesion"
            className='btn btn-verde btn-block'
            />
            </form>
          </div>
        </div>
      </>
    );
}

export default Login;
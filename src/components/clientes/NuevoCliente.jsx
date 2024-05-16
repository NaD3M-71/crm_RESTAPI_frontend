import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // remplazo a withRouter
import clienteAxios from '../../config/axios';
// import context
import { CRMContext } from '../../context/CRMContext';


function NuevoCliente() {
    const [cliente,guardarCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: '',
    });

    // context
    const [auth, guardarAuth] = useContext( CRMContext );
    // navigate
    let navigate = useNavigate();

    // leer datos del form
    const actualizarState = e =>{
        // almacenar lo que el usuario escribe en el state
        guardarCliente({
            // state actual 
            ...cliente, // sino borraria los valores previos
            [e.target.name] : e.target.value.trim()
        })
    }

    // Agregar cliente mediante la REST API 
    const agregarCliente = e =>{
        e.preventDefault();

        // enviar peticion a la API
        clienteAxios.post('/clientes', cliente,{
          headers: {
              Authorization: `Bearer ${auth.token}`
          }
        })
        .then(res=>{
            // validar errores de Mongo
            if(res.data.code === 11000){
                Swal.fire({
                    title: "Hubo un Error",
                    text: 'Ya existe un cliente con ese correo',
                    icon: "error"
                });
            }else {
                Swal.fire({
                    title: "Se agrego el Cliente",
                    text: res.data.mensaje,
                    icon: "success"
                });
            }

        // redireccionar a home
        navigate('/', { replace : true })
        });
    }
    // Validar form
    const validarCliente = ()=>{
        //destructuring
        const { nombre,apellido,email,empresa, telefono} = cliente;

        // revisar que las propiedades del state tengan contenido
        let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length;

        // return true o false
        return valido;
    }

    // verificar si el usuario esta autenticado
    if(!auth.auth && (localStorage.getItem('token')=== auth.token)) return navigate('/iniciar-sesion', {replace: true})
    
    return (
      <>
        <h2>Nuevo Cliente</h2>
        <form
            onSubmit={agregarCliente}
        >
          <legend>Llena todos los campos</legend>

          <div className="campo">
            <label>Nombre:</label>
            <input 
                type="text" 
                placeholder="Nombre Cliente" 
                name="nombre"
                onChange={actualizarState} 
            />
          </div>

          <div className="campo">
            <label>Apellido:</label>
            <input 
                type="text" 
                placeholder="Apellido Cliente" 
                name="apellido" 
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Empresa:</label>
            <input 
                type="text" 
                placeholder="Empresa Cliente" 
                name="empresa" 
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Email:</label>
            <input 
                type="email" 
                placeholder="Email Cliente" 
                name="email" 
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Teléfono:</label>
            <input
              type="tel"
              placeholder="Teléfono Cliente"
              name="telefono"
              onChange={actualizarState}
            />
          </div>

          <div className="enviar">
            <input
              type="submit"
              className="btn btn-azul"
              value="Agregar Cliente"
              disabled= {validarCliente()}
            />
          </div>
        </form>
      </>
    );
}

export default NuevoCliente;
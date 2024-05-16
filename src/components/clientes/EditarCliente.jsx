import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom'; // remplazo a withRouter
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

function EditarCliente(props) {

  // context
  const [auth, guardarAuth] = useContext( CRMContext );
  // navigate
  let navigate = useNavigate();
  // obtener Id
  const { id } = useParams();


    
    const [cliente,datosCliente] = useState({
        nombre : '',
        apellido : '',
        empresa : '',
        emai : '',
        telefono : '',
    });
    

    useEffect( ()=> {
      if (auth.token !== '') {
        const consultarAPI = async()=>{
          try {
            const clienteConsulta = await clienteAxios.get(`/clientes/${id}`,{
              headers: {
                  Authorization: `Bearer ${auth.token}`
              }
          });
            
            // guardar el resultado en el state
            datosCliente(clienteConsulta.data)
          } catch (error) {
            // error con la auth
            if(error.response.status === 500){
              navigate('/iniciar-sesion', {replace: true});
          }
          }
        }
        consultarAPI();
      }
    },[]);

    

    // leer datos del form
    const actualizarState = e =>{
        // almacenar lo que el usuario escribe en el state
        datosCliente({
            // state actual 
            ...cliente, // sino borraria los valores previos
            [e.target.name] : e.target.value.trim()
        })
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
    //destructuring
    const { _id,nombre,apellido,email,empresa, telefono} = cliente;

    const actualizarCliente = e =>{
        e.preventDefault();

        // enviar peticion a la API
        clienteAxios.put(`/clientes/${_id}`, cliente,{
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
                        title: "Exito",
                        text: 'Los datos del Cliente fueron actualizados',
                        icon: "success"
                    });
                }

                // redireccionar a home
                navigate('/', { replace : true })
            });
    }

    // verificar si el usuario esta autenticado
    if(!auth.auth && (localStorage.getItem('token')=== auth.token)) return navigate('/iniciar-sesion', {replace: true})

    return (
      <>
        <h2>Editar Cliente</h2>
        <form
            onSubmit={actualizarCliente}
        >
          <legend>Llena todos los campos</legend>

          <div className="campo">
            <label>Nombre:</label>
            <input 
                type="text" 
                placeholder="Nombre Cliente" 
                name="nombre"
                value={`${nombre}`}
                onChange={actualizarState} 
            />
          </div>

          <div className="campo">
            <label>Apellido:</label>
            <input 
                type="text" 
                placeholder="Apellido Cliente" 
                name="apellido" 
                value={`${apellido}`}
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Empresa:</label>
            <input 
                type="text" 
                placeholder="Empresa Cliente" 
                name="empresa" 
                value={`${empresa}`}
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Email:</label>
            <input 
                type="email" 
                placeholder="Email Cliente" 
                name="email" 
                value= {`${email}`}
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Teléfono:</label>
            <input
              type="tel"
              placeholder="Teléfono Cliente"
              name="telefono"
              value={`${telefono}`}
              onChange={actualizarState}
            />
          </div>

          <div className="enviar">
            <input
              type="submit"
              className="btn btn-azul"
              value="Guardar Cambios"
              disabled= {validarCliente()}
            />
          </div>
        </form>
      </>
    );
}

export default EditarCliente;
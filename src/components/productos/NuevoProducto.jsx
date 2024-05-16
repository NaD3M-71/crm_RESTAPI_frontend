import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';
import Swal from 'sweetalert2';

function NuevoProducto() {
    // producto =  state, guardarProducto = useState
    const [producto, datosProducto]= useState({
        nombre: '',
        precio: '',
    });

    // archivo =  state, guardarArchivo = useState
    const [archivo,guardarArchivo] = useState('');
    // context
    const [auth, guardarAuth] = useContext( CRMContext );
    //navigate
    let navigate = useNavigate();
    
    const actualizarState = e =>{
      // almacenar lo que escribe el usuario en el state
      datosProducto({
        // state actual
        ...producto,
        [e.target.name]: e.target.value.trim()
      })
    }
    
    // coloca imagen en el State
    const leerArchivo = e =>{
      guardarArchivo( e.target.files[0])
    }

    // agregar producto y subir imagen al servidos
    const agregarProducto = async e =>{
        e.preventDefault();

        // crear form data
        const formData =  new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        try {
          await clienteAxios.post('/productos', formData, {
            headers: {
              'Content-Type' : 'multipart/form-data',
              Authorization: `Bearer ${auth.token}`
            }
          })
            .then(res=>{
                Swal.fire({
                    title: "Se agrego el Producto",
                    text: res.data.mensaje,
                    icon: "success"
                });
            })
            navigate('/productos',{ replace : true })
        } catch (error) {
          console.log(error);
          // Swal Alert
          Swal.fire({
            title: "Hubo un error",
            text: 'Por favor vuelva a intentar',
            icon: "error"
        });
        }

        // enviar peticion a la API
        
    }

    // verificar si el usuario esta autenticado
    if(!auth.auth && (localStorage.getItem('token')=== auth.token)) return navigate('/iniciar-sesion', {replace: true})
    
    return (
      <>
        <h2>Nuevo Producto</h2>

        <form
            onSubmit={agregarProducto}
        >
          <legend>Llena todos los campos</legend>

          <div className="campo">
            <label>Nombre:</label>
            <input 
                type="text" 
                placeholder="Nombre Producto" 
                name="nombre" 
                onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Precio:</label>
            <input
              type="number"
              name="precio"
              min="0.00"
              step="0.01"
              placeholder="Precio"
              onChange={actualizarState}
            />
          </div>

          <div className="campo">
            <label>Imagen:</label>
            <input 
                type="file" 
                name="imagen" 
                onChange={leerArchivo}
            />
          </div>

          <div className="enviar">
            <input
              type="submit"
              className="btn btn-azul"
              value="Agregar Producto"
            />
          </div>
        </form>
      </>
    );
}

export default NuevoProducto;
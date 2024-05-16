import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
// Axios
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

// componentes
import Spinner from '../layout/Spinner';



function EditarProducto() {
    // Obtener el id
    const { id } = useParams();
    // context
    const [auth, guardarAuth] = useContext( CRMContext );
    // navigate
    let navigate= useNavigate();
    // state para el producto
    const [producto, datosProducto]= useState({
        nombre: '',
        precio: '',
        imagen: ''
    });
    // useState para el archivo
    const [archivo,guardarArchivo] = useState('');

    
    useEffect(()=>{
        if (auth.token !== '') {
            const consultarAPI= async()=>{
                try {
                    const productoConsulta = await clienteAxios.get(`/productos/${id}`,{
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    // guardo resultado en el useState
                    datosProducto(productoConsulta.data);
                } catch (error) {
                    // error con la auth
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion', {replace: true});
                    }
                }
            };
            consultarAPI();
        } else {
            navigate('/iniciar-sesion', {replace: true});
        }
    },[]);

    if(!auth.auth){ navigate('/iniciar-sesion', {replace: true}); }

    const actualizarState = e =>{
        // almacenar lo que escribe el usuario en el state
        datosProducto({
            // state actual
            ...producto,
            [e.target.name]: e.target.value.trim()
        })
    }
    // coloca la imagen en el state
    const leerArchivo = e => {
        guardarArchivo( e.target.files[0] );
    }
    
    // destructuring
    const { nombre,precio,imagen } = producto;

    // Guardar nueva info del producto
    const EditarProducto = async e=>{
        e.preventDefault();

        // crear form data
        const formData =  new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        try {
            await clienteAxios.put(`/productos/${id}`, formData,{
                headers: {
                  'Content-Type' : 'multipart/form-data',
                  Authorization: `Bearer ${auth.token}`
                }
            }).then(res=>{
                    Swal.fire({
                        title: "Editado Correctamente",
                        text: res.data.mensaje,
                        icon: "success"
                    });
                })
            navigate('/productos',{ replace : true })
        } catch (error) {
            console.log(error);
            //
            Swal.fire({
                title: "Hubo un error",
                text: "Por favor intenta nuevamente",
                icon: "error"
            });
        }
    }


    if(!nombre) return <Spinner/>
    
    // verificar si el usuario esta autenticado
    if(!auth.auth && (localStorage.getItem('token')=== auth.token)) return navigate('/iniciar-sesion', {replace: true})
    
    return ( 
        <>
            <h2>Editar Producto</h2>

            <form
                onSubmit={EditarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        defaultValue={nombre} 
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
                    defaultValue={precio}
                    onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    { imagen ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${imagen}`} 
                            alt='imagen'
                            width='300' 
                        />
                    ): null }
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
                    value="Editar Producto"
                    />
                </div>
            </form>
        </>
     );
}

export default EditarProducto;
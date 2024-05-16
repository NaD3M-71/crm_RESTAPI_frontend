import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Axios
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

// Componentes
import Producto from './Producto';
import Spinner from '../layout/Spinner';



function Productos() {   
    // clientes = state guardarClientes = funcion para guardar el state
    const [productos, guardarProductos ] = useState([])
   // context
   const [auth, guardarAuth] = useContext( CRMContext );
   // navigate
   let navigate = useNavigate();

    // hook useEffect
    useEffect( () => { 
        if(auth.token !== ''){
             // query a la API
            const consultarAPI = async()=>{
                try {
                    const productosConsulta = await clienteAxios.get('/productos',{
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    
                    // guardar el resultado en el state
                    guardarProductos(productosConsulta.data);
                } catch (error) {
                    // error con la auth
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion', {replace: true});
                    }
                }
            }
            consultarAPI();
        } else {
            navigate('/iniciar-sesion', {replace: true});
        }
    }, [productos] );

    if(!auth.auth){ navigate('/iniciar-sesion', {replace: true}); }
    
    // Spinner de Carga
    if(!productos.length) return <Spinner/>

    return ( 
        <>
            <h2>Productos</h2>
            <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente"> 
               + Nuevo Producto
            </Link>
            <ul className="listado-productos">
                {productos.map(producto=>( 
                    <Producto
                        key={producto._id}
                        producto={producto}
                    />
                ))}
            </ul>
        </>
     );
}

export default Productos;
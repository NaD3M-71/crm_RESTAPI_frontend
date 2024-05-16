import React, { useContext, useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

// importar cliente axios
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

// Componentes
import Cliente from './Cliente';
import Spinner from '../layout/Spinner';


function Clientes() {   

    //Aplicar useState
    // clientes = state guardarClientes = funcion para guardar el state
    const [clientes, guardarClientes ] = useState([])
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
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    
                    // guardar el resultado en el state
                    guardarClientes(clientesConsulta.data)
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
        
        }, [clientes] );

        if(!auth.auth){ navigate('/iniciar-sesion', {replace: true}); }

    // Spinner de Carga
    if(!clientes.length) return <Spinner/> 

    return ( 
        <>
            <h2>Clientes</h2>
            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> 
                <i className="fa-solid fa-plus"></i>
                Nuevo Cliente
            </Link>
            <ul className="listado-clientes">
                {clientes.map(cliente=>( 
                    <Cliente
                        key={cliente._id}
                        cliente={cliente}
                    />
                ))}
            </ul>

        </>
     );
}

export default Clientes;
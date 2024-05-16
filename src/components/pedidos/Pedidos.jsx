import React, { useContext, useEffect, useState } from 'react';

// importar cliente axios
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

import Pedido from './Pedido';
import { useNavigate } from 'react-router-dom';

function Pedidos() {   
    // state
    const [pedidos,guardarPedidos] = useState([]);
    
    // context
    const [auth, guardarAuth] = useContext( CRMContext );
    // navigate
    let navigate = useNavigate();

    // useEffect
    useEffect(()=>{
        if (auth.token !== '') {
            const consultarAPI = async ()=>{
                try {
                    const resultado = await clienteAxios.get('/pedidos', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    // guardo resultados en el state
                    guardarPedidos(resultado.data);
                } catch (error) {
                    // error con la auth
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion', {replace: true});
                    }
                }
            }
            consultarAPI()
        } else {
            navigate('/iniciar-sesion', {replace: true});
        }
    },[pedidos]);

    if(!auth.auth){ navigate('/iniciar-sesion', {replace: true}); }

    
    return ( 
        <>
            <h2>Pedidos</h2>
            <ul className="listado-pedidos">

                {pedidos.map(pedido =>(
                    <Pedido
                        key={pedido._id}
                        pedido={pedido}
                        
                    />

                ))}
                
                
            </ul>
        </>
     );
}

export default Pedidos;
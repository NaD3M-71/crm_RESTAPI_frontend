import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

function Cliente({cliente}) {

    // context
    const [auth, guardarAuth] = useContext( CRMContext );

    const {_id,nombre,apellido,empresa,email,telefono} = cliente

    // Eliminar cliente
    const eliminarCliente = idCliente=>{
        Swal.fire({
            title: "Estas seguro que quieres eliminar al Cliente?",
            text: "Una vez eliminado no se puede recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                clienteAxios.delete(`/clientes/${idCliente}`,{
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                    .then(res=>{
                        Swal.fire({
                            title: "Eliminado",
                            text: res.data.mensaje,
                            icon: "success"
                          });
                    })
                
            }
          });
    }
    useNavigate('/',  { replace : true })
    return ( 
        <>
            <li className="cliente">
                <div className="info-cliente">
                    <p className="nombre">{`${apellido}, ${nombre}. `}</p>
                    <p className="empresa">{empresa}</p>
                    <p>{email}</p>
                    <p>Tel: {telefono}</p>
                </div>
                <div className="acciones">
                    <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                        <i className="fa-solid fa-pencil" />
                        Editar Cliente
                    </Link>
                    <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
                        <i className="fa-solid fa-plus" />
                        Nuevo Pedido
                    </Link>
                    <Link href="" className='hidden'></Link>

                    <button 
                        type="button" 
                        className="btn btn-rojo"
                        onClick={()=> eliminarCliente(_id)}
                    >
                        <i className="fa-solid fa-xmark" />
                        Eliminar Cliente
                    </button>
                </div>
            </li>
        </>
     );
}

export default Cliente;
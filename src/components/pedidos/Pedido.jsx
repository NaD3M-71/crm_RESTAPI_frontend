import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';



function Pedido({pedido}) {
    // context
    const [auth, guardarAuth] = useContext( CRMContext );

    const { _id,cliente } = pedido
    //console.log(pedido);

    const eliminarPedido = idPedido =>{
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
                clienteAxios.delete(`/pedidos/${idPedido}`,{
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
    

    
    return ( 
        <>
            <li className="pedido border-black">
                <div className="info-pedido">
                    <p className="id">ID: {pedido._id}</p>
                    <p className="nombre">Cliente: {cliente.apellido}, {cliente.nombre}</p>

                    <div className="articulos-pedido">
                        <p className="productos">Artículos Pedidos: </p>
                        <ul>
                        {pedido.pedido.map(articulos => (
                            <li key={pedido._id+articulos.producto._id}>
                                <p><span className='productos'>{articulos.producto.nombre}</span> </p>
                                <p>Precio: ${articulos.producto.precio} </p>
                                <p>Cantidad: {articulos.cantidad}</p>
                            </li>
                        ))}
                        </ul>
                    </div>
                        <p className="total border-black">Total: ${pedido.total} </p>
                </div>
                <div className="acciones">

                    <button 
                        type="button" 
                        className="btn btn-rojo"
                        onClick={()=>eliminarPedido(_id)}
                    >
                        <i className="fas fa-times"></i>
                        Eliminar Pedido
                    </button>
                </div>
            </li>
        </>
     );
}

export default Pedido;
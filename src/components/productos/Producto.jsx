import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

function Producto({producto}) {
    const {_id,nombre,precio,imagen} = producto;

    // context
    const [auth, guardarAuth] = useContext( CRMContext );

    const eliminarProducto = idProducto=>{
        Swal.fire({
            title: "Estas seguro que quieres eliminar este Producto?",
            text: "Una vez eliminado no se puede recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "No, Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                clienteAxios.delete(`/productos/${idProducto}`,{headers: {
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
                <li className="producto">
                    <div className="info-producto">
                        <p className="nombre">{nombre}</p>
                        <p className="precio">${precio} </p>
                        {
                            imagen ? (<img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${imagen}`} 
                                            alt='imagen producto'
                                            width='300'/> ): null}
                    </div>
                    <div className="acciones">
                        <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
                            <i className="fas fa-pen-alt"></i>
                            Editar Producto
                        </Link>

                        <button 
                            type="button" 
                            className="btn btn-rojo btn-eliminar"
                            onClick={()=>eliminarProducto(_id)}
                        >
                            <i className="fas fa-times"></i>
                            Eliminar Producto
                        </button>
                    </div>
                </li>

        </>
     );
}

export default Producto;
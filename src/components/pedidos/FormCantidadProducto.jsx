import React from 'react';

function FormCantidadProducto(props) {
    const {producto, index, sumarProductos, restarProductos, eliminarProductoPedido} = props
    const {nombre, precio, cantidad } = producto;
    
    return ( 
        <>
            <li>
                <div className="texto-producto">
                    <p className="nombre">{nombre}</p>
                    <p className="precio">${precio}</p>
                </div>
                <div className="acciones">
                    <div className="contenedor-cantidad">
                        <i 
                            className="fas fa-minus"
                            onClick={()=> restarProductos(index)}
                        ></i>
                        <p>{cantidad}</p>  
{/** si quisiera agregar cantidades con teclado utilizar <input> en ves de <p> */}
                        <i 
                            className="fas fa-plus"
                            onClick={()=> sumarProductos(index)}
                        ></i>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-rojo"
                        onClick={()=> eliminarProductoPedido(producto._id)}
                    >
                        <i className="fas fa-minus-circle"></i>
                            Eliminar Producto
                    </button>
                </div>
            </li>
        </>
     );
}

export default FormCantidadProducto;
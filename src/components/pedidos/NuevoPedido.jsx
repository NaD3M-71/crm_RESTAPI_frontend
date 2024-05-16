import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';
// importar Context
import { CRMContext } from '../../context/CRMContext';

// Imports Componentes
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';

// imports 
import Swal from 'sweetalert2';


function NuevoPedido(props) {
    // obtener id y datos cliente
    const { id } = useParams();
    // context
    const [auth, guardarAuth] = useContext( CRMContext );
    // navigate
    let navigate = useNavigate();

    // states
    const [cliente,datosCliente] = useState({});
    const [busqueda,guardarBusqueda] = useState('');
    const [productos,guardarProductos] = useState([]);
    const [total,guardarTotal] = useState(0);
    
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
                    datosCliente(clienteConsulta.data);

                } catch (error) {
                    // error con la auth
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion', {replace: true});
                    }
                }
            }
            // llamar a la API
            consultarAPI();
            // actualizar el Total
            actualizarTotal();
        } else {
            navigate('/iniciar-sesion', {replace: true});
        }
    },[productos]);

    const buscarProducto = async e =>{
        e.preventDefault();
        // obtener los productos de la busqueda

        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`,{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
        //console.log(resultadoBusqueda);

        // si no hay resultados mostrar una alerta, else => agregar al state
        if (resultadoBusqueda.data[0]) {
            
            let productoResultado =  resultadoBusqueda.data[0];

            // agregasr la llave 'producto' (copia de id)

            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;

            // agregar al state
            guardarProductos([...productos, productoResultado]);



        } else {
            // no hay resultados
            Swal.fire({
                icon: 'error',
                title: 'No hay Resultados',
                text: 'La busqueda no encontro resultados.'
            })
        }
    }
    // almacenar una buscqueda en el state
    const leerDatosBusqueda = e =>{
        guardarBusqueda( e.target.value );
    }
    
    // actualizar la cantidad de pedidos
    const restarProductos = i =>{
        // obtener el array
        const allProductos = [...productos]
        // validar que la cantidad no sea 0
        if (allProductos[i].cantidad=== 0) return

        // decremento
        allProductos[i].cantidad--; 
        // guardar cantidad en el state
        guardarProductos(allProductos);
    }
    const sumarProductos = i =>{
        // obtener el array
        const allProductos = [...productos]

        // incremento
        allProductos[i].cantidad++; 
        // guardar cantidad en el state
        guardarProductos(allProductos);
    }

    // Eliminar producto del state
    const eliminarProductoPedido = id =>{
        // obtener el producto y devuelvo el array sin este producto
        const allProductos = productos.filter(producto => producto.producto  !== id );

        // almacenar en el state
        guardarProductos(allProductos);


    }
    
    // actualizar el total a pagar
    const actualizarTotal =()=>{
        // si el array productos es 0, el total es 0
        if(productos.length === 0) {
            guardarTotal(0);
            return;
        }
        // variable nuevoTotal
        let nuevoTotal = 0;
        // map a productos y sus cantidades t precio
        productos.map(producto=> nuevoTotal += (producto.cantidad * producto.precio));

        //guardar el State
        guardarTotal(nuevoTotal);

    }

    // almacenar pedido en la BD
    const enviarPedido = async e =>{
        e.preventDefault();

  
        // construir el objeto
        const pedido = {
            "cliente" : id,
            "pedido" : productos,
            "total" : total
        }

        console.log(pedido);

        // guardar en la BD
        const resultado = await clienteAxios.post('/pedidos', pedido,{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });

        // leer resultado
        if(resultado.status === 200){
            Swal.fire({
                title: 'Pedido realizado',
                text: `Se ha almacenado un pedido para ${cliente.nombre}`,
                icon: 'success'
        })

        navigate('/', { replace : true });
    }else {
        Swal.fire({
            title: 'Hubo un error',
            text: `Intenta nuevamente`,
            icon: 'error'
        })
    }
    
    }
    
    
    // verificar si el usuario esta autenticado
    if(!auth.auth && (localStorage.getItem('token')=== auth.token)) return navigate('/iniciar-sesion', {replace: true})
    
    return ( 
        <>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {cliente.apellido}, {cliente.nombre}</p>
                <p>Empresa: {cliente.empresa}</p>
                <p>Telefono: {cliente.telefono}</p>
            </div>
            

            <FormBuscarProducto
                buscarProducto ={buscarProducto}
                leerDatosBusqueda= {leerDatosBusqueda}
            />
            <form>

                <ul className="resumen">
                    {productos.map((producto, index)=>(
                        <FormCantidadProducto
                            key={producto.producto}
                            producto={producto}
                            restarProductos= {restarProductos}
                            sumarProductos= {sumarProductos}
                            eliminarProductoPedido= {eliminarProductoPedido}
                            index= {index}
                        />

                    ))}
                </ul>
            </form>
                <p className='total'>Total a Pagar: <span>$ {total}</span></p>
                { total > 0 ? (
                    <form
                        onSubmit={enviarPedido}
                    >
                        <div className="enviar">
                            <input 
                                type="submit" 
                                className="btn btn-block btn-verde" 
                                value="Realizar Pedido"/>
                        </div>
                    </form>
                ): null}
        </>
     );
}

export default NuevoPedido;
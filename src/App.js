import React, {Fragment, useContext} from "react";

// Routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


/** LAYOUT */
import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";

/** COMPONENTES */
import Clientes from "./components/clientes/Clientes";
import NuevoCliente from "./components/clientes/NuevoCliente";
import EditarCliente from "./components/clientes/EditarCliente";

import Productos from "./components/productos/Productos";
import NuevoProducto from "./components/productos/NuevoProducto";
import EditarProducto from "./components/productos/EditarProducto";

import Pedidos from "./components/pedidos/Pedidos";
import NuevoPedido from "./components/pedidos/NuevoPedido";

import Login from "./components/auth/Login";

import { CRMContext, CRMProvider } from "./context/CRMContext";


function App() {
  // utilizar context en componentes
  const [auth, guardarAuth] = useContext(CRMContext);
  
  console.log(process.env.REACT_APP_BACKEND_URL);

  return (
    <Router>
      <>
        <CRMProvider value={[ auth,guardarAuth ]}>
          <Header/>
          <div className="grid contenedor contenido-principal">
            <Navbar/>
            <main className="caja-contenido col-9">
              <Routes>
                <Route exact path="/" element={<Clientes/>} />
                <Route exact path="/clientes/nuevo" element={<NuevoCliente/>}/>
                <Route exact path="/clientes/editar/:id" element={<EditarCliente/>}/>

                <Route exact path="/productos" element={<Productos/>} />
                <Route exact path="/productos/nuevo" element={<NuevoProducto/>} />
                <Route exact path="/productos/editar/:id" element={<EditarProducto/>} />
                
                <Route exact path="/pedidos" element={<Pedidos/>} />
                <Route exact path="/pedidos/nuevo/:id" element={<NuevoPedido/>} /> {/** :id => clienteId */}
                
                <Route exact path="/iniciar-sesion" element={<Login/>} />


              </Routes>
            </main>
          </div>
        </CRMProvider>
      </>
    </Router>
  )
}


export default App;

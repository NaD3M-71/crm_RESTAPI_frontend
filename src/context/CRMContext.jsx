import React, { useState } from 'react';


const CRMContext = React.createContext([{}, ()=>{}]);  // el primer item del array seria el objeto auth, el segundo la funcion guardarToken

const CRMProvider = props =>{
    //definir el State
    const[auth, guardarAuth] = useState({
        token:'',
        auth: false
    });

    return(
        <CRMContext.Provider value={[auth,guardarAuth]}>
            {props.children}
        </CRMContext.Provider>
    )
}

export {
    CRMContext,
    CRMProvider
}
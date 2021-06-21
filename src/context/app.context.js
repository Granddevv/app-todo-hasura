import React, { useState } from 'react'

const AppContext = React.createContext();

const AppProvider = props => {
    const [ auth, setAuth ] = useState({
        isAuth: false,
        user: null
    })

  return <AppContext.Provider value={{
    auth,
    setAuth
  }} {...props} />
}

const useApp = () => React.useContext(AppContext)

export { AppProvider, useApp }
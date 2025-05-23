import React, { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto
const UsuarioContext = createContext();

// Hook personalizado para usar el contexto más fácilmente
export const useUsuario = () => {
  const contexto = useContext(UsuarioContext);
  if (!contexto) {
    throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  }
  return contexto;
};

// Proveedor del contexto
export const UsuarioProvider = ({ children }) => {
  // Estado para guardar la información del usuario logueado
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la aplicación, verificar si hay un usuario guardado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const datosUsuario = JSON.parse(usuarioGuardado);
        setUsuario(datosUsuario);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('usuario');
      }
    }
    setCargando(false);
  }, []);

  // Función para hacer login
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
  };

  // Función para hacer logout
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  // Función para verificar si el usuario está logueado
  const estaLogueado = () => {
    return usuario !== null;
  };

  // Función para obtener el rol del usuario
  const obtenerRol = () => {
    return usuario ? usuario.rol : null;
  };

  // Función para obtener los datos del usuario
  const obtenerUsuario = () => {
    return usuario;
  };

  // Valores que estarán disponibles en toda la aplicación
  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    estaLogueado,
    obtenerRol,
    obtenerUsuario
  };

  return (
    <UsuarioContext.Provider value={valor}>
      {children}
    </UsuarioContext.Provider>
  );
};
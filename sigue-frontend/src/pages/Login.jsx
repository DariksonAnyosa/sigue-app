import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import { autenticacion } from '../services/api';

const Login = () => {
  // Estados para el formulario
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Hooks de navegación y contexto
  const navigate = useNavigate();
  const { iniciarSesion } = useUsuario();

  // Función para manejar el envío del formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setError('');
    setCargando(true);

    try {
      // Validaciones básicas
      if (!correo || !contraseña) {
        setError('Por favor, completa todos los campos');
        return;
      }

      // Hacer login al backend
      const respuesta = await autenticacion.login(correo, contraseña);
      
      // Si el login es exitoso
      if (respuesta.usuario) {
        // Guardar usuario en el contexto
        iniciarSesion(respuesta.usuario);
        
        // Redirigir según el rol
        redirigirSegunRol(respuesta.usuario.rol);
      } else {
        setError('Credenciales incorrectas');
      }

    } catch (error) {
      console.error('Error al hacer login:', error);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  // Función para redirigir según el rol del usuario
  const redirigirSegunRol = (rol) => {
    switch (rol) {
      case 'tutor':
        navigate('/inicio-tutor');
        break;
      case 'docente':
        navigate('/inicio-docente');
        break;
      case 'apoderado':
        navigate('/inicio-apoderado');
        break;
      case 'director':
        navigate('/inicio-director');
        break;
      case 'administrador':
        navigate('/inicio-admin');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sistema de Asistencia
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={manejarSubmit}>
          <div className="space-y-4">
            {/* Campo de correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                required
                className="input-field"
                placeholder="ejemplo@colegio.edu"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={cargando}
              />
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                required
                className="input-field"
                placeholder="Tu contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                disabled={cargando}
              />
            </div>
          </div>

          {/* Mostrar errores */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              disabled={cargando}
              className={`w-full btn-primary ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cargando ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          {/* Ayuda */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Problemas para acceder?{' '}
              <a href="mailto:soporte@colegio.edu" className="text-primary-600 hover:text-primary-500 font-medium">
                Contacta al administrador
              </a>
            </p>
          </div>
        </form>

        {/* Información de roles para desarrollo */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Roles disponibles:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• <strong>Tutor:</strong> Ver y marcar asistencia de su aula</div>
            <div>• <strong>Docente:</strong> Marcar asistencia por curso</div>
            <div>• <strong>Apoderado:</strong> Ver historial de su hijo</div>
            <div>• <strong>Director:</strong> Ver estadísticas globales</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
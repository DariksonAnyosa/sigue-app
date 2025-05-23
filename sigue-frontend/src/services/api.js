// URL base de tu backend - CAMBIAR POR LA TUYA
const API_BASE_URL = 'http://localhost:3001/api';

// Función para hacer peticiones HTTP
const hacerPeticion = async (endpoint, opciones = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Configuración por defecto
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...opciones
    };

    // Si hay datos en el body, convertirlos a JSON
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const respuesta = await fetch(url, config);
    
    // Si la respuesta no es exitosa, lanzar error
    if (!respuesta.ok) {
      const error = await respuesta.text();
      throw new Error(`Error ${respuesta.status}: ${error}`);
    }

    // Si la respuesta está vacía, retornar objeto vacío
    const textoRespuesta = await respuesta.text();
    return textoRespuesta ? JSON.parse(textoRespuesta) : {};

  } catch (error) {
    console.error('Error en petición:', error);
    throw error;
  }
};

// ======================================
// FUNCIONES DE AUTENTICACIÓN
// ======================================

export const autenticacion = {
  // Hacer login
  login: async (correo, contraseña) => {
    return hacerPeticion('/auth/login', {
      method: 'POST',
      body: { correo, contraseña }
    });
  },

  // Verificar si el token es válido
  verificarToken: async (token) => {
    return hacerPeticion('/auth/verificar', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// ======================================
// FUNCIONES PARA ESTUDIANTES
// ======================================

export const estudiantes = {
  // Obtener todos los estudiantes
  obtenerTodos: () => hacerPeticion('/estudiantes'),
  
  // Obtener estudiantes por tutor
  obtenerPorTutor: (tutorId) => hacerPeticion(`/estudiantes/tutor/${tutorId}`),
  
  // Obtener estudiante por apoderado
  obtenerPorApoderado: (apoderadoId) => hacerPeticion(`/estudiantes/apoderado/${apoderadoId}`),
  
  // Obtener un estudiante específico
  obtenerPorId: (id) => hacerPeticion(`/estudiantes/${id}`),
  
  // Crear nuevo estudiante
  crear: (datos) => hacerPeticion('/estudiantes', {
    method: 'POST',
    body: datos
  }),
  
  // Actualizar estudiante
  actualizar: (id, datos) => hacerPeticion(`/estudiantes/${id}`, {
    method: 'PUT',
    body: datos
  }),
  
  // Eliminar estudiante
  eliminar: (id) => hacerPeticion(`/estudiantes/${id}`, {
    method: 'DELETE'
  })
};

// ======================================
// FUNCIONES PARA ASISTENCIA
// ======================================

export const asistencia = {
  // Marcar entrada
  marcarEntrada: (estudianteId, registradoPor) => hacerPeticion('/asistencia/entrada', {
    method: 'POST',
    body: { estudianteId, registradoPor }
  }),
  
  // Marcar salida
  marcarSalida: (estudianteId, registradoPor) => hacerPeticion('/asistencia/salida', {
    method: 'POST',
    body: { estudianteId, registradoPor }
  }),
  
  // Obtener asistencia por estudiante
  obtenerPorEstudiante: (estudianteId, fechaInicio, fechaFin) => {
    let url = `/asistencia/estudiante/${estudianteId}`;
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }
    return hacerPeticion(url);
  },
  
  // Obtener asistencia por tutor
  obtenerPorTutor: (tutorId, fecha) => {
    let url = `/asistencia/tutor/${tutorId}`;
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    return hacerPeticion(url);
  },
  
  // Obtener estadísticas de asistencia
  obtenerEstadisticas: (fechaInicio, fechaFin) => {
    return hacerPeticion(`/asistencia/estadisticas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
};

// ======================================
// FUNCIONES PARA PERSONAL
// ======================================

export const personal = {
  // Obtener todo el personal
  obtenerTodos: () => hacerPeticion('/personal'),
  
  // Obtener personal por rol
  obtenerPorRol: (rol) => hacerPeticion(`/personal/rol/${rol}`),
  
  // Crear nuevo personal
  crear: (datos) => hacerPeticion('/personal', {
    method: 'POST',
    body: datos
  }),
  
  // Actualizar personal
  actualizar: (id, datos) => hacerPeticion(`/personal/${id}`, {
    method: 'PUT',
    body: datos
  })
};

// ======================================
// FUNCIONES PARA APODERADOS
// ======================================

export const apoderados = {
  // Obtener todos los apoderados
  obtenerTodos: () => hacerPeticion('/apoderados'),
  
  // Obtener apoderado por ID
  obtenerPorId: (id) => hacerPeticion(`/apoderados/${id}`),
  
  // Crear nuevo apoderado
  crear: (datos) => hacerPeticion('/apoderados', {
    method: 'POST',
    body: datos
  })
};

// ======================================
// FUNCIONES PARA JUSTIFICACIONES
// ======================================

export const justificaciones = {
  // Crear justificación
  crear: (estudianteId, fecha, motivo, registradoPor) => hacerPeticion('/justificaciones', {
    method: 'POST',
    body: { estudianteId, fecha, motivo, registradoPor }
  }),
  
  // Obtener justificaciones por estudiante
  obtenerPorEstudiante: (estudianteId) => hacerPeticion(`/justificaciones/estudiante/${estudianteId}`)
};
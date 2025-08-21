// Componente de pantalla de progreso para mostrar que una funcionalidad está en desarrollo
const ProgressScreen = () => {
  return (
    // Contenedor principal con fondo degradado y centrado
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-[Quicksand] p-4">
      {/* Tarjeta blanca con sombra y bordes redondeados */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icono animado principal */}
        <div className="relative mb-6">
          {/* Círculo animado con SVG */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {/* Primer path del icono */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              {/* Segundo path del icono */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {/* Icono de reloj en la esquina superior derecha */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        {/* Título principal */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Función en Desarrollo
        </h1>
        {/* Mensaje descriptivo */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          La funcionalidad de búsqueda global está actualmente en progreso. Nuestro equipo está trabajando para brindarte la mejor experiencia posible.
        </p>
        {/* Barra de progreso animada */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
        </div>
        {/* Mensaje de agradecimiento */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
          <div className="flex items-center">
            {/* Icono de check */}
            <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800 font-medium">
              ¡Gracias por tu paciencia!
            </p>
          </div>
        </div>
        {/* Información adicional */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>• Tiempo estimado: Próximamente</p>
          <p>• Estado: Pendiente</p>
          <p>• Prioridad: Media-alta</p>
        </div>
      </div>
    </div>
  )
}
// Exporta el componente para su uso en otras partes de la aplicación
export default ProgressScreen
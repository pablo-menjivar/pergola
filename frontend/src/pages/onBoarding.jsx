import { Crown } from 'lucide-react';
import Logo from '../assets/logo.png';
import Pergola from '../assets/pergola.png';
import { useNavigate } from 'react-router-dom';

// Componente simplificado de Onboarding
const PergolaOnboarding = () => {
  const navigate = useNavigate();

  // Finaliza el onboarding y navega al inicio de sesión
  const finishOnboarding = () => {
    navigate('/login');
  };

  // Render principal
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sección Izquierda - Branding */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-8 lg:py-0 relative" style={{ backgroundColor: '#E8E1D8' }}>
        {/* P decorativa en esquina superior izquierda */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
          <img src={Pergola} alt="P decorativa" className="w-8 h-auto sm:w-10 lg:w-12 opacity-60 object-contain"/>
        </div>
        <div className="text-center">
          {/* Logo principal */}
          <img src={Logo} alt="Pérgola Joyería Logo" className="mb-6 lg:mb-8 mx-auto max-w-full object-contain" style={{ width: 'min(320px, 90vw)', height: 'auto', maxHeight: '400px' }}/>
          {/* Frase de bienvenida */}
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold mb-1 sm:mb-2" style={{ color: '#A73249' }}>
              TU BELLEZA
            </h3>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold mb-1 sm:mb-2" style={{ color: '#A73249' }}>
              MERECE CADA
            </h4>
            <p className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold flex items-center justify-center" style={{ color: '#A73249' }}>
              PIEZA <span className="ml-2"></span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Sección Derecha - Contenido del Onboarding */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 py-8 lg:py-0 relative" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-2xl text-center">
          {/* Header con botón para saltar */}
          <div className="flex justify-end items-center mb-10 lg:mb-12">
            <button
              onClick={finishOnboarding}
              className="font-[Nunito] font-semibold underline hover:opacity-70 transition-opacity text-lg lg:text-base"
              style={{ color: '#3D1609' }}>
              Saltar
            </button>
          </div>
          
          {/* Contenido principal */}
          <div className="mb-10 lg:mb-12">
            <div className="mb-6 lg:mb-8 flex justify-center">
              <Crown size={80} className="mx-auto" style={{ color: '#A73249' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[Quicksand] font-bold mb-3 lg:mb-4" style={{ color: '#3D1609' }}>
              Bienvenido/a a Pérgola
            </h2>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-6 lg:mb-8" style={{ color: '#A73249' }}>
              Tu joyería de confianza
            </h3>
            <p className="text-base sm:text-lg lg:text-xl font-[Nunito] leading-relaxed mb-6 lg:mb-8 px-4" style={{ color: '#3D1609' }}>
              Descubre una experiencia única donde cada pieza cuenta una historia y tu belleza brilla con autenticidad.
            </p>
            <div 
              className="text-sm sm:text-base lg:text-lg font-[Nunito] font-semibold px-4 py-3 rounded-lg inline-block"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                color: '#A73249'
              }}
            >
              Calidad excepcional desde 2024
            </div>
          </div>
          
          {/* Botón para comenzar */}
          <div className="flex justify-center">
            <button
              onClick={finishOnboarding}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 lg:px-10 py-3 lg:py-4 rounded-lg font-[Quicksand] font-bold transition-all duration-300 hover:opacity-90 text-sm lg:text-base"
              style={{ 
                backgroundColor: '#A73249',
                color: '#FFFFFF'
              }}
            >
              <span>Comenzar</span>
              <Crown size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default PergolaOnboarding;
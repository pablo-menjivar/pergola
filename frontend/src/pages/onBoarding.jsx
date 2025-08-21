import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Crown, Star } from 'lucide-react';
import Logo from '../assets/logo.png'
import Pergola from '../assets/pergola.png'
import { useNavigate } from 'react-router-dom';

// Componente principal de Onboarding
const PergolaOnboarding = () => {
  // Estado para el paso actual del onboarding
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Pasos del onboarding, cada uno con icono, título, subtítulo y descripción
  const onboardingSteps = [
    {
      icon: <Crown size={80} className="mx-auto mb-6" style={{ color: '#A73249' }} />,
      title: "Bienvenida a Pérgola",
      subtitle: "Tu joyería de confianza",
      description: "Descubre una experiencia única donde cada pieza cuenta una historia y tu belleza brilla con autenticidad.",
      highlight: "✨ Calidad excepcional desde 2024"
    },
    {
      icon: <Sparkles size={80} className="mx-auto mb-6" style={{ color: '#A73249' }} />,
      title: "Colecciones Exclusivas",
      subtitle: "Diseños únicos para ti",
      description: "Explora nuestras colecciones cuidadosamente seleccionadas, desde piezas clásicas hasta las últimas tendencias en joyería.",
      highlight: "💎 Más de 30 diseños disponibles"
    },
    {
      icon: <Star size={80} className="mx-auto mb-6" style={{ color: '#A73249' }} />,
      title: "Lista para Brillar",
      subtitle: "Tu belleza merece cada pieza",
      description: "Comienza tu viaje con nosotras y descubre por qué miles de mujeres confían en Pérgola para sus momentos más importantes.",
      highlight: "🌟 Únete a nuestra familia"
    }
  ];

  // Avanza al siguiente paso
  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  // Retrocede al paso anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  // Salta al último paso
  const skipOnboarding = () => {
    setCurrentStep(onboardingSteps.length - 1);
  };
  // Finaliza el onboarding y navega al registro
  const finishOnboarding = () => {
    navigate('/register')
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
              PIEZA <span className="ml-2">✨</span>
            </p>
          </div>
        </div>
        {/* Indicadores de progreso del onboarding */}
        <div className="absolute bottom-6 lg:bottom-12 flex space-x-3">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-6 sm:w-8' : ''
              }`}
              style={{ 
                backgroundColor: index === currentStep ? '#A73249' : 'rgba(61, 22, 9, 0.3)' 
              }}
            />
          ))}
        </div>
      </div>
      {/* Sección Derecha - Contenido del Onboarding */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 py-8 lg:py-0 relative" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-2xl text-center">
          {/* Header con botón para saltar y contador de pasos */}
          <div className="flex justify-between items-center mb-10 lg:mb-12">
            <button
              onClick={skipOnboarding}
              className="font-[Nunito] font-semibold underline hover:opacity-70 transition-opacity text-lg lg:text-base"
              style={{ color: '#3D1609' }}>
              Saltar
            </button>
            <span className="font-[Nunito] text-l sm:text-sm" style={{ color: '#3D1609' }}>
              {currentStep + 1} de {onboardingSteps.length}
            </span>
          </div>
          {/* Contenido principal del paso actual */}
          <div className="mb-10 lg:mb-12">
            <div className="mb-6 lg:mb-8 flex justify-center">
              {/* Icono dinámico según el paso */}
              {React.cloneElement(onboardingSteps[currentStep].icon, {
                size: window.innerWidth < 640 ? 65 : window.innerWidth < 1024 ? 75 : 85
              })}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[Quicksand] font-bold mb-3 lg:mb-4" style={{ color: '#3D1609' }}>
              {onboardingSteps[currentStep].title}
            </h2>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-6 lg:mb-8" style={{ color: '#A73249' }}>
              {onboardingSteps[currentStep].subtitle}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl font-[Nunito] leading-relaxed mb-6 lg:mb-8 px-4" style={{ color: '#3D1609' }}>
              {onboardingSteps[currentStep].description}
            </p>
            <div 
              className="text-sm sm:text-base lg:text-lg font-[Nunito] font-semibold px-4 py-3 rounded-lg inline-block"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                color: '#A73249'
              }}
            >
              {onboardingSteps[currentStep].highlight}
            </div>
          </div>
          {/* Navegación entre pasos */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-[Quicksand] font-semibold transition-all duration-300 text-sm lg:text-base ${
                currentStep === 0 
                  ? 'opacity-40 cursor-not-allowed' 
                  : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: 'transparent',
                color: '#3D1609',
                border: '2px solid #3D1609'
              }}
            >
              <ChevronLeft size={18} />
              <span>Anterior</span>
            </button>
            {/* Botón para finalizar o avanzar */}
            {currentStep === onboardingSteps.length - 1 ? (
              <button
                onClick={finishOnboarding}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 lg:px-10 py-3 lg:py-4 rounded-lg font-[Quicksand] font-bold transition-all duration-300 hover:opacity-90 text-sm lg:text-base"
                style={{ 
                  backgroundColor: '#A73249',
                  color: '#FFFFFF'
                }}
              >
                <span>Comenzar</span>
                <Sparkles size={18} />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-[Quicksand] font-bold transition-all duration-300 hover:opacity-90 text-sm lg:text-base"
                style={{ 
                  backgroundColor: '#A73249',
                  color: '#FFFFFF'
                }}
              >
                <span>Siguiente</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default PergolaOnboarding;
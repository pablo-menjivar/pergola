import { sendBrevoEmail } from './brevoApi.js'
import { config } from './config.js'

// Función principal para enviar emails
const sendEmail = async (to, subject, text, html, options = {}) => {
  try {
    console.log("🎯 Preparando email para:", to)
    
    // Validaciones básicas
    if (!to || !subject) {
      throw new Error("Email y subject son requeridos")
    }

    if (!config.BREVO?.API_KEY) {
      throw new Error("BREVO_API_KEY no está configurada")
    }

    if (!config.APPUSER?.USER) {
      throw new Error("APPUSER.USER no está configurada")
    }
    const emailData = {
      to: to,
      subject: subject,
      text: text,
      html: html,
      senderName: options.senderName || "Soporte Pérgola",
      senderEmail: config.APPUSER.USER,
      toName: options.toName || "Usuario",
      tags: options.tags || [],
      headers: options.headers || {}
    }

    const result = await sendBrevoEmail(emailData)
    console.log("🎉 Email enviado con éxito!")
    return result
  } catch (error) {
    console.error("⚠️ Error en sendEmail:", error)
    throw error
  }
}
// Función específica para emails de verificación
const sendVerificationEmail = async (to, verCode, userType = 'customer') => {
  console.log(`🔐 Enviando código de verificación ${verCode} a ${to}`)
  const subject = userType === 'employee' 
    ? 'Verificación de cuenta de empleado' 
    : 'Verificación de cuenta'  
  const html = generateVerificationEmailHTML(verCode, userType)
  
  return await sendEmail(to, subject, null, html, {
    tags: [`verification-${userType}`],
    headers: { 'X-Category': 'verification' }
  })
}
// Función para emails de recuperación
const sendRecoveryEmail = async (to, code) => {
  console.log(`🔑 Enviando código de recuperación ${code} a ${to}`)
  const subject = 'Recuperación de Contraseña - Pérgola Joyería'
  const html = HTMLRecoveryEmail(code)
  
  return await sendEmail(to, subject, null, html, {
    tags: ['password-recovery'],
    headers: {
      'X-Category': 'password-recovery'
    }
  })
}
// HTML para email de verificación simple
const generateVerificationEmailHTML = (code, userType) => {
  const title = userType === 'employee' ? 'Empleado' : 'Cliente'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verificación de cuenta</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; background: #f8f9fa; padding: 30px; border-radius: 10px;">
        <h1 style="color: #db2777;">Pérgola Joyería</h1>
        <h2>Verificación de cuenta - ${title}</h2>
        <p>Por favor, usa el siguiente código para verificar tu cuenta:</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #db2777;">
          <span style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 0.2em; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Este código expira en 2 horas.</p>
        <p style="font-style: italic; color: #db2777; margin-top: 20px;">"Tu belleza merece cada pieza ✨"</p>
      </div>
    </body>
    </html>
  `
}
// Tu función HTML existente para recuperación (mantenida igual)
const HTMLRecoveryEmail = (code) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperación de Contraseña - Pérgola Joyería</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #f9fafb;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .main-container {
          background-color: white;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          max-width: 42rem;
          width: 100%;
          overflow: hidden;
        }

        .header {
          background: linear-gradient(to bottom right, #fdf2f8, #fef7f7);
          padding: 3rem;
          text-align: center;
          border-bottom: 1px solid #fce7f3;
        }

        .logo-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 5rem;
          height: 5rem;
          background-color: white;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        }

        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #db2777;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .company-name {
          font-size: 2.25rem;
          font-weight: 300;
          color: #1f2937;
          margin-bottom: 0.75rem;
          letter-spacing: 0.1em;
        }

        .company-subtitle {
          font-size: 0.875rem;
          font-weight: 500;
          color: #db2777;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
        }

        .header-description {
          color: #4b5563;
          font-size: 1.125rem;
          font-weight: 300;
        }

        .content {
          padding: 3rem;
          text-align: center;
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: 300;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .content-description {
          color: #4b5563;
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .code-container {
          position: relative;
          margin-bottom: 2.5rem;
          display: inline-block;
        }

        .code-box {
          background-color: white;
          border: 2px solid #fce7f3;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .verification-code {
          font-size: 3rem;
          font-family: monospace;
          font-weight: bold;
          color: #1f2937;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }

        .code-label {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        .decorative-dot-1 {
          position: absolute;
          top: -0.75rem;
          left: -0.75rem;
          width: 1.5rem;
          height: 1.5rem;
          background-color: #fbcfe8;
          border-radius: 50%;
          opacity: 0.4;
        }

        .decorative-dot-2 {
          position: absolute;
          bottom: -0.75rem;
          right: -0.75rem;
          width: 1rem;
          height: 1rem;
          background-color: #fecaca;
          border-radius: 50%;
          opacity: 0.5;
        }

        .warning-box {
          background-color: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .warning-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #d97706;
          margin-right: 0.75rem;
          fill: currentColor;
        }

        .warning-text {
          color: #92400e;
          font-weight: 500;
        }

        .info-box {
          background-color: #eff6ff;
          border: 1px solid #93c5fd;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .info-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #2563eb;
          margin-right: 0.75rem;
          margin-top: 0.125rem;
          flex-shrink: 0;
          fill: currentColor;
        }

        .info-text {
          color: #1e40af;
          font-size: 0.875rem;
          line-height: 1.75;
          font-weight: 300;
        }

        .slogan-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .slogan {
          color: #db2777;
          font-size: 1.125rem;
          font-weight: 300;
          font-style: italic;
        }

        .footer {
          background-color: #f9fafb;
          padding: 2rem 3rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .footer-question {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          font-weight: 300;
        }

        .support-button {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: #db2777;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 1.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .support-button:hover {
          background-color: #be185d;
          transform: scale(1.05);
        }

        .support-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .copyright {
          color: #9ca3af;
          font-size: 0.75rem;
          margin-top: 1.5rem;
          font-weight: 300;
        }

        /* Responsive styles */
        @media (max-width: 640px) {
          .content {
            padding: 1.5rem !important;
          }

          .content-description {
            font-size: 0.875rem !important;
          }

          .verification-code {
            font-size: 2rem !important;
          }

          .header {
            padding: 2rem;
          }

          .footer {
            padding: 1.5rem 2rem;
          }
        }
      </style>
    </head>

    <body>
      <div class="main-container">
        <!-- Header con logo y estilo minimalista -->
        <div class="header">
          <div class="logo-container">
            <svg class="logo-icon" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
              </path>
            </svg>
          </div>
          <h1 class="company-name">Pérgola</h1>
          <p class="company-subtitle">J O Y E R Í A</p>
          <p class="header-description">Recuperación de contraseña</p>
        </div>
        
        <!-- Contenido principal -->
        <div class="content">
          <div>
            <h2 class="content-title">Restablece tu acceso</h2>
            <p class="content-description">
              Hola, recibimos una solicitud para restablecer tu contraseña.<br>
              Usa el código de verificación a continuación:
            </p>
            
            <!-- Código de verificación elegante -->
            <div class="code-container">
              <div class="code-box">
                <div class="verification-code">
                  ${code}
                </div>
                <div class="code-label">CÓDIGO DE VERIFICACIÓN</div>
              </div>
              <!-- Elementos decorativos sutiles -->
              <div class="decorative-dot-1"></div>
              <div class="decorative-dot-2"></div>
            </div>
            
            <!-- Información de tiempo -->
            <div class="warning-box">
              <svg class="warning-icon" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"></path>
              </svg>
              <p class="warning-text">
                Código válido por <span style="font-weight: bold;">20 minutos</span>
              </p>
            </div>
            
            <!-- Nota de seguridad -->
            <div class="info-box">
              <svg class="info-icon" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"></path>
              </svg>
              <p class="info-text">
                Si no solicitaste este correo, puedes ignorarlo de forma segura.<br>
                Tu cuenta permanecerá protegida.
              </p>
            </div>
            
            <!-- Eslogan -->
            <div class="slogan-section">
              <p class="slogan">
                "Tu belleza merece cada pieza ✨"
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div>
            <p class="footer-question">
              ¿Necesitas ayuda adicional?
            </p>
            <a href="mailto:soporte@pergola.com" class="support-button">
              <svg class="support-icon" viewBox="0 0 24 24">
                <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                </path>
              </svg>
              Contactar Soporte
            </a>
            <p class="copyright">
              © 2025 Pérgola Joyería. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
export { sendEmail, sendVerificationEmail, sendRecoveryEmail }
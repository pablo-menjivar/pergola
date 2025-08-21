import nodemailer from 'nodemailer'
import { config } from './config.js'
//Configurar el transportador para enviar correos
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.APPUSER.USER,
        pass: config.APPUSER.PASS
    }
})
//Definir a quien se le va a enviar el correo
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Soporte Pérgola" <${config.APPUSER.USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        })
        return info
    } catch (err) {
        console.log("error: ", err)
    }
}
//Generar el código HTML para el correo
const HTMLRecoveryEmail = (code) => {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña - Pérgola Joyería</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
          }
          .elegant-shadow {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          }
          .code-shadow {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          }
          @media (max-width: 640px) {
            .responsive-padding { padding: 1.5rem !important; }
            .responsive-text { font-size: 0.875rem !important; }
            .responsive-code { font-size: 2rem !important; }
          }
        </style>
      </head>
      <body class="bg-gray-50 font-sans">
        <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl elegant-shadow max-w-2xl w-full overflow-hidden">
            <!-- Header con logo y estilo minimalista -->
            <div class="bg-gradient-to-br from-pink-50 to-rose-50 p-12 text-center border-b border-pink-100">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 elegant-shadow">
                <svg class="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h1 class="text-4xl font-light text-gray-800 mb-3 tracking-wide">Pérgola</h1>
              <p class="text-sm font-medium text-pink-600 uppercase tracking-widest mb-4">J O Y E R Í A</p>
              <p class="text-gray-600 text-lg font-light">Recuperación de contraseña</p>
            </div>
            <!-- Contenido principal -->
            <div class="p-12 responsive-padding">
              <div class="text-center">
                <h2 class="text-2xl font-light text-gray-800 mb-2">Restablece tu acceso</h2>
                <p class="text-gray-600 text-lg leading-relaxed mb-10 responsive-text font-light">
                  Hola, recibimos una solicitud para restablecer tu contraseña.<br>
                  Usa el código de verificación a continuación:
                </p>
                <!-- Código de verificación elegante -->
                <div class="relative mb-10">
                  <div class="inline-block bg-white border-2 border-pink-100 rounded-2xl p-8 code-shadow">
                    <div class="text-5xl font-mono font-bold text-gray-800 tracking-widest responsive-code mb-2">
                      ${code}
                    </div>
                    <div class="text-sm text-gray-500 uppercase tracking-wide font-medium">Código de verificación</div>
                  </div>
                  <!-- Elementos decorativos sutiles -->
                  <div class="absolute -top-3 -left-3 w-6 h-6 bg-pink-200 rounded-full opacity-40"></div>
                  <div class="absolute -bottom-3 -right-3 w-4 h-4 bg-rose-200 rounded-full opacity-50"></div>
                </div>
                <!-- Información de tiempo -->
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                  <div class="flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-amber-800 font-medium">
                      Código válido por <span class="font-bold">20 minutos</span>
                    </p>
                  </div>
                </div>
                <!-- Nota de seguridad -->
                <div class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <div class="flex items-start justify-center">
                    <svg class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-blue-800 text-sm leading-relaxed font-light">
                      Si no solicitaste este correo, puedes ignorarlo de forma segura.<br>
                      Tu cuenta permanecerá protegida.
                    </p>
                  </div>
                </div>
                <!-- Eslogan -->
                <div class="mt-8 pt-6 border-t border-gray-100">
                  <p class="text-pink-600 text-lg font-light italic">
                    "Tu belleza merece cada pieza ✨"
                  </p>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="bg-gray-50 px-12 py-8 border-t border-gray-100">
              <div class="text-center">
                <p class="text-gray-600 text-sm mb-4 font-light">
                  ¿Necesitas ayuda adicional?
                </p>
                <a href="mailto:soporte@pergola.com" 
                   class="inline-flex items-center px-6 py-3 bg-pink-600 text-white text-sm font-medium rounded-full hover:bg-pink-700 transition-all duration-300 transform hover:scale-105">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Contactar Soporte
                </a>
                <p class="text-gray-400 text-xs mt-6 font-light">
                  © 2025 Pérgola Joyería. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
}
export { sendEmail, HTMLRecoveryEmail }
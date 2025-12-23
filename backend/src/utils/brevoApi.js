import { config } from './config.js'

// Función principal para enviar emails con Brevo API
const sendBrevoEmail = async (emailData) => {
  try {
    console.log("🚀 Iniciando envío con Brevo API...")
    console.log("📧 Datos del email:", {
      to: emailData.to,
      subject: emailData.subject,
      sender: emailData.senderEmail
    })

    // ESTRUCTURA CORRECTA para Brevo API
    const payload = {
      sender: {
        name: emailData.senderName || "Soporte Pérgola",
        email: emailData.senderEmail || config.APPUSER.USER
      },
      to: [{ 
        email: emailData.to, 
        name: emailData.toName || "" 
      }],
      subject: emailData.subject,
      // IMPORTANTE: Solo usar UNO de estos dos
      htmlContent: emailData.html || emailData.htmlContent,
      // textContent: emailData.text || emailData.textContent, // Comentado por ahora
    }

    // Solo agregar tags si existen
    if (emailData.tags && emailData.tags.length > 0) {
      payload.tags = emailData.tags
    }

    // Solo agregar headers si existen
    if (emailData.headers && Object.keys(emailData.headers).length > 0) {
      payload.headers = emailData.headers
    }

    console.log("📦 Payload enviado a Brevo:", JSON.stringify(payload, null, 2))
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": config.BREVO.API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    console.log("📡 Status de respuesta:", response.status)

    const responseData = await response.json()
    console.log("📨 Respuesta completa de Brevo:", responseData)

    if (!response.ok) {
      console.error("❌ Error de Brevo API:", {status: response.status, statusText: response.statusText, error: responseData})
      throw new Error(`Brevo API Error ${response.status}: ${responseData.message || responseData.error || response.statusText}`)
    }
    console.log("✅ Email enviado exitosamente! MessageID:", responseData.messageId)

    return responseData
  } catch (error) {
    console.error("💥 Error crítico enviando email:", error)
    throw error
  }
}
export { sendBrevoEmail }
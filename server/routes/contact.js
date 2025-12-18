import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: `"${name}" <${process.env.GMAIL_USER}>`, // evita usar directamente el email del visitante
    to: process.env.GMAIL_USER, // o 'realbojesound@gmail.com'
    subject: `📩 New message from ${name}`,
    text: `
      You have received a new message from the BOJE website contact form:
      
      👤 Name: ${name}
      📧 Email: ${email}
      📝 Message:
      ${message}
    `,
    replyTo: email // permite responder directamente al visitante
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ message: '✅ Email sent successfully' })
  } catch (err) {
    console.error('❌ Email error:', err)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

export default router
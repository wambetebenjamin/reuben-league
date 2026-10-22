import nodemailer from 'nodemailer'

interface MailPayload {
  to: string
  subject: string
  text: string
  html: string
}

function transport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user, pass },
  })
}

export async function sendMail(payload: MailPayload): Promise<{ sent: boolean; reason?: string }> {
  const transporter = transport()
  const from = process.env.SMTP_FROM ?? 'Reuben League <hello@reubenleague.co.ke>'

  if (!transporter) {
    console.warn('[mailer] SMTP is not configured. Skipping send to', payload.to)
    return { sent: false, reason: 'smtp-not-configured' }
  }

  try {
    await transporter.sendMail({ from, ...payload })
    return { sent: true }
  } catch (error) {
    console.error('[mailer] send failed', error)
    return { sent: false, reason: 'send-failed' }
  }
}

export async function sendTournamentConfirmation(input: {
  to: string
  organiserName: string
  tournamentName: string
  sport: string
  county: string
  startDate: string
}) {
  const subject = `We received your registration for ${input.tournamentName}`
  const text = [
    `Hi ${input.organiserName},`,
    '',
    `Thank you for registering ${input.tournamentName} (${input.sport}, ${input.county}) on Reuben League.`,
    `Requested start date: ${input.startDate}.`,
    '',
    'Our tournament desk reviews new registrations within one working day and will call you to finish the setup of your league, fixtures and referee panel.',
    '',
    'You can reply to this email or message us on WhatsApp at +254 112 272 061.',
    '',
    'Reuben League',
    'Every game counts. Every table is live.',
  ].join('\n')

  const html = `
    <div style="font-family:Muli,Arial,sans-serif;color:#25262a;line-height:1.7;max-width:560px">
      <p>Hi ${input.organiserName},</p>
      <p>Thank you for registering <strong>${input.tournamentName}</strong> (${input.sport}, ${input.county}) on Reuben League.</p>
      <p>Requested start date: <strong>${input.startDate}</strong>.</p>
      <p>Our tournament desk reviews new registrations within one working day and will call you to finish the setup of your league, fixtures and referee panel.</p>
      <p>You can reply to this email or message us on WhatsApp at <a href="https://wa.me/254112272061">+254 112 272 061</a>.</p>
      <p style="color:#f23a2e;font-weight:900">Reuben League</p>
      <p style="color:#989898">Every game counts. Every table is live.</p>
    </div>
  `

  return sendMail({ to: input.to, subject, text, html })
}

export async function sendEnquiryNotification(input: { name: string; email: string; message: string }) {
  const subject = `New enquiry from ${input.name}`
  const text = `${input.name} (${input.email}) wrote:\n\n${input.message}`
  const html = `
    <div style="font-family:Muli,Arial,sans-serif;color:#25262a;line-height:1.7">
      <p><strong>${input.name}</strong> (${input.email}) wrote:</p>
      <p>${input.message.replace(/\n/g, '<br />')}</p>
    </div>
  `
  return sendMail({ to: process.env.SMTP_FROM ?? 'hello@reubenleague.co.ke', subject, text, html })
}

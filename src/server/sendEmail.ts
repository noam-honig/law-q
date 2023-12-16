import type Mail from 'nodemailer/lib/mailer'
export async function sendEmail(options: Mail.Options) {
  if (!options.from) options.from = 'פיתוח חגי <saleyhagai@gmail.com>'
  if (!options.html)
    options.html = `
<html>
  <body dir="rtl">
    <div >
       ${options.text
         ?.toString()
         .split('\n')
         .map((x) => `<div>${x}</div>`)
         .join('\n')}
    </div>
  </body>
</html>
  `
  const { createTransport } = await import('nodemailer')
  const user = process.env['EMAIL_ADDRESS']
  if (!user) {
    const message = 'email user not defined'
    console.log(message)
    return message
  }
  const transport = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass: process.env['EMAIL_PASSWORD'],
    },
  })
  try {
    return await new Promise<string>((res) => {
      transport.sendMail(options, (error, info) => {
        if (error) res(error.message)
        else if (info.response.includes(' OK ')) res('OK')
        else res(info.response)
        console.log({ error, info })
      })
    })
  } finally {
    transport.close()
  }
}

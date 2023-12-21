import type Mail from 'nodemailer/lib/mailer'
export async function sendEmail(options: Mail.Options, context: string) {
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
  //options.to = 'noam.honig@gmail.com'
  //options.bcc = 'noam.honig@gmail.com'
  const { createTransport } = await import('nodemailer')
  const user = process.env['EMAIL_ADDRESS']
  const host = process.env['EMAIL_SERVER']
  const pass = process.env['EMAIL_PASSWORD']
  const connection = process.env['EMAIL_OPTIONS']
  if (!user) {
    const message = 'email user not defined'
    console.log(message)
    return message
  }
  if (!options.from) options.from = `לשכת עורכי הדין  <${user}>`
  const connectionOptions = connection
    ? {
        auth: { user, pass },
        ...JSON.parse(connection),
      }
    : !host
    ? {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user,
          pass,
        },
      }
    : {
        host,
        port: 25,
        secure: false,
        auth: {
          user,
          pass,
        },
      }

  console.log(
    'email options',
    JSON.stringify(connectionOptions, undefined, 2).replace(pass!, '***')
  )
  const transport = createTransport({
    ...connectionOptions,
  })
  try {
    return await new Promise<string>((res) => {
      transport.sendMail(options, (error, info) => {
        if (error) res(error.message)
        else if (info.response.includes(' OK ')) res('OK')
        else res(info.response)
        console.log(JSON.stringify(info, undefined, 2), {
          error,
          subject: options.subject,
          context,
        })
      })
    })
  } finally {
    transport.close()
  }
}

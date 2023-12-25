import { formatPhone, whatsappUrl } from '../common/fields/PhoneField'
import { HelpRequest } from './HelpRequest'

export function draftEmailToLawyer(r: HelpRequest) {
  const email = 'legal.aid@israelbar.org.il'

  const startText = `עו"ד ${r.volunteer?.name || ''} שלום רב,
אנו מודים לך על התנדבותך בפרויקט הסיוע המשפטי עבור אלה הזקוקים לו בקשר עם מלחמת "חרבות ברזל".
שייכנו אותך למתן סיוע ללקוח.ה המצוינים מטה.
אנא צור עימו/עימה קשר באופן ישיר לצורך מתן מענה על השאלה המפורטת מטה ועדכן אותנו במידה ואינך מעונין לטפל בפניה ו/או בדבר סיום הטיפול בפניה במייל:`
  const text = `${startText} ${email}
נושא: ${r.title} (#${r.id})
תיאור: ${r.description}
שם: ${r.name}
טלפון: ${formatPhone(r.phone)}
מייל: ${r.email}
אמצעי קשר מועדף: ${r.contactMethod}
עיר: ${r.city}
תאריך פניה: ${r.createdAt.toLocaleDateString('he-IL')}
`

  const html = `
  <html>
    <body dir="rtl">
      <div style="white-space:pre">${startText} <a href="mailto:${email}">${email}</a></div>
      <div>
      נושא:<strong> ${r.title} (#${r.id})</strong>
      </div><div style="white-space:pre">תיאור: ${r.description}</div><div>
      שם: ${r.name}
      </div><div>
      טלפון: <a href="tel:${r.phone}"> ${formatPhone(
    r.phone
  )}</a>,  <a href="${whatsappUrl(r.phone, messageToPerson(r))}">שלח ווטסאפ</a>
      </div><div>
      מייל:  <a href="mailto:${emailToPerson(r)}">${r.email}</a>
      </div><div>
      אמצעי קשר מועדף: ${r.contactMethod}
      </div><div>
      עיר: ${r.city}
      </div><div>
      תאריך פניה: ${r.createdAt.toLocaleDateString('he-IL')}
      </div>
    </body>
  </html>
    `
  return {
    html,
    text,
  }
}

export function emailToPerson(r: HelpRequest) {
  const title = emailSubject(r)
  const body = messageToPerson(r)
  const emailLink = `mailto:${r.email}?subject=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(body)}`
  return emailLink
}
export function emailSubject(r: HelpRequest) {
  return `פנייתך ללשכת עורכי הדין, מספר ${r.id} בנושא ${r.title}`
}

export function messageToPerson(r: HelpRequest) {
  return `שלום ${r.name},
בקשר לפניתך ללשכת עורכי הדין, מספר ${r.id} בנושא ${r.title},
`
}

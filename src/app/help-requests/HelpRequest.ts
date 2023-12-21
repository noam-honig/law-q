import {
  Allow,
  Entity,
  EntityBase,
  Fields,
  Relations,
  Validators,
} from 'remult'
import { PhoneField } from '../common/fields/PhoneField'
import { EmailField } from '../common/fields/EmailField'
import { ValueListField } from '../common/fields/ValueListField'
import { recordChanges } from '../common/change-log/change-log'
import { CreatedAtField } from './utils/date'
import { Volunteer } from '../volunteer-request/volunteer-request'
import { NameField } from './NameField'
import { sendEmail } from '../../server/sendEmail'
import { draftEmailToLawyer, emailSubject } from './draft-email-to-lwayer'

export const helpRequestStatuses = [
  'חדשה',
  'ממתינה לשיוך',
  'שוייכה',
  'נדחתה',
] as const

@Entity<HelpRequest>('HelpRequests', {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: true,
  allowApiDelete: false,
  defaultOrderBy: {
    createdAt: 'desc',
  },
  saving: async (user, e) => {
    await recordChanges(user, e)
  },
  saved: async (r, e) => {
    if (e.isNew) {
      sendEmail(
        {
          to: r.email,
          subject: emailSubject(r),
          text: `שלום ${r.name},
קיבלנו את פניתך לקבלת מענה משפטי. 
אנו נבחן את הפניה ונשיבך בהקדם.`,
        },
        'requestId:' + e.id.toString() + ' ' + r.status
      )
    } else if (e.fields.status.valueChanged()) {
      switch (r.status) {
        case 'ממתינה לשיוך':
          sendEmail(
            {
              to: r.email,
              subject: emailSubject(r),
              text: `שלום ${r.name},
בחנו את פנייתך לקבלת מענה משפטי והפנינו אותה לעורך דין לצורך מענה. עורך הדין יבחן את הפניה וישיבך בהקדם.`,
            },
            'requestId:' + e.id.toString() + ' ' + r.status
          )
          break
        case 'שוייכה':
          const v = await e.fields.volunteer!.load()
          if (v) {
            const { text, html } = draftEmailToLawyer(r)
            sendEmail(
              {
                to: v.email,
                subject: `פנייה לסיוע מלשכת עורכי הדין, מספר ${r.id} בנושא ${r.title}`,
                text,
                html,
              },
              'requestId:' + e.id.toString() + ' ' + r.status + ' לעורך הדין'
            )
          }
          break
        case 'נדחתה':
          sendEmail(
            {
              to: r.email,
              subject: emailSubject(r),
              text: `שלום ${r.name},
פנייתך לקבלת מענה משפטי נבחנה ולמרבה הצער הפניה אינה קשורה למלחמת "חרבות ברזל" ועל כן לא נוכל להפנות אותה להמשך טיפול על ידי עורך דין. נשמח שתפנה אלינו שוב בעתיד בפניות משפטיות נוספות בקשר עם מלחמת "חרבות ברזל" ואנו נעשה מאמץ לסייע ככל הניתן.`,
            },
            'requestId:' + e.id.toString() + ' ' + r.status
          )
          break
      }
    }
  },
})
export class HelpRequest extends EntityBase {
  @Fields.autoIncrement({ caption: '#', width: '70' })
  id = 0
  @CreatedAtField({ caption: 'תאריך פניה' })
  createdAt = new Date()
  @NameField()
  name = ''
  @EmailField({ validate: [Validators.required] })
  email = ''
  @PhoneField({ caption: 'טלפון', validate: [Validators.required] })
  phone = ''
  @Fields.string({ caption: 'עיר', validate: [Validators.required] })
  city = ''
  // @ValueListField(legalExpertise, {
  //   caption: 'תחום משפטי',
  // })
  // legalField = ''
  @Fields.string({ caption: 'כותרת', validate: [Validators.required] })
  title = ''
  @Fields.string({
    caption: 'תיאור',
    validate: [Validators.required],
    customInput: (x) => x.textarea(),
  })
  description = ''
  @ValueListField(['טלפון', 'אימייל', 'סמס/ווטסאפ'], {
    caption: 'איך עדיף ליצור איתך קשר?',
    validate: [Validators.required],
  })
  contactMethod = ''
  @ValueListField(helpRequestStatuses, {
    caption: 'סטטוס',
    includeInApi: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
  })
  status: (typeof helpRequestStatuses)[number] = 'חדשה'

  @Relations.toOne(() => Volunteer, {
    caption: 'מתנדב משוייך',
    allowNull: true,
    includeInApi: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
  })
  volunteer?: Volunteer
}

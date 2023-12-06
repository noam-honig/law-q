import { Allow, Entity, EntityBase, Fields, Validators } from 'remult'
import { PhoneField } from '../common/fields/PhoneField'
import { EmailField } from '../common/fields/EmailField'
import { ValueListField } from '../common/fields/ValueListField'
import { recordChanges } from '../common/change-log/change-log'

@Entity('HelpRequests', {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: true,
  saving: async (user, e) => {
    await recordChanges(user, e)
  },
})
export class HelpRequest extends EntityBase {
  @Fields.autoIncrement()
  id = 0
  @Fields.string({
    caption: 'שם מלא',
    validate: [
      Validators.required,
      (_, v) => {
        // verify that the name has two words with at least two characters
        if (!v.value.match(/^[א-ת]{2,} [א-ת]{2,}$/)) {
          throw Error('נא להזין שם ושם משפחה')
        }
      },
    ],
  })
  name = ''
  @EmailField({ validate: [Validators.required] })
  email = ''
  @PhoneField({ caption: 'טלפון', validate: [Validators.required] })
  phone = ''
  @Fields.string({ caption: 'עיר', validate: [Validators.required] })
  city = ''
  @ValueListField(
    [
      'דיני עבודה',
      'נזיקין (נזקי גוף ורכוש)',
      'מיסוי',
      'ביטוח לאומי',
      'פיצוי כללי',
      'הכרה ממשלתית כנפגע פעולות איבה או הכרה של צה”ל בחייל כנכה  צה”ל',
      'אימות נוטריוני',
      'אימות תצהיר',
      'אחר',
      'ערעורים',
      'פשיטת רגל והוצאה לפועל',
      'זכויות אזרחיות',
      'צרכנות',
      'מסחרי',
      'רשומות פליליות וביטחון',
      'דיני פרטיות',
      'ישוב סכסוכים',
      'חינוך',
      'דיני הגנת הסביבה',
      'דיני משפחה',
      'כספים',
      'ממשל',
      'אפוטרופסות',
      'בריאות',
      'דיור',
      'זכויות אדם',
      'הגירה ומקלט מדיני',
      'קנין רוחני',
      'משפט בינלאומי',
      'זכויות ציבור ורווחה',
      'משפט ציבורי',
      'נדל”ן',
    ],
    { caption: 'תחום משפטי', validate: [Validators.required] }
  )
  legalField = ''
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
}

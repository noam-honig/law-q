import { Allow, Entity, EntityBase, Fields, Validators } from 'remult'
import { PhoneField } from '../common/fields/PhoneField'
import { EmailField } from '../common/fields/EmailField'
import { ValueListField } from '../common/fields/ValueListField'
import { recordChanges } from '../common/change-log/change-log'
import { legalExpertise } from './legal-expertise'
import { CreatedAtField } from './utils/date'

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
  @ValueListField(legalExpertise, {
    caption: 'תחום משפטי',
    validate: [Validators.required],
  })
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

export function NameField() {
  return Fields.string({
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
}

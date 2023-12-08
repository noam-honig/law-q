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
import { legalExpertise } from './legal-expertise'
import { CreatedAtField } from './utils/date'
import { Volunteer } from '../volunteer-request/volunteer-request'
import { NameField } from './NameField'

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
  @ValueListField(helpRequestStatuses, { caption: 'סטטוס' })
  status: (typeof helpRequestStatuses)[number] = 'חדשה'

  @Relations.toOne(() => Volunteer, {
    caption: 'מתנדב משוייך',
    allowNull: true,
  })
  volunteer?: Volunteer
}

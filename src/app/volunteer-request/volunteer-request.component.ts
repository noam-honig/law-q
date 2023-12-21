import { Component, OnInit } from '@angular/core'
import { Volunteer } from './volunteer-request'
import { repo } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'
import { legalExpertise } from '../help-requests/legal-expertise'
import { openDialog } from '../common-ui-elements'
import { TermsComponent } from '../terms/terms.component'

@Component({
  selector: 'app-volunteer-request',
  templateUrl: './volunteer-request.component.html',
  styleUrls: ['./volunteer-request.component.scss'],
})
export class VolunteerRequestComponent implements OnInit {
  constructor() {}

  r = repo(Volunteer).create()
  area = new DataAreaSettings({
    fields: () =>
      this.r.$.toArray().filter(
        (x) =>
          ![this.r.$.legalExpertise].includes(x) &&
          x.metadata.apiUpdateAllowed()
      ),
  })
  legalExpertise = legalExpertise
  confirm = false
  ngOnInit(): void {}
  async submit() {
    if (!this.confirm) {
      throw 'אנא אשר/י את תנאי השימוש'
    }
    await this.r.save()
  }
  showTerms() {
    openDialog(
      TermsComponent,
      (x) =>
        (x.terms = `
ידוע לי כי אני רשאי לשתף אחרים אודות התנדבותי במסגרת תוכנית הסיוע המשפטי של לשכת עורכי הדין (להלן: "**התכנית**"). אולם, כל מידע בנוגע ללקוח ולפניה שביצע לקבלת סיוע משפטי (להלן בהתאמה: "**הלקוח**"; "**הפניה**") הינו מידע חסוי החוסה תחת חיסיון "עורך דין-לקוח". "מידע חסוי", הינו מידע אשר, בין היתר:

- מידע מזהה אודות הלקוח, לרבות שמו, כתובת מגוריו או פרטי התקשרות עימו;

- מידע אודות בני משפחתו;

- כל מידע אחר שעשוי או באופן סביר צפוי לחשוף את זהות הלקוח;

- מידע בקשר עם הפניה.

אני מצהיר ומתחייב כי לא אמסור לאחר מידע חסוי ללא קבלת אישור מראש ובכתב מהלקוח, בכפוף למגבלות כל דין.

אני מצהיר ומאשר כי עבודתי בתוכנית היא התנדבותית, על כל המשתמע מכך, לרבות בחינת הפניות שאקבל מהלשכה, החלטתי אם לסרב לטפל בפניות ו/או לטפל בפניות לגופן, היקף הטיפול ותוכנו. אני מצהיר כי הטיפול בלקוח בקשר עם הפניה תעשה בהתנדבות מלאה ומבלי שאגבה בגין כך תשלום מהלקוח. 

עבודתי זו (ואף לאחר מכן) תהיה תחת אחריותי המקצועית והבלעדית, וכי ידוע לי שלשכת עורכי הדין לא תהא אחראית בגין כל טענה שיעלה לקוח בקשר לטיפול בפנייתו. הריני מתחייב כי אם תעלה טענה ו/או תוגש תביעה ו/או דרישה נגד לשכת עורכי הדין בגין עניין הקשור לפניה ולאופן הטיפול או הסירוב לטפל בה, אני אשפה את הלשכה מיד עם דרישתה הראשונה בגין כל נזק ו/או הוצאה ו/או הפסד שיגרמו לה בקשר לאמור, בכפוף למתן פסק דין חלוט שמטיל אחריות על הלשכה בגין האמור.
    `)
    )
  }
  toggleExpertise(e: string) {
    if (this.r.legalExpertise.includes(e)) {
      this.r.legalExpertise.splice(this.r.legalExpertise.indexOf(e), 1)
    } else {
      this.r.legalExpertise.push(e)
    }
  }
  chipSelected(e: any) {
    this.toggleExpertise(e.srcElement.innerText)
  }
}

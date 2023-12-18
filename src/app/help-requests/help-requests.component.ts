import { Component, OnInit } from '@angular/core'
import { repo } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'
import { HelpRequest } from './HelpRequest'
import { openDialog } from '../common-ui-elements'
import { TermsComponent } from '../terms/terms.component'

@Component({
  selector: 'app-help-requests',
  templateUrl: './help-requests.component.html',
  styleUrls: ['./help-requests.component.scss'],
})
export class HelpRequestsComponent implements OnInit {
  static route = 'בקשה לסיוע משפטי'
  constructor() {}
  r = repo(HelpRequest).create()
  area = new DataAreaSettings({
    fields: () =>
      this.r.$.toArray().filter(
        (x) =>
          x.metadata.apiUpdateAllowed() &&
          ![this.r.$.status, this.r.$.volunteer].includes(x)
      ),
  })
  confirm = false
  ngOnInit(): void {}
  async submit() {
    if (!this.confirm) {
      throw 'אנא אשר/י את תנאי השימוש'
    }
    await this.r.save()
  }
  showTerms() {
    openDialog(TermsComponent)
  }
}

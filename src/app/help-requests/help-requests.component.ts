import { Component, OnInit } from '@angular/core'
import { repo } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'
import { HelpRequest } from './HelpRequest'

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
      this.r.$.toArray().filter((x) => x.metadata.apiUpdateAllowed()),
  })
  ngOnInit(): void {}
  async submit() {
    await this.r.save()
  }
}

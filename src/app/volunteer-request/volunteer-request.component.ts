import { Component, OnInit } from '@angular/core'
import { VolunteerRequest } from './volunteer-request'
import { repo } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'
import { legalExpertise } from '../help-requests/legal-expertise'

@Component({
  selector: 'app-volunteer-request',
  templateUrl: './volunteer-request.component.html',
  styleUrls: ['./volunteer-request.component.scss'],
})
export class VolunteerRequestComponent implements OnInit {
  constructor() {}

  r = repo(VolunteerRequest).create()
  area = new DataAreaSettings({
    fields: () =>
      this.r.$.toArray().filter(
        (x) => ![this.r.$.id, this.r.$.legalExpertise].includes(x)
      ),
  })
  legalExpertise = legalExpertise
  ngOnInit(): void {}
  async submit() {
    await this.r.save()
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

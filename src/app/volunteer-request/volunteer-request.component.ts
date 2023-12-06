import { Component, OnInit } from '@angular/core'
import { VolunteerRequest } from './volunteer-request'
import { repo } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'

@Component({
  selector: 'app-volunteer-request',
  templateUrl: './volunteer-request.component.html',
  styleUrls: ['./volunteer-request.component.scss'],
})
export class VolunteerRequestComponent implements OnInit {
  constructor() {}

  r = repo(VolunteerRequest).create()
  area = new DataAreaSettings({
    fields: () => this.r.$.toArray().filter((x) => x != this.r.$.id),
  })
  ngOnInit(): void {}
  async submit() {
    await this.r.save()
  }
}

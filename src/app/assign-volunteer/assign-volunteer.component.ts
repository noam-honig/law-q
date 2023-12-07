import { Component, OnInit } from '@angular/core'
import { HelpRequest } from '../help-requests/HelpRequest'
import { Volunteer } from '../volunteer-request/volunteer-request'
import { repo } from 'remult'
import { WantsToCloseDialog } from '../common-ui-elements'

@Component({
  selector: 'app-assign-volunteer',
  templateUrl: './assign-volunteer.component.html',
  styleUrls: ['./assign-volunteer.component.scss'],
})
export class AssignVolunteerComponent implements OnInit, WantsToCloseDialog {
  constructor() {}
  searchString = ''
  r!: HelpRequest
  volunteers: Volunteer[] = []
  filter(volunteer: Volunteer) {
    return (
      !this.searchString ||
      this.searchString == '' ||
      this.searchString
        .split(' ')
        .filter((y) => y != '')
        .map(
          (x) =>
            volunteer.name.includes(x) ||
            volunteer.notes.includes(x) ||
            volunteer.city.includes(x) ||
            volunteer.legalExpertise?.filter((y) => y.includes(x)).length > 0
        )
        .filter((y) => !y).length === 0
    )
  }
  selectedVolunteer?: Volunteer
  ngOnInit(): void {
    repo(Volunteer)
      .find({ where: {} })
      .then((vrs) => (this.volunteers = vrs))
  }
  async assign() {
    this.r.status = 'שוייכה'
    this.r.volunteer = this.selectedVolunteer
    await this.r.save()
    this.closeDialog()
  }

  closeDialog!: VoidFunction
}

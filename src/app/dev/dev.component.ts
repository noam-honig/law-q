import { Component, OnInit } from '@angular/core'
import { repo } from 'remult'
import { HelpRequest } from '../help-requests/HelpRequest'
import { openDialog } from '../common-ui-elements'
import { AssignVolunteerComponent } from '../assign-volunteer/assign-volunteer.component'

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss'],
})
export class DevComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    repo(HelpRequest)
      .findFirst()
      .then((r) =>
        openDialog(AssignVolunteerComponent, (x) => {
          x.r = r
        })
      )
  }
}

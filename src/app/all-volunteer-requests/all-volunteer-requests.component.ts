import { Component, OnInit } from '@angular/core'
import { BusyService } from '../common-ui-elements'
import { GridSettings } from '../common-ui-elements/interfaces'
import { Volunteer } from '../volunteer-request/volunteer-request'
import { repo } from 'remult'
import { saveToExcel } from '../common-ui-elements/interfaces/src/saveGridToExcel'

@Component({
  selector: 'app-all-volunteer-requests',
  templateUrl: './all-volunteer-requests.component.html',
  styleUrls: ['./all-volunteer-requests.component.scss'],
})
export class AllVolunteerRequestsComponent implements OnInit {
  constructor(private busyService: BusyService) {}
  grid: GridSettings<Volunteer> = new GridSettings(repo(Volunteer), {
    allowUpdate: true,
    gridButtons: [
      {
        name: 'Excel',
        click: () => saveToExcel(this.grid, 'מתנדבים', this.busyService),
      },
    ],
  })

  ngOnInit(): void {}
}

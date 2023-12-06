import { Component, OnInit } from '@angular/core'
import { GridSettings } from '../common-ui-elements/interfaces'
import { repo } from 'remult'
import { HelpRequest } from '../help-requests/HelpRequest'
import { saveToExcel } from '../common-ui-elements/interfaces/src/saveGridToExcel'
import { BusyService } from '../common-ui-elements'

@Component({
  selector: 'app-all-help-requests',
  templateUrl: './all-help-requests.component.html',
  styleUrls: ['./all-help-requests.component.scss'],
})
export class AllHelpRequestsComponent implements OnInit {
  constructor(private busyService: BusyService) {}
  grid: GridSettings<HelpRequest> = new GridSettings(repo(HelpRequest), {
    allowUpdate: true,
    gridButtons: [
      {
        name: 'Excel',
        click: () => saveToExcel(this.grid, 'בקשות', this.busyService),
      },
    ],
  })

  ngOnInit(): void {}
}

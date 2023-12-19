import { Component, OnInit } from '@angular/core'
import { Fields, getFields, repo } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'
import { HelpRequest } from '../help-requests/HelpRequest'
import { BackgroundColorService } from '../services/background-color.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private globalStyleService: BackgroundColorService) {}

  ngOnInit() {
    this.globalStyleService.addGlobalStyle()
  }

  ngOnDestroy() {
    this.globalStyleService.removeGlobalStyle()
  }
}

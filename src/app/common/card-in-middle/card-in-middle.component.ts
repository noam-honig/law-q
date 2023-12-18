import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackgroundColorService } from '../../services/background-color.service';

@Component({
  selector: 'app-card-in-middle',
  templateUrl: './card-in-middle.component.html',
  styleUrls: ['./card-in-middle.component.scss']
})
export class CardInMiddleComponent implements OnInit, OnDestroy {

  constructor(private globalStyleService: BackgroundColorService) {}

  ngOnInit() {
    this.globalStyleService.addGlobalStyle();
  }

  ngOnDestroy() {
    this.globalStyleService.removeGlobalStyle();
  }

}

import { Component, Input, OnInit } from '@angular/core'
import { formatPhone, whatsappUrl } from '../common/fields/PhoneField'

@Component({
  selector: 'app-display-phone',
  templateUrl: './display-phone.component.html',
  styleUrls: ['./display-phone.component.scss'],
})
export class DisplayPhoneComponent implements OnInit {
  constructor() {}
  @Input()
  phone = ''
  @Input()
  message = ''
  formattedPhone() {
    return formatPhone(this.phone)
  }
  whatsappUrl() {
    return whatsappUrl(this.phone, this.message)
  }
  ngOnInit(): void {}
}

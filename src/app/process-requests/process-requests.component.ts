import { Component, OnInit } from '@angular/core'
import { HelpRequest, helpRequestStatuses } from '../help-requests/HelpRequest'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators'
import { fromLiveQuery } from '../common/from-live-query'
import { repo } from 'remult'
import { FormControl } from '@angular/forms'
import { openDialog } from '../common-ui-elements'
import { AssignVolunteerComponent } from '../assign-volunteer/assign-volunteer.component'
import { RowButton } from '../common-ui-elements/interfaces'
import { UIToolsService } from '../common/UIToolsService'

@Component({
  selector: 'app-process-requests',
  templateUrl: './process-requests.component.html',
  styleUrls: ['./process-requests.component.scss'],
})
export class ProcessRequestsComponent implements OnInit {
  edit(r: HelpRequest) {
    this.ui.areaDialog({
      fields: r.$.toArray().filter(
        (f) => ![r.$.id, r.$.createdAt, r.$.volunteer].includes(f)
      ),
      ok: async () => {
        await r.save()
      },
      cancel: async () => {
        await r._.reload()
      },
    })
  }
  buttons: RowButton<HelpRequest>[] = [
    {
      name: 'אישור',
      click: async (r) => {
        r.status = 'ממתינה לשיוך'
        await r.save()
      },
      visible: (r) => r.status === 'חדשה',
    },
    {
      name: 'דחייה',
      click: async (r) => {
        r.status = 'נדחתה'
        await r.save()
      },
      visible: (r) => r.status === 'חדשה',
    },
    {
      name: 'שיוך',
      click: async (r) => {
        openDialog(AssignVolunteerComponent, (x) => {
          x.r = r
        })
      },
      visible: (r) => r.status === 'ממתינה לשיוך',
    },
  ]
  messageToPerson(r: HelpRequest) {
    return `שלום ${r.name},
בקשר לפניתך מספר ${r.id} בנושא ${r.title},
`
  }
  messageToLawyer(r: HelpRequest) {
    return `שלום עו"ד ${r.volunteer!.name}, 
בקשר לפניה מספר ${r.id} בנושא ${r.title} של ${r.name},
    `
  }
  emailToPerson(r: HelpRequest) {
    const title = `פנייתך ללשכת עורכי הדין, מספר ${r.id} בנושא ${r.title}`
    const body = this.messageToPerson(r)
    const emailLink = `mailto:${r.email}?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(body)}`
    return emailLink
  }
  emailToLawyer(r: HelpRequest) {
    const title = `פנייה מספר ${r.id} בנושא ${r.title}`
    const body = this.messageToPerson(r)
    const emailLink = `mailto:${
      r.volunteer!.email
    }?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    return emailLink
  }

  constructor(private ui: UIToolsService) {}

  options = [...helpRequestStatuses, 'כל הבקשות'] as const
  selectedOption = new FormControl<(typeof this.options)[number]>('חדשה')

  requests$ = this.selectedOption.valueChanges.pipe(
    startWith(this.selectedOption.value),
    switchMap((selected) =>
      fromLiveQuery(
        repo(HelpRequest).liveQuery({
          where: { status: selected === 'כל הבקשות' ? undefined : selected! },
          include: {
            volunteer: true,
          },
        })
      )
    )
  )

  ngOnInit(): void {}
}

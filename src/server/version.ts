import {
  dbNamesOf,
  Entity,
  Fields,
  IdEntity,
  remult,
  repo,
  SqlDatabase,
} from 'remult'
import { Volunteer } from '../app/volunteer-request/volunteer-request'
import { HelpRequest } from '../app/help-requests/HelpRequest'

@Entity(undefined!, {
  dbName: 'versionInfo',
})
export class VersionInfo extends IdEntity {
  @Fields.number()
  version: number = 0
}

export async function versionUpdate() {
  let version = async (ver: number, what: () => Promise<void>) => {
    let v = await remult.repo(VersionInfo).findFirst()
    if (!v) {
      v = remult.repo(VersionInfo).create()
      v.version = 0
    }
    if (v.version <= ver - 1) {
      try {
        console.time(`version: ` + ver)
        await what()
      } catch (err) {
        console.error(err)
        throw err
      } finally {
        console.timeEnd(`version: ` + ver)
      }

      v.version = ver
      await v.save()
    }
  }

  await version(5, async () => {
    for (const r of await repo(HelpRequest).find()) {
      r.status = 'חדשה'
      r.legalField = ''
      await r.save()
    }
  })
  await version(6, async () => {
    if (remult.dataProvider instanceof SqlDatabase) {
      const h = await dbNamesOf(repo(HelpRequest))
      await (remult.dataProvider as SqlDatabase).execute(
        `ALTER TABLE ${h} ALTER COLUMN ${h.volunteer} DROP NOT NULL`
      )
    }
  })
}

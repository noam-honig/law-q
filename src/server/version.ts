import { Entity, Fields, IdEntity, remult, SqlDatabase } from 'remult'

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

  await version(1, async () => {})
}

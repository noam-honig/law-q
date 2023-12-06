import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { initRequest } from './server-session'
import { HelpRequest } from '../app/help-requests/HelpRequest'
import { getPostgresSchemaManager } from './PostgresSchemaWrapper'
import { remult } from 'remult'
import { VersionInfo } from './version'

const entities = [User, HelpRequest, VersionInfo]
export const api = remultExpress({
  entities,
  controllers: [SignInController, UpdatePasswordController],

  initRequest: async (req) => {
    await initRequest(req)
    if (process.env['NODE_ENV'] === 'production')
      remult.dataProvider = await getPostgresSchemaManager({
        entities,
        disableSsl: false,
      }).getConnectionForSchema('lawq')
  },
  dataProvider: async () => {
    return undefined
  },
})

import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { initRequest } from './server-session'
import { HelpRequest } from '../app/help-requests/HelpRequest'
import { getPostgresSchemaManager } from './PostgresSchemaWrapper'

const entities = [User, HelpRequest]
export const api = remultExpress({
  entities,
  controllers: [SignInController, UpdatePasswordController],
  initRequest,
  dataProvider: async () => {
    if (process.env['NODE_ENV'] === 'production')
      return getPostgresSchemaManager({
        entities,
        disableSsl: false,
      }).getConnectionForSchema('lawq')
    return undefined
  },
})

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
import { VolunteerRequest } from '../app/volunteer-request/volunteer-request'
import { config } from 'dotenv'
config() //loads the configuration from the .env file

const entities = [User, HelpRequest, VersionInfo, VolunteerRequest]
const db = getPostgresSchemaManager({
  entities,
  disableSsl: false,
})

export const api = remultExpress({
  entities,
  controllers: [SignInController, UpdatePasswordController],

  initRequest: async (req) => {
    if (process.env['DATABASE_URL'])
      remult.dataProvider = await db.getConnectionForSchema('lawq')
    await initRequest(req)
  },
  dataProvider: async () => {
    return undefined
  },
})

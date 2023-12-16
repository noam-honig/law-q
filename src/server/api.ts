import { remultExpress } from 'remult/remult-express'
import { PostgresDataProvider, PostgresSchemaBuilder } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { initRequest } from './server-session'
import { HelpRequest } from '../app/help-requests/HelpRequest'
import {
  PostgresSchemaWrapper,
  createPostgresSchemaDataProvider,
} from './PostgresSchemaWrapper'
import { SqlDatabase, remult, repo } from 'remult'
import { VersionInfo, versionUpdate } from './version'
import { Volunteer } from '../app/volunteer-request/volunteer-request'
import { config } from 'dotenv'
import { Pool } from 'pg'
import { ChangeLog } from '../app/common/change-log/change-log'
import { sendEmail } from './sendEmail'
import fs from 'fs'
import { draftEmailToLawyer } from '../app/help-requests/draft-email-to-lwayer'
config() //loads the configuration from the .env file

const entities = [User, HelpRequest, VersionInfo, Volunteer, ChangeLog]

export const api = remultExpress({
  entities,
  controllers: [SignInController, UpdatePasswordController],
  dataProvider: async () => {
    if (!process.env['DATABASE_URL']) return undefined
    return createPostgresSchemaDataProvider({
      schema: 'lawq',
      connectionString: process.env['DATABASE_URL'],
    })
  },
  initRequest,
  initApi: async () => {
    await versionUpdate()
    const r = await repo(HelpRequest).findFirst(
      {},
      {
        include: {
          volunteer: true,
        },
      }
    )
    fs.writeFileSync('./tmp/test.html', draftEmailToLawyer(r).html)
  },
})

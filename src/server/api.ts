import { remultExpress } from 'remult/remult-express'
import {
  PostgresDataProvider,
  PostgresSchemaBuilder,
  createPostgresDataProvider,
} from 'remult/postgres'
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

const DATABASE_URL = process.env['DATABASE_URL']
const DATABASE_SCHEMA = process.env['DATABASE_SCHEMA']
export const api = remultExpress({
  entities,
  controllers: [SignInController, UpdatePasswordController],
  dataProvider: async () => {
    if (!DATABASE_URL) return undefined
    if (!DATABASE_SCHEMA)
      return createPostgresDataProvider({
        configuration: 'heroku',
      })
    else
      return createPostgresSchemaDataProvider({
        schema: 'lawq',
        connectionString: DATABASE_URL,
        disableSsl: DATABASE_URL.indexOf('localhost') >= 0,
      })
  },
  initRequest,
  initApi: async () => {
    await versionUpdate()

    const fetch = await import('node-fetch')
    fetch
      .default('https://api.ipify.org?format=json')
      .then((y) => y.json())
      .then((x) => console.log(x.ip))

    sendEmail(
      {
        to: ['noam.honig@gmail.com', 'assaf.r@israelbar.org.il'],
        subject: 'המערכת עולה',
        text: `
הי נועם
רק רציתי לעדכן שהמערכת של לשכת עורכי הדין עלתה, וששליחת המייל הצליחה
      `,
      },
      'server started'
    )
  },
})

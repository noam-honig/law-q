import { Fields, Validators } from 'remult'

export function NameField() {
  return Fields.string({
    caption: 'שם מלא',
    validate: [
      Validators.required,
      (_, v) => {
        const words = v.value.split(' ')
        if (words.length < 2) {
          throw new Error('נא להזין שם ושם משפחה')
        }
      },
    ],
  })
}

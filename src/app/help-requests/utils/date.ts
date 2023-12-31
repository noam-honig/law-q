import { FieldOptions, Fields } from 'remult'

export function formatDate(d: Date) {
  const now = new Date()

  let result = displayTime(d)
  if (now.toDateString() == d.toDateString()) return result
  return (
    result +
    ' ' +
    d
      .toLocaleDateString('he-il', {
        day: 'numeric',
        month: 'numeric',
      })
      .replace('.', '/')
  )
}

export function DateField<entityType>(
  options?: FieldOptions<entityType, Date>
) {
  return Fields.date({ displayValue: (_, d) => formatDate(d), ...options })
}

export function CreatedAtField<entityType>(
  options?: FieldOptions<entityType, Date>
) {
  return Fields.createdAt({
    width: '120',
    displayValue: (_, d) => formatDate(d),
    ...options,
  })
}

export function displayTime(d: Date) {
  return d.toLocaleTimeString('he-il', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

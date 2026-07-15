export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

export function reviewSeedKey(name: string, date: string): string {
  return slugify(`${name}-${date}`)
}

export function faqSeedKey(question: string): string {
  return slugify(question)
}

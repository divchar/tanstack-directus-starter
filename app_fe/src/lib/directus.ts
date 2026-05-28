import { createDirectus, rest } from '@directus/sdk'

const directusUrl =
  import.meta.env.VITE_DIRECTUS_URL ??
  process.env.VITE_DIRECTUS_URL ??
  'http://localhost:8055'

const directus = createDirectus(directusUrl).with(rest())

export default directus

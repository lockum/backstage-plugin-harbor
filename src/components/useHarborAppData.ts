import { Entity } from '@backstage/catalog-model'

export const HARBOR_ANNOTATION_REPOSITORY = 'goharbor.io/repository-slug'

export interface ParsedHarborSlug {
  host: string
  project: string
  repository: string
  slug: string
}

export function parseHarborSlug(slug: string): ParsedHarborSlug {
  const trimmed = slug.trim()
  const parts = trimmed.split('/')

  if (parts.length <= 1) {
    return { host: '', project: trimmed, repository: '', slug: trimmed }
  }

  // Harbor projects cannot contain dots or colons.
  // A host component will contain a dot (domain name/IP), a colon (host:port), or be 'localhost'.
  const firstPart = parts[0]
  const isHost =
    firstPart.includes('.') ||
    firstPart.includes(':') ||
    firstPart.toLowerCase() === 'localhost'

  if (isHost && parts.length >= 3) {
    return {
      host: firstPart,
      project: parts[1],
      repository: parts.slice(2).join('/'),
      slug: trimmed,
    }
  }

  return {
    host: '',
    project: parts[0],
    repository: parts.slice(1).join('/'),
    slug: trimmed,
  }
}

export const useHarborAppData = ({ entity }: { entity: Entity }) => {
  const repositorySlug =
    entity?.metadata.annotations?.[HARBOR_ANNOTATION_REPOSITORY] ?? ''

  if (!repositorySlug) {
    throw new Error("'Harbor' annotations are missing")
  }
  return { repositorySlug }
}

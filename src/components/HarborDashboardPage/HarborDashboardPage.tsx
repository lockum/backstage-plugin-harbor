import { useEntity } from '@backstage/plugin-catalog-react'
import { HarborRepository } from '../HarborRepository'
import { parseHarborSlug, useHarborAppData } from '../useHarborAppData'
import { Grid } from '@material-ui/core'

export const HarborDashboardPage = () => {
  const { entity } = useEntity()
  const { repositorySlug } = useHarborAppData({ entity })

  return (
    <Grid container spacing={3}>
      {repositorySlug
        .split(',')
        .map(slug => slug.trim())
        .filter(Boolean)
        .map(slug => {
          const { host, project, repository } = parseHarborSlug(slug)
          const key = slug

          return (
            <Grid item xs={12} key={key}>
              <HarborRepository
                slug={slug}
                title={slug}
                host={host}
                project={project}
                repository={repository}
                widget={false}
              />
            </Grid>
          )
        })}
    </Grid>
  )
}

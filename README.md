# Backstage Harbor Plugin

[![npm version](https://img.shields.io/npm/v/@digitalist-open-cloud/backstage-plugin-harbor.svg)](https://www.npmjs.com/package/@digitalist-open-cloud/backstage-plugin-harbor)

The Harbor Frontend Plugin displays detailed information about Docker images and container artifacts stored in [CNCF Harbor](https://goharbor.io/) directly within your Backstage software catalog.

> This repository is a fork of [`container-registry/backstage-plugin-harbor`](https://github.com/container-registry/backstage-plugin-harbor) updated for modern Backstage versions, featuring full support for **multi-path / nested repositories** (e.g., `project/subproject/repository` or `project/path1/path2/repository`), multi-instance Harbor environments, and enhanced error handling.

---

## Features

- **Vulnerability Gauge Widget**: Visual speedometer displaying the latest image's vulnerability status (None, Low, Medium, High, Critical) in your component Overview.
- **Detailed Artifacts Table**: Dedicated Harbor tab listing image tags, artifact digests, sizes, push/pull dates, vulnerability breakdowns, and direct links to the Harbor web UI.
- **Multi-Path Repository Support**: Seamlessly handles repositories with any number of nested path segments (`project/subproject/repo`, `project/path1/path2/repo`).
- **Multi-Instance Support**: Easily query images from multiple different Harbor instances based on the host specified in the catalog entity.
- **Multiple Repositories per Entity**: Track multiple images by providing comma-separated slugs on a single component.

---

## Prerequisites

This frontend plugin requires the [Harbor Backend Plugin](https://github.com/lockum/backstage-plugin-harbor-backend) configured and running in your Backstage backend.

---

## Installation

Add the frontend plugin package to your Backstage `packages/app`:

```bash
# Using Yarn directly from your repository fork
yarn --cwd packages/app add git+https://github.com/lockum/backstage-plugin-harbor.git
```

---

## Integration

### 1. Add the Dedicated Harbor Tab to Entity Pages

In `packages/app/src/components/catalog/EntityPage.tsx`:

```tsx
import {
  HarborPage,
  isHarborAvailable,
} from '@digitalist-open-cloud/backstage-plugin-harbor';

// Inside your serviceEntityPage / componentEntityPage:
const serviceEntityPage = (
  <EntityLayout>
    {/* ... other tabs ... */}

    <EntityLayout.Route path="/harbor" title="Harbor" if={isHarborAvailable}>
      <HarborPage />
    </EntityLayout.Route>
  </EntityLayout>
);
```

### 2. Add the Overview Widget (Optional)

You can also display a summary vulnerability widget on the entity's Overview tab:

```tsx
import {
  HarborWidget,
  isHarborAvailable,
} from '@digitalist-open-cloud/backstage-plugin-harbor';

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {/* ... other overview widgets ... */}

    <EntitySwitch>
      <EntitySwitch.Case if={isHarborAvailable}>
        <Grid item xs={12} md={6}>
          <HarborWidget />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </Grid>
);
```

---

## Configuring Catalog Entities (`catalog-info.yaml`)

To enable the Harbor tab and widget for a component, add the `goharbor.io/repository-slug` annotation to its `metadata.annotations`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  description: Example service with Harbor image tracking
  annotations:
    # 1. Standard two-segment repository (uses default Harbor instance)
    goharbor.io/repository-slug: my-project/my-service

    # 2. Multi-path / nested repository (3 segments)
    # goharbor.io/repository-slug: my-project/subproject/my-service

    # 3. Deeply nested repository (4+ segments)
    # goharbor.io/repository-slug: my-project/teams/backend/my-service

    # 4. Multi-instance: Target a specific Harbor host defined in app-config.yaml
    # goharbor.io/repository-slug: harbor2.yourdomain.com/my-project/my-service

    # 5. Multi-instance with nested repository
    # goharbor.io/repository-slug: harbor2.yourdomain.com/my-project/subproject/my-service

    # 6. Multiple repositories: Comma-separated list
    # goharbor.io/repository-slug: my-project/service-api, my-project/subproject/service-worker
spec:
  type: service
  lifecycle: production
  owner: team-a
```

### Slug Format Reference

| Format | Host | Project | Repository Path |
| --- | --- | --- | --- |
| `project/repo` | Default (`harbor.baseUrl`) | `project` | `repo` |
| `project/subproject/repo` | Default (`harbor.baseUrl`) | `project` | `subproject/repo` |
| `project/path1/path2/repo` | Default (`harbor.baseUrl`) | `project` | `path1/path2/repo` |
| `harbor2.domain.com/project/repo` | `harbor2.domain.com` | `project` | `repo` |
| `harbor2.domain.com/project/sub/repo` | `harbor2.domain.com` | `project` | `sub/repo` |
| `harbor:8080/project/sub/repo` | `harbor:8080` | `project` | `sub/repo` |

> [!NOTE]
> Harbor project names cannot contain dots (`.`) or colons (`:`). If the first segment contains a dot, colon, or matches `localhost`, the plugin treats it as a Harbor host. Otherwise, it is treated as the Harbor project name under the default Harbor instance.

---

## Contributing

Contributions, bug reports, and pull requests are welcome!

Please also consider contributing back upstream to the original repository at [container-registry/backstage-plugin-harbor](https://github.com/container-registry/backstage-plugin-harbor).

## License

Licensed under the [Apache License, Version 2.0](LICENSE).

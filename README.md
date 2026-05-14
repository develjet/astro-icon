# @develjet/astro-icon

A lightweight Astro integration and component for using Iconify icons and local SVGs.

## Installation

```bash
npm add @develjet/astro-icon
```

## Setup

Add the integration to your `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import icon from '@develjet/astro-icon';

export default defineConfig({
  integrations: [icon()],
});
```

## Cloudflare Integration

When using the `@astrojs/cloudflare` adapter, you **must** add the `nodejs_compat` flag to your `wrangler.toml` (or `wrangler.json`) file:

```toml
compatibility_flags = ["nodejs_compat"]
```

## Configuration

### Integration Options

You can configure the integration in your `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import icon from '@develjet/astro-icon';

export default defineConfig({
  integrations: [
    icon({
      // The directory where local SVG icons are stored
      // Default: "src/assets/icons"
      iconDir: "src/assets/icons",
    }),
  ],
});
```

### Component Props

The `Icon` component accepts the following props:

| Prop       | Type                    | Default      | Description                                             |
| :--------- | :---------------------- | :----------- | :------------------------------------------------------ |
| `name`     | `string`                | **Required** | The icon name (e.g., `mdi:home` or `local-icon-name`)   |
| `size`     | `string | number`      | `"1em"`      | The height and width of the icon                        |
| `class`    | `string`                | `undefined`  | CSS classes to apply to the `<svg>` element             |
| `...props` | `HTMLAttributes<"svg">` | `undefined`  | Any other valid SVG attributes (e.g., `fill`, `stroke`) |

## Usage

### Iconify Icons

To use icons from Iconify, you need to install the corresponding icon set:

```bash
npm add -D @iconify-json/mdi
```

Then use the `Icon` component:

```astro
---
import Icon from '@develjet/astro-icon/Icon.astro';
---

<Icon name="mdi:home" size={24} class="text-blue-500" />
```

### Local Icons

By default, the component looks for local SVG icons in `src/assets/icons/*.svg`. You can customize this path using the `iconDir` option in the integration settings.

```astro
<Icon name="my-local-icon" size="2em" />
```

This will load `my-local-icon.svg` from your configured `iconDir`.

## License

MIT

import type { AstroIntegration } from "astro";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface IconifyOptions {
  /**
   * The directory where local SVG icons are stored.
   * @default "src/assets/icons"
   */
  iconDir?: string;
  /**
   * Alias for iconDir.
   */
  outDir?: string;
}

export default function iconIntegration(
  options: IconifyOptions = {},
): AstroIntegration {
  const { iconDir = options.outDir || "src/assets/icons" } = options;

  return {
    name: "@develjet/astro-icon",
    hooks: {
      "astro:config:setup": ({ updateConfig, config }) => {
        const virtualModuleId = "virtual:astro-icon/local-icons";
        const resolvedVirtualModuleId = "\0" + virtualModuleId;

        // Detect installed icon sets from the user's package.json
        let installedSets: string[] = [];
        try {
          const pkgPath = join(config.root.pathname, "package.json");
          const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
          const allDeps = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {}),
          };
          installedSets = Object.keys(allDeps)
            .filter((dep) => dep.startsWith("@iconify-json/"))
            .map((dep) => dep.replace("@iconify-json/", ""));
        } catch (e) {
          console.warn("[astro-icon] Unable to read package.json to detect icon sets.");
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-icon-config",
                resolveId(id) {
                  if (id === virtualModuleId) {
                    return resolvedVirtualModuleId;
                  }
                },
                load(id) {
                  if (id === resolvedVirtualModuleId) {
                    const globPath = iconDir.startsWith("/") ? iconDir : `/${iconDir}`;

                    // Create a mapping of prefix -> import function
                    // This allows Vite to statically analyze and bundle only the needed sets
                    const setImports = installedSets
                      .map((set) => `"${set}": () => import("@iconify-json/${set}/icons.json")`)
                      .join(",\n");

                    return `
                      export const localIcons = import.meta.glob("${globPath}/*.svg", { query: "?raw", eager: true });
                      export const iconSets = {
                        ${setImports}
                      };
                      export default localIcons;
                    `;
                  }
                },
              },
            ],
            ssr: {
              // Force bundling of the integration and iconify utilities
              noExternal: [
                "@develjet/astro-icon",
                "@iconify/utils",
                /^@iconify-json\//,
              ],
            },
          },
        });
      },
    },
  };
}

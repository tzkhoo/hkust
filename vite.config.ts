import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];

  // Load lovable-tagger only in development to avoid build-time resolution errors
  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      const tagger = componentTagger();
      if (Array.isArray(tagger)) {
        plugins.push(...tagger);
      } else if (tagger) {
        plugins.push(tagger as PluginOption);
      }
    } catch (err) {
      // Plugin not available; ignore in non-Lovable environments
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

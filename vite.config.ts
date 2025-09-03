import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "child_process";

// Get current git branch
function getGitBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn('Could not get git branch:', error);
    return 'unknown';
  }
}

const gitBranch = getGitBranch();
console.log('🔍 Vite config: Setting VITE_GIT_BRANCH to:', gitBranch);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_GIT_BRANCH': JSON.stringify(gitBranch),
  },
  // Ensure environment variables are available in development
  envPrefix: 'VITE_',
}));

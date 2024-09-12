import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgr()],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, './src/components/'),
      Services: path.resolve(__dirname, './src/services/'),
      Constants: path.resolve(__dirname, './src/constants/'),
      Interfaces: path.resolve(__dirname, './src/interfaces/'),
      ApiHooks: path.resolve(__dirname, './src/apiHooks/'),
      Utils: path.resolve(__dirname, './src/utils/'),
      Styles: path.resolve(__dirname, './src/styles/'),
      Assets: path.resolve(__dirname, './assets/'),
      Shared: path.resolve(__dirname, './src/shared/'),
      Pages: path.resolve(__dirname, './src/pages/'),
      OD: path.resolve(__dirname, './src/outerDeclarations/'),
      Providers: path.resolve(__dirname, './src/providers/'),
      Canisters: path.resolve(__dirname, './src/canisters/'),
      ABIs: path.resolve(__dirname, './src/ABIs/'),
      Stores: path.resolve(__dirname, './src/stores/'),
      SVGIcons: path.resolve(__dirname, './src/SVGIcons/'),
      Hooks: path.resolve(__dirname, './src/hooks/'),
      Types: path.resolve(__dirname, './src/types/'),
    },
  },
});

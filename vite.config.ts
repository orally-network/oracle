import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr(),
  ],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, './src/app_frontend/src/components/'),
      Services: path.resolve(__dirname, './src/app_frontend/src/services/'),
      Constants: path.resolve(__dirname, './src/app_frontend/src/constants/'),
      Interfaces: path.resolve(__dirname, './src/app_frontend/src/interfaces/'),
      ApiHooks: path.resolve(__dirname, './src/app_frontend/src/apiHooks/'),
      Utils: path.resolve(__dirname, './src/app_frontend/src/utils/'),
      Styles: path.resolve(__dirname, './src/app_frontend/src/styles/'),
      Assets: path.resolve(__dirname, './src/app_frontend/assets/'),
      Declarations: path.resolve(__dirname, './src/declarations/'),
      Shared: path.resolve(__dirname, './src/app_frontend/src/shared/'),
      Pages: path.resolve(__dirname, './src/app_frontend/src/pages/'),
      OD: path.resolve(__dirname, './src/app_frontend/src/outerDeclarations/'),
      Providers: path.resolve(__dirname, './src/app_frontend/src/providers/'),
      Canisters: path.resolve(__dirname, './src/app_frontend/src/canisters/'),
      ABIs: path.resolve(__dirname, './src/app_frontend/src/ABIs/'),
      Stores: path.resolve(__dirname, './src/app_frontend/src/stores/'),
      Public: path.resolve(__dirname, './public/'),
    },
  }
})

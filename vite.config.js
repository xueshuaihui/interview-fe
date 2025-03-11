import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { exec } from 'child_process'

function generateJsonPlugin() {
  const generateJson = () => {
    return new Promise((resolve, reject) => {
      exec('node scripts/generate-json.js', (error) => {
        if (error) {
          console.error('Error generating JSON files:', error)
          reject(error)
          return
        }
        console.log('JSON files generated successfully')
        resolve()
      })
    })
  }

  return {
    name: 'generate-json',
    buildStart() {
      return generateJson()
    },
    handleHotUpdate({ file }) {
      if (file.endsWith('.md')) {
        return generateJson()
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), generateJsonPlugin()],
})

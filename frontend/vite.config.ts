import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    viteStaticCopy({                                 
      targets: [
        {
          src: 'public/_redirects',                   
          dest: ''                                    
        }
      ]
    })
  ],
  server: {
    port: 3000,
  },
})

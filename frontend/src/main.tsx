import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollArea } from "@/components/ui/scroll-area"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ScrollArea>
        <App />
      </ScrollArea>
    </ThemeProvider>
  </StrictMode>
)

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components'
import { Auth, Home} from '@/pages'
import { RequireAuth } from '@/components'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="auth" element={<Auth />} />
          <Route element={<RequireAuth />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

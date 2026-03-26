import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

function HomePage() {
  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-canvas"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
          Портал Автомоек
        </h1>
        <p className="text-muted text-lg">Проект в разработке</p>
      </div>
    </motion.main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

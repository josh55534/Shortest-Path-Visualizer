import { useState } from 'react'
import { PathVisualizer } from './Visualizer/path-visualizer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <PathVisualizer />
    </div>
  )
}

export default App

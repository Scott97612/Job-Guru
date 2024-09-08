import { useState, useCallback, useEffect, useRef } from 'react'
import Home from './components/Home'
import Writing from './components/Writing'
import Output from './components/Output'

function App() {

  const [processing, setProcessing] = useState(false);
  const [outputAvailable, setOutputAvailable] = useState(false);

  return (
    <>
      {outputAvailable? <Output/>: 
      processing? <Writing/>:
      <Home/>}
    </>
  )
}

export default App

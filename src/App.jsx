import { useState, useCallback, useEffect, useRef } from 'react'
import Home from './components/Home'
import Writing from './components/Writing'
import Output from './components/Output'
import Header from './components/Header'

function App() {

  const BACKEND_ENDPOINT = 'http://localhost:5000/'

  const [processing, setProcessing] = useState(false);
  const [outputAvailable, setOutputAvailable] = useState(false);
  // type selection set a default value
  const [type, setType] = useState('CV/Resume');
  const [profile, setProfile] = useState(null);
  const [companyDescription, setCompanyDescription] = useState(null);
  const [companyDescriptionImage, setCompanyDescriptionImage] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [jobDescriptionImage, setJobDescriptionImage] = useState(null);
  const [userRequests, setUserRequests] = useState(null);
  // model selection set a default value
  const [model, setModel] = useState('Gemini-1.5-Flash');

  const Reset = useCallback(async () => {
    setProcessing(false);
    setOutputAvailable(false);
    // reset the backend data as well
    const formData = new FormData();
    formData.append('action', 'reset');
    const response = await fetch(`${BACKEND_ENDPOINT}/reset`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Reset response:', data);
  }, []);

  return (
    <div className='flex flex-col mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header Reset={Reset}/>
        {outputAvailable? <Output/>: 
        processing? <Writing/>:
        <Home setType={setType} setProfile={setProfile} setCompanyDescription={setCompanyDescription}
        setCompanyDescriptionImage={setCompanyDescriptionImage} setJobDescription={setJobDescription}
        setJobDescriptionImage={setJobDescriptionImage} setUserRequests={setUserRequests} 
        setModel={setModel}/>}
      </section>
    </div>
  )
}


export default App

import { useState, useCallback, useEffect } from 'react'
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import Home from './components/Home'
import Writing from './components/Writing'
import Output from './components/Output'
import Header from './components/Header'

function App() {
  const BACKEND_ENDPOINT = 'http://localhost:5000'
  const [sessionId, setSessionId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);
  const [type, setType] = useState('CV/Resume');
  const [profile, setProfile] = useState(null);
  const [companyDescription, setCompanyDescription] = useState(null);
  const [companyDescriptionImage, setCompanyDescriptionImage] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [jobDescriptionImage, setJobDescriptionImage] = useState(null);
  const [userRequests, setUserRequests] = useState(null);
  const [model, setModel] = useState('Gemini-1.5-Flash');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 15));
  }, []);

  const checkJobStatus = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${BACKEND_ENDPOINT}/api-get-output`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        }
      });

      if (response.status === 202) {
        // Job still processing
        return false;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.output) {
        const md = new MarkdownIt();
        const parsedMarkdown = md.render(result.output);
        const sanitizedHTML = DOMPurify.sanitize(parsedMarkdown)
          .replace(/\\n/g, '<br>')
          .replace(/---/g, '<hr>')
          .replace(/\\u/g, '-')
          .replace(/###/g, '');
        setOutput(<div className="flex flex-col bg-white shadow-lg rounded-lg max-w-[1300px] mx-auto p-4" id="content" 
           dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />);
        setProcessing(false);
        return true;
      }
    } catch (error) {
      console.error('Error checking job status:', error);
      setProcessing(false);
    }
    return false;
  }, [sessionId]);

  useEffect(() => {
    let intervalId;
    if (processing) {
      intervalId = setInterval(async () => {
        const jobComplete = await checkJobStatus();
        if (jobComplete) {
          clearInterval(intervalId);
        }
      }, 2000); // Poll every 2 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [processing, checkJobStatus]);

  const formSubmit = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('pdf', profile || null);
      formData.append('job_description', jobDescription || '');
      formData.append('job_description_image', jobDescriptionImage || null);
      formData.append('company_description', companyDescription || '');
      formData.append('company_description_image', companyDescriptionImage || null);
      formData.append('user_request', userRequests || '');
      formData.append('model_name', model);

      setProcessing(true);
      setOutput(null);

      console.log('Sending POST request with session ID:', sessionId);
      const response = await fetch(`${BACKEND_ENDPOINT}/api-post-data`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': sessionId
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.message !== 'Data processing started') {
        throw new Error('Unexpected response from server');
      }

    } catch (error) {
      console.error('Error uploading data:', error);
      setProcessing(false);
    }
  }, [sessionId, type, profile, jobDescription, jobDescriptionImage, companyDescription, companyDescriptionImage, userRequests, model]);

  const Reset = useCallback(async () => {
    setProcessing(false);
    setOutput(null);
    const formData = new FormData();
    formData.append('action', 'reset');
    console.log('Sending reset request with session ID:', sessionId);
    const response = await fetch(`${BACKEND_ENDPOINT}/api-reset`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Session-ID': sessionId
      }
    });
    const data = await response.json();
    console.log('Reset response:', data);
  }, [sessionId]);

  const renderedComponent = output ? <Output output={output}/> :
                            processing ? <Writing/> :
                            <Home setType={setType} setProfile={setProfile} 
                                  setCompanyDescription={setCompanyDescription}
                                  setCompanyDescriptionImage={setCompanyDescriptionImage} 
                                  setJobDescription={setJobDescription}
                                  setJobDescriptionImage={setJobDescriptionImage} 
                                  setUserRequests={setUserRequests} 
                                  setModel={setModel} formSubmit={formSubmit}/>;

  return (
    <div className='flex flex-col mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header Reset={Reset}/>
        {renderedComponent}
      </section>
    </div>
  )
}

export default App
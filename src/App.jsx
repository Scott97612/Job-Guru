import { useState, useCallback, useEffect, useRef } from 'react'
import io from 'socket.io-client';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import Home from './components/Home'
import Writing from './components/Writing'
import Output from './components/Output'
import Header from './components/Header'

function App() {

  const BACKEND_ENDPOINT = 'http://localhost:5000'
  const socketRef = useRef(null);
  const isProcessingRef = useRef(false);
  const [renderedComponent, setRenderedComponent] = useState(null);

  const [processing, setProcessing] = useState(false);
  const [outputAvailable, setOutputAvailable] = useState(false);
  const [output, setOutput] = useState(null);
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

  // Set up socket connection
  useEffect(() => {
    socketRef.current = io(BACKEND_ENDPOINT);

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!socketRef.current) return;

    const onProcessing = (data) => {
      console.log('Processing event received:', data.status);
      isProcessingRef.current = true;
      setProcessing(true);             
    };

    const onComplete = async () => {
      console.log('Writing complete');
      isProcessingRef.current = false;
      setProcessing(false);
      setOutputAvailable(true);

      try {
        const response = await fetch(`${BACKEND_ENDPOINT}/api-get-output`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
        }
        });
        const result = await response.text();
        console.log(result)
        const formattedResult = result.slice(15, result.length - 4);
        const md = new MarkdownIt();
        const parsedMarkdown = md.render(formattedResult);
        const sanitizedHTML = DOMPurify.sanitize(parsedMarkdown).replace(/\\n/g, '<br>').replace(/---/g, '<hr>').replace(/\\u/g, '-').replace(/###/g, '');
        setOutput(<div className=" flex flex-col bg-white shadow-lg rounded-lg max-w-[1300px] mx-auto p-4" id="content" 
           dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    const onError = (data) => {
      console.error('Error event received:', data.status);
      isProcessingRef.current = false;
      setProcessing(false);
    };

    socketRef.current.on('processing', onProcessing);
    socketRef.current.on('complete', onComplete);
    socketRef.current.on('error', onError);

    return () => {
      socketRef.current.off('processing', onProcessing);
      socketRef.current.off('complete', onComplete);
      socketRef.current.off('error', onError);
    };
  }, []);

  const formSubmit = useCallback(async () => {
    if (!type && !companyDescription && !companyDescriptionImage && !jobDescription && !jobDescriptionImage && !userRequests && !model) return;
    if (isProcessingRef.current) {
      console.log('Already processing, please wait');
      return;
    }

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

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      const response = await fetch(`${BACKEND_ENDPOINT}/api-post-data`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Upload response:', data);

      // Wait for processing to complete
      await new Promise((resolve) => {
        const checkProcessing = setInterval(() => {
          if (!isProcessingRef.current) {
            clearInterval(checkProcessing);
            resolve();
          }
        }, 100);
      });

    } catch (error) {
      console.error('Error uploading data:', error);
      setProcessing(false);
    }
  }, [type, profile, jobDescription, jobDescriptionImage, companyDescription, companyDescriptionImage, userRequests, model]);

  useEffect(() => {
    if (outputAvailable) {
      setRenderedComponent(<Output output={output}/>);
    }
    else if (processing) {
      setRenderedComponent(<Writing/>)
    }
    else {
      setRenderedComponent(<Home setType={setType} setProfile={setProfile} setCompanyDescription={setCompanyDescription}
        setCompanyDescriptionImage={setCompanyDescriptionImage} setJobDescription={setJobDescription}
        setJobDescriptionImage={setJobDescriptionImage} setUserRequests={setUserRequests} 
        setModel={setModel} formSubmit={formSubmit}/>)
    }
  }, [formSubmit, output, outputAvailable, processing])

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
        {renderedComponent}
      </section>
    </div>
  )
}


export default App

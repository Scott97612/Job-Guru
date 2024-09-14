import { Upload } from 'lucide-react'
import { useState, useEffect } from 'react'

// Custom Tooltip component with flatter rectangle style
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-1 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm tooltip dark:bg-gray-700 whitespace-nowrap"
             style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', maxWidth: '1000px' }}>
          {content}
        </div>
      )}
    </div>
  );
};

// InfoIcon component using the custom Tooltip
const InfoIcon = ({ tooltip }) => (
  <Tooltip content={tooltip}>
    <i className="fa-solid fa-circle-question text-gray-400 hover:text-gray-600 ml-2 cursor-help"></i>
  </Tooltip>
);

export default function Home(props) {
    const {setType, setProfile, setCompanyDescription, setCompanyDescriptionImage, setJobDescription, setJobDescriptionImage, setUserRequests, setModel, formSubmit} = props;

    const [localType, setLocalType] = useState(() => localStorage.getItem('type') || 'CV/Resume');
    const [localCompanyDescription, setLocalCompanyDescription] = useState(() => localStorage.getItem('companyDescription') || '');
    const [localJobDescription, setLocalJobDescription] = useState(() => localStorage.getItem('jobDescription') || '');
    const [localUserRequests, setLocalUserRequests] = useState(() => localStorage.getItem('userRequests') || '');
    const [localModel, setLocalModel] = useState(() => localStorage.getItem('model') || 'Gemini-1.5-Flash');

    const [profileFileName, setProfileFileName] = useState(() => localStorage.getItem('profileFileName') || '');
    const [companyImageFileName, setCompanyImageFileName] = useState(() => localStorage.getItem('companyImageFileName') || '');
    const [jobImageFileName, setJobImageFileName] = useState(() => localStorage.getItem('jobImageFileName') || '');

    useEffect(() => {
        setType(localType);
        setCompanyDescription(localCompanyDescription);
        setJobDescription(localJobDescription);
        setUserRequests(localUserRequests);
        setModel(localModel);

        localStorage.setItem('type', localType);
        localStorage.setItem('companyDescription', localCompanyDescription);
        localStorage.setItem('jobDescription', localJobDescription);
        localStorage.setItem('userRequests', localUserRequests);
        localStorage.setItem('model', localModel);
        localStorage.setItem('profileFileName', profileFileName);
        localStorage.setItem('companyImageFileName', companyImageFileName);
        localStorage.setItem('jobImageFileName', jobImageFileName);
    }, [localType, localCompanyDescription, localJobDescription, localUserRequests, localModel, profileFileName, companyImageFileName, jobImageFileName, setType, setCompanyDescription, setJobDescription, setUserRequests, setModel]);

    const handleFileChange = (e, setter, fileNameSetter) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setter(file);
            fileNameSetter(file.name);
        }
    };

    const handleReselect = (inputId) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.click();
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Company Description */}
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4 text-orange-500 flex items-center">
                                    Company Introduction
                                    <InfoIcon tooltip="Provide a brief introduction to the company you're applying to. No need for well-known companies." />
                                </h2>
                                <div className="mb-4">
                                    <textarea
                                        placeholder="Enter company name with optional introduction"
                                        value={localCompanyDescription}
                                        onChange={(e) => setLocalCompanyDescription(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={6}
                                        style={{resize: 'none', overflow: 'auto'}}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className="mr-2">or</span>
                                    <div className="relative">
                                        <input
                                            id="company-image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setCompanyDescriptionImage, setCompanyImageFileName)}
                                            className="hidden"
                                        />
                                        <label htmlFor="company-image-upload" className="flex items-center justify-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                            {companyImageFileName ? (
                                                <>
                                                    <span className="text-sm text-gray-500 mr-2">{companyImageFileName}</span>
                                                    <button
                                                        onClick={() => handleReselect('company-image-upload')}
                                                        className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs"
                                                    >
                                                        Reselect
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1">
                                                    <i className="fa-solid fa-file-image"></i>
                                                    <span className="text-sm text-gray-400">Screenshot</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4 text-orange-500 flex items-center">
                                    Job Description
                                    <InfoIcon tooltip="Enter the job description or key requirements for the position you're applying for." />
                                </h2>
                                <div className="mb-4">
                                    <textarea
                                        placeholder="Enter job description"
                                        value={localJobDescription}
                                        onChange={(e) => setLocalJobDescription(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={6}
                                        style={{resize: 'none', overflow: 'auto'}}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className="mr-2">or</span>
                                    <div className="relative">
                                        <input
                                            id="job-image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setJobDescriptionImage, setJobImageFileName)}
                                            className="hidden"
                                        />
                                        <label htmlFor="job-image-upload" className="flex items-center justify-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                            {jobImageFileName ? (
                                                <>
                                                    <span className="text-sm text-gray-500 mr-2">{jobImageFileName}</span>
                                                    <button
                                                        onClick={() => handleReselect('job-image-upload')}
                                                        className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs"
                                                    >
                                                        Reselect
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1">
                                                    <i className="fa-solid fa-file-image"></i>
                                                    <span className="text-sm text-gray-400">Screenshot</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional User Requests */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-orange-500 flex items-center">
                            Additional Information
                            <InfoIcon tooltip="Add any additional custom requests, Guru would prioritize them." />
                        </h2>
                        <div className="mb-4">
                            <label htmlFor="user-requests" className="block text-sm font-medium text-gray-700 mb-1">Additional Requests</label>
                            <textarea
                                id="user-requests"
                                placeholder="Enter any additional requests"
                                value={localUserRequests}
                                onChange={(e) => setLocalUserRequests(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows={8}
                                style={{resize: 'none', overflow: 'auto'}}
                            />
                        </div>
                    </div>

                    {/* Writing Type, Profile Upload, and Model Selection */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-orange-500">Writing Type & Your Profile</h2>
                        
                        {/* Type Selection */}
                        <div className="mb-4">
                            <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                Writing Type
                                <InfoIcon tooltip="Choose the type of document you want to create." />
                            </label>
                            <select
                                id="type-select"
                                value={localType}
                                onChange={(e) => setLocalType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="CV/Resume">CV/Resume</option>
                                <option value="Cover Letter">Cover Letter</option>
                            </select>
                        </div>

                        {/* Profile Upload */}
                        <div className="mb-4">
                            <label htmlFor="profile-upload" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                Upload Profile (PDF)
                                <InfoIcon tooltip="Upload your profile in PDF format. Try export a PDF profile from your LinkedIn." />
                            </label>
                            <div className="relative">
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(e, setProfile, setProfileFileName)}
                                    className="hidden"
                                />
                                <label htmlFor="profile-upload" className="flex items-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                                    {profileFileName ? (
                                        <>
                                            <span className="text-sm text-gray-500 mr-2">{profileFileName}</span>
                                            <button
                                                onClick={() => handleReselect('profile-upload')}
                                                className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                                Reselect
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 text-gray-400" size={24} />
                                            <span className="text-sm text-gray-500">Choose PDF file</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Model Selection */}
                        <div>
                            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                Select Model
                                <InfoIcon tooltip="Choose the AI model to use for generating your document." />
                            </label>
                            <select
                                id="model-select"
                                value={localModel}
                                onChange={(e) => setLocalModel(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Gemini-1.5-Flash">Gemini-1.5-Flash</option>
                                <option value="GPT-4o">GPT-4o</option>
                                <option value="GPT-4o-mini">GPT-4o-mini</option>
                                <option value="Claude-Sonnet-3.5">Claude-Sonnet-3.5</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button onClick={formSubmit} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Ask Guru
                    </button>
                </div>
            </div>
        </div>
    )
}
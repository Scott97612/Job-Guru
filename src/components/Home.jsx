import { Upload, Image } from 'lucide-react'

export default function Home(props) {
    // eslint-disable-next-line react/prop-types
    const {setType, setProfile, setCompanyDescription, setCompanyDescriptionImage, setJobDescription, setJobDescriptionImage, setUserRequests, setModel} = props;

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-orange-500">Please Provide Guru Some Information</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-orange-500">Writing Type & Your Profile</h2>
                
                {/* Type Selection */}
                <div className="mb-4">
                <label htmlFor="type-select" className="block text-sm font-medium text-gray-700 mb-1">Writing Type</label>
                <select
                    id="type-select"
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="CV/Resume">CV/Resume</option>
                    <option value="Cover Letter">Cover Letter</option>
                </select>
                </div>

                {/* Profile Upload */}
                <div>
                <label htmlFor="profile-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Profile (PDF)</label>
                <label className="flex items-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                    id="profile-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setProfile(e.target.files[0])}
                    className="hidden"
                    />
                    <Upload className="mr-2 text-gray-400" size={24} />
                    <span className="text-sm text-gray-500">Choose PDF file</span>
                </label>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-orange-500">Company & Job Details</h2>
                
                {/* Company Description */}
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company and/or Introduction</label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="Enter company with introduction (optional)"
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <label className="flex items-center justify-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCompanyDescriptionImage(e.target.files[0])}
                        className="hidden"
                    />
                    <Image size={20} className="text-gray-400" />
                    </label>
                </div>
                </div>

                {/* Job Description */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="Enter job description"
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <label className="flex items-center justify-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setJobDescriptionImage(e.target.files[0])}
                        className="hidden"
                    />
                    <Image size={20} className="text-gray-400" />
                    </label>
                </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-orange-500">Additional Information</h2>
                
                {/* Additional User Requests */}
                <div className="mb-4">
                <label htmlFor="user-requests" className="block text-sm font-medium text-gray-700 mb-1">Additional Requests</label>
                <textarea
                    id="user-requests"
                    placeholder="Enter any additional requests"
                    onChange={(e) => setUserRequests(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                />
                </div>

                {/* Model Selection */}
                <div>
                <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">Select Model</label>
                <select
                    id="model-select"
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="Gemini-1.5-Flash">Gemini-1.5-Flash</option>
                    <option value="Gemini-1.5-Pro">Gemini-1.5-Pro</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="GPT-4o-mini">GPT-4o-mini</option>
                </select>
                </div>
            </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
            <button className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Ask Guru
            </button>
            </div>
        </div>
        </div>
    )
}
import html2pdf from 'html2pdf.js';

export default function Output(props) {
  const {output} = props;
  // output itself is a div

    const handleDownload = () => {
      const element = document.getElementById('content');
      html2pdf()
        .from(element)
        .set({
          margin: 1,
          filename: 'document.pdf',
          html2canvas: { scale: 2 }, // Increase scale for better quality
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .save();
    }

  return(
    <div>
      {output}
      <div className='flex flex-col items-center mx-auto text-lg pt-6 pb-4 gap-3'> 
        <button onClick={handleDownload} title='Download as PDF' className='bg-transparent px-4 hover:text-orange-400 flex justify-center mx-auto gap-2 items-center'>
          <h3>Download as PDF</h3>
          <i className="fa-solid fa-download"></i>
        </button>
        <p className='text-slate-500'>📍SoTA models are very capable, but still please proof read the output before using them for applications</p>
      </div>
    </div>
)}
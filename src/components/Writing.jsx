import Gif from '../assets/pen.gif'

export default function Writing() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 md:gap-8 pb-24 text-center flex-1'>
        <div className='flex flex-col gap-3 sm:gap-4'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Guru Writing...</h1>
        </div>
        
        <div className='flex items-center gap-4 max-w-[500px] mx-auto w-full p-4'>
          <img src={Gif} alt="Loading GIF" className="w-1/3" />
          <div className='flex flex-col gap-2 sm:gap-4 w-2/3'>
            {[0, 1, 2].map(val => {
              return (
              <div key={val} className={'rounded-full h-2 sm:h-3 bg-orange-300 loading ' + `loading${val}`}>
              </div>)})}
          </div>
        </div>
        
    </div>
  )
}

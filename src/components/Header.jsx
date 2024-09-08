export default function Header(props) {

    // eslint-disable-next-line react/prop-types
    const {Reset} = props;
  
    return (
      <header className='flex items-center justify-between gap-4 p-4'>
          <a href='/' onClick={Reset}><h1 className='font-bold text-xl animate-[rollingColor_4s_linear_infinite]'>Job Guru</h1></a>
          <a href='/' onClick={Reset}><button className='flex items-center gap-2 simpleBtn px-4 py-2 rounded-xl text-orange-400 text-xl'>
              <h3>New</h3>
              <i className="fa-regular fa-square-plus"></i>
          </button></a>
      </header>
    )
  }
  
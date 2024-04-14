import nosleepicon from '../assets/nosleep.svg';
export default function Header() {
  
  return (
    <header>
      <img src={nosleepicon} alt='no sleep icon' className='headerIcon'/>
      <h2>DON&apos;T SNOOZE HEALTH AND FITNESS CLUB</h2>
    </header>
  );
}
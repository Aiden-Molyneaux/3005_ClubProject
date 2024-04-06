export default function Footer() {
  function clearCookies() {
      window.localStorage.removeItem('auth');
  }
  
  return (
    <footer>
      <p>Aiden Molyneaux 2024</p>
      <button onClick={() => clearCookies()}>Clear cookies</button>
    </footer>
  )
}
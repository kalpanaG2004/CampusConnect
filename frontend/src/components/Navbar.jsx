import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-[#DFFFE3]/40 backdrop-blur fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 shadow">
      <h1 className="text-xl text-[#3A8F50] hover:text-[#2F3E2E] font-bold hover:drop-shadow-glow transition duration-300">
        <Link to="/" >Campus Connect</Link>
      </h1>
      <div className="text-xl text-[#2F3E2E] space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;

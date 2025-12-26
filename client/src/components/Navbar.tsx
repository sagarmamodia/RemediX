import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-background-paper border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-text-main tracking-tight">
              Remedi<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-text-muted hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-text-muted hover:text-primary transition-colors font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-text-muted hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-text-main font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-soft hover:shadow-md active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

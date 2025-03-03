
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Book, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="w-full py-4 px-6 bg-background/80 backdrop-blur-md border-b z-10 sticky top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-purple" />
          <span className="font-bold text-xl">EnglishPlay</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            to="/" 
            className={cn("nav-item flex items-center gap-2", isActive('/') && "active")}
          >
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </Link>
          <Link 
            to="/games" 
            className={cn("nav-item flex items-center gap-2", isActive('/games') && "active")}
          >
            <Book className="h-4 w-4" />
            <span>Juegos</span>
          </Link>
          <Link 
            to="/progress" 
            className={cn("nav-item flex items-center gap-2", isActive('/progress') && "active")}
          >
            <Trophy className="h-4 w-4" />
            <span>Progreso</span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/profile" className="h-10 w-10 rounded-full bg-purple text-white flex items-center justify-center">
            <span className="font-medium">JP</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

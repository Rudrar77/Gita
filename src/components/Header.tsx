
import { Search, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-orange-900">Dharma Gita</h1>
            <p className="text-sm text-orange-700">Wisdom of the Ages</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-900">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-900">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

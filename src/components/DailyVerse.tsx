
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Star } from "lucide-react";
import { sampleVerse } from "@/data/sampleVerse";

const DailyVerse = () => {
  return (
    <Card className="bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-900">Verse of the Day</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-900">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-2xl font-serif text-gray-800 leading-relaxed mb-2">
              {sampleVerse.Shloka.split('\n')[1]}
            </p>
            <p className="text-sm text-gray-600 italic">
              {sampleVerse.Transliteration.split('\n')[1]}
            </p>
          </div>
          
          <div className="bg-white/40 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">
              {sampleVerse.EngMeaning.replace('1.1 Dhritarashtra said  ', '')}
            </p>
          </div>
          
          <div className="text-center">
            <span className="inline-block bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              Chapter {sampleVerse.Chapter}, Verse {sampleVerse.Verse}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyVerse;

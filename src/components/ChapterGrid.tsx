
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { chapters } from "@/data/sampleVerse";
import { BookOpen, Circle } from "lucide-react";

const ChapterGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chapters.map((chapter) => (
        <Card 
          key={chapter.number} 
          className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 border-orange-100"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{chapter.number}</span>
                </div>
                <BookOpen className="w-4 h-4 text-orange-600" />
              </div>
              <Circle className="w-4 h-4 text-gray-300" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">
              {chapter.title}
            </h3>
            <p className="text-sm text-orange-700 font-medium mb-2">{chapter.titleSanskrit}</p>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{chapter.summary}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-700">0/{chapter.verseCount}</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChapterGrid;


import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <Card className="bg-white shadow-sm border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

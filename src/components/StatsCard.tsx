import React from "react";
import { TrendingUp } from "lucide-react";
import gitaData from "@/data/Bhagwad_Gita.json";
import { useReadVerses } from "@/hooks/useReadVerses";
import { useTranslation } from '@/hooks/useTranslation';

const StatsCard = () => {
  const { readVerses } = useReadVerses();
  const total = gitaData.length;
  const read = readVerses.length;
  const percent = total > 0 ? Math.round((read / total) * 100) : 0;
  const t = useTranslation();

  return (
    <div className="mobile-card p-6 rounded-2xl shadow flex flex-col items-center text-center bg-white">
      <TrendingUp className="w-8 h-8 text-orange-500 mb-2" />
      <div className="font-bold text-2xl text-orange-900 mb-1">{t('progress')}</div>
      <div className="text-orange-700 text-base mb-4">{read}/{total} {t('readVerses')}</div>
      <div className="w-full">
        <div className="w-full h-3 bg-orange-50 rounded-full overflow-hidden mb-2">
          <div className="h-3 rounded-full bg-orange-200" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between text-xs text-orange-500 font-semibold">
          <span>0%</span>
          <span>{percent}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

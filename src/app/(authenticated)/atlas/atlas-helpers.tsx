import { AtlasOutput, IndicatorList } from "@/datamodels/atlas_model";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const getSignalColor = (type: AtlasOutput['type']): string => {
    switch (type) {
      case 'Bull':
        return 'bg-green-600';
      case 'Bear':
        return 'bg-red-600';
      default:
        return 'bg-yellow-600';
    }
  };
  
export const getSignalIcon = (type: "Bull" | "Bear" | "Neutral") => {
      switch (type) {
        case "Bull":
          return <TrendingUp className="w-5 h-5 text-green-500" />;
        case "Bear":
          return <TrendingDown className="w-5 h-5 text-red-500" />;
        default:
          return <Minus className="w-5 h-5 text-yellow-500" />;
      }
    };

export const parseIndicatorList = (listStr: string): IndicatorList => {
        try {
          return JSON.parse(listStr.replace(/'/g, '"'));
        } catch {
          return {};
        }}
        
      
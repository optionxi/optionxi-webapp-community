import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AtlasOutput } from "@/datamodels/atlas_model";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, Info, Clock,ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";
import { useState } from "react";
import { getSignalIcon, parseIndicatorList } from "./atlas-helpers";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailDialogProps {
  output: AtlasOutput;
}

export const DetailDialog: React.FC<DetailDialogProps> = ({ output }) => {
    const [expandedSections, setExpandedSections] = useState({
      statistics: true,
      direction: true,
      positive: true,
      negative: false,
      neutral: false
    });
  
    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };
  
    const CollapsibleSection = ({ 
      title, 
      icon, 
      section, 
      count,
      children 
    }: { 
      title: string; 
      icon: React.ReactNode; 
      section: keyof typeof expandedSections;
      count?: number;
      color?: string;
      children: React.ReactNode;
    }) => (
      <div className="space-y-4">
        <button 
          onClick={() => toggleSection(section)}
          className="w-full flex items-center gap-2 pb-2 border-b hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors px-2 -mx-2 rounded-t"
        >
          {icon}
          <h3 className="font-semibold text-lg flex-1 text-left">{title} {count !== undefined && `(${count})`}</h3>
          {expandedSections[section] ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        <div className={`space-y-4 transition-all duration-300 ${expandedSections[section] ? 'block' : 'hidden'}`}>
          {children}
        </div>
      </div>
    );
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Info className="w-4 h-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="w-[95%] max-w-2xl mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl flex items-center gap-2">
              {getSignalIcon(output.type)}
              <span>{output.type} Signal Details</span>
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="w-4 h-4" />
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(output.created_at), { addSuffix: true })}
              </p>
              <span>{format(new Date(output.created_at), 'MMM d y h:mm a')}</span>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] md:max-h-[80vh] px-2 md:px-4">
            <div className="space-y-6">
              <CollapsibleSection 
                title="Market Statistics" 
                icon={<Info className="w-5 h-5 text-blue-500" />}
                section="statistics"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-muted-foreground mb-1">Probability</h4>
                    <p className="text-2xl font-bold">{output.probability}%</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-muted-foreground mb-1">Advancing</h4>
                    <p className="text-2xl font-bold text-green-500">{output.advancing}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-muted-foreground mb-1">Declining</h4>
                    <p className="text-2xl font-bold text-red-500">{output.declining}</p>
                  </div>
                </div>
              </CollapsibleSection>
  
              <CollapsibleSection 
                title="Trend Direction" 
                icon={<Info className="w-5 h-5 text-purple-500" />}
                section="direction"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    {getSignalIcon(output.longterm)}
                    <div>
                      <p className="text-sm text-muted-foreground">Long Term</p>
                      <p className="font-medium">{output.longterm}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getSignalIcon(output.shortterm)}
                    <div>
                      <p className="text-sm text-muted-foreground">Short Term</p>
                      <p className="font-medium">{output.shortterm}</p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
  
              <CollapsibleSection 
                title="Positive Indicators" 
                icon={<ArrowUpCircle className="w-5 h-5 text-green-500" />}
                section="positive"
                count={output["Postive Indicators"]}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(parseIndicatorList(output["Postive Indicators List"])).map(([key, value]) => {
                    const formattedKey = key.replace(/Web_|_/g, ' ').trim();
                    return (
                      <div key={key} className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <ArrowUpCircle className="w-4 h-4 text-green-500" />
                        <span>{formattedKey}: <strong>{value}</strong></span>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleSection>
  
              <CollapsibleSection 
                title="Negative Indicators" 
                icon={<ArrowDownCircle className="w-5 h-5 text-red-500" />}
                section="negative"
                count={output["Negative Indicators"]}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(parseIndicatorList(output["Negative Indicators List"])).map(([key, value]) => {
                    const formattedKey = key.replace(/Web_|_/g, ' ').trim();
                    return (
                      <div key={key} className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <ArrowDownCircle className="w-4 h-4 text-red-500" />
                        <span>{formattedKey}: <strong>{value}</strong></span>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleSection>
  
              <CollapsibleSection 
                title="Neutral Indicators" 
                icon={<MinusCircle className="w-5 h-5 text-yellow-500" />}
                section="neutral"
                count={output["Neutral Indicators"]}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(parseIndicatorList(output["Neutral Indicators List"])).map(([key, value]) => {
                    const formattedKey = key.replace(/Web_|_/g, ' ').trim();
                    return (
                      <div key={key} className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                        <MinusCircle className="w-4 h-4 text-yellow-500" />
                        <span>{formattedKey}: <strong>{value}</strong></span>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleSection>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

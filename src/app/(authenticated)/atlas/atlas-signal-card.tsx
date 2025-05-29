import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtlasOutput } from "@/datamodels/atlas_model";
import { format, formatDistanceToNow } from "date-fns";
import { Clock,TrendingUp, TrendingDown } from "lucide-react";
import { DetailDialog } from "./atlas-detail-dialog";
import { getSignalColor, getSignalIcon } from "./atlas-helpers";
import { Badge } from "@/components/ui/badge";
import { getSentimentStyles } from "../alerts/helper-sentiment-styles";

export const SignalCard: React.FC<{ output: AtlasOutput; index: number }> = ({ output, index }) => {
    const totalIndicators = output["Postive Indicators"] + output["Negative Indicators"] + output["Neutral Indicators"];
    const styles = getSentimentStyles(output.type+"ish");
    return (
      <div className="relative">
        <Card className={`${styles.border} overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-gray-800 animate-in slide-in-from-right`}
              style={{ animationDelay: `${index * 100}ms` }}>          
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pl-4">
            <div>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                {getSignalIcon(output.type)}
                <span>{output.type} Signal</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="w-4 h-4" />
                
                <span>{format(new Date(output.created_at), 'MMM d y h:mm a')}</span>
                <span>{formatDistanceToNow(new Date(output.created_at), { addSuffix: true })}</span>

              </div>
            </div>
            <DetailDialog output={output} />
          </CardHeader>
  
          <CardContent className="pl-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Signal Probability</span>
                <Badge className={`${getSignalColor(output.type)} px-3 py-1 pointer-events-none`}>
                  {output.probability}%
                </Badge>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Short Term:</span>
                  {/* <Badge className={`${getSignalColor(output.shortterm)} pointer-events-none`}>
                    {getSignalIcon(output.shortterm)}
                    <span className="ml-1">{output.shortterm}ish</span>
                  </Badge> */}
                  {getSignalIcon(output.shortterm)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Long Term:</span>
                  {/* <Badge className={`${getSignalColor(output.longterm)} pointer-events-none`}>
                    <span className="ml-1">{output.longterm}ish</span>
                  </Badge> */}
                  {getSignalIcon(output.longterm)}
                </div>
              </div>
  
              
  
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                  <p className="text-sm text-muted-foreground">Advancing</p>
                  <p className="text-lg font-semibold text-green-500">{output.advancing}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                  <p className="text-sm text-muted-foreground">Declining</p>
                  <p className="text-lg font-semibold text-red-500">{output.declining}</p>
                </div>
              </div> */}
  
              {(output.upbreakout === 'true' || output.lowbreakout === 'true') && (
                <div className="flex items-center gap-2 pt-2">
                  {output.upbreakout === 'true' && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Up Breakout
                    </Badge>
                  )}
                  {output.lowbreakout === 'true' && (
                    <Badge className="bg-red-500 hover:bg-red-600">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Low Breakout
                    </Badge>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Indicators Distribution</span>
                  <span>{totalIndicators} Total</span>
                </div>
                <div className="h-2 flex rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(output["Postive Indicators"] / totalIndicators) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${(output["Neutral Indicators"] / totalIndicators) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(output["Negative Indicators"] / totalIndicators) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Positive: {output["Postive Indicators"]}</span>
                  <span>Neutral: {output["Neutral Indicators"]}</span>
                  <span>Negative: {output["Negative Indicators"]}</span>
                </div>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>
    );
  };



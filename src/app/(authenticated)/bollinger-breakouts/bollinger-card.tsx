import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react'; // Import trending icons
import { BollingerBreakoutModel } from '@/datamodels/bollinger_model';

interface ModernSentimentCardProps {
  item: BollingerBreakoutModel;
}

const getSentimentColor = (sentiment: 'bullish' | 'bearish'): string => {
  const colors = {
    bullish: 'text-green-600',
    bearish: 'text-red-600'
  };
  return colors[sentiment] || 'text-gray-600';
};

const ModernSentimentCard: React.FC<ModernSentimentCardProps> = ({ item }) => {
  const extractNumberAfterColon = (text: string): string | null => {
    const match = text.match(/:\s*(\d+)/);
    return match ? match[1] : null;
  };

  const hasBreakoutText = item.description.toLowerCase().includes('first breakout');
  const numberValue = extractNumberAfterColon(item.description);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <h3 className={`font-semibold ${getSentimentColor(item.sentiment)}`}>
            {item.sentiment.toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(item.created_at), 'PP p')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-gray-700 dark:text-gray-300">
            {item.description.split(':')[0]}
          </p>
          {numberValue && (
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {numberValue}
            </span>
          )}
          {hasBreakoutText && (
            <>
              {item.sentiment === 'bullish' ? (
                <TrendingUp className="h-5 w-5 text-green-600" /> // Bullish trending up icon
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" /> // Bearish trending down icon
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernSentimentCard;
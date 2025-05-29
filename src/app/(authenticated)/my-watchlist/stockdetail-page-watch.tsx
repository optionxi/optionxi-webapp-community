import { notFound } from 'next/navigation';
import { totalstocks } from '@/datamodels/constants';
import StockDashboardWatchlist from '../stocks/[stockname]/stock-dashboard_watchlist';
import { StockExternalLinksWatchlist } from '../stocks/[stockname]/stock-external-links_watchlist';
import AISummary from './ai-summary';
import StockFinancials from '@/components/db_component/cust_financials';


async function getStockData(stockname: string) {
  const decodedStockname = decodeURIComponent(stockname);
  const formattedStockName = `${decodedStockname}`.toUpperCase();

  const stockData = Object.values(totalstocks).find(
    stock => stock.stock_name.toUpperCase().split(":")[1].split("-")[0] === formattedStockName
  );

  if (!stockData) {
    return null;
  }

  return stockData;
}


export default function StockDetailPageWatchList({ stockname }: {stockname:string}) {

  const stock = getStockData(stockname);
  if (!stock) {
    notFound();
  }
  
  const decodedStockName = decodeURIComponent(stockname);

  return (
    <>
      <br/>
      <StockDashboardWatchlist stockName={decodedStockName} />
      <br/>
      <StockFinancials stockname={decodedStockName}/>
      <br/>
      <AISummary/>
      <br/>
      <StockExternalLinksWatchlist stockName={decodedStockName} />
      <br/>
    
    </>
  );
}

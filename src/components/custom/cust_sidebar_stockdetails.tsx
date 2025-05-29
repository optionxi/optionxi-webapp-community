"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AISummary from "@/app/(authenticated)/my-watchlist/ai-summary";
import StockDashboardSideBar from "@/app/(authenticated)/stocks/[stockname]/stock-dashboard_sidebar";
import { StockExternalLinksSideBar } from "@/app/(authenticated)/stocks/[stockname]/stock-external-links-sidebar";
import StockFinancialsSideBar from "../db_component/cust_financials_sidebar";

export default function StockDetailSideBarPage({ stockname }: { stockname: string }) {
  const router = useRouter();
//   const [stock, setStock] = useState<any>(null);

  useEffect(() => {
    // const decodedStockname = decodeURIComponent(stockname).toUpperCase();

    // const foundStock = Object.values(totalstocks).find(
    //   (stock) => stock.stock_name.toUpperCase().split(":")[1].split("-")[0] === decodedStockname.split(":")[1].split("-")[0]
    // );

    // if (!foundStock) {
    // //   router.replace("/404"); // Redirect to a custom 404 page
    // } else {
    //   setStock(foundStock);
    // }
  }, [stockname, router]);

//   if (!stock) {
//     return null; // Prevent rendering while checking stock data
//   }

  return (
    <>
    <br />
      <StockDashboardSideBar stockName={stockname.split(":")[1].split("-")[0].toUpperCase()} />
      <br/>
      <StockFinancialsSideBar stockname={stockname.split(":")[1].split("-")[0].toUpperCase()}/>
      <br />
      <AISummary />
      <br />
      <StockExternalLinksSideBar stockName={stockname.split(":")[1].split("-")[0].toUpperCase()} />
    </>
  );
}

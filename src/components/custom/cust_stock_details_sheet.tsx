import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import StockDetailSideBarPage from "./cust_sidebar_stockdetails";

interface StockItemProps {
  logoUrl: string;
  title: string;
  price: number;
  priceChange: number;
  percentage: number;
}

interface StockChartDrawerProps extends StockItemProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StockDetailsDrawer: React.FC<StockChartDrawerProps> = ({ open, setOpen, ...props }) => {
  
  const getFormattedSymbol = (title: string) => {
    const parts = title.split('-');
    // console.log("The TradingView stock name is " + `${parts[0]}`);
    return `${parts[0]}`;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="w-full overflow-auto">
              {/* <SheetHeader>
                <SheetTitle>{stockName}</SheetTitle>
              </SheetHeader> */}
              <div className="mt-4">
                <StockDetailSideBarPage stockname={getFormattedSymbol(props.title)}            />
              </div>
            </SheetContent>
          </Sheet>
  );
};

export default StockDetailsDrawer;

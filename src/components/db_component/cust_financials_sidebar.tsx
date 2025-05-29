import { Book } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { CardTitle } from '../ui/card';

interface StockFinancialsProps {
  stockname: string;
}

const StockFinancialsSideBar = ({ stockname }: StockFinancialsProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Book className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold tracking-tight">
            See Financial Summary
          </CardTitle>
        </div>
        <Link href={`/financials/${stockname}`} passHref>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl ml-auto">
            {/* <span className="text-sm font-semibold">View all</span> */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </Link>
      </div>
      <Separator />
    </div>
  );
};

export default StockFinancialsSideBar;

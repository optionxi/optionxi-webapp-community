import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Info} from 'lucide-react';

export function TotalAssetsInfo({ growth }: { growth: number }) {
  const [open, setOpen] = useState(false);
  const dialogContent = `
    What does it indicate?
    Total assets show the company’s overall asset value. Positive growth signals expansion and financial health, while a decline may indicate challenges.

    How is it calculated?
    Growth is calculated as ((Current Assets / Previous Assets) - 1) * 100.

    Status: ${growth > 0 ? "Expansion and financial health" : "Decline may indicate financial challenges"}

    Disclaimer: Data from Yahoo Finance. Verify with the stock exchange before making decisions.
  `;

  return <InfoDialog title="Total Assets" growth={growth} content={dialogContent} open={open} setOpen={setOpen} />;
}

export function DebtToAssetsInfo({ debtToAssets }: { debtToAssets: number }) {
  const [open, setOpen] = useState(false);
  const dialogContent = `
    What does it indicate?
    Measures the portion of assets financed by debt. Higher ratios signal financial leverage risk, while lower ratios suggest conservative finances.

    How is it calculated?
    Formula: (Total Debt / Total Assets) * 100.

    Status: ${debtToAssets > 50 ? "High risk due to leverage" : "Lower risk and stronger financial position"}

    Disclaimer: Data from Yahoo Finance. Verify with the stock exchange before making decisions.
  `;

  return <InfoDialog title="Debt to Assets Ratio" growth={debtToAssets} content={dialogContent} open={open} setOpen={setOpen} />;
}

export function TotalDebtInfo({ growth }: { growth: number }) {
  const [open, setOpen] = useState(false);
  const dialogContent = `
    What does it indicate?
    Total debt reflects the company's borrowing level. Significant debt growth signals potential stress, while debt reduction shows improvement.

    How is it calculated?
    Growth is calculated as ((Current Debt / Previous Debt) - 1) * 100.

    Status: ${growth > 20 ? "High debt growth, potential risk" : growth < 0 ? "Debt reduction, strong position" : "Balanced management of debt"}

    Disclaimer: Data from Yahoo Finance. Verify with the stock exchange before making decisions.
  `;

  return <InfoDialog title="Total Debt" growth={growth} content={dialogContent} open={open} setOpen={setOpen} />;
}

export function WorkingCapitalInfo({ growth }: { growth: number }) {
  const [open, setOpen] = useState(false);
  const dialogContent = `
    What does it indicate?
    Shows the company’s ability to cover short-term obligations. Positive growth indicates strong operational health, while negative growth may signal liquidity issues.

    How is it calculated?
    Growth is calculated as ((Current Capital / Previous Capital) - 1) * 100.

    Status: ${growth > 0 ? "Improved operational health" : "Liquidity concerns"}

    Disclaimer: Data from Yahoo Finance. Verify with the stock exchange before making decisions.
  `;

  return <InfoDialog title="Working Capital" growth={growth} content={dialogContent} open={open} setOpen={setOpen} />;
}

export function StockholdersEquityInfo({ growth }: { growth: number }) {
  const [open, setOpen] = useState(false);
  const dialogContent = `
    What does it indicate?
    Reflects ownership value in the company. Growth suggests profitability or capital investment, while a decline may indicate financial issues.

    How is it calculated?
    Growth is calculated as ((Current Equity / Previous Equity) - 1) * 100.

    Status: ${growth > 0 ? "Strong profitability and financial health" : "Financial issues may be present"}

    Disclaimer: Data from Yahoo Finance. Verify with the stock exchange before making decisions.
  `;

  return <InfoDialog title="Stockholders Equity" growth={growth} content={dialogContent} open={open} setOpen={setOpen} />;
}

export function CurrentRatioInfo({ ratio }: { ratio: number }) {
  const [open, setOpen] = useState(false);
  const dialogContent = `
    What does it indicate?
    Measures the company’s ability to cover short-term liabilities. A higher ratio suggests strong liquidity, while a lower ratio points to potential concerns.

    How is it calculated?
    Formula: (Current Assets / Current Liabilities).

    Status: ${ratio > 2 ? "Strong liquidity" : ratio < 1 ? "Liquidity concerns" : "Moderate liquidity"}

    Disclaimer: Data from Yahoo Finance. Verify with the stock exchange before making decisions.
  `;

  return <InfoDialog title="Current Ratio" growth={ratio} content={dialogContent} open={open} setOpen={setOpen} />;
}

function InfoDialog({ title, content, open, setOpen }: { title: string; growth: number; content: string; open: boolean; setOpen: (open: boolean) => void }) {
    return (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full p-2.5 hover:bg-gray-100/80 hover:ring-2 hover:ring-gray-200 dark:hover:bg-gray-800/80 dark:hover:ring-gray-700 transition-all duration-300"
            onClick={() => setOpen(true)}
            aria-label="Show information"
          >
            <Info className="w-5 h-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
          </Button>
    
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md rounded-2xl border-0 shadow-xl bg-white dark:bg-gray-900 p-6 sm:p-8">
            <DialogHeader className="space-y-4">
                <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                {title}
                </DialogTitle>
                
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <DialogDescription className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 text-left">
                    {content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                    ))}
                </DialogDescription>
                </div>
            </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      );
}

export default {
  TotalAssetsInfo,
  TotalDebtInfo,
  StockholdersEquityInfo,
  CurrentRatioInfo
};
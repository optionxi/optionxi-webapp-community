import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users } from "lucide-react";

export function StockDetailTab() {

    return <Tabs defaultValue="stock" className="space-y-4">
    <TabsList className="flex flex-wrap gap-2">        
        <TabsTrigger value="stock">Stock Performance</TabsTrigger>
        <TabsTrigger value="financial">Financial Summary</TabsTrigger>
        <TabsTrigger value="business">Business Operations</TabsTrigger>
        <TabsTrigger value="management">Management</TabsTrigger>
      </TabsList>
    
      <TabsContent value="stock" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Price Evolution</CardTitle>
            <CardDescription>Historical price movement from 2014 to present</CardDescription>
          </CardHeader>
          {/* {StockChart(stockPriceData)} */}
        </Card>  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">52-Week High</span>
                <span className="font-medium">₹1,608.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">52-Week Low</span>
                <span className="font-medium">₹1,149.02</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">50-Day Average</span>
                <span className="font-medium">₹1,430</span>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Dividends & Splits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dividend Yield</span>
                <span className="font-medium">0.38%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payout Ratio</span>
                <span className="font-medium">9.96%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recent Split</span>
                <span className="font-medium">2:1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
  
      <TabsContent value="financial" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Ratios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROA</span>
                <span className="font-medium">3.87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROE</span>
                <span className="font-medium">8.48%</span>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Debt Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Debt to Equity</span>
                <span className="font-medium">37.46%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Ratio</span>
                <span className="font-medium">1.08</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
  
      <TabsContent value="business">
        <Card>
          <CardHeader>
            <CardTitle>Business Segments</CardTitle>
            <CardDescription>Major operational divisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Oil & Gas</h3>
                <p className="text-sm text-muted-foreground">Refining and marketing operations</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Retail</h3>
                <p className="text-sm text-muted-foreground">Consumer retail operations</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Digital Services</h3>
                <p className="text-sm text-muted-foreground">Jio telecom services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
  
      <TabsContent value="management">
        <Card>
          <CardHeader>
            <CardTitle>Leadership & Governance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Executive Leadership</h3>
                <p className="text-sm text-muted-foreground">Led by Mukesh Ambani with experienced sector veterans</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Governance Risk</h3>
                <p className="text-sm text-muted-foreground">Higher governance risk score in audit and board areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>;
  }
'use client';

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import Link from "next/link";
import { getMenuList } from "@/lib/menu-list";

// Define type for tool item
type ToolItem = {
  name: string;
  icon: React.ReactNode;
  link: string;
  description: string;
  category: string;
  hasSubmenu: boolean;
  color: string;
};

const ToggleTools = () => {
  // Get all trading tools from menu list
  const menuList = getMenuList();
  
  // Extract the trading tools group
  const tradingToolsGroup = menuList.find(group => group.groupLabel === "Trading Tools");
  
  // Define routes to exclude
  // const excludedRoutes = ["/alerts", "/scanners", "/bollinger-breakouts","/atlas"];
  const excludedRoutes = [""];
  
  // Handle the case where tradingToolsGroup might be undefined
  const tools: ToolItem[] = tradingToolsGroup ? tradingToolsGroup.menus
  .filter(menu => menu.href === "" || !excludedRoutes.includes(menu.href)) // Filter out excluded routes
    .map((menu, index) => {
      return {
        name: menu.label,
        icon: <menu.icon className="h-4 w-4" />,
        link: menu.href || (menu.submenus && menu.submenus.length > 0 ? menu.submenus[0].href : "#"),
        description: getToolDescription(menu.label),
        category: getToolCategory(menu.label),
        hasSubmenu: Boolean(menu.submenus && menu.submenus.length > 0),
        color: getToolColor(menu.label, index)
      };
    }) : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mb-6"
    >
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-1 pt-3">
          {/* <CardTitle className="text-lg font-semibold">Trading Tools</CardTitle> */}
          {/* <CardDescription className="text-xs">Essential market analysis tools</CardDescription> */}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap justify-center gap-2">
            {tools.map((tool, index) => (
              <Link 
                key={index} 
                href={tool.link}
                className="no-underline"
              >
                <motion.div 
                  initial={{ opacity: 1, y: 10 }}
                  // animate={{ 
                  //   opacity: 1, 
                  //   y: 0,
                  //   transition: { delay: 0.03 * index }
                  // }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backgroundColor: tool.color }}
                  className={`flex items-center px-3 py-1.5 rounded-full border border-white/10 
                           shadow-sm transition-all cursor-pointer group`}
                >
                  <div className="mr-1.5">
                    {tool.icon}
                  </div>
                  <span className="text-xs font-medium text-white">{tool.name}</span>
                  {tool.hasSubmenu && (
                    <span className="ml-1 text-xs font-bold text-white/80">+</span>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to get descriptions for tools
function getToolDescription(label: string): string {
  const descriptions: Record<string, string> = {
    "Top Gainers": "Stocks with highest price increase",
    "Top Losers": "Stocks with biggest price decrease",
    "Top Volume": "Highest trading volume stocks",
    "Heat Map": "Visual representation of market trends",
    "Screeners": "Filter stocks by custom criteria",
    "Scanners": "Real-time market opportunities",
    "Market Sentiment": "Analyze market mood and trends",
    "Breakouts": "Stocks breaking resistance levels",
    "Stock Alerts": "Get notified on price movements"
  };
  
  return descriptions[label] || "Access trading insights";
}

// Helper function to categorize tools
function getToolCategory(label: string): string {
  const categories: Record<string, string> = {
    "Top Gainers": "Analysis",
    "Top Losers": "Analysis",
    "Top Volume": "Analysis",
    "Heat Map": "Visual",
    "Screeners": "Filter",
    "Scanners": "Discovery",
    "Market Sentiment": "Trends",
    "Breakouts": "Technical",
    "Stock Alerts": "Notification"
  };
  
  return categories[label] || "";
}

// Helper function to assign colors to tools
function getToolColor(label: string, index: number): string {
  const colors: Record<string, string> = {
    "Top Gainers": "#10b981", // green
    "Top Losers": "#ef4444", // red
    "Top Volume": "#6366f1", // indigo
    "Heat Map": "#f59e0b", // amber
    "Screeners": "#8b5cf6", // violet
    "Scanners": "#3b82f6", // blue
    "Market Sentiment": "#ec4899", // pink
    "Breakouts": "#06b6d4", // cyan
    "Stock Alerts": "#f97316", // orange
  };
  
  // Return specific color if available, otherwise use a gradient based on index
  return colors[label] || `hsla(${(index * 40) % 360}, 85%, 45%, 1)`;
}

export default ToggleTools;
import {
  Settings,
  PenToolIcon,
  LayoutGrid,
  LucideIcon,
  ChartArea,
  // Book,
  Heart,
  BellRing,
  Filter,
  TrendingUpDown,
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  BookOpenText,
  // ListTodo,
  BarChart2Icon,
  ChartNetwork,
  Telescope,
  User,
  // Brain,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  target?: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  target?: string;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        },
        // {
        //   href: "/my-watchlist",
        //   label: "My Watchlist",
        //   icon: ListTodo,
        //   submenus: []
        // },
        // {
        //   href: "/ai-assistant",
        //   label: "AI Assistant",
        //   icon: Brain,
        //   submenus: []
        // }
      ]
    },
    {
      groupLabel: "Trading Tools",
      menus: [
        {
          href: "",
          label: "Top Gainers",
          icon: ArrowUpNarrowWideIcon,
          submenus: [
            {
              href: "/top-gainers?category=ALL",
              label: "All Stocks"
            },
            {
              href: "/top-gainers?category=NIFTY50",
              label: "Nifty 50"
            },
            // {
            //   href: "/top-gainers/?category=NIFTY100",
            //   label: "Nifty 100"
            // },
            {
              href: "/top-gainers/?category=NIFTY200",
              label: "Nifty 200"
            }
          ]
        },
        {
          href: "",
          label: "Top Losers",
          icon: ArrowDownNarrowWideIcon,
          submenus: [
            {
              href: "/top-losers/",
              label: "All Stocks"
            },
            {
              href: "/top-losers/?category=NIFTY50",
              label: "Nifty 50"
            },
            // {
            //   href: "/top-losers/?category=NIFTY100",
            //   label: "Nifty 100"
            // },
            {
              href: "/top-losers/?category=NIFTY200",
              label: "Nifty 200"
            }
          ]
        },
        {
          href: "",
          label: "Top Volume",
          icon: BarChart2Icon,
          submenus: [
            {
              href: "/top-volume/",
              label: "All Stocks"
            },
            {
              href: "/top-volume/?category=NIFTY50",
              label: "Nifty 50"
            },
            // {
            //   href: "/top-volume/?category=NIFTY100",
            //   label: "Nifty 100"
            // },
            {
              href: "/top-volume/?category=NIFTY200",
              label: "Nifty 200"
            }
          ]
        },
        {
          href: "/heatmap",
          label: "Heat Map",
          icon: ChartArea
        },
        {
          href: "/screeners",
          label: "Screeners",
          icon: Filter
        },
        {
          href: "/scanners",
          label: "Scanners",
          icon: TrendingUpDown
        },
        {
          href: "/atlas",
          label: "Market Sentiment",
          icon: ChartNetwork,
        },
        {
          href: "/bollinger-breakouts",
          label: "Breakouts",
          icon: BellRing,
        },
        {
          href: "/alerts",
          label: "Stock Alerts",
          icon: BellRing
        },
      ]
    },
    {
      groupLabel: "Advanced",
      menus: [
        // {
        //   href: "https://docs.optionxi.com",
        //   label: "Docs",
        //   icon: Book,
        //   target: "_blank",  // Add this line
        // },
        // {
        //   href: "https://status.optionxi.com",
        //   label: "Health Check",
        //   icon: Heart,
        //   target: "_blank",  // Add this line
        // },
        {
          href: "https://health.optionxi.com",
          label: "Health Status",
          icon: Heart,
          target: "_blank",  // Add this line
        },
        {
          href: "/feature-request",
          label: "Feature Request",
          icon: PenToolIcon,
          target: "_blank",  // Add this line
        },
        {
          href: "https://optionxi.canny.io/",
          label: "RoadMap",
          icon: Telescope,
          target: "_blank",  // Add this line
        },
        {
          href: "https://optionxi.com/blogs",
          label: "Blogs",
          icon: BookOpenText,
          target: "_blank",  // Add this line
        },
      ]
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "/profile",
          label: "Profile",
          icon: User
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Settings
        }
      ]
    }
  ];
}

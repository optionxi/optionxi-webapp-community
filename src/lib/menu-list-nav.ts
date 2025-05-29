import {
  // ListTodo,
  Filter,
  TrendingUpDown,
  BellRing,
  LucideIcon,
  GaugeCircle,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  BarChart2,
  ChartArea,
  ScanLine,
  Zap,
  User,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  target?: string;
  active?: boolean;
  icon?: LucideIcon;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  target?: string;
  submenus?: Submenu[];
};

export function getMenuListNavbar(): Menu[] {
  return [
    {
      href: "/alerts",
      label: "Alerts",
      icon: BellRing,
      submenus: [],
    },
    {
      href: "/tools",
      label: "Tools",
      icon: Filter,
      submenus: [
        {
          href: "/top-gainers",
          label: "Top Gainers",
          icon: ArrowUpNarrowWide,
        },
        {
          href: "/top-losers",
          label: "Top Losers",
          icon: ArrowDownNarrowWide,
        },
        {
          href: "/top-volume",
          label: "Top Volume",
          icon: BarChart2,
        },
        {
          href: "/heatmap",
          label: "Heatmap",
          icon: ChartArea,
        },
      ],
    },
    {
      href: "/scanners",
      label: "Scanners",
      icon: TrendingUpDown,
      submenus: [
        {
          href: "/screeners",
          label: "Screeners",
          icon: Filter,
        },
        {
          href: "/scanners",
          label: "Scanners",
          icon: ScanLine,
        },
        {
          href: "/bollinger-breakouts",
          label: "Breakouts",
          icon: Zap,
        },
       
      ],
    },
    // {
    //   href: "/my-watchlist",
    //   label: "Watchlist",
    //   icon: ListTodo,
    //   submenus: [],
    // },
    {
      href: "/atlas",
      label: "Trend",
      icon: GaugeCircle,
      submenus: [],
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      submenus: [],
    },
  ];
}
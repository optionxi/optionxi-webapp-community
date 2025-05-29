import { useEffect } from "react";

const TradingViewWidgetFinanicial: React.FC<{ symbol: string }> = ({ symbol }) => {
    useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "isTransparent": false,
        "largeChartUrl": "",
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "colorTheme": "dark",
        "symbol": symbol,
        "locale": "en"
      });
  
      const widgetContainer = document.querySelector('.tradingview-widget-container__widget');
      if (widgetContainer) {
        widgetContainer.appendChild(script);
      }
  
      return () => {
        if (widgetContainer && widgetContainer.contains(script)) {
          widgetContainer.removeChild(script);
        }
      };
    }, [symbol]);
  
    return (
      <div className="tradingview-widget-container h-full">
        <div className="tradingview-widget-container__widget h-full"></div>
        <div className="tradingview-widget-copyright">
          <a href="https://in.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    );
  };

  export default TradingViewWidgetFinanicial;
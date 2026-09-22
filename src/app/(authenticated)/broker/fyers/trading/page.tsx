import { ContentLayout } from "@/components/admin-panel/content-layout";
import FyersTradingHomePage from "./trading_home";

export default function BrokerTradingPage() {
  return (
    <ContentLayout title="Broker Fyers Trading Page">
      <FyersTradingHomePage />
    </ContentLayout>
  );
}
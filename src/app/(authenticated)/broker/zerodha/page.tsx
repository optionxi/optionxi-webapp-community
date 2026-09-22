import { ContentLayout } from "@/components/admin-panel/content-layout";
import ZerodhaConnect from "./zerodha_connect_page";

export default function BrokerRedirectPage() {
  return (
    <ContentLayout title="Broker Redirect Zerodha">
      <ZerodhaConnect/>
    </ContentLayout>
  );
}
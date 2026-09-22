import { ContentLayout } from "@/components/admin-panel/content-layout";
import UpstoxConnect from "./upstox_connect_page";

export default function BrokerRedirectPage() {
  return (
    <ContentLayout title="Broker Redirect Upstox">
      <UpstoxConnect/>
    </ContentLayout>
  );
}
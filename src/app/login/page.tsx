import { ContentLayout } from "@/components/admin-panel/content-layout";
import LandingLoginPage from "./landing-sign-in";

export default function LoginPage() {
  return (
    <ContentLayout title="Login">
      <LandingLoginPage/>
    </ContentLayout>
  );
}
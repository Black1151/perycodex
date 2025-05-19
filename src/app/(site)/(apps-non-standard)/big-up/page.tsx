import { ToolLandingPage } from "@/app/(site)/(apps)/ToolLandingPageInner";
import { RecognitionHubSplashScreen } from "./BigUpSplashScreen";

export default async function Home() {
  const redirectUrl = "/big-up/app";

  return (
    <ToolLandingPage
      redirectUrl={redirectUrl}
      splashScreen={<RecognitionHubSplashScreen />}
    />
  );
}

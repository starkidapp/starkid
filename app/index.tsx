import { useRouter } from "expo-router";
import { useEffect } from "react";
import ThemeSplash from "../components/ThemeSplash";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/LoginScreen");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return <ThemeSplash />;
}

"use client";
import AppFooter from "@/components/app-footer/app-footer";
import AppHeader from "@/components/app-header/app-header";
import '@globals';
import HomeMain from "./components/home-main/home-main";

export default function HomePage() {
  return (
    <div className="body-content">
      <AppHeader></AppHeader>
      <HomeMain></HomeMain>
      <AppFooter></AppFooter>
    </div>
  );
}

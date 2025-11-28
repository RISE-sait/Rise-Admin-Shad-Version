"use client";

import React, { useCallback, useEffect, useState } from "react";
import { HeroPromo, FeatureCard, PromoVideo } from "@/types/website-promo";
import { Button } from "@/components/ui/button";
import RightDrawer from "@/components/reusable/RightDrawer";
import { PlusIcon, Image, LayoutGrid, RefreshCw, Video } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { getAllHeroPromos, getAllFeatureCards, getAllPromoVideos } from "@/services/website-promo";
import HeroPromoTable from "./HeroPromoTable";
import FeatureCardTable from "./FeatureCardTable";
import PromoVideoTable from "./PromoVideoTable";
import HeroPromoForm from "./HeroPromoForm";
import FeatureCardForm from "./FeatureCardForm";
import PromoVideoForm from "./PromoVideoForm";
import HeroPromoInfoPanel from "./HeroPromoInfoPanel";
import FeatureCardInfoPanel from "./FeatureCardInfoPanel";
import PromoVideoInfoPanel from "./PromoVideoInfoPanel";
import { toast } from "sonner";

type DrawerContent =
  | "hero-details"
  | "hero-add"
  | "feature-details"
  | "feature-add"
  | "video-details"
  | "video-add"
  | null;

export default function WebsiteContentPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("hero-promos");

  // Hero Promos state
  const [heroPromos, setHeroPromos] = useState<HeroPromo[]>([]);
  const [selectedHeroPromo, setSelectedHeroPromo] = useState<HeroPromo | null>(null);

  // Feature Cards state
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [selectedFeatureCard, setSelectedFeatureCard] = useState<FeatureCard | null>(null);

  // Promo Videos state
  const [promoVideos, setPromoVideos] = useState<PromoVideo[]>([]);
  const [selectedPromoVideo, setSelectedPromoVideo] = useState<PromoVideo | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);

  // Loading states
  const [isLoadingHero, setIsLoadingHero] = useState(true);
  const [isLoadingFeature, setIsLoadingFeature] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch hero promos
  const fetchHeroPromos = useCallback(async () => {
    if (!user?.Jwt) return;
    try {
      const data = await getAllHeroPromos(user.Jwt);
      setHeroPromos(data);
    } catch (error) {
      console.error("Failed to fetch hero promos:", error);
      toast.error("Failed to load hero promos");
    } finally {
      setIsLoadingHero(false);
    }
  }, [user?.Jwt]);

  // Fetch feature cards
  const fetchFeatureCards = useCallback(async () => {
    if (!user?.Jwt) return;
    try {
      const data = await getAllFeatureCards(user.Jwt);
      setFeatureCards(data);
    } catch (error) {
      console.error("Failed to fetch feature cards:", error);
      toast.error("Failed to load feature cards");
    } finally {
      setIsLoadingFeature(false);
    }
  }, [user?.Jwt]);

  // Fetch promo videos
  const fetchPromoVideos = useCallback(async () => {
    if (!user?.Jwt) return;
    try {
      const data = await getAllPromoVideos(user.Jwt);
      setPromoVideos(data);
    } catch (error) {
      console.error("Failed to fetch promo videos:", error);
      toast.error("Failed to load promo videos");
    } finally {
      setIsLoadingVideo(false);
    }
  }, [user?.Jwt]);

  useEffect(() => {
    fetchHeroPromos();
    fetchFeatureCards();
    fetchPromoVideos();
  }, [fetchHeroPromos, fetchFeatureCards, fetchPromoVideos]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchHeroPromos(), fetchFeatureCards(), fetchPromoVideos()]);
    setIsRefreshing(false);
    toast.success("Content refreshed");
  };

  const handleHeroPromoSelect = useCallback((promo: HeroPromo) => {
    setSelectedHeroPromo(promo);
    setDrawerContent("hero-details");
    setDrawerOpen(true);
  }, []);

  const handleFeatureCardSelect = useCallback((card: FeatureCard) => {
    setSelectedFeatureCard(card);
    setDrawerContent("feature-details");
    setDrawerOpen(true);
  }, []);

  const handlePromoVideoSelect = useCallback((video: PromoVideo) => {
    setSelectedPromoVideo(video);
    setDrawerContent("video-details");
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setDrawerContent(null);
    setSelectedHeroPromo(null);
    setSelectedFeatureCard(null);
    setSelectedPromoVideo(null);
  }, []);

  const handleAfterMutation = useCallback(async () => {
    await Promise.all([fetchHeroPromos(), fetchFeatureCards(), fetchPromoVideos()]);
  }, [fetchHeroPromos, fetchFeatureCards, fetchPromoVideos]);

  const getDrawerWidth = () => {
    if (drawerContent === "hero-details" || drawerContent === "feature-details" || drawerContent === "video-details") {
      return "w-[60%]";
    }
    return "w-[40%]";
  };

  const getDrawerTitle = () => {
    switch (drawerContent) {
      case "hero-details":
        return "Hero Promo Details";
      case "hero-add":
        return "Add Hero Promo";
      case "feature-details":
        return "Feature Card Details";
      case "feature-add":
        return "Add Feature Card";
      case "video-details":
        return "Promo Video Details";
      case "video-add":
        return "Add Promo Video";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Website Content"
          description="Manage hero banners, feature cards, and promo videos displayed on the website"
        />
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="hero-promos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Hero Promos
            </TabsTrigger>
            <TabsTrigger value="feature-cards" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Feature Cards
            </TabsTrigger>
            <TabsTrigger value="promo-videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Promo Videos
            </TabsTrigger>
          </TabsList>

          {activeTab === "hero-promos" && (
            <Button
              onClick={() => {
                setDrawerContent("hero-add");
                setDrawerOpen(true);
              }}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              <PlusIcon className="h-4 w-4" />
              Add Hero Promo
            </Button>
          )}

          {activeTab === "feature-cards" && (
            <Button
              onClick={() => {
                setDrawerContent("feature-add");
                setDrawerOpen(true);
              }}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              <PlusIcon className="h-4 w-4" />
              Add Feature Card
            </Button>
          )}

          {activeTab === "promo-videos" && (
            <Button
              onClick={() => {
                setDrawerContent("video-add");
                setDrawerOpen(true);
              }}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              <PlusIcon className="h-4 w-4" />
              Add Promo Video
            </Button>
          )}
        </div>

        <TabsContent value="hero-promos" className="mt-4">
          <HeroPromoTable
            heroPromos={heroPromos}
            onSelect={handleHeroPromoSelect}
            isLoading={isLoadingHero}
          />
        </TabsContent>

        <TabsContent value="feature-cards" className="mt-4">
          <FeatureCardTable
            featureCards={featureCards}
            onSelect={handleFeatureCardSelect}
            isLoading={isLoadingFeature}
          />
        </TabsContent>

        <TabsContent value="promo-videos" className="mt-4">
          <PromoVideoTable
            promoVideos={promoVideos}
            onSelect={handlePromoVideoSelect}
            isLoading={isLoadingVideo}
          />
        </TabsContent>
      </Tabs>

      <RightDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        drawerWidth={getDrawerWidth()}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {getDrawerTitle()}
          </h2>

          {drawerContent === "hero-add" && (
            <HeroPromoForm
              onSuccess={async () => {
                await handleAfterMutation();
                handleDrawerClose();
              }}
            />
          )}

          {drawerContent === "hero-details" && selectedHeroPromo && (
            <HeroPromoInfoPanel
              heroPromo={selectedHeroPromo}
              onClose={handleDrawerClose}
              onSuccess={handleAfterMutation}
            />
          )}

          {drawerContent === "feature-add" && (
            <FeatureCardForm
              onSuccess={async () => {
                await handleAfterMutation();
                handleDrawerClose();
              }}
            />
          )}

          {drawerContent === "feature-details" && selectedFeatureCard && (
            <FeatureCardInfoPanel
              featureCard={selectedFeatureCard}
              onClose={handleDrawerClose}
              onSuccess={handleAfterMutation}
            />
          )}

          {drawerContent === "video-add" && (
            <PromoVideoForm
              onSuccess={async () => {
                await handleAfterMutation();
                handleDrawerClose();
              }}
            />
          )}

          {drawerContent === "video-details" && selectedPromoVideo && (
            <PromoVideoInfoPanel
              promoVideo={selectedPromoVideo}
              onClose={handleDrawerClose}
              onSuccess={handleAfterMutation}
            />
          )}
        </div>
      </RightDrawer>
    </div>
  );
}

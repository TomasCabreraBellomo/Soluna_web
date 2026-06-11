import { BraceletBuilderSection } from "@/components/home/BraceletBuilderSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { EmotionalSection } from "@/components/home/EmotionalSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { GiftBanner } from "@/components/home/GiftBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedCategories />
      <EmotionalSection />
      <FeaturedProducts />
      <BraceletBuilderSection />
      <BenefitsSection />
      <InstagramSection />
      <TestimonialsSection />
      <GiftBanner />
    </PublicLayout>
  );
}

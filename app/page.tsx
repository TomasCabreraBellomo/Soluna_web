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
import { getStoreCategories, getStoreProducts } from "@/lib/db-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getStoreProducts(), getStoreCategories()]);

  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedCategories categories={categories} />
      <EmotionalSection />
      <FeaturedProducts products={products} />
      <BraceletBuilderSection />
      <BenefitsSection />
      <InstagramSection />
      <TestimonialsSection />
      <GiftBanner />
    </PublicLayout>
  );
}

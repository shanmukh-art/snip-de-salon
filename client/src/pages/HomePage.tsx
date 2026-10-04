import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedServices } from '../components/home/FeaturedServices';
import { AboutSection } from '../components/home/AboutSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { PackagesSection } from '../components/home/PackagesSection';
import { ProductShowcase } from '../components/home/ProductShowcase';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { SocialGallery } from '../components/home/SocialGallery';
import { LocationContactPreview } from '../components/home/LocationContactPreview';
import { BookingCTA } from '../components/home/BookingCTA';
import { MultiStepBookingModal } from '../components/booking/MultiStepBookingModal';
import { Service } from '../types';

export function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenBookingWithService = (service: Service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  const handleOpenBookingGeneral = () => {
    setSelectedService(null);
    setBookingOpen(true);
  };

  return (
    <div className="space-y-4">
      <HeroSection onOpenBooking={handleOpenBookingGeneral} />
      <FeaturedServices onSelectService={handleOpenBookingWithService} />
      <AboutSection />
      <WhyChooseUs />
      <PackagesSection onOpenBooking={handleOpenBookingGeneral} />
      <ProductShowcase />
      <TestimonialsSection />
      <SocialGallery />
      <LocationContactPreview />
      <BookingCTA onOpenBooking={handleOpenBookingGeneral} />

      <MultiStepBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preSelectedService={selectedService}
      />
    </div>
  );
}

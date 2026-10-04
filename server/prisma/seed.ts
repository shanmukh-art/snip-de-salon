import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Snip De Salon...');

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      salonName: 'Snip De Salon',
      tagline: 'Luxury Beauty, Hair & Wellness Sanctuary',
      phone: '+91 891 234 5678',
      email: 'concierge@snipdesalon.com',
      address: 'Near Apollo Pharmacy, Main Road, Sujatha Nagar',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      postalCode: '530051',
      country: 'India',
      openingHours: 'Monday - Sunday: 09:00 AM - 08:30 PM',
      googleMapsUrl: 'https://maps.google.com/?q=Sujatha+Nagar+Visakhapatnam',
      instagramUrl: 'https://instagram.com/snipdesalon',
      facebookUrl: 'https://facebook.com/snipdesalon',
      whatsappNumber: '+919876543210',
      bookingNotice: 'Please arrive 10 minutes prior to your bespoke service time.',
      cancellationPolicyHours: 2,
      currencySymbol: '₹',
      taxRatePercent: 18.0,
    },
  });

  // 2. Admin User
  const adminPassword = process.env.ADMIN_PASSWORD || 'SalonAdmin2026!';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@snipdesalon.com';

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: 'Snip De Salon Concierge Admin',
      phone: '+91 891 234 5678',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created/verified:', adminUser.email);

  // 3. Customer User
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'sneha.reddy@example.com' },
    update: {},
    create: {
      email: 'sneha.reddy@example.com',
      passwordHash: customerPassword,
      name: 'Sneha Reddy',
      phone: '+91 98480 12345',
      role: 'CUSTOMER',
      customerProfile: {
        create: {
          address: 'Villa 14, Palm Grove, Sujatha Nagar, Visakhapatnam',
          notes: 'Prefers organic and sensitive skin products',
        },
      },
    },
    include: {
      customerProfile: true,
    },
  });

  const customerProfileId = customerUser.customerProfile?.id!;

  // 4. Service Categories
  const categoriesData = [
    {
      name: 'Hair Services',
      slug: 'hair-services',
      description: 'Couture cuts, bespoke styling, keratin therapy, and luxury hair spa rituals.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      orderIndex: 1,
    },
    {
      name: 'Facial & Skin Care',
      slug: 'facial-skin-care',
      description: 'Dermatologist-grade facials, botanical hydra infusions, and anti-aging therapies.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      orderIndex: 2,
    },
    {
      name: 'Makeup & Bridal',
      slug: 'makeup-bridal',
      description: 'Red-carpet glam, HD bridal masterstrokes, and pre-wedding glow packages.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      orderIndex: 3,
    },
    {
      name: 'Nails & Hand Care',
      slug: 'nails-hand-care',
      description: 'Gel extensions, French manicure, paraffin dips, and Russian precision nail care.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      orderIndex: 4,
    },
    {
      name: 'Spa & Wellness Rituals',
      slug: 'spa-wellness',
      description: 'Aromatherapy body massages, deep-tissue therapy, and detoxifying scrubs.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      orderIndex: 5,
    },
    {
      name: 'Waxing & Body Silking',
      slug: 'waxing-body-silking',
      description: 'Painless Rica waxing, Brazilian chocolate wax, and body smoothening polish.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      orderIndex: 6,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  // 5. Services
  const servicesData = [
    {
      name: 'Signature Royal Hair Spa & Scalp Detox',
      slug: 'signature-royal-hair-spa',
      categorySlug: 'hair-services',
      description: 'An indulgent 7-step restorative hair treatment with Moroccan argan oil infusion, steam therapy, and tension-relieving shoulder massage.',
      benefits: 'Deep follicle nourishment\nFrizz reduction & intense shine\nRelieves scalp tension & stress',
      durationMinutes: 60,
      price: 2499,
      originalPrice: 3200,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Couture Precision Cut & Blowdry Styling',
      slug: 'couture-precision-cut',
      categorySlug: 'hair-services',
      description: 'Personalized consultation, luxury hair wash, custom precision haircut tailored to your bone structure, finished with runway blowdry.',
      benefits: 'Flattering custom silhouette\nAdds natural bounce and volume\nThermal protection finish',
      durationMinutes: 45,
      price: 1499,
      originalPrice: 1800,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Balayage & Bespoke French Gloss',
      slug: 'balayage-french-gloss',
      categorySlug: 'hair-services',
      description: 'Hand-painted dimensional sun-kissed highlights blended with ammonia-free Italian tones for seamless, luminous color transitions.',
      benefits: 'Zero harsh demarcation lines\nUltra-glossy conditioning finish\nTailored to your undertones',
      durationMinutes: 120,
      price: 5999,
      originalPrice: 7500,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Hydra-Luxe 24K Gold Cellular Facial',
      slug: 'hydra-luxe-24k-gold-facial',
      categorySlug: 'facial-skin-care',
      description: 'Ultra-luxurious revitalizing facial combining ultrasonic exfoliation, pure 24-karat gold leaf sheet, and hyaluronic acid peptide infusion.',
      benefits: 'Instant luminous bridal radiance\nBoosts collagen elasticity\nHydrates deep epidermal layers',
      durationMinutes: 75,
      price: 3499,
      originalPrice: 4500,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'O2 Glass Skin Oxygen Therapy',
      slug: 'o2-glass-skin-therapy',
      categorySlug: 'facial-skin-care',
      description: 'Medical-grade hyperbaric oxygen mist delivering active vitamins A, C, and E directly into skin for that coveted Korean glass finish.',
      benefits: 'Decongests pores and calms inflammation\nRefines rough skin texture\nDewy, poreless glow',
      durationMinutes: 60,
      price: 2899,
      originalPrice: 3500,
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1512290900672-1f0230a0edec?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Luxury HD Bridal Makeover & Draping',
      slug: 'luxury-hd-bridal-makeover',
      categorySlug: 'makeup-bridal',
      description: 'Flawless 18-hour waterproof high-definition makeup application, luxury mink eyelashes, designer saree/lehenga draping, and flower setting.',
      benefits: 'Camera-ready high definition\nPerspiration-resistant long wear\nIncludes trial consultation',
      durationMinutes: 150,
      price: 14999,
      originalPrice: 18000,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Cocktail & Evening Glam Makeup',
      slug: 'cocktail-evening-glam-makeup',
      categorySlug: 'makeup-bridal',
      description: 'Sultry smoky eyes or classic cut crease with radiant strobe glow, sculpting contour, and long-lasting matte lip contouring.',
      benefits: 'Elevates any party or celebration look\nCustomized to your outfit\nComplimentary lash extension strip',
      durationMinutes: 75,
      price: 3999,
      originalPrice: 4800,
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Luxe Champagne Gel Manicure & Pedicure',
      slug: 'luxe-champagne-mani-pedi',
      categorySlug: 'nails-hand-care',
      description: 'Champagne rose soak, dead sea salt scrub, cuticle therapy, paraffin wax warm wrap, followed by chip-free Gel polish.',
      benefits: 'Silky smooth hands & feet\nNail bed revitalization\nUp to 4 weeks chip-resistant color',
      durationMinutes: 75,
      price: 1899,
      originalPrice: 2400,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Deep Tissue Swedish Aromatherapy Massage',
      slug: 'deep-tissue-aromatherapy-massage',
      categorySlug: 'spa-wellness',
      description: 'Full-body relaxation ritual using warm lavender and sandalwood essential oils to dissolve muscle knots and restore energetic balance.',
      benefits: 'Relieves chronic back and neck aches\nStimulates lymphatic circulation\nDeep mental serenity',
      durationMinutes: 60,
      price: 2999,
      originalPrice: 3800,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Full Body Silking Rica Brazilian Wax',
      slug: 'full-body-silking-rica-wax',
      categorySlug: 'waxing-body-silking',
      description: 'Colophony-free Italian Rica wax enriched with avocado butter for maximum comfort, zero irritation, and ultra-smooth skin.',
      benefits: 'Virtually painless application\nRetards hair regrowth\nLeaves skin velvety soft',
      durationMinutes: 90,
      price: 2799,
      originalPrice: 3400,
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const serviceMap = new Map<string, string>();
  for (const s of servicesData) {
    const catId = categoryMap.get(s.categorySlug);
    if (!catId) continue;

    const createdService = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        categoryId: catId,
        description: s.description,
        benefits: s.benefits,
        durationMinutes: s.durationMinutes,
        price: s.price,
        originalPrice: s.originalPrice,
        isFeatured: s.isFeatured,
        image: s.image,
      },
      create: {
        name: s.name,
        slug: s.slug,
        categoryId: catId,
        description: s.description,
        benefits: s.benefits,
        durationMinutes: s.durationMinutes,
        price: s.price,
        originalPrice: s.originalPrice,
        isFeatured: s.isFeatured,
        image: s.image,
      },
    });
    serviceMap.set(s.slug, createdService.id);
  }

  // 6. Staff Members
  const staffData = [
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@snipdesalon.com',
      phone: '+91 98491 00101',
      roleTitle: 'Creative Director & Master Hair Artist',
      bio: 'Trained at Toni&Guy London with 10+ years shaping high-fashion hair silhouettes, corrective coloring, and keratin transformations.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      services: ['signature-royal-hair-spa', 'couture-precision-cut', 'balayage-french-gloss'],
    },
    {
      name: 'Ananya Rao',
      email: 'ananya.rao@snipdesalon.com',
      phone: '+91 98491 00102',
      roleTitle: 'Senior Aesthetician & Skin Specialist',
      bio: 'CIDESCO certified aesthetician specializing in clinical dermaplaning, 24K gold infusions, and transformative anti-aging facial rituals.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      services: ['hydra-luxe-24k-gold-facial', 'o2-glass-skin-therapy'],
    },
    {
      name: 'Kavita Patel',
      email: 'kavita.patel@snipdesalon.com',
      phone: '+91 98491 00103',
      roleTitle: 'Celebrity & Bridal Makeup Artist',
      bio: 'Renowned for ethereal South Indian bridal looks, modern red-carpet glam, and precision HD airbrush techniques.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      services: ['luxury-hd-bridal-makeover', 'cocktail-evening-glam-makeup'],
    },
    {
      name: 'Rajesh Varma',
      email: 'rajesh.varma@snipdesalon.com',
      phone: '+91 98491 00104',
      roleTitle: 'Master Stylist & Barbering Virtuoso',
      bio: 'Specialist in precision scissor work, royal beard sculpting, and hair revival therapies with 8 years of luxury salon experience.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      services: ['couture-precision-cut', 'signature-royal-hair-spa'],
    },
    {
      name: 'Sunita Menon',
      email: 'sunita.menon@snipdesalon.com',
      phone: '+91 98491 00105',
      roleTitle: 'Holistic Spa & Body Therapist',
      bio: 'Experienced in traditional Ayurvedic pressure points, Swedish relaxation, and soothing head-to-toe wellness therapies.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      services: ['deep-tissue-aromatherapy-massage', 'luxe-champagne-mani-pedi', 'full-body-silking-rica-wax'],
    },
  ];

  const staffMap = new Map<string, string>();
  for (const st of staffData) {
    const createdStaff = await prisma.staff.create({
      data: {
        name: st.name,
        email: st.email,
        phone: st.phone,
        roleTitle: st.roleTitle,
        bio: st.bio,
        avatar: st.avatar,
        workingHoursStart: '09:00',
        workingHoursEnd: '20:00',
      },
    });
    staffMap.set(st.name, createdStaff.id);

    // Link services
    for (const serviceSlug of st.services) {
      const sId = serviceMap.get(serviceSlug);
      if (sId) {
        await prisma.staffService.upsert({
          where: {
            staffId_serviceId: {
              staffId: createdStaff.id,
              serviceId: sId,
            },
          },
          update: {},
          create: {
            staffId: createdStaff.id,
            serviceId: sId,
          },
        });
      }
    }
  }

  // 7. Product Categories & Products
  const prodCategories = [
    {
      name: 'Luxury Hair Care',
      slug: 'luxury-hair-care',
      description: 'Salon-exclusive shampoos, restorative hair masks, and argan bonding elixirs.',
      image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Advanced Skin & Glow',
      slug: 'advanced-skin-glow',
      description: 'Potent vitamin C serums, ceramide moisturizers, and sun protection formulations.',
      image: 'https://images.unsplash.com/photo-1608248597359-5489816089a8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Spa & Botanical Wellness',
      slug: 'spa-botanical-wellness',
      description: 'Aromatherapy bath soaks, Himalayan crystal scrubs, and botanical body oils.',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const prodCatMap = new Map<string, string>();
  for (const pc of prodCategories) {
    const createdPC = await prisma.productCategory.upsert({
      where: { slug: pc.slug },
      update: pc,
      create: pc,
    });
    prodCatMap.set(pc.slug, createdPC.id);
  }

  const productsData = [
    {
      name: 'Snip De Salon Caviar & Keratin Repair Mask',
      slug: 'caviar-keratin-repair-mask',
      categorySlug: 'luxury-hair-care',
      description: 'Ultra-rich intensive mask infused with French caviar extract and biomimetic keratin that repairs split ends and deeply hydrates damaged fibers.',
      price: 2199,
      discountPercent: 10,
      stock: 24,
      sku: 'SND-HR-001',
      rating: 4.9,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Moroccan Elixir Pure Gold Hair Oil (100ml)',
      slug: 'moroccan-elixir-hair-oil',
      categorySlug: 'luxury-hair-care',
      description: 'Cold-pressed organic argan oil enriched with sweet almond essence. Imparts instant glass shine without weighing fine strands down.',
      price: 1850,
      discountPercent: 15,
      stock: 35,
      sku: 'SND-HR-002',
      rating: 4.8,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1608248597359-5489816089a8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '24K Pure Gold Radiance Glow Serum',
      slug: '24k-gold-radiance-glow-serum',
      categorySlug: 'advanced-skin-glow',
      description: 'Suspended with 24-karat gold flakes and triple hyaluronic acid complex to revitalize tired skin, fade fine lines, and boost luminous reflection.',
      price: 2899,
      discountPercent: 12,
      stock: 18,
      sku: 'SND-SK-001',
      rating: 5.0,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Lavender & Sandalwood Herbal Body Polish',
      slug: 'lavender-sandalwood-body-polish',
      categorySlug: 'spa-botanical-wellness',
      description: 'Fine Dead Sea salt minerals blended with organic essential oils and shea butter for gentle body exfoliation and velvet softness.',
      price: 1450,
      discountPercent: 0,
      stock: 15,
      sku: 'SND-SP-001',
      rating: 4.7,
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1547793548-710ec862bb52?auto=format&fit=crop&w=600&q=80',
    },
  ];

  for (const pr of productsData) {
    const cId = prodCatMap.get(pr.categorySlug);
    if (!cId) continue;
    await prisma.product.upsert({
      where: { slug: pr.slug },
      update: {
        name: pr.name,
        categoryId: cId,
        description: pr.description,
        price: pr.price,
        discountPercent: pr.discountPercent,
        stock: pr.stock,
        sku: pr.sku,
        rating: pr.rating,
        isFeatured: pr.isFeatured,
        image: pr.image,
      },
      create: {
        name: pr.name,
        slug: pr.slug,
        categoryId: cId,
        description: pr.description,
        price: pr.price,
        discountPercent: pr.discountPercent,
        stock: pr.stock,
        sku: pr.sku,
        rating: pr.rating,
        isFeatured: pr.isFeatured,
        image: pr.image,
      },
    });
  }

  // 8. Offers & Packages
  const offersData = [
    {
      title: 'The Sovereign Royal Bridal Symphony',
      slug: 'royal-bridal-symphony',
      description: 'Complete high-end bridal experience: Pre-bridal glow facial, 24K gold body scrub, luxury manicure-pedicure, full hair revival, and HD airbrush wedding day makeup.',
      originalPrice: 28000,
      offerPrice: 21999,
      badgeText: 'Most Popular Bridal',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      validUntil: '2026-12-31',
      terms: 'Advance booking of at least 7 days required. Includes complimentary trial consultation.',
      isFeatured: true,
    },
    {
      title: 'Keratin Gloss & Color Transformation Duo',
      slug: 'keratin-gloss-color-duo',
      description: 'Transform frizzy or unmanageable hair into silk with organic formaldehyde-free Brazilian Keratin treatment paired with bespoke French gloss toning.',
      originalPrice: 11000,
      offerPrice: 7999,
      badgeText: 'Seasonal 28% Off',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      validUntil: '2026-11-30',
      terms: 'Applicable for any hair length up to waist level.',
      isFeatured: true,
    },
    {
      title: 'Mind & Body Serenity Spa Day',
      slug: 'mind-body-serenity-spa-day',
      description: 'A 2.5-hour pampering voyage: 60-min Deep Tissue Lavender Massage, 45-min Hydra Facial, and Champagne Foot Reflexology.',
      originalPrice: 7500,
      offerPrice: 5499,
      badgeText: 'Weekend Special',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      validUntil: '2026-12-15',
      terms: 'Available Monday through Friday slots. Includes complimentary herbal detox tea.',
      isFeatured: true,
    },
  ];

  for (const ofr of offersData) {
    await prisma.offer.upsert({
      where: { slug: ofr.slug },
      update: ofr,
      create: ofr,
    });
  }

  // 9. Sample Reviews
  const firstServiceId = serviceMap.get('signature-royal-hair-spa');
  const secondServiceId = serviceMap.get('hydra-luxe-24k-gold-facial');

  if (firstServiceId) {
    await prisma.review.create({
      data: {
        customerId: customerProfileId,
        serviceId: firstServiceId,
        rating: 5,
        comment: 'Snip De Salon is truly a league above anything else in Vizag! Priya was attentive, the ambiance with soft jazz and warm lighting is exquisite, and my hair feels completely revived.',
        isApproved: true,
      },
    });
  }

  if (secondServiceId) {
    await prisma.review.create({
      data: {
        customerId: customerProfileId,
        serviceId: secondServiceId,
        rating: 5,
        comment: 'The 24K gold facial gave me an unmistakable bridal glow for my engagement. Their hygiene standards and consultation were world-class.',
        isApproved: true,
      },
    });
  }

  // 10. Sample Appointment for Customer
  if (firstServiceId) {
    const priyaId = staffMap.get('Priya Sharma');
    await prisma.appointment.upsert({
      where: { bookingReference: 'SND-78291' },
      update: {},
      create: {
        bookingReference: 'SND-78291',
        customerId: customerProfileId,
        staffId: priyaId,
        serviceId: firstServiceId,
        date: '2026-10-15',
        startTime: '11:00',
        endTime: '12:00',
        status: 'CONFIRMED',
        notes: 'Client requested warm organic Moroccan oil rinse',
        totalAmount: 2499,
        paymentStatus: 'PAID',
        paymentMethod: 'ONLINE',
      },
    });
  }

  // 11. Discount Coupons
  await prisma.coupon.upsert({
    where: { code: 'SNIPLUXURY' },
    update: {},
    create: {
      code: 'SNIPLUXURY',
      discountPct: 20,
      maxDiscount: 1000,
      minSpend: 2000,
      isActive: true,
      validUntil: '2026-12-31',
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountPct: 10,
      maxDiscount: 500,
      minSpend: 999,
      isActive: true,
      validUntil: '2026-12-31',
    },
  });

  console.log('✨ Database seeding finished successfully for Snip De Salon!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

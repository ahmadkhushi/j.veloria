const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding j.veloria database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jveloria.com' },
    update: { passwordHash: adminPassword, role: 'ADMIN' },
    create: {
      email: 'admin@jveloria.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Categories
  const categoriesData = [
    { name: 'Suits & Tuxedos', slug: 'suits', department: 'CLOTHES', description: 'Tailored luxury ready-to-wear suits and evening tuxedos.' },
    { name: 'Outerwear & Coats', slug: 'outerwear', department: 'CLOTHES', description: 'Fine wool, cashmere, and leather jackets.' },
    { name: 'Formal Shirts', slug: 'shirts', department: 'CLOTHES', description: 'Egyptian cotton dress shirts.' },
    { name: 'Tailored Trousers', slug: 'trousers', department: 'CLOTHES', description: 'Impeccable fit pleated trousers.' },
    { name: 'Oxfords & Dress Shoes', slug: 'oxfords', department: 'SHOES', description: 'Handcrafted leather oxfords and monk straps.' },
    { name: 'Luxury Loafers', slug: 'loafers', department: 'SHOES', description: 'Venetian suede loafers and slippers.' },
    { name: 'Sneakers & Leisure', slug: 'sneakers', department: 'SHOES', description: 'Low-top minimalist leather sneakers.' },
    { name: 'Chelsea & Dress Boots', slug: 'boots', department: 'SHOES', description: 'Calfskin dress boots.' },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('Categories created');

  // 3. Seed SizeOptions
  const sizeOptionsData = [
    { type: 'CLOTHING', label: 'Small (S)', code: 'S', sortOrder: 1 },
    { type: 'CLOTHING', label: 'Medium (M)', code: 'M', sortOrder: 2 },
    { type: 'CLOTHING', label: 'Large (L)', code: 'L', sortOrder: 3 },
    { type: 'CLOTHING', label: 'X-Large (XL)', code: 'XL', sortOrder: 4 },
    { type: 'CLOTHING', label: 'XX-Large (XXL)', code: 'XXL', sortOrder: 5 },
    { type: 'FOOTWEAR', label: 'EU 39 / US 6.5', code: 'EU 39', sortOrder: 10 },
    { type: 'FOOTWEAR', label: 'EU 40 / US 7.5', code: 'EU 40', sortOrder: 11 },
    { type: 'FOOTWEAR', label: 'EU 41 / US 8.5', code: 'EU 41', sortOrder: 12 },
    { type: 'FOOTWEAR', label: 'EU 42 / US 9.5', code: 'EU 42', sortOrder: 13 },
    { type: 'FOOTWEAR', label: 'EU 43 / US 10.5', code: 'EU 43', sortOrder: 14 },
    { type: 'FOOTWEAR', label: 'EU 44 / US 11.5', code: 'EU 44', sortOrder: 15 },
    { type: 'FOOTWEAR', label: 'EU 45 / US 12.5', code: 'EU 45', sortOrder: 16 },
  ];

  for (const size of sizeOptionsData) {
    const existing = await prisma.sizeOption.findFirst({
      where: { type: size.type, code: size.code }
    });
    if (!existing) {
      await prisma.sizeOption.create({ data: size });
    }
  }
  console.log('Size options created');

  // 4. Seed Dynamic Custom Pages (CMS Feature)
  const customPagesData = [
    {
      title: 'Heritage & Craftsmanship',
      slug: 'heritage-craftsmanship',
      content: `
        <h2 class="text-2xl font-serif text-white mb-4">The J. VELORIA Legacy of Luxury</h2>
        <p class="text-slate-300 mb-6 leading-relaxed">
          Founded on unyielding principles of luxury ready-to-wear garments and shoe artisanry, J. VELORIA represents the pinnacle of modern menswear and footwear.
          Every suit is crafted with meticulous stitching using only fine virgin wool and pure cashmere fibers.
        </p>
        <h3 class="text-xl font-serif text-white mb-3">Premium Footwear</h3>
        <p class="text-slate-300 leading-relaxed">
          Our footwear is handcrafted by master shoemakers with generations of heritage.
          Utilizing Goodyear and Blake-welted techniques, each shoe undergoes hand-finishing to achieve iconic depth of color.
        </p>
      `,
      metaTitle: 'Heritage & Craftsmanship | J. VELORIA Luxury',
      metaDescription: 'Discover the heritage, luxury ready-to-wear menswear, and premium footwear artisanry of J. VELORIA.',
      showInHeader: false,
      showInFooter: false,
      sortOrder: 1,
    },
    {
      title: 'Size & Fit Guide',
      slug: 'size-guide',
      content: `
        <h2 class="text-2xl font-serif text-white mb-4">Size & Fitting Guide</h2>
        <p class="text-slate-300 mb-6">Use our comprehensive conversion chart to ensure your J. VELORIA garments and footwear fit flawlessly right off the rack.</p>
        
        <h3 class="text-xl font-serif text-white mb-3 text-gold-400">Clothing Measurement Guide</h3>
        <div class="overflow-x-auto mb-8">
          <table class="w-full text-left text-sm border border-slate-700 text-slate-200">
            <thead class="bg-navy-900 border-b border-slate-700 text-white font-serif">
              <tr>
                <th class="p-3">Size</th>
                <th class="p-3">Chest (Inches)</th>
                <th class="p-3">Waist (Inches)</th>
                <th class="p-3">European Size</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">S</td><td class="p-3">36 - 38</td><td class="p-3">30 - 32</td><td class="p-3">46 - 48</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">M</td><td class="p-3">38 - 40</td><td class="p-3">32 - 34</td><td class="p-3">48 - 50</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">L</td><td class="p-3">40 - 42</td><td class="p-3">34 - 36</td><td class="p-3">50 - 52</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">XL</td><td class="p-3">42 - 44</td><td class="p-3">36 - 38</td><td class="p-3">52 - 54</td></tr>
            </tbody>
          </table>
        </div>

        <h3 class="text-xl font-serif text-white mb-3 text-gold-400">Footwear Conversion Chart</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border border-slate-700 text-slate-200">
            <thead class="bg-navy-900 border-b border-slate-700 text-white font-serif">
              <tr>
                <th class="p-3">EU Size</th>
                <th class="p-3">US Size</th>
                <th class="p-3">UK Size</th>
                <th class="p-3">Insole Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">EU 39</td><td class="p-3">6.5</td><td class="p-3">5.5</td><td class="p-3">25.0 cm</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">EU 40</td><td class="p-3">7.5</td><td class="p-3">6.5</td><td class="p-3">25.7 cm</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">EU 41</td><td class="p-3">8.5</td><td class="p-3">7.5</td><td class="p-3">26.4 cm</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">EU 42</td><td class="p-3">9.5</td><td class="p-3">8.5</td><td class="p-3">27.0 cm</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">EU 43</td><td class="p-3">10.5</td><td class="p-3">9.5</td><td class="p-3">27.7 cm</td></tr>
              <tr class="border-b border-slate-800"><td class="p-3 font-semibold text-white">EU 44</td><td class="p-3">11.5</td><td class="p-3">10.5</td><td class="p-3">28.4 cm</td></tr>
            </tbody>
          </table>
        </div>
      `,
      metaTitle: 'Size & Fit Guide | J. VELORIA',
      metaDescription: 'Find your precise measurements and sizing for J. VELORIA ready-to-wear suits and shoes.',
      showInHeader: true,
      showInFooter: true,
      sortOrder: 2,
    }
  ];

  for (const page of customPagesData) {
    await prisma.customPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log('Dynamic custom pages created');

  // 5. Seed Initial Luxury Products (4-5 items)
  const sampleProducts = [
    {
      name: 'Royal Navy Cashmere Suit',
      slug: 'royal-navy-cashmere-suit',
      description: 'Crafted from pure 180s virgin cashmere-wool blend. Structured with floating canvas, hand-stitched lapels, horn buttons, and navy silk lining for effortless luxury.',
      price: 1850.00,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-in-a-suit-adjusting-his-tie-41584-large.mp4',
      brand: 'J. VELORIA',
      department: 'CLOTHES',
      categoryId: categoryMap['suits'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      stock: 25,
      colors: [
        { name: 'Navy Blue', hex: '#0A192F', inStock: true },
        { name: 'Midnight Blue', hex: '#050C1A', inStock: true }
      ],
      keywords: 'navy suit, luxury suit, cashmere tuxedo, ready to wear menswear, J. VELORIA clothes'
    },
    {
      name: 'Hand-Burnished Calfskin Oxfords',
      slug: 'hand-burnished-calfskin-oxfords',
      description: 'Chiseled toe wholecut oxfords masterfully hand-stained in midnight navy and deep espresso. Blake-welted construction with ultra-durable full-grain leather soles.',
      price: 920.00,
      salePrice: 850.00,
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop',
      videoUrl: null,
      brand: 'J. VELORIA',
      department: 'SHOES',
      categoryId: categoryMap['oxfords'],
      availableSizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      stock: 18,
      colors: [
        { name: 'Deep Navy', hex: '#0A192F', inStock: true },
        { name: 'Espresso Black', hex: '#111111', inStock: true }
      ],
      keywords: 'oxford shoes, leather shoes, navy dress shoes, luxury footwear, J. VELORIA shoes'
    },
    {
      name: 'Midnight Navy Velvet Evening Tuxedo Jacket',
      slug: 'midnight-navy-velvet-tuxedo',
      description: 'Sumptuous silk-blend navy velvet dinner jacket featuring satin peak lapels and covered buttons. Designed for high-end red carpet events, galas, and weddings.',
      price: 2400.00,
      salePrice: 2100.00,
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      videoUrl: null,
      brand: 'J. VELORIA',
      department: 'CLOTHES',
      categoryId: categoryMap['suits'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      isActive: true,
      isFeatured: true,
      isNewArrival: false,
      stock: 12,
      colors: [
        { name: 'Royal Velvet Navy', hex: '#0B132B', inStock: true }
      ],
      keywords: 'velvet jacket, tuxedo, luxury outerwear, evening wear'
    },
    {
      name: 'Venetian Suede Drivers & Loafers',
      slug: 'venetian-suede-loafers',
      description: 'Ultra-supple suede driving shoes in deep navy with hand-stitched apron and signature rubber pebble soles for uncompromised comfort.',
      price: 780.00,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1582844246519-ec1010e81446?q=80&w=1000&auto=format&fit=crop',
      videoUrl: null,
      brand: 'J. VELORIA',
      department: 'SHOES',
      categoryId: categoryMap['loafers'],
      availableSizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'],
      isActive: true,
      isFeatured: true,
      isNewArrival: false,
      stock: 30,
      colors: [
        { name: 'Navy Suede', hex: '#1C2541', inStock: true },
        { name: 'Pure White', hex: '#FFFFFF', inStock: true }
      ],
      keywords: 'loafers, suede drivers, navy shoes, casual luxury'
    },
    {
      name: 'Monogrammed Merino Wool Trench Coat',
      slug: 'monogrammed-merino-trench-coat',
      description: 'Double-breasted weather-resistant double-weave merino wool trench coat with horn buttons and removable silk waist belt in signature navy.',
      price: 2100.00,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
      videoUrl: null,
      brand: 'J. VELORIA',
      department: 'CLOTHES',
      categoryId: categoryMap['outerwear'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      isActive: true,
      isFeatured: false,
      isNewArrival: true,
      stock: 15,
      colors: [
        { name: 'Navy Blue', hex: '#0A192F', inStock: true }
      ],
      keywords: 'trench coat, wool coat, luxury outerwear, navy coat'
    }
  ];

  for (const prod of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log('Sample luxury products seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

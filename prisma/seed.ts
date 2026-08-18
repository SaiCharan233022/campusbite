import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CampusBite database for college demo...');

  // 1. Create Demo Users (Student & Canteen Admin)
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  const student = await prisma.user.upsert({
    where: { collegeId: '2024CS101' },
    update: {},
    create: {
      collegeId: '2024CS101',
      name: 'Rahul Sharma',
      email: 'rahul@college.edu',
      passwordHash: studentPassword,
      phone: '9876543210',
      role: 'STUDENT',
    },
  });

  const admin = await prisma.user.upsert({
    where: { collegeId: 'ADMIN001' },
    update: {},
    create: {
      collegeId: 'ADMIN001',
      name: 'Canteen Supervisor',
      email: 'admin@canteen.edu',
      passwordHash: adminPassword,
      phone: '9876543211',
      role: 'ADMIN',
    },
  });

  // 2. Create 3 Campus Canteens
  const mainMess = await prisma.canteen.upsert({
    where: { id: 'canteen-main' },
    update: {},
    create: {
      id: 'canteen-main',
      name: 'Main Campus Dining Mess',
      description:
        'North & South Indian hot meals, rotis, curries, biryani, and thalis.',
      location: 'Block A, Ground Floor (Central)',
      openTime: '07:00',
      closeTime: '22:00',
    },
  });

  const juiceCorner = await prisma.canteen.upsert({
    where: { id: 'canteen-juice' },
    update: {},
    create: {
      id: 'canteen-juice',
      name: 'Fresh Juice & Shake Bar',
      description:
        'Freshly squeezed seasonal juices, thick milkshakes, lassi, and fruit bowls.',
      location: 'Near Central Library & Block C',
      openTime: '08:00',
      closeTime: '20:00',
    },
  });

  const chaiStall = await prisma.canteen.upsert({
    where: { id: 'canteen-tea' },
    update: {},
    create: {
      id: 'canteen-tea',
      name: 'Tapri Chai & Hot Snacks',
      description:
        'Ginger cutting chai, filter coffee, crispy samosas, vada pav & Maggi.',
      location: 'Main Campus Gate Plaza',
      openTime: '06:30',
      closeTime: '23:00',
    },
  });

  // 3. Populate Menu Items
  const menuData = [
    // Main Mess
    {
      name: 'Paneer Butter Masala',
      description: 'Rich, velvety cottage cheese cubes in aromatic tomato butter gravy.',
      price: 120,
      category: 'DINNER',
      isVeg: true,
      isAvailable: true,
      prepTime: 12,
      canteenId: mainMess.id,
    },
    {
      name: 'Chicken Dum Biryani',
      description: 'Slow-cooked spiced basmati rice layered with succulent chicken pieces.',
      price: 150,
      category: 'LUNCH',
      isVeg: false,
      isAvailable: true,
      prepTime: 15,
      canteenId: mainMess.id,
    },
    {
      name: 'Dal Tadka with Jeera Rice',
      description: 'Yellow lentils tempered with garlic and ghee, served with cumin rice.',
      price: 85,
      category: 'DINNER',
      isVeg: true,
      isAvailable: true,
      prepTime: 10,
      canteenId: mainMess.id,
    },
    {
      name: 'Crispy Masala Dosa',
      description: 'Golden crispy rice crepe with spiced potato mash, coconut chutney & sambar.',
      price: 60,
      category: 'BREAKFAST',
      isVeg: true,
      isAvailable: true,
      prepTime: 8,
      canteenId: mainMess.id,
    },
    {
      name: 'Aloo Paratha with Curd',
      description: 'Two hot whole wheat flatbreads stuffed with spiced potatoes & butter.',
      price: 55,
      category: 'BREAKFAST',
      isVeg: true,
      isAvailable: true,
      prepTime: 8,
      canteenId: mainMess.id,
    },
    {
      name: 'Veg Hakka Fried Rice',
      description: 'Wok-tossed basmati rice with crunchy carrots, cabbage and spring onions.',
      price: 90,
      category: 'DINNER',
      isVeg: true,
      isAvailable: true,
      prepTime: 10,
      canteenId: mainMess.id,
    },
    {
      name: 'Chole Bhature (2 Pcs)',
      description: 'Fluffy golden fried bhature served with tangy Punjabi spiced chickpeas.',
      price: 75,
      category: 'LUNCH',
      isVeg: true,
      isAvailable: true,
      prepTime: 10,
      canteenId: mainMess.id,
    },
    {
      name: 'Egg Masala Curry',
      description: 'Two farm boiled eggs simmered in spicy onion-tomato gravy.',
      price: 80,
      category: 'LUNCH',
      isVeg: false,
      isAvailable: true,
      prepTime: 10,
      canteenId: mainMess.id,
    },

    // Juice Bar
    {
      name: 'Alphonso Mango Lassi',
      description: 'Thick, creamy chilled yogurt blended with authentic mango pulp.',
      price: 50,
      category: 'BEVERAGES',
      isVeg: true,
      isAvailable: true,
      prepTime: 3,
      canteenId: juiceCorner.id,
    },
    {
      name: 'Cold Coffee with Ice Cream',
      description: 'Rich blended espresso shake topped with a scoop of vanilla ice cream.',
      price: 60,
      category: 'BEVERAGES',
      isVeg: true,
      isAvailable: true,
      prepTime: 4,
      canteenId: juiceCorner.id,
    },
    {
      name: 'Fresh Mosambi (Sweet Lime) Juice',
      description: 'Freshly extracted citrus juice with a pinch of black salt.',
      price: 40,
      category: 'BEVERAGES',
      isVeg: true,
      isAvailable: true,
      prepTime: 3,
      canteenId: juiceCorner.id,
    },
    {
      name: 'Chilled Watermelon Mint Juice',
      description: 'Hydrating fresh watermelon juice with crushed mint leaves.',
      price: 35,
      category: 'BEVERAGES',
      isVeg: true,
      isAvailable: true,
      prepTime: 3,
      canteenId: juiceCorner.id,
    },
    {
      name: 'Exotic Fruit Salad Bowl',
      description: 'Diced papaya, watermelon, apples and bananas topped with honey.',
      price: 60,
      category: 'SNACKS',
      isVeg: true,
      isAvailable: true,
      prepTime: 5,
      canteenId: juiceCorner.id,
    },

    // Chai & Snacks Tapri
    {
      name: 'Adrak Elaichi Cutting Chai',
      description: 'Authentic Indian ginger-cardamom steeped hot milk tea.',
      price: 15,
      category: 'BEVERAGES',
      isVeg: true,
      isAvailable: true,
      prepTime: 2,
      canteenId: chaiStall.id,
    },
    {
      name: 'Hot Samosa (2 pcs) with Chutneys',
      description: 'Crispy pastry shells filled with spiced potato mash and green chutney.',
      price: 20,
      category: 'SNACKS',
      isVeg: true,
      isAvailable: true,
      prepTime: 2,
      canteenId: chaiStall.id,
    },
    {
      name: 'Mumbai Style Vada Pav',
      description: 'Golden fried spiced batata vada inside buttered pav with dry garlic chutney.',
      price: 25,
      category: 'SNACKS',
      isVeg: true,
      isAvailable: true,
      prepTime: 3,
      canteenId: chaiStall.id,
    },
    {
      name: 'Cheese Maggi Bowl',
      description: '2-minute noodles tossed with butter, sweet corn, chili and melted cheese.',
      price: 45,
      category: 'SNACKS',
      isVeg: true,
      isAvailable: true,
      prepTime: 5,
      canteenId: chaiStall.id,
    },
    {
      name: 'Spicy Masala Bread Omelette',
      description: 'Double egg masala omelette folded between toasted buttered bread slices.',
      price: 35,
      category: 'SNACKS',
      isVeg: false,
      isAvailable: true,
      prepTime: 5,
      canteenId: chaiStall.id,
    },
    {
      name: 'Warm Gulab Jamun (2 Pcs)',
      description: 'Soft melt-in-mouth milk dumplings in warm rose cardamom sugar syrup.',
      price: 30,
      category: 'DESSERTS',
      isVeg: true,
      isAvailable: true,
      prepTime: 2,
      canteenId: chaiStall.id,
    },
  ];

  // Delete existing items to avoid duplicates
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});

  const createdItems = [];
  for (const item of menuData) {
    const created = await prisma.menuItem.create({ data: item });
    createdItems.push(created);
  }

  // 4. Create Sample Orders for Demo Screen
  const sampleOrder1 = await prisma.order.create({
    data: {
      tokenNumber: 104,
      status: 'PREPARING',
      totalAmount: 175,
      paymentId: 'pay_demo_104',
      paymentStatus: 'COMPLETED',
      scheduledFor: 'now',
      estimatedReady: new Date(Date.now() + 8 * 60 * 1000),
      userId: student.id,
      canteenId: mainMess.id,
      notes: 'Make it medium spicy please',
      items: {
        create: [
          { menuItemId: createdItems[1].id, quantity: 1, price: 150 }, // Biryani
          { menuItemId: createdItems[13].id, quantity: 1, price: 25 },  // Vada Pav
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      tokenNumber: 105,
      status: 'READY',
      totalAmount: 110,
      paymentId: 'pay_demo_105',
      paymentStatus: 'COMPLETED',
      scheduledFor: '19:30',
      estimatedReady: new Date(Date.now() - 2 * 60 * 1000),
      userId: student.id,
      canteenId: juiceCorner.id,
      items: {
        create: [
          { menuItemId: createdItems[8].id, quantity: 1, price: 50 },  // Lassi
          { menuItemId: createdItems[9].id, quantity: 1, price: 60 },  // Cold coffee
        ],
      },
    },
  });

  console.log('✅ Database successfully seeded!');
  console.log('   👤 Student Account: 2024CS101 / student123');
  console.log('   🛡️ Admin Account:   ADMIN001 / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

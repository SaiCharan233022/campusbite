import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_CANTEENS = [
  {
    id: 'canteen-main',
    name: 'Main Campus Dining Mess',
    description: 'North & South Indian hot meals, rotis, curries, biryani, and thalis.',
    location: 'Block A, Ground Floor (Central)',
    openTime: '07:00',
    closeTime: '22:00',
    isActive: true,
  },
  {
    id: 'canteen-juice',
    name: 'Fresh Juice & Shake Bar',
    description: 'Freshly squeezed seasonal juices, thick milkshakes, lassi, and fruit bowls.',
    location: 'Near Central Library & Block C',
    openTime: '08:00',
    closeTime: '20:00',
    isActive: true,
  },
  {
    id: 'canteen-tea',
    name: 'Tapri Chai & Hot Snacks',
    description: 'Ginger cutting chai, filter coffee, crispy samosas, vada pav & Maggi.',
    location: 'Main Campus Gate Plaza',
    openTime: '06:30',
    closeTime: '23:00',
    isActive: true,
  },
];

export async function GET() {
  try {
    const canteens = await prisma.canteen.findMany({
      where: { isActive: true },
    });

    if (canteens && canteens.length > 0) {
      return NextResponse.json({ canteens });
    }
    return NextResponse.json({ canteens: DEFAULT_CANTEENS });
  } catch (error: any) {
    console.warn('Prisma lookup fallback to default canteens:', error.message);
    return NextResponse.json({ canteens: DEFAULT_CANTEENS });
  }
}

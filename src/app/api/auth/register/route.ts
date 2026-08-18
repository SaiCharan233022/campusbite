import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { collegeId, name, email, password, phone } = await req.json();

    if (!collegeId || !name || !email || !password) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Check existing
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { collegeId }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A student with this College ID or Email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        collegeId,
        name,
        email,
        passwordHash,
        phone,
        role: 'STUDENT',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        collegeId: user.collegeId,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

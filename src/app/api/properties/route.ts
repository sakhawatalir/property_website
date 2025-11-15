import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET all properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const includeTranslations = searchParams.get('includeTranslations') !== 'false';

    const properties = await prisma.property.findMany({
      include: {
        translations: includeTranslations ? {
          where: { locale },
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST create new property
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      slug,
      status,
      type,
      year,
      price,
      bedrooms,
      bathrooms,
      area,
      location,
      coordinates,
      featured,
      images,
      translations, // { en: {...}, de: {...}, es: {...} }
    } = data;

    // Create property with translations
    const property = await prisma.property.create({
      data: {
        slug,
        status,
        type,
        year: year ? parseInt(year) : null,
        price: parseFloat(price),
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        location,
        coordinates,
        featured: featured || false,
        images: images || [],
        translations: {
          create: Object.entries(translations || {}).map(([locale, translation]: [string, any]) => ({
            locale,
            title: translation.title,
            description: translation.description,
            subtitle: translation.subtitle || null,
            features: translation.features || [],
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT update property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      translations,
    } = data;

    // Update property
    const property = await prisma.property.update({
      where: { id: params.id },
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
      },
    });

    // Update translations
    if (translations) {
      await Promise.all(
        Object.entries(translations).map(async ([locale, translation]: [string, any]) => {
          await prisma.propertyTranslation.upsert({
            where: {
              propertyId_locale: {
                propertyId: params.id,
                locale,
              },
            },
            create: {
              propertyId: params.id,
              locale,
              title: translation.title,
              description: translation.description,
              subtitle: translation.subtitle || null,
              features: translation.features || [],
            },
            update: {
              title: translation.title,
              description: translation.description,
              subtitle: translation.subtitle || null,
              features: translation.features || [],
            },
          });
        })
      );
    }

    const updatedProperty = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({ property: updatedProperty });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}


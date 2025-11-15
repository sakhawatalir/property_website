'use client';

import PropertyForm from '@/components/admin/PropertyForm';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return <PropertyForm propertyId={params.id} />;
}


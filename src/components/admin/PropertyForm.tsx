'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

interface PropertyFormProps {
  propertyId?: string;
}

interface TranslationData {
  title: string;
  description: string;
  subtitle?: string;
  features: string[];
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!propertyId);
  const [locales] = useState(['en', 'de', 'es']);
  
  // Basic property data
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('available');
  const [type, setType] = useState('residential');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>(['']);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  // Translations
  const [translations, setTranslations] = useState<Record<string, TranslationData>>({
    en: { title: '', description: '', subtitle: '', features: [''] },
    de: { title: '', description: '', subtitle: '', features: [''] },
    es: { title: '', description: '', subtitle: '', features: [''] },
  });

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        const property = data.property;

        // Set basic data
        setSlug(property.slug || '');
        setStatus(property.status || 'available');
        setType(property.type || 'residential');
        setYear(property.year?.toString() || '');
        setPrice(property.price?.toString() || '');
        setBedrooms(property.bedrooms?.toString() || '');
        setBathrooms(property.bathrooms?.toString() || '');
        setArea(property.area?.toString() || '');
        setLocation(property.location || '');
        setCoordinates(property.coordinates || '');
        setFeatured(property.featured || false);
        setImages(property.images && property.images.length > 0 ? property.images : ['']);

        // Set translations
        const translationsData: Record<string, TranslationData> = {
          en: { title: '', description: '', subtitle: '', features: [''] },
          de: { title: '', description: '', subtitle: '', features: [''] },
          es: { title: '', description: '', subtitle: '', features: [''] },
        };

        property.translations?.forEach((t: any) => {
          translationsData[t.locale] = {
            title: t.title || '',
            description: t.description || '',
            subtitle: t.subtitle || '',
            features: t.features && t.features.length > 0 ? t.features : [''],
          };
        });

        setTranslations(translationsData);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        slug,
        status,
        type,
        year: year || null,
        price: parseFloat(price),
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        location,
        coordinates: coordinates || null,
        featured,
        images: images.filter((img) => img.trim() !== ''),
        translations,
      };

      const url = propertyId ? `/api/properties/${propertyId}` : '/api/properties';
      const method = propertyId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        router.push('/admin/properties');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      alert('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const updateTranslation = (locale: string, field: keyof TranslationData, value: string | string[]) => {
    setTranslations({
      ...translations,
      [locale]: {
        ...translations[locale],
        [field]: value,
      },
    });
  };

  const addFeature = (locale: string) => {
    const currentFeatures = translations[locale].features || [''];
    updateTranslation(locale, 'features', [...currentFeatures, '']);
  };

  const removeFeature = (locale: string, index: number) => {
    const currentFeatures = translations[locale].features || [''];
    updateTranslation(locale, 'features', currentFeatures.filter((_, i) => i !== index));
  };

  const updateFeature = (locale: string, index: number, value: string) => {
    const currentFeatures = [...(translations[locale].features || [''])];
    currentFeatures[index] = value;
    updateTranslation(locale, 'features', currentFeatures);
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setUploading((prev) => {
      const newUploading = { ...prev };
      delete newUploading[index];
      return newUploading;
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading((prev) => ({ ...prev, [index]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        updateImage(index, data.url);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(index, file);
    }
  };

  const localeNames: Record<string, string> = {
    en: 'English',
    de: 'German (Deutsch)',
    es: 'Spanish (Español)',
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Loading property...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          {propertyId ? 'Edit Property' : 'Add New Property'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="luxury-villa-son-vida"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="leased">Leased</option>
                <option value="under-management">Under Management</option>
                <option value="in-development">In Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="text-red-400">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="hospitality">Hospitality</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (€) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="8500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Area (m²)</label>
              <input
                type="number"
                step="0.01"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Son Vida, Mallorca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coordinates (JSON)
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder='{"lat": 39.5696, "lng": 2.6502}'
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-600"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                Featured Property
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Images</h2>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              <Plus size={16} />
              Add Image
            </button>
          </div>
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="space-y-3">
                <div className="flex gap-4 items-start">
                  {/* File Upload Input */}
                  <div className="flex-1">
                    <label className="block mb-2">
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-gray-300">
                          {uploading[index] ? 'Uploading...' : image ? 'Change Image' : 'Upload Image'}
                        </span>
                        {uploading[index] && (
                          <Loader2 className="ml-auto animate-spin text-blue-400" size={18} />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, e)}
                        className="hidden"
                        disabled={uploading[index]}
                      />
                    </label>
                    
                    {/* URL Input (Alternative) */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Or enter image URL:</p>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors"
                      disabled={uploading[index]}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* Image Preview */}
                {image && !uploading[index] && (
                  <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    {image.startsWith('http') || image.startsWith('/') ? (
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Translations */}
        {locales.map((locale) => (
          <div key={locale} className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">
              {localeNames[locale]} Content
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={translations[locale].title}
                  onChange={(e) => updateTranslation(locale, 'title', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Luxury Villa in Son Vida"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={translations[locale].subtitle || ''}
                  onChange={(e) => updateTranslation(locale, 'subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Exclusive 6-bedroom villa with panoramic views"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={translations[locale].description}
                  onChange={(e) => updateTranslation(locale, 'description', e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Detailed property description..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Features</label>
                  <button
                    type="button"
                    onClick={() => addFeature(locale)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <Plus size={16} />
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {translations[locale].features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(locale, index, e.target.value)}
                        placeholder="Feature description"
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      {translations[locale].features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(locale, index)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Property</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


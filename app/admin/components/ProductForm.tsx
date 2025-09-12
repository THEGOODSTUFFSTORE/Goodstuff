"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { createProduct, updateProduct, uploadProductImage } from '@/lib/firebaseApi';
import { Product } from '@/lib/types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (productData: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, product, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'wine',
    subcategory: '',
    type: '',
    price: '',
    stockQuantity: '',
    description: '',
    detailedDescription: '',
    tastingNotes: '',
    additionalNotes: '',
    origin: '',
    alcoholContent: '',
    volume: '',
    brand: '',
    status: 'active',
    sections: [] as string[],
    image: null as File | null,
  });

  // Update form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'wine',
        subcategory: product.subcategory || '',
        type: product.type || '',
        price: product.price?.toString() || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        description: product.description || '',
        detailedDescription: product.detailedDescription || '',
        tastingNotes: product.tastingNotes || '',
        additionalNotes: product.additionalNotes || '',
        origin: product.origin || '',
        alcoholContent: product.alcoholContent || '',
        volume: product.volume || '',
        brand: product.brand || '',
        status: product.status || 'active',
        sections: product.sections || [],
        image: null as File | null,
      });
    } else {
      // Reset form for adding new product
      setFormData({
        name: '',
        category: 'wine',
        subcategory: '',
        type: '',
        price: '',
        stockQuantity: '',
        description: '',
        detailedDescription: '',
        tastingNotes: '',
        additionalNotes: '',
        origin: '',
        alcoholContent: '',
        volume: '',
        brand: '',
        status: 'active',
        sections: [] as string[],
        image: null as File | null,
      });
    }
  }, [product]);

  const categories = [
    { value: 'wine', label: 'Wine' },
    { value: 'spirit', label: 'Spirits' },
    { value: 'beer', label: 'Beer' },
    { value: 'gin', label: 'Gin' },
    { value: 'bourbon', label: 'Whisky' },
    { value: 'vodka', label: 'Vodka' },
    { value: 'rum', label: 'Rum' },
    { value: 'tequila', label: 'Tequila' },
    { value: 'cider', label: 'Cider' },
    { value: 'cognac', label: 'Cognac' },
    { value: 'cream-liquers', label: 'Cream Liquers' },
    { value: 'market', label: 'Market' },
  ];

  const subcategoriesData = {
    wine: [
      { id: 'red', name: 'Red' },
      { id: 'white', name: 'White' },
      { id: 'rose', name: 'Rosé' },
      { id: 'champagne', name: 'Champagne' }
    ],
    market: [
      { id: 'merchandise', name: 'Merchandise' },
      { id: 'nicotine-pouches', name: 'Nicotine pouches' },
      { id: 'vapes', name: 'Vapes' },
      { id: 'lighters', name: 'Lighters' },
      { id: 'cigars', name: 'Cigars' },
      { id: 'soft-drinks', name: 'Soft Drinks' }
    ]
  };

  const availableSubcategories = useMemo(() => {
    return subcategoriesData[formData.category as keyof typeof subcategoriesData] || [];
  }, [formData.category]);

  const sections = [
    { value: 'popular', label: 'Popular Products' },
    { value: 'new_arrivals', label: 'New Arrivals' },
    { value: 'trending_deals', label: 'Trending Deals' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      sections: checked 
        ? [...(prev.sections || []), name]
        : (prev.sections || []).filter(section => section !== name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Automatically determine status based on stock and user selection
      const stockQuantity = parseInt(formData.stockQuantity as string) || 0;
      let finalStatus = formData.status;
      
      // Override status if stock is 0 and user hasn't explicitly set it to discontinued
      if (stockQuantity === 0 && formData.status !== 'discontinued') {
        finalStatus = 'out_of_stock';
      }
      
      const productData = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        subcategory: formData.subcategory,
        type: formData.type,
        productImage: product?.productImage || '',
        price: parseFloat(formData.price as string) || 0,
        stockQuantity: stockQuantity,
        description: formData.description,
        detailedDescription: formData.detailedDescription,
        tastingNotes: formData.tastingNotes,
        additionalNotes: formData.additionalNotes,
        origin: formData.origin,
        alcoholContent: formData.alcoholContent,
        volume: formData.volume,
        brand: formData.brand,
        status: finalStatus,
        sections: formData.sections,
        updatedAt: new Date().toISOString(),
      };

      console.log('Saving product data:', productData);
      console.log('Sections being saved:', formData.sections);

      // First save/update the product data without the new image
      let savedProduct: Product;
      if (product?.id) {
        console.log('Updating existing product:', product.id);
        await updateProduct(product.id, productData);
        savedProduct = { ...productData, id: product.id };
      } else {
        console.log('Creating new product');
        savedProduct = await createProduct(productData);
      }

      console.log('Product saved successfully:', savedProduct);

      // Instantly reflect the change in UI
      onSubmit(savedProduct);
      onClose();

      // Then handle image upload in the background if there's a new image
      if (formData.image) {
        console.log('Starting image upload for product:', savedProduct.id);
        try {
          const imageUrl = await uploadProductImage(formData.image, savedProduct.id);
          console.log('Image uploaded successfully:', imageUrl);
          
          // Update the product with the new image URL
          await updateProduct(savedProduct.id, { 
            productImage: imageUrl,
            updatedAt: new Date().toISOString()
          });
          console.log('Product updated with new image URL');
          
          // Reflect the image update
          onSubmit({ ...savedProduct, productImage: imageUrl });
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          // Don't throw here - the product is saved, just the image failed
          alert('Product saved but image upload failed. You can try updating the image later.');
        }
      }
    } catch (error: any) {
      console.error('Error saving product:', {
        error,
        message: error.message,
        code: error.code,
        details: error.details,
        stack: error.stack
      });
      
      let errorMessage = 'Error saving product. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'You do not have permission to perform this action.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'The service is currently unavailable. Please try again later.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-black text-base"
              required
            />
          </div>

          {/* Category field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-black text-base"
              required
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory field - only show if category has subcategories */}
          {availableSubcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Subcategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-black text-base"
                required
              >
                <option value="">Select a subcategory</option>
                {availableSubcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type field */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-black text-base"
              placeholder="Enter product type (e.g., Premium, Standard, etc.)"
              required
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              placeholder="Enter stock quantity"
            />
            {parseInt(formData.stockQuantity) === 0 && (
              <p className="mt-1 text-sm text-red-600">
                ⚠️ Product will be marked as "Out of Stock" when saved
              </p>
            )}
          </div>

          {/* Product Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Product Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
            >
              <option value="active">Active (Visible to customers)</option>
              <option value="out_of_stock">Out of Stock (Visible but not purchasable)</option>
              <option value="discontinued">Discontinued</option>
            </select>
            <p className="mt-1 text-sm text-gray-600">
              {formData.status === 'active' && 'Product will be visible to customers'}
              {formData.status === 'out_of_stock' && 'Product will be shown but cannot be added to cart'}
              {formData.status === 'discontinued' && 'Product will be permanently hidden'}
            </p>
          </div>

          {/* Price and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
                            <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
                placeholder="Enter price in KES"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
                placeholder="Enter brand name"
              />
            </div>
          </div>

          {/* Origin and Volume */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
                placeholder="Enter origin"
              />
            </div>

            <div>
              <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                Volume
              </label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
                placeholder="e.g., 750ml"
              />
            </div>
          </div>

          {/* Alcohol Content */}
          <div>
            <label htmlFor="alcoholContent" className="block text-sm font-medium text-gray-700 mb-2">
              Alcohol Content
            </label>
            <input
              type="text"
              id="alcoholContent"
              name="alcoholContent"
              value={formData.alcoholContent}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              placeholder="e.g., 14.5%"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              placeholder="Enter short product description..."
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              placeholder="Enter detailed product description..."
            />
          </div>

          {/* Tasting Notes */}
          <div>
            <label htmlFor="tastingNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Tasting Notes
            </label>
            <textarea
              id="tastingNotes"
              name="tastingNotes"
              value={formData.tastingNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              placeholder="Enter tasting notes..."
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              placeholder="Enter additional notes..."
            />
          </div>

          {/* Product Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display in Sections
            </label>
            <div className="space-y-2">
              {sections.map((section) => (
                <div key={section.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={section.value}
                    name={section.value}
                    checked={formData.sections?.includes(section.value) || false}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor={section.value} className="ml-2 text-sm text-gray-700">
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  id="image"
                  name="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {formData.image && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {formData.image.name}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center space-x-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 
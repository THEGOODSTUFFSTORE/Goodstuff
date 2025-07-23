import React, { useState } from 'react';

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
}

interface ShippingAddressFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialAddress?: Partial<ShippingAddress>;
  isLoading?: boolean;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  onSubmit,
  initialAddress = {},
  isLoading = false
}) => {
  const [address, setAddress] = useState<ShippingAddress>({
    name: initialAddress.name || '',
    email: initialAddress.email || '',
    phone: initialAddress.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={address.name}
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={address.email}
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            required
            placeholder="+254700000000"
            className="block w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-sm transition-all duration-300 transform hover:scale-105 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </form>
  );
};

export default ShippingAddressForm; 
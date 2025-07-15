import React, { useState } from 'react';

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
    phone: initialAddress.phone || '',
    street: initialAddress.street || '',
    city: initialAddress.city || '',
    state: initialAddress.state || '',
    postalCode: initialAddress.postalCode || '',
    country: initialAddress.country || 'Kenya'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={address.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={address.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State/Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
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
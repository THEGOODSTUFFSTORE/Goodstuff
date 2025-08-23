import Link from 'next/link';

export default function CategoryGrid() {
  const categories = [
    {
      name: 'Wine',
      image: '🍷',
      gradient: 'from-red-500 to-red-300',
      href: '/wine'
    },
    {
      name: 'Gin',
      image: '🍸',
      gradient: 'from-orange-500 to-orange-300',
      href: '/gin'
    },
    {
      name: 'Whisky',
      image: '🥃',
      gradient: 'from-amber-600 to-yellow-400',
      href: '/bourbon'
    },
    {
      name: 'Vodka',
      image: '🍾',
      gradient: 'from-lime-500 to-yellow-300',
      href: '/vodka'
    },
    {
      name: 'Beer',
      image: '🍺',
      gradient: 'from-green-500 to-green-300',
      href: '/beer'
    },
    {
      name: 'Rum',
      image: '🥃',
      gradient: 'from-amber-600 to-yellow-400',
      href: '/rum'
    },
    {
      name: 'Tequila',
      image: '🍹',
      gradient: 'from-yellow-500 to-orange-300',
      href: '/tequila'
    },
    {
      name: 'Cider',
      image: '🍺',
      gradient: 'from-green-400 to-yellow-300',
      href: '/cider'
    },
    {
      name: 'Cognac',
      image: '🥃',
      gradient: 'from-amber-700 to-orange-600',
      href: '/cognac'
    },
    {
      name: 'Cream Liquers',
      image: '🍷',
      gradient: 'from-purple-500 to-pink-400',
      href: '/cream-liquers'
    },
    {
      name: 'Mixers',
      image: '🍸',
      gradient: 'from-teal-400 to-cyan-300',
      href: '/mixers'
    },
    {
      name: 'Market',
      image: '🛒',
      gradient: 'from-blue-500 to-green-500',
      href: '/market'
    }
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}></div>
              
              {/* Content */}
              <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                {/* Icon/Image */}
                <div className="mb-4 text-6xl opacity-80 transition-transform duration-300 group-hover:scale-110">
                  {category.image}
                </div>
                
                {/* Category Name */}
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

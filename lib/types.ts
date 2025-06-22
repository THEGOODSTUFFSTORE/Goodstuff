export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  productImage: string;
  price: number;
  description?: string;
  detailedDescription?: string;
  tastingNotes?: string;
  additionalNotes?: string;
  origin?: string;
  alcoholContent?: string;
  volume?: string;
  brand?: string;
}

export interface Wine {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  type: string;
  vintage: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  tags: string[];
}

export interface ContentfulProduct {
  contentTypeId: 'product';
  sys: {
    id: string;
  };
  fields: {
    name: string;
    slug: string;
    category: string;
    subcategory: string;
    productImage: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    price: number;
    description?: string;
    detailedDescription?: string;
    tastingNotes?: string;
    additionalNotes?: string;
    origin?: string;
    alcoholContent?: string;
    volume?: string;
    brand?: string;
  };
}

export interface ContentfulWine {
  contentTypeId: 'wine';
  sys: {
    id: string;
  };
  fields: {
    name: string;
    price: string;
    image: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    type: string;
    vintage: string;
    description?: string;
    isPopular?: boolean;
  };
}

export interface ContentfulBlogPost {
  contentTypeId: 'blogPost';
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    author: string;
    publishDate: string;
    tags: string[];
  };
} 
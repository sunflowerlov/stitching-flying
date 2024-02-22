import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import item1Image from '../assets/images/shop/item1/main.jpg'
import item2Image from '../assets/images/shop/item2/main.JPG'
import item3Image from '../assets/images/shop/item3/main.jpg'
import item4Image from '../assets/images/shop/item4/main.jpg'

const item = [
  {
    id: 0,
    name: 'Crystal Light',
    price: '$1048',
    imageSrc: item1Image,
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 1,
    name: 'Dragon',
    price: '$735',
    imageSrc: item2Image,
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 2,
    name: 'Cloud Fan',
    price: '$289',
    imageSrc: item3Image,
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 3,
    name: 'Camellia',
    price: '$135',
    imageSrc: item4Image,
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  }
]

function Shop() {
  const [products, setProducts] = useState([]); // State to store the fetched products

  useEffect(() => {
    // Function to fetch products data
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data'); // Adjust the URL if necessary
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data); // Update state with fetched data
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="bg-background">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="sr-only">Products</h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product, index) => (
          <Link key={product.id} to={`/item/${product.id}`} className="group">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img
                src={item[index].imageSrc}
                alt={item[index].imageAlt}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
          </Link>
        ))}
      </div>
      <h2 className='mt-20'>More Coming soon ...</h2>
    </div>
  </div>
  )
}

export default Shop;
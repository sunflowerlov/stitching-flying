import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const people = [
  {
    name: 'Order number',
    email: 'name',
    role: 'Purchased',
    lastSeen: 'Date',
    productName: 'product name',
    price: 'price',
    quantity: 'quantity',
    subtotal: 'subtotal'
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    lastSeen: '3h ago',
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    lastSeen: null,
  }
]

export default function Profile() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrderHistory();
    } else {
      console.log('error');
    }
  }, [isLoggedIn]);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/order-history`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      const data = await response.json();
      //console.log('data', data)

      // Transform data to group by order_id
      const groupedOrders = data.reduce((acc, item) => {
        const existingOrder = acc.find(order => order.order_id === item.order_id);
        if (existingOrder) {
          existingOrder.products.push({
            product_name: item.product_name,
            price: item.price,
            quantity: item.quantity
          });
          // Update subtotal
          existingOrder.subtotal += item.price * item.quantity;
        } else {
          acc.push({
            order_id: item.order_id,
            user_name: item.user_name,
            products: [{
              product_name: item.product_name,
              price: item.price,
              quantity: item.quantity
            }],
            subtotal: item.price * item.quantity
          });
        }
        return acc;
      }, []);

      setOrderHistory(groupedOrders);


      //setOrderHistory(data);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]); // Reset order history on error
    }
  };
  console.log('Order history', orderHistory);

  const handlePersonClick = (email) => {
    // Toggle the selected person: if the same person is clicked, deselect, otherwise select the new person
    setSelectedPerson(selectedPerson === email ? null : email);
  };
  return (
    <>
      <div className="min-h-full mt-16">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 px-6">Purchase History</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <ul role="list" className="divide-y divide-gray-100">
              {orderHistory.map((order) => (
                <li className="hover:bg-background gap-x-6 py-5 px-6 rounded-lg">
                  <div className='flex justify-between'>
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">Order number: {order.order_id}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{order.user_name}</p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">Purchased</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {/* <time>{person.lastSeen}</time> */}
                      </p>
                    </div>
                  </div>
                  <div className='mt-6'>Products information</div>
                  {order.products.map((product) => (
                    <div className='text-sm leading-6 text-gray-900'>
                      <div className='mt-4'>{product.product_name}</div>
                      <div className='flex justify-between'>
                        <div>${product.price}</div>
                        <div>Qty: {product.quantity}</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-right mt-6"><strong>Subtotal: ${order.subtotal}</strong></div>
                </li>

              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}

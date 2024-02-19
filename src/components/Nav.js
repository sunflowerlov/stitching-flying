import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Nav({ onCartClick}) {
  const [currentNavItem, setCurrentNavItem] = useState('Home');
  
  const handleNavItemClick = (itemName) => {
    setCurrentNavItem(itemName);
  };

  const navigation = [
    { name: 'Home', href: '/', current: currentNavItem === 'Home' },
    { name: 'Shop', href: '/Shop', current: currentNavItem === 'Shop' },
    { name: 'About', href: '/About', current: currentNavItem === 'About' },
    { name: 'Contact', href: '/Contact', current: currentNavItem === 'Contact' },
    { name: 'Cart', href: '/Cart', current: currentNavItem === 'Cart', isCartLink: true },
  ];

  const account = [
    { name: 'Profile', href: '/Profile', current: currentNavItem === 'Profile' },
  ]

  return (
    <Disclosure as="nav" className="app-nav bg-custom-green bg-opacity-50 w-screen">
    {({ open }) => (
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                logo
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                {navigation.map((item) => {
                if (item.isCartLink) {
                  // Cart button
                  return (
                    <button
                      key={item.name}
                      onClick={onCartClick}
                      className={classNames(
                        'rounded-md px-3 py-2 text-sm font-medium',
                        'text-black hover:bg-gray-700 hover:text-white'
                      )}
                    >
                      {item.name}
                    </button>
                  );
                } else {
                  // Regular navigation link
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => handleNavItemClick(item.name)}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                }
              })}
                </div>
                
              </div>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/Profile"
                          className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => {
                if (item.isCartLink) {
                  // Cart button
                  return (
                    <Disclosure.Button
                      key={item.name}
                      onClick={onCartClick}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                    >
                      {item.name}
                      </Disclosure.Button>
                  );
                } else {
                  // Regular navigation link
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => handleNavItemClick(item.name)}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                      </Link>
                  );
                }
              })}
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
  );
}

export default Nav;
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const people = [
  {
    name: 'Order number',
    email: 'name',
    role: 'Purchased',
    lastSeen: 'Date',
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
  return (
    <>
      <div className="min-h-full mt-16">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Purchase History</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <ul role="list" className="divide-y divide-gray-100">
              {people.map((person) => (
                <li key={person.email} className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">{person.role}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        <time>{person.lastSeen}</time>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}

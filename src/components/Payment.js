import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import './Payment.scss';


function Payment({ items, onClose }) {
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Collect the form data
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData);
    const today = new Date();

    // Define regex patterns
    const patterns = {
      cardholder: /^[a-zA-Z\s]+$/,
      'card-number': /^\d+$/, //dash with quote
      'expire-date': /^(0[1-9]|1[0-2])\/\d{2}$/,
      CVV: /^\d{3,4}$/,
      'street-address': /^[a-zA-Z0-9\s,.'-]{3,}$/,
      city: /^[a-zA-Z',.\s-]{2,25}$/,
      'State/Province': /^[a-zA-Z.\s]{2,}$/,
      'postal-code': /^[a-zA-Z0-9\s]{3,10}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    const calculateTotalPrice = (items) => {
      let total = 0;
    
      items.forEach(item => {
        // Remove the dollar sign and convert the price to a number
        const price = parseFloat(item.price.replace('$', ''));
        // Multiply the price by the quantity
        total += price * item.quantity;
      });
      return total;
    };
    const subtotal = calculateTotalPrice(items);

    // Combine the form data with the cart items
    const orderData = {
      order: formValues,
      products: items,
      subtotal: subtotal.toFixed(2),
      date_of_order: today.toLocaleDateString()
    };
    console.log('order', orderData)

    // Check for empty fields and validate formats
    let formIsValid = true;
    event.target.querySelectorAll('input').forEach(input => {
      const warningContainer = input.nextElementSibling; // Assuming the warning container is right after the input
      const value = input.value.trim();
      const pattern = patterns[input.name];
      // Reset previous states
      warningContainer.textContent = '';
      input.classList.remove('error'); // Remove previous error state
      // Check for empty value or incorrect format
      if (!value || (pattern && !pattern.test(value))) {
        const message = !value ? 'Cannot be empty' : `Please enter a valid value`;
        warningContainer.textContent = message;
        input.classList.add('error'); // Add error class to input
        formIsValid = false;
      }
    });
    if (!formIsValid) {
      return; // Stop if the form is invalid
    }

    //Send the combined data to the server
    try {
      const response = await fetch('http://127.0.0.1:5000/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      // Handle response data
      const data = await response.json();
      console.log(data); // For demonstration

      // Close the payment modal and clear the cart
      onClose();
      // Assuming you have a function to clear the cart in App.js, you should call it here.
      // For example: clearCart();

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-12">

                          <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                  Cardholder
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="cardholder"
                                    id="cardholder"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small class="warning-message"></small>
                                </div>
                              </div>


                              <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                  Card number
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="card-number"
                                    id="card-number"
                                    autoComplete="card-number"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>

                              <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                  Expire Date
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="expire-date"
                                    id="expire-date"
                                    autoComplete="expire-date"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <label htmlFor="CVV" className="block text-sm font-medium leading-6 text-gray-900">
                                  CVV
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="CVV"
                                    id="CVV"
                                    autoComplete="CVV"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>



                              <div className="sm:col-span-3">
                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                  Country
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                  >
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>

                              <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                  Street address
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="street-address"
                                    id="street-address"
                                    autoComplete="street-address"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>

                              <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                  City
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                  State / Province
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="State/Province"
                                    id="region"
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                  ZIP / Postal code
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="postal-code"
                                    id="postal-code"
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>

                              <div className="col-span-full">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                  Email address
                                </label>
                                <div className="mt-2">
                                  <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <small className="warning-message"></small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Place order
                          </button>
                        </div>

                      </form>


                    </div>
                  </div>
                </div>
              </Dialog.Panel>

            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Payment;
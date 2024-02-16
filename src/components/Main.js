import React, { useEffect, useState } from 'react';
import './Main.scss';

function Main() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000')  // Assuming Flask runs on default port 5000
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div className='bg-background'>
    <div className="relative overflow-hidden bg-white banner" >
      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-custom-typo sm:text-6xl">
             Welcome to Stitch Flying
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Hey there! Thanks for visiting our site. Allow us to introduce ourselves!
            </p>
          </div>
        </div>
      </div>
    </div>

      <div className='intro'>
        <div className='intro-image'></div>
      </div>
    </div>
  )
}
export default Main;
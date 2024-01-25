// import React from 'react'
// import { Link } from 'react-router-dom'
// import Logo from '../Logo'

// function Footer() {
//   return (
//     <section classNameName="w-full absolute overflow-hidden py-10 bg-gray-400 border border-t-2 border-t-black">
//             <div classNameName="relative z-10 mx-auto max-w-7xl px-4">
//                 <div classNameName="-m-6 flex flex-wrap">
//                     <div classNameName="w-full p-6 md:w-1/2 lg:w-5/12">
//                         <div classNameName="flex h-full flex-col justify-between">
//                             <div classNameName="mb-4 inline-flex items-center">
//                                 <Logo width="100px" />
//                             </div>
//                             <div>
//                                 <p classNameName="text-sm text-gray-600">
//                                     &copy; Copyright 2023. All Rights Reserved by DevUI.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                     <div classNameName="w-full p-6 md:w-1/2 lg:w-2/12">
//                         <div classNameName="h-full">
//                             <h3 classNameName="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
//                                 Company
//                             </h3>
//                             <ul>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Features
//                                     </Link>
//                                 </li>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Pricing
//                                     </Link>
//                                 </li>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Affiliate Program
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Press Kit
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div classNameName="w-full p-6 md:w-1/2 lg:w-2/12">
//                         <div classNameName="h-full">
//                             <h3 classNameName="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
//                                 Support
//                             </h3>
//                             <ul>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Account
//                                     </Link>
//                                 </li>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Help
//                                     </Link>
//                                 </li>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Contact Us
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Customer Support
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div classNameName="w-full p-6 md:w-1/2 lg:w-3/12">
//                         <div classNameName="h-full">
//                             <h3 classNameName="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
//                                 Legals
//                             </h3>
//                             <ul>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Terms &amp; Conditions
//                                     </Link>
//                                 </li>
//                                 <li classNameName="mb-4">
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Privacy Policy
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link
//                                         classNameName=" text-base font-medium text-gray-900 hover:text-gray-700"
//                                         to="/"
//                                     >
//                                         Licensing
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//   )
// }

// export default Footer

import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'
import "../../App.css"
function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-400 body-font">
            <div className="bg-opacity-75">
                <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
                    <Link className="flex title-font font-medium items-center md:justify-start justify-center text-white" to="/">
                        <Logo />
                        <span className="ml-3 text-xl text-black">ValarMorghulis</span>
                    </Link>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                        <Link className="text-gray-400" to="/">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                        </Link>
                        <Link className="ml-3 text-gray-400" to="/">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </Link>
                        <Link className="ml-3 text-gray-400" to="/">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </Link>
                        <Link className="ml-3 text-gray-400" to="/">
                            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke="none"></circle>
                            </svg>
                        </Link>
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer


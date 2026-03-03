import React from 'react'

const Cont = () => {
    return (
        <div>
            <div className=' flex gap-2 gap-x-2 mt-10 py-10' >
                <div className='flex-1/2' >
                    <p className='font-semibold text-black text-lg' >How it works</p>
                    <h2 className=' text-5xl mt-5 text-black' >
                        The Smarter Way to
                        Stay Connected
                    </h2>
                </div>

                <div className='flex-1/2' >
                    <p className=' text-gray-500' >Experience next-gen connectivity with our E-SIM technology. It’s 100% digital, quick to set up, and works seamlessly across countries giving you freedom, flexibility, and control over your mobile data.</p>
                    <p className=' text-gray-500 mt-5' >Connecting while traveling shouldn’t be complicated. With our E-SIM, it takes just a few taps pick your data plan, scan the QR, and you’re online in seconds, anywhere in the world.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 py-10 mt-10 rounded-xl ">

                <img className="w-full md:w-1/2 rounded-xl object-cover" src="https://esim-olive.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhow1.b03dcdf4.png&w=640&q=75" />

                <div className='flex-1/2' >
                    <div className='w-12 h-12 flex justify-center items-center text-xl bg-gray-200 rounded-full text-black font-semibold' >
                        01
                    </div>

                    <div className='mt-5' >
                        <p className='text-gray-500' >Browse from a wide range of data plans available for your travel destination. Pick the one that fits your needs and budget.</p>

                        <button className='border-black border-1 text-black rounded-4xl px-5 py-2 mt-5  ' >
                            View all Plans
                        </button>
                    </div>

                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 py-10 mt-10 rounded-xl ">
                <div className='flex-1/2 bg-gray-200' >
                </div>

                <div className='flex-1/2' >
                    <div className='w-12 h-12 flex justify-center items-center text-xl bg-gray-200 rounded-full text-black font-semibold' >
                        02
                    </div>

                    <div className='mt-5' >
                        <p className='text-gray-500' >Instantly receive your QR code by email after purchase. Scan the code using your phone to activate your eSIM.</p>

                        <button className='border-black border-1 text-black rounded-4xl px-5 py-2 mt-5  ' >
                            Setup Guide
                        </button>
                    </div>

                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 py-10 mt-10 rounded-xl ">
                <div className='flex-1/2 bg-gray-200' >
                </div>

                <div className='flex-1/2' >
                    <div className='w-12 h-12 flex justify-center items-center text-xl bg-gray-200 rounded-full text-black font-semibold' >
                        03
                    </div>

                    <div className='mt-5' >
                        <p className='text-gray-500' >Instantly receive your QR code by email after purchase. Scan the code using your phone to activate your eSIM.</p>

                        <button className='border-black border-1 text-black rounded-4xl px-5 py-2 mt-5  ' >
                            Check Device Compatiblity
                        </button>
                    </div>

                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 p-10 mt-10 bg-gray-100 rounded-xl ">

                {/* Image */}
                <img
                    src="https://esim-olive.vercel.app/howits.webp"
                    alt="Device Compatibility"
                    className="w-full md:w-1/2 rounded-xl object-cover"
                />

                {/* Content */}
                <div className="w-full md:w-1/2">

                    <h3 className="text-3xl text-black font-semibold">
                        Check Device Compatibility
                    </h3>

                    <p className="text-gray-500 mt-5">
                        Verify Your Device – Make sure your phone or tablet supports eSIM activation for seamless connectivity.
                    </p>

                    <p className="text-gray-500 mt-5">
                        Get Started Instantly – Checking takes just a few seconds, so you can enjoy a hassle-free start to your travel experience.
                    </p>

                    <button className="border cursor-pointer border-black text-black rounded-full px-5 py-2 mt-5 hover:bg-black hover:text-white transition">
                        Check Device Compatibility
                    </button>

                </div>

            </div>

            <div className=' gap-2 gap-x-2 mt-10 py-10' >
                <p className='font-semibold text-black text-lg mb-10' >WHY IT'S SO EASY</p>
                <div className='flex' >
                    <h2 className=' text-5xl text-black flex-1/2' >
                        Built for travelers — enjoy fast
                        activation, flexible plans, and global
                        connectivity with our digital E-SIM.
                    </h2>
                    <div className='flex-1/2' >
                        <p className=' text-gray-500' >Our eSIM is designed to make travel effortless. With quick activation, flexible data plans, and global compatibility, you can stay connected anywhere without the hassle of physical SIM cards or complex setups.</p>
                    </div>
                </div>

            </div>

            <img
                src='https://esim-olive.vercel.app/globabou.jpg'
                className="w-full md:w-1/2 rounded-xl object-cover"
            />


            <div className='mt-10 flex items-center text-black md:flex-row gap-3' >

                <div className='border-1 flex-1/4 border-gray-400 rounded-lg p-5' >
                    <label className='text-xl font-semibold '>Instant Activation</label>
                    <p className='text-gray-400' >
                        Set up in minutes. No physical SIM, no waiting.
                    </p>
                </div>

                <div className='border-1 flex-1/4 border-gray-400 rounded-lg p-5' >
                    <label className='text-xl font-semibold '>Global Coverage</label>
                    <p className='text-gray-400' >
                        Set up in minutes. No physical SIM, no waiting.
                    </p>
                </div>

                <div className='border-1 flex-1/4 border-gray-400 rounded-lg p-5' >
                    <label className='text-xl font-semibold '>Affordable & Transparent</label>
                    <p className='text-gray-400' >
                        Set up in minutes. No physical SIM, no waiting.
                    </p>
                </div>

                <div className='border-1 flex-1/4 border-gray-400 rounded-lg p-5' >
                    <label className='text-xl font-semibold '>Designed for Travelers</label>
                    <p className='text-gray-400' >
                        Set up in minutes. No physical SIM, no waiting.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Cont

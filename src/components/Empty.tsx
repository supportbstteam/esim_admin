import Image from 'next/image'
import React from 'react'

function Empty({ text = "No Data Available" }) {
    return (
        <div className="flex flex-col items-center justify-center self-center" >
            <Image
                src="/empty.svg"
                alt="PayPal"
                width={250}
                height={250}
                className="rounded-full m-2"
            />
            <p className="text-gray-600 mt-2" >{text}</p>
        </div>
    )
}

export default Empty
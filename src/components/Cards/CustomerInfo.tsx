import React from 'react'
import { CiUser, CiMail, CiPhone } from 'react-icons/ci'

function CustomerInfo({ name, email, phone }) {
    return (
        <div className="shadow border rounded py-5 px-5" >
            <h3 className="text-xl font-semibold text-black " >Customer Details</h3>
            <div className="flex items-center justify-between mt-5"  >
                <span className="text-black flex-1 flex items-center gap-1" > <CiUser size={25} />{name}</span>
                {email && <span className="text-black flex-1 flex items-center gap-1 " > <CiMail size={25} /> {email}</span>}
                {phone && <span className="text-black flex-1 flex items-center gap-1 " > <CiPhone size={25} /> {phone}</span>}

            </div>
        </div>
    )
}

export default CustomerInfo
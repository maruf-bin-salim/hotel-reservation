import AuthUI from '@/components/AuthUI/AuthUI'
import { getHotelByIdfromDatabase } from '@/database/functions';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function Hotel({ user }) {

    const [hotel, setHotel] = useState(null);
    const router = useRouter();
    
    async function fetchedHotel(id) {
        const hotel = await getHotelByIdfromDatabase(id);
        setHotel(hotel);
    }

    useEffect(() => {
        if (router.query.id) {
            fetchedHotel(router.query.id);
        }
    }, [router.query.id])
        
    return (
        <div>
            HI {user.email}
            HOTEL {JSON.stringify(hotel)}
        </div>
    )
}


export default function Page() {
    return (
        <AuthUI InnerComponent={Hotel} />
    )
}
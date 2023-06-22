import AuthUI from '@/components/AuthUI/AuthUI'
import { getHotelByIdfromDatabase } from '@/database/functions';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import styles from '@/styles/rooms.module.css'

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


    if (!hotel) {
        return (
            <div className={styles.loading}>
                Loading...
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.cover}
                style={{
                    backgroundImage: `${hotel.image && hotel.image !== '' ? `url(${hotel.image})` : `url(/default.png)`}`,
                }}
            >
                <div className={styles.back_button} onClick={() => { router.push('/') }} />
                <div className={styles.main}>

                    <h1 className={styles.name}>
                        {hotel.name}
                    </h1>

                    <div className={styles.address}>
                        {hotel.address}
                    </div>
                    <div className={styles.description}>
                        {hotel.description}
                    </div>

                    {
                        (Math.floor(hotel.rating) > 0) ?
                            <div className={styles.rating_stars}>
                                {`${hotel.rating} / 5`}
                            </div>

                            :
                            <div className={styles.rating_stars}>
                                {`No rating yet!`}
                            </div>
                    }

                </div>
            </div>

            {/* main */}
            <div className={styles.main_content}>
            </div>
        </div>
    )
}


export default function Page() {
    return (
        <AuthUI InnerComponent={Hotel} />
    )
}
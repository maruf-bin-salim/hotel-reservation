import AuthUI from '@/components/AuthUI/AuthUI'
import { getHotelByIdfromDatabase, getRoomsFromDatabaseByHotelID } from '@/database/functions';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import styles from '@/styles/hotel.module.css'


// const room = {
//     id: roomID,
//     title: roomTitle,
//     price: roomPrice,
//     description: roomDescription,
//     image: roomImageUrl,
//     type: selectedRoomType,
//     hotelID: hotelID,
//     reservationStartTimestamp: null,
//     reservationForDays: null,
// }

function Room({ room }) {
    return (
        <div className={styles.room}>
            <div className={styles.room_image}>
                {
                    <img src={room.image && room.image !== '' ? room.image : '/default.png'} />
                }
            </div>

            <div className={styles.info_container}>
                <div className={styles.room_name}>
                    <h2>{room.title}</h2>
                </div>
                <div className={styles.room_description}>
                    <p>Description :  {room.description} </p>


                </div>
                <div className={styles.room_price}>
                    <p>
                        {`Price : $${room.price} / day`}
                    </p>
                </div>
                <div className={styles.room_type}>
                    <p>
                        {"Type : "}{room.type}
                    </p>
                </div>
            </div>
        </div>
    )
}


function Hotel({ user }) {


    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const router = useRouter();

    async function fetchedHotel(id) {
        const hotel = await getHotelByIdfromDatabase(id);
        setHotel(hotel);
    }

    async function fetchedRooms(hotelID) {
        const rooms = await getRoomsFromDatabaseByHotelID(hotelID);
        setRooms(rooms);
    }

    useEffect(() => {
        if (router.query.id) {
            fetchedHotel(router.query.id);
            fetchedRooms(router.query.id);
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
            <div className={styles.flex_container}>
                <div className={styles.main_content}>
                    {
                        rooms.map(room => {
                            return (
                                <Room key={room.id} room={room} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}


export default function Page() {
    return (
        <AuthUI InnerComponent={Hotel} />
    )
}
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

function BookingOverlay({ room, user, setShowBookingOverlay, setIsLoading }) {

    const [selectedDate, setSelectedDate] = useState('');
    const [numberOfDays, setNumberOfDays] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };


    const handleNumberOfDaysChange = (event) => {
        const value = parseInt(event.target.value);
        if (Number.isInteger(value)) {
            setNumberOfDays(value);
        }
    };

    return (
        <div className={styles.booking_overlay}>
            <div className={styles.booking_overlay_container} onClick={() => { }}>
                {JSON.stringify(room)}
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <input
                    type="number"
                    placeholder="Number of days"
                    value={numberOfDays}
                    onChange={handleNumberOfDaysChange}
                />
            </div>
        </div>
    )

}

function Room({ room, setShowBookingOverlay, setSelectedRoom }) {
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
            <div className={styles.room_button_container}>
                <button className={styles.room_button} onClick={() => {
                    setSelectedRoom(room);
                    setShowBookingOverlay(true);
                }}>
                    Book Now
                </button>
            </div>
        </div>
    )
}


function Hotel({ user }) {


    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showBookingOverlay, setShowBookingOverlay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        if (router.query.id && isLoading === false) {
            fetchedHotel(router.query.id);
            fetchedRooms(router.query.id);
        }
    }, [router.query.id, isLoading])




    if (!hotel) {
        return (
            <div className={styles.loading}>
                Loading...
            </div>
        )
    }

    return (
        <div className={styles.page}>
            {
                showBookingOverlay &&
                <BookingOverlay
                    room={selectedRoom}
                    user={user}
                    setShowBookingOverlay={setShowBookingOverlay}
                    setIsLoading={setIsLoading}
                />
            }
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
                                <Room key={room.id}
                                    room={room}
                                    setShowBookingOverlay={setShowBookingOverlay}
                                    setSelectedRoom={setSelectedRoom}
                                />
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
import AuthUI from '@/components/AuthUI/AuthUI'
import { getHotelByIdfromDatabase, getRoomsFromDatabaseByHotelID, updateRoomToDatabase } from '@/database/functions';
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

function BookingOverlay({ room, user, hotel, setShowBookingOverlay, isLoading, setIsLoading }) {

    const [selectedDate, setSelectedDate] = useState('');
    const [numberOfDays, setNumberOfDays] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    function getTimestampFromDate(date) {
        const dateObject = new Date(date);
        return dateObject.getTime();
    }


    const handleNumberOfDaysChange = (event) => {
        if (event.target.value === '') {
            setNumberOfDays('');
            return;
        }
        const value = parseInt(event.target.value);
        if (Number.isInteger(value)) {
            setNumberOfDays(value);
        }
    };

    async function makeReservation() {
        if (selectedDate === '' || numberOfDays === '') return;

        let reservationStartTimestamp = getTimestampFromDate(selectedDate);
        let reservationForDays = parseInt(numberOfDays);

        const newRoom = {
            ...room,
            reservationStartTimestamp,
            reservationForDays,
        }

        setIsLoading(true);
        await updateRoomToDatabase(newRoom);
        setIsLoading(false);
        setShowBookingOverlay(false);


    }

    return (
        <div className={styles.booking_overlay}>
            <div className={styles.booking_overlay_container}>
                <div className={styles.booking_overlay_close_button} onClick={() => { setShowBookingOverlay(false) }} >
                    <h2>X</h2>
                </div>
                <h1>
                    {`Book "${room.title}" at ${hotel.name}`}
                </h1>
                {
                    numberOfDays !== '' &&
                    <h3>
                        Total Price : {room.price} X {numberOfDays} = ${room.price * numberOfDays}
                    </h3>
                }
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


                {
                    !isLoading &&
                    <button onClick={async () => {
                        await makeReservation();
                    }}>
                        confirm booking
                    </button>
                }
            </div>
        </div>
    )

}

function Room({ room, setShowBookingOverlay, setSelectedRoom }) {

    function isBookable(room) {
        if (room.reservationStartTimestamp === null || room.reservationForDays === null) {
            return true;
        }
        const todayTimestamp = new Date().getTime();
        const reservationEndTimestamp = room.reservationStartTimestamp + (room.reservationForDays * 86400000);
        return todayTimestamp > reservationEndTimestamp;
    }
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
            {
                isBookable(room) &&
                <div className={styles.room_button_container}>
                    <button className={styles.room_button} onClick={() => {
                        setSelectedRoom(room);
                        setShowBookingOverlay(true);
                    }}>
                        Book Now
                    </button>
                </div>
            }
            {
                !isBookable(room) &&
                <div className={styles.room_button_container}>
                    <p> Can't book, room occupied ... </p>
                </div>
            }
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
                    hotel={hotel}
                    setShowBookingOverlay={setShowBookingOverlay}
                    isLoading={isLoading}
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
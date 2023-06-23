import AuthUI from '@/components/AuthUI/AuthUI'
import { addBookingToDatabase, getBookingsFromDatabaseByRoomID, getHotelByIdfromDatabase, getRoomsFromDatabaseByHotelID, updateRoomToDatabase } from '@/database/functions';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import styles from '@/styles/hotel.module.css'
import { generateID } from '@/utils/generateID';



function BookingOverlay({ room, user, hotel, setShowBookingOverlay, isLoading, setIsLoading }) {

    const [selectedDate, setSelectedDate] = useState('');
    const [numberOfDays, setNumberOfDays] = useState('');
    const [bookings, setBookings] = useState([]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    function getTimestampFromDate(date) {
        const dateObject = new Date(date);
        return dateObject.getTime();
    }

    async function fetchBookingsOfRoomID(roomID) {
        const fetchedBookubgs = await getBookingsFromDatabaseByRoomID(roomID);
        setBookings(fetchedBookubgs);
    }

    useEffect(() => {
        if (room && room.id) {
            fetchBookingsOfRoomID(room.id);
        }
    }, [room])

    useEffect(() => {
        console.log('bookings', bookings);
    }, [bookings])



    function canMakeReservation(bookings, reservationStartTimestamp, reservationEndTimestamp) {

        const now = new Date().getTime();
        if (reservationStartTimestamp < now) {
            return {
                state: false,
                rangeError: 'Reservation start date cannot be in the past',
            };
        }


        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];
            const startTimestamp = booking.startTimestamp;
            const endTimestamp = startTimestamp + (booking.bookedFor * 24 * 60 * 60 * 1000);

            if (
                (reservationStartTimestamp >= startTimestamp && reservationStartTimestamp < endTimestamp) ||
                (reservationEndTimestamp > startTimestamp && reservationEndTimestamp <= endTimestamp) ||
                (reservationStartTimestamp <= startTimestamp && reservationEndTimestamp >= endTimestamp)
            ) {
                return {
                    state: false,
                    rangeError: `Already a booking exists between ${new Date(startTimestamp)} and ${new Date(endTimestamp)}`,
                };
            }
        }

        return {
            state: true,
            rangeError: null,
        };
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

        const booking = {
            id: generateID('booking'),
            roomID: room.id,
            hotelID: hotel.id,
            userID: user.uid,
            startTimestamp: getTimestampFromDate(selectedDate),
            bookedFor: parseInt(numberOfDays),
            price: room.price * parseInt(numberOfDays),
            rating: null,
            status: 'rating_pending',
            hotelName: hotel.name,
            roomTitle: room.title,
        }

        setIsLoading(true);
        await updateRoomToDatabase(newRoom);
        await addBookingToDatabase(booking);
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
                    selectedDate !== '' &&
                    canMakeReservation(bookings, getTimestampFromDate(selectedDate), getTimestampFromDate(selectedDate) + numberOfDays * 86400000).state &&
                    <h3>
                        Total Price : {room.price} X {numberOfDays} = ${room.price * numberOfDays}
                    </h3>
                }

                {
                    numberOfDays !== '' && selectedDate !== '' && !canMakeReservation(bookings, getTimestampFromDate(selectedDate), getTimestampFromDate(selectedDate) + numberOfDays * 86400000).state &&
                    <div className={styles.error}>
                        <h3>
                            {canMakeReservation(bookings, getTimestampFromDate(selectedDate), getTimestampFromDate(selectedDate) + numberOfDays * 86400000).rangeError}
                        </h3>
                    </div>
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
                    !isLoading && numberOfDays !== '' && selectedDate !== '' && canMakeReservation(bookings, getTimestampFromDate(selectedDate), getTimestampFromDate(selectedDate) + numberOfDays * 86400000).state &&
                    <button onClick={async () => {
                        await makeReservation();
                    }}>
                        Confirm Booking
                    </button>
                }
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
                    <p><span> Description : </span> {room.description} </p>


                </div>
                <div className={styles.room_price}>
                    <p>
                        <span>
                            Price :
                        </span>
                        {` $${room.price} / day`}
                    </p>
                </div>
                <div className={styles.room_type}>
                    <p>
                        <span> {"Type : "} </span> {room.type}
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
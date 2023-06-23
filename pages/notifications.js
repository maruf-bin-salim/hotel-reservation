import AuthUI from "@/components/AuthUI/AuthUI";
import { getBookingsFromDatabaseByUserID } from "@/database/functions";
import styles from '@/styles/notifications.module.css'
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react'

function NavigationBar() {
    const router = useRouter();

    return (
        <div className={styles.navigation_bar}>
            <div className={styles.navigation_bar_item} onClick={() => { router.push('/') }}>
                Home
            </div>
        </div>
    )
}
// const booking = {
//     id: generateID('booking'),
//     roomID: room.id,
//     hotelID: hotel.id,
//     userID: user.uid,
//     startTimestamp: getTimestampFromDate(selectedDate),
//     bookedFor: parseInt(numberOfDays),
//     price: room.price * parseInt(numberOfDays),
//     rating: null,
//     status: 'rating_pending',
//     hotelName: hotel.name,
//     roomTitle: room.title,
// }


function BookingHistory({ booking }) {

    function getDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toDateString();
    }
    return (
        <div className={styles.booking_history}>
            <div className={styles.booking_history_item}>
                <div className={styles.booking_history_item_title}>
                    Your booking for {booking.hotelName} - {booking.roomTitle} is was successful!
                </div>
                <div className={styles.booking_history_item_details}>
                    <h3>
                        Start Date
                    </h3>
                    {getDateFromTimestamp(booking.startTimestamp)}
                </div>
                <div className={styles.booking_history_item_details}>
                    <h3>
                        End Date
                    </h3>
                    {getDateFromTimestamp(booking.startTimestamp + booking.bookedFor * 24 * 60 * 60 * 1000)}
                </div>
                <div className={styles.booking_history_item_details}>
                    <h3>
                        Total Price
                    </h3>
                    {booking.price}$
                </div>
            </div>
        </div>
    )


}

function Notifications({ user }) {

    const [bookings, setBookings] = useState([]);

    async function fetcheBooking(id) {
        const bookingList = await getBookingsFromDatabaseByUserID(id);
        setBookings(bookingList);
    }

    useEffect(() => {
        fetcheBooking(user.uid);
    }, [user])



    return (
        <div className={styles.page}>
            <NavigationBar />
            {
                bookings.map(booking => {
                    return (
                        <BookingHistory booking={booking} />
                    )
                })
            }
        </div>
    )
}


export default function Page() {
    return (
        <AuthUI InnerComponent={Notifications} />
    )
}
import AuthUI from "@/components/AuthUI/AuthUI";
import { getBookingsFromDatabaseByUserID, getHotelByIdfromDatabase, updateBookingToDatabase, updateHotelToDatabase } from "@/database/functions";
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



function BookingHistory({ booking, isLoading, setIsLoading }) {


    const [rating, setRating] = useState(5);

    function getDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toDateString();
    }

    function isBookingExpired() {
        const now = new Date().getTime();
        const end = booking.startTimestamp + booking.bookedFor * 24 * 60 * 60 * 1000;
        return now > end;
    }




    async function leaveRating() {
        const newBooking = {
            ...booking,
            rating: parseInt(rating),
            status: 'rating_given'
        }
        setIsLoading(true);
        await updateBookingToDatabase(newBooking);
        const hotel = await getHotelByIdfromDatabase(booking.hotelID);
        const newHotel = {
            ...hotel,
            rating: (hotel.rating * hotel.numberOfRatings + parseInt(rating)) / (hotel.numberOfRatings + 1),
            numberOfRatings: hotel.numberOfRatings + 1
        }
        await updateHotelToDatabase(newHotel);
        setIsLoading(false);
    }

    async function skipRating() {
        const newBooking = {
            ...booking,
            status: 'rating_cancelled'
        }
        setIsLoading(true);
        await updateBookingToDatabase(newBooking);
        setIsLoading(false);
    }




    return (

        <div className={styles.booking_history}>

            <div className={styles.booking_started}>
                <div className={styles.booking_history_item}>
                    <div className={styles.booking_history_item_title}>
                        <h1>Your booking for {booking.hotelName} - {booking.roomTitle} was successful!</h1>
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


            {
                (isBookingExpired()) &&
                <div className={styles.booking_review}>

                    {
                        booking.status === 'rating_pending' &&
                        <div>

                            <h1>
                                Your booking for {booking.hotelName} - {booking.roomTitle}  has ended!
                            </h1>
                            <h2>
                                Please leave a rating for the hotel!
                            </h2>
                            <div className={styles.rating_system}>
                                <select value={rating} onChange={(e) => { setRating(e.target.value) }}>
                                    <option value={1}>
                                        1 star
                                    </option>
                                    <option value={2}>
                                        2 stars
                                    </option>
                                    <option value={3}>
                                        3 stars
                                    </option>
                                    <option value={4}>
                                        4 stars
                                    </option>
                                    <option value={5}>
                                        5 stars
                                    </option>
                                </select>

                                <button onClick={leaveRating}>
                                    Leave a rating
                                </button>
                                <button onClick={skipRating}>
                                    Skip
                                </button>
                            </div>
                        </div>
                    }

                    {
                        booking.status === 'rating_given' &&
                        <div>
                            <h1>
                                your booking for {booking.hotelName} - {booking.roomTitle}  has ended!
                            </h1>
                            <h3>
                                You have already left a rating of {booking.rating} / 5 stars for this booking!
                            </h3>
                        </div>
                    }
                    {
                        booking.status === 'rating_cancelled' &&
                        <div>
                            <h1>Your booking for {booking.hotelName} - {booking.roomTitle}  has ended!</h1>
                        </div>
                    }
                </div>
            }




        </div>
    )


}

function Notifications({ user }) {

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetcheBooking(id) {
        const bookingList = await getBookingsFromDatabaseByUserID(id);
        setBookings(bookingList);
    }

    useEffect(() => {
        if (!isLoading && user) {
            fetcheBooking(user.uid);
        }
    }, [isLoading, user])



    return (
        <div className={styles.page}>

            <NavigationBar />
            <h1 className={styles.notification_bar}>Notification History</h1>
            <div className={styles.main}>

                {
                    bookings.map(booking => {
                        return (
                            <BookingHistory booking={booking} isLoading={isLoading} setIsLoading={setIsLoading} />
                        )
                    })

                }
            </div>
        </div>
    )
}


export default function Page() {
    return (
        <AuthUI InnerComponent={Notifications} />
    )
}
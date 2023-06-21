import AuthUI from '@/components/AuthUI/AuthUI';
import useAuth from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/admin.module.css';
import { useRouter } from 'next/router';
import { addHotelToDatabase, deleteHotelByIdfromDatabase, getHotelsFromDatabase, updateHotelToDatabase } from '@/database/functions';
import { generateID } from '@/utils/generateID';


const PAGE_MODE = {
    ADD_HOTEL: 'add_hotel',
    EDIT_HOTEL: 'edit_hotel',
}


function NavigationBar({ mode, setMode }) {
    let { logOut } = useAuth();

    return (
        <div className={styles.navigation_bar}>
            <div className={mode === PAGE_MODE.ADD_HOTEL ? styles.navigation_bar_item_active : styles.navigation_bar_item} onClick={() => setMode(PAGE_MODE.ADD_HOTEL)}>
                Add Hotel
            </div>
            <div className={mode === PAGE_MODE.EDIT_HOTEL ? styles.navigation_bar_item_active : styles.navigation_bar_item} onClick={() => setMode(PAGE_MODE.EDIT_HOTEL)}>
                Edit Hotel
            </div>
            <div className={styles.navigation_bar_item} onClick={() => { logOut() }}>
                Logout
            </div>
        </div>
    )
}

function AddHotel() {

    let [isLoading, setIsLoading] = useState(false);
    let [hotelName, setHotelName] = useState('');
    let [hotelAddress, setHotelAddress] = useState('');
    let [hotelImage, setHotelImage] = useState('');
    let [hotelDescription, setHotelDescription] = useState('');


    async function addHotel() {
        let id = generateID('hotel');
        const hotel = {
            id: id,
            name: hotelName,
            address: hotelAddress,
            image: hotelImage,
            description: hotelDescription,
            rating: 0,
        }
        setIsLoading(true);
        await addHotelToDatabase(hotel);
        setIsLoading(false);
    }


    return (
        <div className={styles.add_hotel}>
            <div className={styles.add_hotel_container}>

                {/* add hotel form */}
                <div className={styles.add_hotel_form}>
                    <div className={styles.add_hotel_form_item}>
                        <label>Hotel Name</label>
                        <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                    </div>
                    <div className={styles.add_hotel_form_item}>
                        <label>Hotel Address</label>
                        <input type="text" value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
                    </div>
                    <div className={styles.add_hotel_form_item}>
                        <label> Hotel Description</label>
                        <textarea type="text" value={hotelDescription} onChange={(e) =>
                            hotelDescription.length < 500 &&
                            setHotelDescription(e.target.value)} />
                    </div>
                    <div className={styles.add_hotel_form_item}>
                        <label>Hotel Image</label>
                        <input type="text" onChange={(e) => setHotelImage(e.target.value)} />
                    </div>
                </div>
                {
                    !isLoading &&
                    <div className={styles.add_hotel_button} onClick={async () => await addHotel()}>
                        Add Hotel
                    </div>
                }

                {/* preview */}
                {
                    (hotelName.length > 0 || hotelAddress.length > 0 || hotelDescription.length > 0 || hotelImage.length > 0) &&
                    <div className={styles.add_hotel_preview}>

                        <div className={styles.add_hotel_preview_image}>
                            <img src={hotelImage ? hotelImage : '/default.png'} />
                        </div>

                        <div className={styles.add_hotel_preview_informations}>
                            <div className={styles.add_hotel_preview_name}>
                                <h2>
                                    {hotelName.length > 0 ? "Hotel Name" : ""}
                                </h2>
                                {hotelName}
                            </div>
                            <div className={styles.add_hotel_preview_address}>
                                <h2>
                                    {hotelAddress.length > 0 ? "Hotel Address" : ""}
                                </h2>
                                {hotelAddress}
                            </div>
                            <div className={styles.add_hotel_preview_description}>
                                <h2>
                                    {hotelDescription.length > 0 ? "Hotel Description" : ""}
                                </h2>
                                {hotelDescription}
                            </div>
                        </div>


                    </div>
                }

            </div>


        </div>
    )
}


function EditHotel({ hotel, isLoading, setIsLoading }) {
    // return inputs and preview similaer to add hotel with the same css
    // add a button to update hotel
    // add a button to delete hotel
    // add a button to go to rooms of this hotel

    const [hotelName, setHotelName] = useState(hotel.name);
    const [hotelAddress, setHotelAddress] = useState(hotel.address);
    const [hotelImage, setHotelImage] = useState(hotel.image);
    const [hotelDescription, setHotelDescription] = useState(hotel.description);

    const router = useRouter();


    async function deleteHotel() {
        let id = hotel.id;
        setIsLoading(true);
        await deleteHotelByIdfromDatabase(id);
        setIsLoading(false);
    }

    async function updateHotel() {
        const updated = {
            id: hotel.id,
            name: hotelName,
            address: hotelAddress,
            image: hotelImage,
            description: hotelDescription,
            rating: hotel.rating,
        }

        setIsLoading(true);
        await updateHotelToDatabase(updated);
        setIsLoading(false);

    }


    return (
        <div className={styles.edit_hotel}>
            <div className={styles.edit_hotel_container}>
                <div className={styles.edit_hotel_form}>
                    <div className={styles.edit_hotel_form_item}>
                        <label>Hotel Name</label>
                        <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                    </div>
                    <div className={styles.edit_hotel_form_item}>
                        <label>Hotel Address</label>
                        <input type="text" value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
                    </div>
                    <div className={styles.edit_hotel_form_item}>
                        <label> Hotel Description</label>
                        <textarea type="text" value={hotelDescription} onChange={(e) =>
                            hotelDescription.length < 500 &&
                            setHotelDescription(e.target.value)} />
                    </div>
                    <div className={styles.edit_hotel_form_item}>
                        <label>Hotel Image</label>
                        <input type="text" onChange={(e) => setHotelImage(e.target.value)} />
                    </div>
                </div>
                {
                    !isLoading &&
                    <div className={styles.edit_hotel_buttons}>
                        <div className={styles.edit_hotel_button} onClick={async () => await updateHotel()}>
                            Update Hotel
                        </div>

                        <div className={styles.edit_hotel_button} onClick={async () => await deleteHotel()}>
                            Delete Hotel
                        </div>

                        <div className={styles.edit_hotel_button}>
                            Go to Rooms
                        </div>
                    </div>
                }


                <div className={styles.edit_hotel_preview}>
                    <div className={styles.edit_hotel_preview_image}>
                        <img src={hotelImage ? hotelImage : '/default.png'} />
                    </div>
                    <div className={styles.edit_hotel_preview_informations}>
                        <div className={styles.edit_hotel_preview_name}>
                            <h2>
                                {hotelName.length > 0 ? "Hotel Name" : ""}
                            </h2>
                            {hotelName}
                        </div>
                        <div className={styles.edit_hotel_preview_address}>
                            <h2>
                                {hotelAddress.length > 0 ? "Hotel Address" : ""}
                            </h2>
                            {hotelAddress}
                        </div>
                        <div className={styles.edit_hotel_preview_description}>
                            <h2>
                                {hotelDescription.length > 0 ? "Hotel Description" : ""}
                            </h2>
                            {hotelDescription}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditHotelsContainer() {

    let [hotels, setHotels] = useState([]);
    let [isLoading, setIsLoading] = useState(false);

    async function fetchHotels() {
        const fetchedHotels = await getHotelsFromDatabase();
        setHotels(fetchedHotels);
    }

    useEffect(() => {
        if (!isLoading) fetchHotels();
    }, [isLoading])

    return (
        <div className={styles.edit_hotel_container}>
            {
                hotels.map(hotel => {
                    return (
                        <EditHotel key={hotel.id} hotel={hotel} isLoading={isLoading} setIsLoading={setIsLoading} />
                    )
                })
            }
        </div>
    )
}

function Admin({ user }) {

    const [mode, setMode] = useState(PAGE_MODE.ADD_HOTEL);

    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/');
        }
        if (user && user.email !== 'admin@gmail.com') {
            router.push('/');
        }
    }, [user])

    return (
        <div className={styles.page}>
            <NavigationBar mode={mode} setMode={setMode} />
            {mode === PAGE_MODE.ADD_HOTEL && <AddHotel />}
            {mode === PAGE_MODE.EDIT_HOTEL && <EditHotelsContainer />}
        </div>
    )
}



export default function Page() {
    return (
        <AuthUI InnerComponent={Admin} isAdmin={true} />
    )
}
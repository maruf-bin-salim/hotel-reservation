import AuthUI from '@/components/AuthUI/AuthUI';
import useAuth from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/admin.module.css';
import { useRouter } from 'next/router';


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

    let [hotelName, setHotelName] = useState('');
    let [hotelAddress, setHotelAddress] = useState('');
    let [hotelImage, setHotelImage] = useState('');
    let [hotelDescription, setHotelDescription] = useState('');


    async function addHotel() {

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

                <div className={styles.add_hotel_button} onClick={async () => await addHotel()}>
                    Add Hotel
                </div>

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

function EditHotelsContainer() {
    return (
        <div className={styles.edit_hotel_container}>
            Edit hotel
        </div>
    )
}

function Admin({user}) {

    const [mode, setMode] = useState(PAGE_MODE.ADD_HOTEL);

    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/');
        }
        if(user && user.email !== 'admin@gmail.com'){
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
import AuthUI from '@/components/AuthUI/AuthUI'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/rooms.module.css'
import { getHotelByIdfromDatabase } from '@/database/functions'

const PAGE_MODE = {
    CREATE: 'create',
    EDIT: 'edit'
}


function NavigationBar({ mode, setMode }) {
    const router = useRouter();

    return (
        <div className={styles.navigation_bar}>

            <div className={styles.navigation_bar_item} onClick={() => { router.push('/admin') }}>
                Go Back
            </div>

            <div className={mode === PAGE_MODE.CREATE ? styles.navigation_bar_item_active : styles.navigation_bar_item} onClick={() => setMode(PAGE_MODE.CREATE)}>
                Add Room 
            </div>
            <div className={mode === PAGE_MODE.EDIT ? styles.navigation_bar_item_active : styles.navigation_bar_item} onClick={() => setMode(PAGE_MODE.EDIT)}>
                Edit Rooms
            </div>
            
        </div>
    )
}

function CreateRoom({ hotelID }) {
    return (
        <div>
            create room
        </div>
    )
}

function EditRooms({ hotelID }) {
    return (
        <div>
            edit rooms
        </div>
    )
}

function Hotel({ hotelID}) {

    const [hotel, setHotel] = useState(null);

    async function fetchedHotel(id) {
        const fetchedHotel = await getHotelByIdfromDatabase(id);
        setHotel(fetchedHotel);
    }
    

    useEffect(() => {
        if (hotelID) {
            fetchedHotel(hotelID);
        }
    }, [hotelID]);

    if(hotel){
        return (
            <div>
                <h1>{hotel.name}</h1>
                <h3>{hotel.address}</h3>
            </div>
        )
    }
}
function Room({ user }) {

    const router = useRouter();
    const { id } = router.query;
    const [mode, setMode] = React.useState(PAGE_MODE.CREATE);


    useEffect(() => {
        if (user && user.email !== 'admin@gmail.com') {
            router.push('/');
        }
    }, [user])


    return (
        <div className={styles.page}>
            <NavigationBar mode={mode} setMode={setMode} />
            <Hotel hotelID={id} />
            {mode === PAGE_MODE.CREATE && <CreateRoom hotelID={id} />}
            {mode === PAGE_MODE.EDIT && <EditRooms hotelID={id} />}
        </div>
    )
}

export default function Page() {
    return (
        <AuthUI InnerComponent={Room} isAdmin={true} />
    )
}
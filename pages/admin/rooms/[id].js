import AuthUI from '@/components/AuthUI/AuthUI'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/rooms.module.css'
import { addRoomToDatabase, getHotelByIdfromDatabase } from '@/database/functions'
import { generateID } from '@/utils/generateID'


const PAGE_MODE = {
    CREATE: 'create',
    EDIT: 'edit'
}

const ROOM_TYPES = {
    STANDARD: 'standard',
    DELUXE: 'DELUXE',
    SUITE: 'SUITE',
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

    const [selectedRoomType, setSelectedRoomType] = useState('standard');
    const [roomTitle, setRoomTitle] = useState('');
    const [roomPrice, setRoomPrice] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [roomImageUrl, setRoomImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleRoomTitleChange = (event) => {
        setRoomTitle(event.target.value);
    };

    const handleRoomPriceChange = (event) => {
        setRoomPrice(event.target.value);
    };

    const handleRoomDescriptionChange = (event) => {
        setRoomDescription(event.target.value);
    };

    const handleRoomImageUrlChange = (event) => {
        setRoomImageUrl(event.target.value);
    };



    const handleRoomTypeChange = (event) => {
        setSelectedRoomType(event.target.value);
    };

    async function addRomm() {
        const roomID = generateID('room');
        const room = {
            id: roomID,
            title: roomTitle,
            price: roomPrice,
            description: roomDescription,
            image: roomImageUrl,
            type: selectedRoomType,
            hotelID: hotelID,
            reservationStartTimestamp: null,
            reservationForDays: null,
        }
        setIsLoading(true);
        await addRoomToDatabase(room);
        setIsLoading(false);
    }


    return (
        <div className={styles.add_room}>
            <div className={styles.add_room_form}>
                <h2>Add a Room</h2>
                <div className={styles.room_input}>
                    <label>
                        Room Title:
                    </label>
                    <input
                        type="text"
                        value={roomTitle}
                        onChange={handleRoomTitleChange}
                    />
                </div>
                <div className={styles.room_input}>
                    <label>
                        Room Price per Day:
                    </label>
                    <input
                        type="number"
                        value={roomPrice}
                        onChange={handleRoomPriceChange}
                    />
                </div>
                <div className={styles.room_input}>
                    <label>
                        Room Description:
                    </label>
                    <textarea
                        value={roomDescription}
                        onChange={handleRoomDescriptionChange}
                    ></textarea>
                </div>
                <div className={styles.room_input}>
                    <label>
                        Room Image URL:
                    </label>
                    <input
                        type="text"
                        value={roomImageUrl}
                        onChange={handleRoomImageUrlChange}
                    />
                </div>

                <div className={styles.room_input}>
                    <label>
                        Room Type:
                    </label>
                    <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                        <option value="standard">Standard Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="suite">Suite</option>
                    </select>
                </div>

            </div>

            {
                (!isLoading && roomTitle.length > 0 && roomPrice.length > 0 && roomDescription.length > 0) &&
                <div className={styles.add_room_button_container}>
                    <button onClick={async () => {
                        await addRomm();
                    }}>
                        Add Room
                    </button>
                </div>
            }



            {
                (roomTitle.length > 0 || roomPrice.length > 0 || roomDescription.length > 0 || roomImageUrl.length > 0) &&
                <div className={styles.add_room_preview}>

                    <div className={styles.add_room_preview_image}>
                        <img src={roomImageUrl ? roomImageUrl : '/default.png'} />
                    </div>
                    <div className={styles.add_room_preview_info}>
                        {
                            roomTitle.length > 0 &&
                            <p>Title: {roomTitle}</p>
                        }
                        {
                            roomPrice.length > 0 &&
                            <p>Price per Day: {roomPrice}</p>
                        }
                        {
                            roomDescription.length > 0 &&
                            <p>Description: {roomDescription}</p>
                        }
                        <p>Room Type: {selectedRoomType}</p>
                    </div>
                </div>
            }




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

function Hotel({ hotelID }) {

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

    if (hotel) {
        return (
            <div className={styles.hotel}>
                <img src={hotel.image === '' ? '/default.png' : hotel.image} />
                <h1>{hotel.name}</h1>
                <h3>{hotel.address}</h3>
            </div>
        )
    }
}
function Room({ user }) {
    const [selectedRoomType, setSelectedRoomType] = useState('standard');

    const handleRoomTypeChange = (event) => {
        setSelectedRoomType(event.target.value);
    };


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
            <div className={styles.main}>
                <Hotel hotelID={id} />
                {mode === PAGE_MODE.CREATE && <CreateRoom hotelID={id} />}
                {mode === PAGE_MODE.EDIT && <EditRooms hotelID={id} />}
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <AuthUI InnerComponent={Room} isAdmin={true} />
    )
}
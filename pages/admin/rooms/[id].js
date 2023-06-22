import AuthUI from '@/components/AuthUI/AuthUI'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/rooms.module.css'
import { addRoomToDatabase, deleteRoomByIdFromDatabase, getHotelByIdfromDatabase, getRoomsFromDatabaseByHotelID, updateRoomToDatabase } from '@/database/functions'
import { generateID } from '@/utils/generateID'


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

function CreateRoom({ hotelID, isLoading, setIsLoading }) {

    const [selectedRoomType, setSelectedRoomType] = useState('standard');
    const [roomTitle, setRoomTitle] = useState('');
    const [roomPrice, setRoomPrice] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [roomImageUrl, setRoomImageUrl] = useState('');


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
            lastReservedBY: null,
            reservationStartTimestamp: null,
            reservationForDays: null,
        }
        setIsLoading(true);
        await addRoomToDatabase(room);
        setIsLoading(false);
    }


    return (
        <div className={styles.add_room}>
            <div>

                <div className={styles.add_room_form}>
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

            </div>


            {
                (roomTitle.length > 0 || roomPrice.length > 0 || roomDescription.length > 0 || roomImageUrl.length > 0) &&
                <div className={styles.add_room_preview}>

                    <div className={styles.add_room_preview_image}>
                        <img src={roomImageUrl ? roomImageUrl : '/default.png'} />
                    </div>
                    <div className={styles.add_room_preview_info}>
                        {
                            roomTitle.length > 0 &&
                            <p> <span className={styles.preview_info}> Title:  </span> {roomTitle}</p>
                        }
                        {
                            roomPrice.length > 0 &&
                            <p><span className={styles.preview_info}> Price per Day : </span>{roomPrice}</p>
                        }
                        {
                            roomDescription.length > 0 &&
                            <p>  {roomDescription}</p>
                        }
                        <p> <span className={styles.preview_info}> Room Type: </span>  {selectedRoomType}</p>
                    </div>
                </div>
            }




        </div>
    )
}


function EditRoom({ room, isLoading, setIsLoading }) {


    const [selectedRoomType, setSelectedRoomType] = useState(room.type);
    const [roomTitle, setRoomTitle] = useState(room.title);
    const [roomPrice, setRoomPrice] = useState(room.price);
    const [roomDescription, setRoomDescription] = useState('');
    const [roomImageUrl, setRoomImageUrl] = useState('');


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


    async function updateRoom() {
        const newRoom = {
            ...room,
            title: roomTitle,
            price: roomPrice,
            description: roomDescription,
            image: roomImageUrl,
            type: selectedRoomType,
        }
        setIsLoading(true);
        await updateRoomToDatabase(newRoom);
        setIsLoading(false);
    }

    async function deleteRoom() {
        setIsLoading(true);
        await deleteRoomByIdFromDatabase(room.id);
        setIsLoading(false);
    }



    return (
        <div className={styles.add_room}>
            <div>

                <div className={styles.add_room_form}>
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
                    !isLoading &&
                    <div className={styles.add_room_button_container}>
                        <button onClick={async () => {
                            await updateRoom();
                        }}>
                            Edit Room
                        </button>

                        <button onClick={async () => {
                            await deleteRoom();
                        }}>
                            Delete Room
                        </button>

                    </div>
                }
            </div>



            {
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

function EditRooms({ rooms, isLoading, setIsLoading }) {
    return (
        <div>
            {
                rooms.map(room => {
                    return (
                        <EditRoom room={room} isLoading={isLoading} setIsLoading={setIsLoading} />
                    )
                })
            }
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


    const router = useRouter();
    const { id } = router.query;
    const [mode, setMode] = React.useState(PAGE_MODE.CREATE);
    const [isLoading, setIsLoading] = useState(false);
    const [rooms, setRooms] = useState([]);



    async function fetchRooms(hotelID) {
        let fetched = await getRoomsFromDatabaseByHotelID(hotelID);
        setRooms(fetched);
    }


    useEffect(() => {
        if (user && user.email !== 'admin@gmail.com') {
            router.push('/');
        }
    }, [user])


    useEffect(() => {
        if (id && isLoading === false) {
            fetchRooms(id);
        }
    }, [id, isLoading])

    return (
        <div className={styles.page}>
            <NavigationBar mode={mode} setMode={setMode} />
            <div className={styles.main}>
                <Hotel hotelID={id} />
                {mode === PAGE_MODE.CREATE && <CreateRoom hotelID={id} isLoading={isLoading} setIsLoading={setIsLoading} />}
                {mode === PAGE_MODE.EDIT && <EditRooms rooms={rooms} isLoading={isLoading} setIsLoading={setIsLoading} />}
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <AuthUI InnerComponent={Room} isAdmin={true} />
    )
}
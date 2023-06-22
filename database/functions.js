import { app } from './firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';
const database = getFirestore(app);


async function getHotelsFromDatabase() {
    const hotelsCol = collection(database, 'hotels');
    const hotelSnapshot = await getDocs(hotelsCol);
    const hotelList = hotelSnapshot.docs.map(doc => doc.data());
    return hotelList;
}

async function addHotelToDatabase(hotel) {
    const hotelsCol = collection(database, 'hotels');
    const hotelRef = await addDoc(hotelsCol, hotel);
    return hotelRef;
}

async function updateHotelToDatabase(hotel) {
    const hotelsCol = collection(database, 'hotels');
    const q = query(hotelsCol, where("id", "==", hotel.id));
    const hotelSnapshot = await getDocs(q);
    if (hotelSnapshot.empty) {
        return;
    }
    const hotelDoc = hotelSnapshot.docs[0];
    await updateDoc(hotelDoc.ref, hotel);

}

async function getHotelByIdfromDatabase(id) {
    const hotelsCol = collection(database, 'hotels');
    const q = query(hotelsCol, where("id", "==", id));
    const hotelSnapshot = await getDocs(q);
    const hotelList = hotelSnapshot.docs.map(doc => doc.data());
    return hotelList[0];
}

async function deleteHotelByIdfromDatabase(id) {
    const hotelsCol = collection(database, 'hotels');
    const q = query(hotelsCol, where("id", "==", id));
    const hotelSnapshot = await getDocs(q);

    if (hotelSnapshot.empty) {
        return;
    }

    const hotelDoc = hotelSnapshot.docs[0];
    await deleteDoc(hotelDoc.ref);
}

async function addRoomToDatabase(room) {
    const roomsCol = collection(database, 'rooms');
    const roomRef = await addDoc(roomsCol, room);
    return roomRef;
}

async function getRoomsFromDatabaseByHotelID(hotelID) {
    const roomsCol = collection(database, 'rooms');
    const q = query(roomsCol, where("hotelID", "==", hotelID));
    const roomSnapshot = await getDocs(q);
    const roomList = roomSnapshot.docs.map(doc => doc.data());
    return roomList;
}


export {
    getHotelsFromDatabase,
    addHotelToDatabase,
    updateHotelToDatabase,
    getHotelByIdfromDatabase,
    deleteHotelByIdfromDatabase,
    addRoomToDatabase,
    getRoomsFromDatabaseByHotelID
}
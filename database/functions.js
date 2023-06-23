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


async function updateRoomToDatabase(room) {
    const roomsCol = collection(database, 'rooms');
    const q = query(roomsCol, where("id", "==", room.id));
    const roomSnapshot = await getDocs(q);
    if (roomSnapshot.empty) {
        return;
    }
    const roomDoc = roomSnapshot.docs[0];
    await updateDoc(roomDoc.ref, room);
}

async function deleteRoomByIdFromDatabase(id){
    const roomsCol = collection(database, 'rooms');
    const q = query(roomsCol, where("id", "==", id));
    const roomSnapshot = await getDocs(q);

    if (roomSnapshot.empty) {
        return;
    }

    const roomDoc = roomSnapshot.docs[0];
    await deleteDoc(roomDoc.ref);
}



async function addBookingToDatabase(booking) {
    const bookingsCol = collection(database, 'bookings');
    const bookingRef = await addDoc(bookingsCol, booking);
    return bookingRef;
}

async function getBookingsFromDatabaseByRoomID(roomID) {
    const bookingsCol = collection(database, 'bookings');
    const q = query(bookingsCol, where("roomID", "==", roomID));
    const bookingSnapshot = await getDocs(q);
    const bookingList = bookingSnapshot.docs.map(doc => doc.data());
    return bookingList;
}

async function getBookingsFromDatabaseByUserID(userID) {
    const bookingsCol = collection(database, 'bookings');
    const q = query(bookingsCol, where("userID", "==", userID));
    const bookingSnapshot = await getDocs(q);
    const bookingList = bookingSnapshot.docs.map(doc => doc.data());
    return bookingList;
}

async function updateBookingToDatabase(booking) {
    const bookingsCol = collection(database, 'bookings');
    const q = query(bookingsCol, where("id", "==", booking.id));
    const bookingSnapshot = await getDocs(q);
    if (bookingSnapshot.empty) {
        return;
    }
    const bookingDoc = bookingSnapshot.docs[0];
    await updateDoc(bookingDoc.ref, booking);
}

export {
    //
    getHotelsFromDatabase,
    //
    addHotelToDatabase,
    getHotelByIdfromDatabase,
    updateHotelToDatabase,
    deleteHotelByIdfromDatabase,
    //
    addRoomToDatabase,
    getRoomsFromDatabaseByHotelID,
    updateRoomToDatabase,
    deleteRoomByIdFromDatabase,
    //
    addBookingToDatabase,
    getBookingsFromDatabaseByRoomID,
    getBookingsFromDatabaseByUserID,
    updateBookingToDatabase
}
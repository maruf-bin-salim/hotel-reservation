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


async function getHotelByIdfromDatabase(id) {
    const hotelsCol = collection(database, 'hotels');
    const q = query(hotelsCol, where("id", "==", id));
    const hotelSnapshot = await getDocs(q);
    const hotelList = hotelSnapshot.docs.map(doc => doc.data());
    return hotelList[0];
}

export {
    getHotelsFromDatabase,
    addHotelToDatabase,
    getHotelByIdfromDatabase,
}
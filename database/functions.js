import { app } from './firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';
const database = getFirestore(app);


async function getHotels() {
    const hotelsCol = collection(database, 'hotels');
    const hotelSnapshot = await getDocs(hotelsCol);
    const hotelList = hotelSnapshot.docs.map(doc => doc.data());
    return hotelList;
}

export {

}
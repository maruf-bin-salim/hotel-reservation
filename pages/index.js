import AuthUI from "@/components/AuthUI/AuthUI"
import { getHotelsFromDatabase } from "@/database/functions";
import useAuth from "@/hooks/useAuth";
import styles from '@/styles/index.module.css'
import { useEffect, useState } from "react";


function Hotel({ hotel }) {
  return (
    <div className={styles.hotel}>
      <div className={styles.hotel_image}>
        <img src="/default.png" />
      </div>

      <div className={styles.info_container}>

        <div className={styles.hotel_name}>
          {hotel.name} 
        </div>

        <div className={styles.hotel_address}>
          {hotel.address} 
        </div>

        {
          (Math.floor(hotel.rating) > 0) ?

          <div className={styles.hotel_rating}>
            <div className={styles.hotel_rating_stars}>
              {`${hotel.rating} / 5`}
            </div>
          </div>
          :
          <div className={styles.hotel_rating}>
            <div className={styles.hotel_rating_stars}>
              {`No rating yet!`}
            </div>
          </div>
        }



      </div>
      <button className={styles.hotel_details_button}>
        view hotel details
      </button>
    </div>
  )
}


function Index({ user }) {

  let { logOut } = useAuth();

  let [hotels, setHotels] = useState([]);

  async function getHotels() {
    let fetchedHotels = await getHotelsFromDatabase();
    setHotels(fetchedHotels);
  }
  useEffect(() => {
    getHotels();
  }, []);



  return (
    <div className={styles.page}>

      {/* top bar */}
      <div className={styles.top_bar}>
        <div className={styles.top_bar_left}>
          <div className={styles.logo}
          />
        </div>

        <div className={styles.top_search_bar}>
          <input type="text" placeholder="Search by city name or adress" />
          <div className={styles.search_icon} />
        </div>

        <div className={styles.top_bar_right}>
          <div className={styles.user_name}>
            {user ? user.email.split('@')[0] : ''}
          </div>
          <div className={styles.logout_button}
            onClick={async () => await logOut()}
          />
        </div>
      </div>

      {/* main content */}
      <div className={styles.main_content}>
        {
          hotels.map((hotel) => {
            return (
              <Hotel hotel={hotel} key={hotel.id} />
            )
          })

        }
      </div>

    </div>
  )
}



export default function Page() {
  return (
    <AuthUI InnerComponent={Index} />
  )
}
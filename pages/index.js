import AuthUI from "@/components/AuthUI/AuthUI"
import { getHotelsFromDatabase } from "@/database/functions";
import useAuth from "@/hooks/useAuth";
import styles from '@/styles/index.module.css'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


function Hotel({ hotel }) {
  const router = useRouter();
  // testing production
  return (
    <div className={styles.hotel}>
      <div className={styles.hotel_image}>
        {
          (hotel.image && hotel.image !== '') ?
            <img src={hotel.image} />
            :
            <img src="/default.png" />
        }
      </div>

      <div className={styles.info_container}>

        <div className={styles.hotel_name}>
          <h2>{hotel.name}</h2>
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
      <button className={styles.hotel_details_button} onClick={() => { router.push(`/hotel/${hotel.id}`) }}>
        View Hotel Details
      </button>
    </div>
  )
}


function Index({ user }) {

  let { logOut } = useAuth();

  let [hotels, setHotels] = useState([]);
  let [search, setSearch] = useState('');

  async function getHotels() {
    let fetchedHotels = await getHotelsFromDatabase();
    setHotels(fetchedHotels);
  }
  useEffect(() => {
    getHotels();
  }, []);



  function filterHotels(hotels) {
    if (search === '') {
      return hotels;
    }
    return hotels.filter((hotel) => {
      return hotel.name.toLowerCase().includes(search.toLowerCase()) || hotel.address.toLowerCase().includes(search.toLowerCase());
    })
  }



  return (
    <div className={styles.page}>

      {/* top bar */}
      <div className={styles.top_bar}>
        <div className={styles.top_bar_left}>
          <div className={styles.logo}
          />
        </div>

        <div className={styles.top_search_bar}>
          <input type="text" placeholder="Search by hotel name or adress / city"
            onChange={(e) => { setSearch(e.target.value) }}
          />
          <div className={styles.search_icon} />
        </div>

        <div className={styles.top_bar_right}>
          <div className={styles.user_notifications}>
            <div className={styles.user_notifications_icon}/>
          </div>
          <div className={styles.user_name}>
            {user ? user.email.split('@')[0] : ''}
          </div>
          <div className={styles.logout_button}
            onClick={async () => await logOut()}
          />
        </div>
      </div>

      <div className={styles.main}>


        <div className={styles.cover}>
          <h1>"Experience Relaxation and Adventure - Reserve Your Hotel Today!"
          </h1>
        </div>
        <div className={styles.find}>
          <h1>FIND YOUR HOTEL HERE.</h1>
        </div>
        {/* main content */}
        <div className={styles.main_content}>
          {
            filterHotels(hotels).map((hotel) => {
              return (
                <Hotel hotel={hotel} key={hotel.id} />
              )
            })

          }
        </div>

      </div>
    </div>

  )
}



export default function Page() {
  return (
    <AuthUI InnerComponent={Index} />
  )
}
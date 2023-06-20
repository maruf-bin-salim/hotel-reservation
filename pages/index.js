import AuthUI from "@/components/AuthUI/AuthUI"
import styles from '@/styles/index.module.css'

function Hotel({ hotel }) {
  return (
    <div className={styles.hotel}>
      <div className={styles.hotel_image}>
        <img src="https://cdn.lapaninja.com/assets/images/airbnb-08-06-2021-thumb.jpg" />
      </div>

      <div className={styles.hotel_name}>
        Hotel Name
      </div>

      <div className={styles.hotel_address}>
        Hotel Address
      </div>

      <div className={styles.hotel_rating}>
        <div className={styles.hotel_rating_stars}>
        </div>
      </div>
        <button className={styles.hotel_details_button}>
          view hotel details
        </button>
    </div>
  )
}


function Index({ user }) {
  return (
    <div className={styles.page}>

      {/* top bar */}
      <div className={styles.top_bar}>
        <div className={styles.top_bar_left}>
          <div className={styles.logo} />
        </div>

        <div className={styles.top_search_bar}>
          <input type="text" placeholder="Search by city name or adress" />
          <div className={styles.search_icon} />
        </div>

        <div className={styles.top_bar_right}>
          <div className={styles.user_name}>
            {user ? user.email.split('@')[0] : ''}
          </div>
          <div className={styles.logout_button} />
        </div>
      </div>

      {/* main content */}
      <div className={styles.main_content}>
        <Hotel />
        <Hotel />
        <Hotel />
        <Hotel />
        <Hotel />
        <Hotel />
        <Hotel />
        <Hotel />
      </div>

    </div>
  )
}



export default function Page() {
  return (
    <AuthUI InnerComponent={Index} />
  )
}
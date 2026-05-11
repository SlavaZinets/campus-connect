import Link from "next/link";
import { FiSearch, FiCheckCircle, FiCalendar } from "react-icons/fi";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Campus events, booked in two clicks.
          </h1>
          <p className={styles.heroLead}>
            Discover what&apos;s happening on campus this week — lectures, socials,
            sports, society meet-ups — and reserve your spot before it fills up.
          </p>
          <div className={styles.heroCtas}>
            <PrimaryButton href="/attendee/events">Browse events</PrimaryButton>
            <Link href="/register" className={styles.secondaryCta}>
              Sign up
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.steps}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <ol className={styles.stepGrid}>
          <li className={styles.step}>
            <span className={styles.stepIcon} aria-hidden="true">
              <FiSearch />
            </span>
            <h3 className={styles.stepTitle}>Browse</h3>
            <p className={styles.stepBody}>
              Filter events by category, date or location and find something
              worth your evening.
            </p>
          </li>
          <li className={styles.step}>
            <span className={styles.stepIcon} aria-hidden="true">
              <FiCheckCircle />
            </span>
            <h3 className={styles.stepTitle}>Book</h3>
            <p className={styles.stepBody}>
              Reserve a free spot in one click. We hold capacity so you&apos;re
              never turned away at the door.
            </p>
          </li>
          <li className={styles.step}>
            <span className={styles.stepIcon} aria-hidden="true">
              <FiCalendar />
            </span>
            <h3 className={styles.stepTitle}>Attend</h3>
            <p className={styles.stepBody}>
              Keep your bookings in one place and show up — your profile page
              has the details.
            </p>
          </li>
        </ol>
      </section>

      <section className={styles.roles}>
        <h2 className={styles.sectionTitle}>Pick your side</h2>
        <div className={styles.rolePanels}>
          <Link href="/register?role=attendee" className={styles.rolePanel}>
            <h3 className={styles.roleTitle}>For attendees</h3>
            <p className={styles.roleBody}>
              Free to join. Browse every event on campus, book the ones you
              like, and track them from your profile.
            </p>
            <span className={styles.roleLink}>Sign up as an attendee</span>
          </Link>
          <Link href="/register?role=organiser" className={styles.rolePanel}>
            <h3 className={styles.roleTitle}>For organisers</h3>
            <p className={styles.roleBody}>
              Running a society, club or department event? Publish it here,
              set capacity, and watch the bookings roll in.
            </p>
            <span className={styles.roleLink}>Sign up as an organiser</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

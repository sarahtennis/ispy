import styles from "./page.module.scss";
import Flashlight from "./components/flashlight/flashlight";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Flashlight></Flashlight>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}

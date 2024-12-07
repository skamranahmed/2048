import Board from "@/components/board";
import Score from "@/components/score";
import styles from "@/styles/index.module.css";
import Head from "next/head";

export default function Home() {
  return (
    <div className={styles.twenty48}>
      <Head>
        <title>2048</title>
        <meta name="description" content="2048 game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>2048</h1>
        <Score />
      </header>
      <main>
        <Board />
      </main>
      <footer>Made with ❤️ by Kamran</footer>
    </div>
  );
}

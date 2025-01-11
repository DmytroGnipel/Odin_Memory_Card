import styles from "./Card.module.css";

export default function Card({ name, url, changeClick, countPoints }) {
  return (
    <div
      className={styles.card}
      onClick={() => {
        countPoints(name);
      }}
    >
      <img className={styles.img} src={url} onClick={changeClick} />
      <p>{name}</p>
    </div>
  );
}

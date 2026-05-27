import styles from "./loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner} />
      <p className={styles.text}>Cargando noticias...</p>
    </div>
  );
};

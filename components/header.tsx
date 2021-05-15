import styles from "../styles/Header.module.css";

function Header() {
  return (
    <header>
      <figure className={styles.circulo_figura}>
        <img
          className={styles.circulo}
          src="/circle.svg"
          alt="um círculo preto"
        />
      </figure>
    </header>
  );
}

export default Header;

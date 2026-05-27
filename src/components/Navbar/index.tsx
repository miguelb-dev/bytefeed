import { Sun, Moon } from "lucide-react";
import type { Category, Theme } from "../../types";
import { categories } from "../../constants/categories";
import styles from "./navbar.module.css";
import logo from "../../assets/img/favicon.svg";

type NavbarProps = {
  activeCategory: string;
  onCategoryChange: (category: Category) => void;
  theme: Theme;
  onThemeToggle: () => void;
};

export const Navbar = ({
  activeCategory,
  onCategoryChange,
  theme,
  onThemeToggle,
}: NavbarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.header}>
          <img className={styles.logo} src={logo} alt="Logo de ByteFeed" />
          <h1>ByteFeed</h1>
        </a>

        <ul className={styles.categories}>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`${styles.categoryButton} ${activeCategory === category.id ? styles.categoryButtonActive : ""}`}
              onClick={() => onCategoryChange(category)}
            >
              {category.label}
            </li>
          ))}
          <button
            className={styles.themeToggle}
            onClick={onThemeToggle}
            aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </ul>
      </div>
    </nav>
  );
};

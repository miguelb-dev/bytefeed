import { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  const handleCategoryClick = (category: Category) => {
    onCategoryChange(category);
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.header}>
          <a href="/" className={styles.brand}>
            <img className={styles.logo} src={logo} alt="Logo de ByteFeed" />
            <h1>ByteFeed</h1>
          </a>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.menuButton}
            onClick={handleToggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            type="button"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            className={styles.themeToggle}
            onClick={onThemeToggle}
            aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <ul className={`${styles.categories} ${isMenuOpen ? styles.open : ""}`}>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`${styles.categoryButton} ${activeCategory === category.id ? styles.categoryButtonActive : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

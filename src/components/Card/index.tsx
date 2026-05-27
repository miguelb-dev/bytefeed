import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ArrowRight, ImageOff } from "lucide-react";
import type { Article } from "../../types";
import styles from "./card.module.css";

type CardProps = {
  article: Article;
};

export const Card = ({ article }: CardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.open(article.url, "_blank", "noopener,noreferrer");
  };

  const formattedDate = format(
    new Date(article.publishedAt),
    "d 'de' MMMM, yyyy",
    { locale: es },
  );

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      role="link"
      tabIndex={0}
    >
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <div className={styles.imageContainer}>
          {article.image && !imageError ? (
            <img
              src={article.image}
              alt={article.title}
              className={styles.image}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>
              <ImageOff size={48} />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <span className={styles.source}>{article.source.name}</span>

          <h2 className={styles.title}>{article.title}</h2>

          <p className={styles.description}>{article.description}</p>

          <footer className={styles.footer}>
            <span className={styles.date}>
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className={styles.readMore}>
              Leer más <ArrowRight size={14} />
            </span>
          </footer>
        </div>
      </a>
    </article>
  );
};

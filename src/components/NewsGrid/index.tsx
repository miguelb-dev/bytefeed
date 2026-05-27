import type { Article } from "../../types";
import { Card } from "../../components/Card";
import styles from "./NewsGrid.module.css";

type NewsGridProps = {
  articles: Article[];
};

export const NewsGrid = ({ articles }: NewsGridProps) => {
  return (
    <div className={styles.grid}>
      {articles.map((article, index) => (
        <Card key={`${article.url}-${index}`} article={article} />
      ))}
    </div>
  );
};

import { useState, useEffect, useCallback } from "react";
import { Newspaper } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { NewsGrid } from "./components/NewsGrid";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { fetchNews } from "./services/newsService";
import { useTheme } from "./hooks/useTheme";
import { categories } from "./constants/categories";
import type { Article, Category } from "./types";

export const App = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const { theme, toggleTheme } = useTheme();

  // Busca las noticias
  const loadNews = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNews(query);
      setArticles(data.articles);
    } catch (err) {
      setError("No pudimos cargar las noticias. Por favor, intenta de nuevo.");
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Al cambiar `activeCategory`, carga las noticias de esa categoría buscando la entrada correspondiente en `categories` y llamando a `loadNews`.
  useEffect(() => {
    const category = categories.find((c) => c.id === activeCategory);
    if (category) {
      loadNews(category.query);
    }
  }, [activeCategory, loadNews]);

  // Marca la categoría activa (para la navbar)
  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category.id);
  };

  // Reintenta cargar noticias para la `activeCategory` actual: busca la categoría correspondiente y vuelve a llamar a `loadNews` con su query.
  const handleRetry = () => {
    const category = categories.find((c) => c.id === activeCategory);
    if (category) {
      loadNews(category.query);
    }
  };

  return (
    <>
      <header>
        <Navbar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          theme={theme}
          onThemeToggle={toggleTheme}
        ></Navbar>
      </header>

      <main>
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : articles.length === 0 ? (
          <div>
            <Newspaper size={48} />
            <h2>No hay noticias disponibles</h2>
            <p>
              No encontramos noticias para esta categoría. ¡Prueba con otro
              topic!
            </p>
          </div>
        ) : (
          <NewsGrid articles={articles} />
        )}
      </main>
    </>
  );
};

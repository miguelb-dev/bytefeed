import { supabase } from "../lib/supabaseClient";
import type { Article, GNewsResponse, Database } from "../types";

type NewsRow = Database["public"]["Tables"]["news"]["Row"];

const mapNewsRowToArticle = (row: NewsRow): Article => ({
  title: row.title,
  description: row.description ?? "",
  content: row.description ?? "",
  url: row.url,
  image: row.image_url,
  publishedAt: row.published_at,
  source: {
    name: row.source_name ?? "Fuente desconocida",
    url: row.url,
  },
});

export const fetchNews = async (query: string): Promise<GNewsResponse> => {
  const trimmedQuery = query.trim();
  const queryFilter = trimmedQuery ? `%${trimmedQuery}%` : "%";

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .or(
      `category.ilike.${queryFilter},title.ilike.${queryFilter},description.ilike.${queryFilter}`,
    )
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      totalArticles: 0,
      articles: [],
    };
  }

  const articles = data.map(mapNewsRowToArticle);

  return {
    totalArticles: articles.length,
    articles,
  };
};

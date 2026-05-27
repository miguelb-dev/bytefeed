export type Article = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
};

export type GNewsResponse = {
  totalArticles: number;
  articles: Article[];
};

export type Category = {
  id: string;
  label: string;
  query: string;
};

export type Theme = "light" | "dark";

export type Database = {
  public: {
    Tables: {
      news: {
        Row: {
          id: number;
          category: string;
          title: string;
          description: string | null;
          url: string;
          image_url: string | null;
          source_name: string | null;
          published_at: string;
          fetched_at: string;
        };
        Insert: {
          id?: number;
          category: string;
          title: string;
          description?: string | null;
          url: string;
          image_url?: string | null;
          source_name?: string | null;
          published_at: string;
          fetched_at?: string;
        };
      };
    };
  };
};

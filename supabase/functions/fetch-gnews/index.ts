import { createClient } from "jsr:@supabase/supabase-js@2";

// Tipa el resultado de la consulta a la API de GNews
interface GNewsArticle {
  id?: string; // * Opcional porque a veces GNews no lo regresa
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
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// Función para generar un ID único basado en la URL
function generateIdFromUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString();
}

// Función para normalizar título
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Función para verificar duplicados por título
async function isDuplicateByTitle(
  supabase: any,
  title: string,
  category: string,
): Promise<{ isDuplicate: boolean; existingId?: string }> {
  const normalizedNewTitle = normalizeTitle(title);

  const { data: existingArticles, error } = await supabase
    .from("news")
    .select("id, title")
    .eq("category", category)
    .limit(20);

  if (error || !existingArticles || existingArticles.length === 0) {
    return { isDuplicate: false };
  }

  for (const existing of existingArticles) {
    const normalizedExistingTitle = normalizeTitle(existing.title);

    if (normalizedNewTitle === normalizedExistingTitle) {
      return { isDuplicate: true, existingId: existing.id };
    }

    if (
      normalizedExistingTitle.includes(normalizedNewTitle) ||
      normalizedNewTitle.includes(normalizedExistingTitle)
    ) {
      return { isDuplicate: true, existingId: existing.id };
    }
  }

  return { isDuplicate: false };
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const categories = [
      "technology",
      "artificial intelligence",
      "mobile",
      "cybersecurity",
      "games",
    ];

    const categoryStats: Record<
      string,
      {
        found: number;
        inserted: number;
        skippedById: number;
        skippedByTitle: number;
        errors: number;
      }
    > = {};

    let totalFound = 0;
    let totalInserted = 0;
    let totalSkippedById = 0;
    let totalSkippedByTitle = 0;
    let totalErrors = 0;

    for (const category of categories) {
      console.log(`Procesando categoría: ${category}`);

      const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY");
      if (!GNEWS_API_KEY) {
        throw new Error("GNEWS_API_KEY no configurada");
      }

      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(category)}&lang=es&country=any&max=100&token=${GNEWS_API_KEY}`;

      const response = await fetch(url);
      const data: GNewsResponse = await response.json();

      let categoryFound = data.articles?.length || 0;
      let categoryInserted = 0;
      let categorySkippedById = 0;
      let categorySkippedByTitle = 0;
      let categoryErrors = 0;

      if (data.articles && data.articles.length > 0) {
        for (const article of data.articles) {
          let articleId = article.id;

          if (!articleId || articleId.trim() === "") {
            articleId = generateIdFromUrl(article.url);
          }

          // Verificar por ID
          const { data: existingById, error: checkError } = await supabase
            .from("news")
            .select("id")
            .eq("id", articleId)
            .maybeSingle();

          if (checkError) {
            categoryErrors++;
            totalErrors++;
            continue;
          }

          if (existingById) {
            categorySkippedById++;
            continue;
          }

          // Verificar por título
          const { isDuplicate: duplicateByTitle } = await isDuplicateByTitle(
            supabase,
            article.title,
            category,
          );

          if (duplicateByTitle) {
            categorySkippedByTitle++;
            continue;
          }

          const { error: insertError } = await supabase.from("news").insert({
            id: articleId,
            category: category,
            title: article.title,
            description: article.description,
            content: article.content || article.description,
            url: article.url,
            image_url: article.image,
            source_name: article.source.name,
            published_at: article.publishedAt,
          });

          if (insertError) {
            console.error(`Error insertando:`, insertError);
            categoryErrors++;
            totalErrors++;
          } else {
            categoryInserted++;
          }
        }
      }

      categoryStats[category] = {
        found: categoryFound,
        inserted: categoryInserted,
        skippedById: categorySkippedById,
        skippedByTitle: categorySkippedByTitle,
        errors: categoryErrors,
      };

      totalFound += categoryFound;
      totalInserted += categoryInserted;
      totalSkippedById += categorySkippedById;
      totalSkippedByTitle += categorySkippedByTitle;
      totalErrors += categoryErrors;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        message: `Actualización: ${totalInserted} nuevas, ${totalSkippedById} por ID, ${totalSkippedByTitle} por título, ${totalErrors} errores`,
        summary: {
          totalFound,
          totalInserted,
          totalSkippedById,
          totalSkippedByTitle,
          totalErrors,
          categoriesProcessed: categories.length,
          details: categoryStats,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fatal:", error);
    return new Response(
      JSON.stringify({
        success: false,
        timestamp: new Date().toISOString(),
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});

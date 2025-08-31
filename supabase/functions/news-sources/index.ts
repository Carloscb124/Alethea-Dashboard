// Supabase Edge Function: news-sources
// Returns the list of news sources used by the app

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const news_sources = [
      { id: 1, name: 'G1', url: 'https://g1.globo.com', rss: 'https://g1.globo.com/dynamo/rss2.xml', category: 'geral' },
      { id: 2, name: 'Folha de S.Paulo', url: 'https://www.folha.uol.com.br', rss: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml', category: 'geral' },
      { id: 3, name: 'Estadão', url: 'https://www.estadao.com.br', rss: 'https://www.estadao.com.br/rss/', category: 'geral' },
      { id: 4, name: 'BBC Brasil', url: 'https://www.bbc.com/portuguese', rss: 'https://feeds.bbci.co.uk/portuguese/rss.xml', category: 'internacional' },
      { id: 5, name: 'CNN Brasil', url: 'https://www.cnnbrasil.com.br', rss: null, category: 'geral' },
      { id: 6, name: 'UOL Notícias', url: 'https://noticias.uol.com.br', rss: 'https://www.uol.com.br/feed/noticias.xml', category: 'geral' },
      { id: 7, name: 'TechCrunch', url: 'https://techcrunch.com', rss: 'https://techcrunch.com/feed/', category: 'tecnologia' },
      { id: 8, name: 'The Verge', url: 'https://www.theverge.com', rss: 'https://www.theverge.com/rss/index.xml', category: 'tecnologia' },
      { id: 9, name: 'Reuters', url: 'https://www.reuters.com', rss: 'https://www.reutersagency.com/feed/?best-sectors=general-news', category: 'internacional' },
      { id: 10, name: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br', rss: 'https://agenciabrasil.ebc.com.br/rss/geral/feed.xml', category: 'geral' },
      { id: 11, name: 'Valor Econômico', url: 'https://valor.globo.com', rss: 'https://valor.globo.com/rss/', category: 'economia' },
      { id: 12, name: 'Exame', url: 'https://exame.com', rss: 'https://exame.com/feed/', category: 'economia' },
      { id: 13, name: 'InfoMoney', url: 'https://www.infomoney.com.br', rss: 'https://www.infomoney.com.br/feed/', category: 'economia' },
      { id: 14, name: 'Carta Capital', url: 'https://www.cartacapital.com.br', rss: null, category: 'politica' },
      { id: 15, name: 'O Antagonista', url: 'https://www.oantagonista.com', rss: 'https://oantagonista.com/feed/', category: 'politica' },
      { id: 16, name: 'Gazeta do Povo', url: 'https://www.gazetadopovo.com.br', rss: 'https://www.gazetadopovo.com.br/rss/', category: 'politica' },
      { id: 17, name: 'ESPN Brasil', url: 'https://www.espn.com.br', rss: null, category: 'esportes' },
      { id: 18, name: 'Globo Esporte', url: 'https://ge.globo.com', rss: 'https://ge.globo.com/rss/agenda.xml', category: 'esportes' },
      { id: 19, name: 'Lance!', url: 'https://www.lance.com.br', rss: 'https://www.lance.com.br/rss/latest.xml', category: 'esportes' },
      { id: 20, name: 'Al Jazeera', url: 'https://www.aljazeera.com', rss: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'internacional' },
      { id: 21, name: 'Aos Fatos', url: 'https://www.aosfatos.org', rss: 'https://www.aosfatos.org/rss', category: 'fact-checking' },
      { id: 22, name: 'Agência Lupa', url: 'https://piaui.folha.uol.com.br/lupa', rss: null, category: 'fact-checking' },
      { id: 23, name: 'Boatos.org', url: 'https://www.boatos.org', rss: null, category: 'fact-checking' },
      { id: 24, name: 'E-Farsas', url: 'https://www.e-farsas.com', rss: 'https://www.e-farsas.com/feed', category: 'fact-checking' },
      { id: 25, name: 'PolitiFact', url: 'https://www.politifact.com', rss: 'https://www.politifact.com/feeds/articles/truth-o-meter/', category: 'fact-checking' },
    ];

    const body = JSON.stringify({ news_sources });
    return new Response(body, {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (e) {
    console.error('news-sources error', e);
    return new Response(JSON.stringify({ error: 'failed_to_load_sources' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});
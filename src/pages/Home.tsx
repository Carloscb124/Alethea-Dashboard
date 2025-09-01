import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/data/mockData';
import { ArrowRight, TrendingUp, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const { toast } = useToast();

  // Lista de sites específicos para atualizar com o botão
  const specificUrls = [
    'https://g1.globo.com/df/distrito-federal/noticia/2025/08/27/condominio-onde-bolsonaro-cumpre-prisao-no-df-ja-soltou-notas-para-regular-uso-de-drones-e-negar-expulsao-de-moradores.ghtml',
    'https://oglobo.globo.com/rio/noticia/2025/08/26/casa-do-traficante-lacoste-um-dos-chefes-do-tcp-tinha-saida-secreta-para-mata-na-comunidade-da-serrinha.ghtml',
    'https://www.cartacapital.com.br/politica/motta-acena-a-bolsonaristas-e-camara-deve-votar-nesta-quarta-blindagem-a-parlamentares/',
    'https://oglobo.globo.com/economia/imposto-de-renda/noticia/2025/08/27/isencao-de-ir-para-quem-ganha-ate-r-5-mil-veja-como-o-projeto-mexe-no-bolso-de-cada-classe-social.ghtml',
    'https://veja.abril.com.br/coluna/radar/pf-recomenda-a-moraes-colocar-agentes-dentro-da-casa-de-bolsonaro/'
  ];
  const loadNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error loading news:', error);
        toast({
          title: "Erro ao carregar notícias",
          description: "Não foi possível carregar as notícias do banco de dados.",
          variant: "destructive",
        });
        return;
      }

      // Check if we need to crawl fresh news (if no recent news in last 6 hours)
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      const recentNews = data?.filter(item => new Date(item.created_at) > sixHoursAgo) || [];
      
      if (!data || data.length === 0) {
        toast({
          title: "Buscando notícias...",
          description: "A base de dados está vazia. Buscando notícias automaticamente.",
        });
        setLoading(false);
        await crawlNews();
        return;
      }

      // If no recent news, automatically crawl
      if (recentNews.length === 0) {
        toast({
          title: "Atualizando notícias...",
          description: "Buscando notícias mais recentes.",
        });
        // Don't await this to show existing news while updating
        crawlNews();
      }

      // Transform Supabase data to NewsItem format
      const transformedNews: NewsItem[] = (data || [])
        .filter(item => 
          item.title && 
          item.summary && 
          !item.title.includes('Apuração das Eleições') && // Remove páginas duplicadas de eleições
          item.title !== 'g1 - O portal de notícias da Globo' // Remove homepage do G1
        ) 
        .map(item => ({
          id: item.id,
          title: item.title || 'Título não disponível',
          summary: item.summary || 'Resumo não disponível',
          category: item.category || 'Geral',
          date: item.published_at || item.created_at,
          source: item.source || 'Fonte não identificada',
          status: 'partial' as const, // Default status since we don't have verification yet
          readTime: item.read_time || 5,
          image: item.image_url,
          url: item.url
        }))
        .slice(0, 15); // Mostrar até 15 notícias

      setNewsData(transformedNews);
    } catch (error) {
      console.error('Error loading news:', error);
      toast({
        title: "Erro ao carregar notícias",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const crawlSpecificNews = async (urls: string[]) => {
    setCrawling(true);
    try {
      const { data, error } = await supabase.functions.invoke('crawl-news', {
        body: { 
          sources: urls,
          limit: 1 // Only get the main article from each URL
        }
      });

      if (error) {
        console.error('Error crawling specific news:', error);
        toast({
          title: "Erro ao buscar notícias",
          description: "Não foi possível buscar as notícias específicas.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Notícias específicas adicionadas!",
        description: `${urls.length} notícias foram processadas com sucesso.`,
      });

      // Reload news after crawling
      await loadNews();
    } catch (error) {
      console.error('Error crawling specific news:', error);
      toast({
        title: "Erro ao buscar notícias",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setCrawling(false);
    }
  };

  const crawlNews = async () => {
    setCrawling(true);
    try {
      // Busca as fontes da API (Edge Function) e usa suas URLs para o crawler
      const { data: sourcesResp, error: sourcesError } = await supabase.functions.invoke('news-sources');
      if (sourcesError) {
        console.error('Error loading sources:', sourcesError);
        toast({
          title: 'Erro ao carregar fontes',
          description: 'Não foi possível carregar a lista de fontes.',
          variant: 'destructive',
        });
        return;
      }

      const urls = (sourcesResp as any)?.news_sources?.map((s: any) => s.url).filter(Boolean) || [];
      if (urls.length === 0) {
        toast({ title: 'Nenhuma fonte disponível', description: 'A lista de fontes está vazia.' });
        return;
      }

      const { error } = await supabase.functions.invoke('crawl-news', {
        body: { sources: urls, limit: 5 }
      });

      if (error) {
        console.error('Error crawling news:', error);
        toast({
          title: 'Erro ao buscar notícias',
          description: 'Não foi possível buscar novas notícias.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Notícias atualizadas!',
        description: 'Novas notícias foram coletadas com sucesso.',
      });

      // Reload news after crawling
      await loadNews();
    } catch (error) {
      console.error('Error crawling news:', error);
      toast({
        title: 'Erro ao buscar notícias',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setCrawling(false);
    }
  };

  useEffect(() => {
    loadNews();
    
    // Usando a lista specificUrls definida acima

    
    // Check if we need to crawl these specific URLs
    const checkAndCrawlSpecific = async () => {
      const { data } = await supabase
        .from('news_items')
        .select('url')
        .in('url', specificUrls);
      
      const existingUrls = data?.map(item => item.url) || [];
      const missingUrls = specificUrls.filter(url => !existingUrls.includes(url));
      
      if (missingUrls.length > 0) {
        setTimeout(() => crawlSpecificNews(missingUrls), 2000); // Delay to avoid conflicts
      }
    };
    
    checkAndCrawlSpecific();
  }, []);

  const stats = [
    {
      label: 'Notícias Verificadas',
      value: '1,247',
      icon: CheckCircle,
      color: 'text-verified-true'
    },
    {
      label: 'Conteúdo Analisado',
      value: '2,891',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      label: 'Alertas Emitidos',
      value: '573',
      icon: AlertTriangle,
      color: 'text-verified-false'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Jornal <span className="text-primary-glow">Alethea</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Notícias verificadas para uma sociedade melhor informada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                variant="secondary"
              >
                <Link to="/submit">
                  Enviar Conteúdo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="hero"
                size="lg"
              >
                <Link to="/learn">Aprenda a Verificar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Feed */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Últimas Verificações
              </h2>
              <div className="flex gap-2">
                <Button 
                  onClick={crawlNews}
                  disabled={crawling}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${crawling ? 'animate-spin' : ''}`} />
                  {crawling ? 'Buscando...' : 'Atualizar'}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/search">
                    Ver Todas
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {loading || crawling ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-alethea animate-pulse">
                    <div className="flex justify-between mb-3">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newsData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhuma notícia encontrada.</p>
                <Button onClick={crawlNews} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Buscar Notícias
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {newsData.map((news) => (
                  <NewsCard 
                    key={news.id} 
                    news={news}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
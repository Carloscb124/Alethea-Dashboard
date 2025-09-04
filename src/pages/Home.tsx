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
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Lista de sites específicos para atualizar com o botão
  const specificUrls = [
    'https://g1.globo.com/df/distrito-federal/noticia/2025/08/27/condominio-onde-bolsonaro-cumpre-prisao-no-df-ja-soltou-notas-para-regular-uso-de-drones-e-negar-expulsao-de-moradores.ghtml',
    'https://oglobo.globo.com/rio/noticia/2025/08/26/casa-do-traficante-lacoste-um-dos-chefes-do-tcp-tinha-saida-secreta-para-mata-na-comunidade-da-serrinha.ghtml',
    'https://www.cartacapital.com.br/politica/motta-acena-a-bolsonaristas-e-camara-deve-votar-nesta-quarta-blindagem-a-parlamentares/',
    'https://oglobo.globo.com/economia/imposto-de-renda/noticia/2025/08/27/isencao-de-ir-para-quem-ganha-ate-r-5-mil-veja-como-o-projeto-mexe-no-bolso-de-cada-classe-social.ghtml',
    'https://veja.abril.com.br/coluna/radar/pf-recomenda-a-moraes-colocar-agentes-dentro-da-casa-de-bolsonaro/'
  ];
  const loadNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (error) {
        console.error('Error loading news:', error);
        toast({
          title: "Erro ao carregar notícias",
          description: "Não foi possível carregar as notícias do banco de dados.",
          variant: "destructive",
        });
        return;
      }

      // Transform Supabase data to NewsItem format
      const transformedNews: NewsItem[] = (data || [])
        .filter(item => 
          item.title && 
          item.summary && 
          !item.title.includes('Apuração das Eleições') &&
          item.title !== 'g1 - O portal de notícias da Globo' &&
          !item.title.includes('Assine nosso feed')
        ) 
        .map(item => ({
          id: item.id,
          title: item.title || 'Título não disponível',
          summary: item.summary || item.title || 'Resumo não disponível',
          category: item.category || 'Geral',
          date: item.published_at || item.created_at,
          source: item.source || 'Fonte não identificada',
          status: 'partial' as const,
          readTime: item.read_time || 5,
          image: item.image_url,
          url: item.url
        }));

      setNewsData(transformedNews);

      // Background check for fresh news (non-blocking)
      if (!isRefresh) {
        checkAndUpdateNews(data);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      toast({
        title: "Erro ao carregar notícias",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkAndUpdateNews = async (currentData: any[]) => {
    // Non-blocking background check for fresh content
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const recentNews = currentData?.filter(item => new Date(item.created_at) > sixHoursAgo) || [];
    
    if (recentNews.length < 5) {
      // Background crawl - don't show loading to user
      setTimeout(() => backgroundCrawl(), 2000);
    }
  };

  const backgroundCrawl = async () => {
    try {
      const { data: sourcesResp } = await supabase.functions.invoke('news-sources');
      const urls = (sourcesResp as any)?.news_sources?.map((s: any) => s.url).filter(Boolean) || [];
      
      if (urls.length > 0) {
        await supabase.functions.invoke('crawl-news', {
          body: { sources: urls.slice(0, 2), limit: 2 }
        });
        // Silently refresh after background crawl
        setTimeout(() => loadNews(true), 5000);
      }
    } catch (error) {
      // Silent fail for background operations
      console.log('Background crawl failed:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data: sourcesResp } = await supabase.functions.invoke('news-sources');
      const urls = (sourcesResp as any)?.news_sources?.map((s: any) => s.url).filter(Boolean) || [];
      
      if (urls.length === 0) {
        toast({ 
          title: 'Nenhuma fonte disponível', 
          description: 'A lista de fontes está vazia.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Buscando notícias...',
        description: 'Aguarde enquanto coletamos as últimas notícias.',
      });

      const { error } = await supabase.functions.invoke('crawl-news', {
        body: { sources: urls.slice(0, 3), limit: 3 }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          toast({
            title: 'Limite de requisições atingido',
            description: 'Aguarde alguns minutos antes de tentar novamente.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro ao buscar notícias',
            description: 'Não foi possível buscar novas notícias no momento.',
            variant: 'destructive',
          });
        }
        return;
      }

      toast({
        title: 'Notícias atualizadas!',
        description: 'Novas notícias foram coletadas com sucesso.',
      });

      // Reload news after crawling
      setTimeout(() => loadNews(true), 3000);
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
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
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Jornal <span className="text-primary-glow">Alethea</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4">
              Notícias verificadas para uma sociedade melhor informada
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button 
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
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
                className="w-full sm:w-auto"
              >
                <Link to="/learn">Aprenda a Verificar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 sm:p-0">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Feed */}
      <main className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Últimas Verificações
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Buscando...' : 'Atualizar'}
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/search">
                    Ver Todas
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-alethea animate-pulse p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 mb-3">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                    <div className="h-5 sm:h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-full sm:w-3/4"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                      <div className="h-3 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newsData.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">Nenhuma notícia encontrada.</p>
                <Button onClick={handleRefresh} variant="outline" disabled={refreshing} className="w-full sm:w-auto">
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Buscando...' : 'Buscar Notícias'}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
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
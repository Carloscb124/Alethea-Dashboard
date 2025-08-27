import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/data/mockData';
import { ArrowRight, TrendingUp, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const { toast } = useToast();

  const loadNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
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
      const transformedNews: NewsItem[] = (data || []).map(item => ({
        id: item.id,
        title: item.title || 'Título não disponível',
        summary: item.summary || 'Resumo não disponível',
        category: item.category || 'Geral',
        date: item.published_at || item.created_at,
        source: item.source || 'Fonte não identificada',
        status: 'partial' as const, // Default status since we don't have verification yet
        readTime: item.read_time || 5,
        image: item.image_url
      }));

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

  const crawlNews = async () => {
    setCrawling(true);
    try {
      const { data, error } = await supabase.functions.invoke('crawl-news', {
        body: { limit: 5 }
      });

      if (error) {
        console.error('Error crawling news:', error);
        toast({
          title: "Erro ao buscar notícias",
          description: "Não foi possível buscar novas notícias.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Notícias atualizadas!",
        description: "Novas notícias foram coletadas com sucesso.",
      });

      // Reload news after crawling
      await loadNews();
    } catch (error) {
      console.error('Error crawling news:', error);
      toast({
        title: "Erro ao buscar notícias",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setCrawling(false);
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

            {loading ? (
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
            ) : (
              <div className="grid gap-6">
                {newsData.map((news) => (
                  <NewsCard 
                    key={news.id} 
                    news={news}
                    onClick={() => {
                      // Could navigate to detail page
                      console.log('View news:', news.id);
                    }}
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
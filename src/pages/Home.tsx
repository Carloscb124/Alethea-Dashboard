import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { mockNewsData, NewsItem } from '@/data/mockData';
import { ArrowRight, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadNews = async () => {
      setLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setNewsData(mockNewsData);
      setLoading(false);
    };

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
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Notícias verificadas para uma sociedade melhor informada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Link to="/submit">
                  Enviar Conteúdo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
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
              <Button asChild variant="outline">
                <Link to="/search">
                  Ver Todas
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
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
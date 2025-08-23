import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import VerificationBadge from '@/components/VerificationBadge';
import { mockNewsData, VerificationStatus } from '@/data/mockData';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(mockNewsData.map(item => item.category)));

  const filteredNews = useMemo(() => {
    return mockNewsData.filter(news => {
      const matchesSearch = searchQuery === '' || 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || news.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Buscar Verificações
              </h1>
              <p className="text-muted-foreground">
                Encontre informações verificadas sobre qualquer assunto
              </p>
            </div>

            {/* Search and Filters */}
            <div className="card-alethea mb-8">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por título ou resumo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status de Verificação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="true">Verdadeiro</SelectItem>
                        <SelectItem value="false">Falso</SelectItem>
                        <SelectItem value="partial">Parcial</SelectItem>
                        <SelectItem value="manipulated">Manipulado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="shrink-0"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpar
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredNews.length} resultado{filteredNews.length !== 1 ? 's' : ''} encontrado{filteredNews.length !== 1 ? 's' : ''}
                {searchQuery && (
                  <span> para "<strong className="text-foreground">{searchQuery}</strong>"</span>
                )}
              </p>
            </div>

            {/* Active Filters */}
            {(selectedStatus !== 'all' || selectedCategory !== 'all') && (
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                {selectedStatus !== 'all' && (
                  <VerificationBadge status={selectedStatus as VerificationStatus} />
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                    {selectedCategory}
                  </span>
                )}
              </div>
            )}

            {/* Results */}
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou usar outros termos de busca
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredNews.map((news) => (
                  <NewsCard 
                    key={news.id} 
                    news={news}
                    onClick={() => {
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

export default Search;
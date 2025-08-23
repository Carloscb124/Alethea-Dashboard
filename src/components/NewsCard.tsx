import { NewsItem } from '@/data/mockData';
import VerificationBadge from './VerificationBadge';
import { Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NewsCardProps {
  news: NewsItem;
  onClick?: () => void;
}

const NewsCard = ({ news, onClick }: NewsCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(news.date), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <article 
      className="card-alethea cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-primary bg-accent px-2 py-1 rounded-lg">
          {news.category}
        </span>
        <VerificationBadge status={news.status} />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {news.title}
      </h3>

      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {news.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="font-medium">{news.source}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{news.readTime} min</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span>{formattedDate}</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
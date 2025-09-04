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

  const handleClick = () => {
    if (news.url) {
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
    onClick?.();
  };

  return (
    <article 
      className="card-alethea cursor-pointer group p-4 sm:p-6"
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
        <span className="text-xs font-medium text-accent-foreground bg-accent px-2 py-1 rounded-lg w-fit">
          {news.category}
        </span>
        <VerificationBadge status={news.status} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {news.summary}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs text-muted-foreground">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-medium truncate max-w-[120px] sm:max-w-none">{news.source}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{news.readTime} min</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <span className="text-xs">{formattedDate}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {news.image && (
          <div className="flex-shrink-0 order-first lg:order-last">
            <img 
              src={news.image} 
              alt={news.title}
              className="w-full h-48 sm:h-32 lg:w-32 lg:h-32 object-cover rounded-lg border border-border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default NewsCard;
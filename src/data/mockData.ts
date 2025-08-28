// Mock data for Alethea fact-checking platform

export type VerificationStatus = 'true' | 'false' | 'partial' | 'manipulated';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  source: string;
  status: VerificationStatus;
  image?: string;
  readTime: number;
  url?: string;
}

export interface Submission {
  id: string;
  type: 'LINK' | 'IMAGE' | 'TEXT';
  content: string;
  submittedAt: string;
  status: 'pending' | 'analyzing' | 'completed';
  submitterEmail?: string;
}

export interface CheckItem extends Submission {
  analysis?: string;
  verdict?: VerificationStatus;
  sources: string[];
  checkedBy?: string;
  checkedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'fact-checker' | 'viewer';
  avatar: string;
}

// Mock news feed data
export const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Vacina contra COVID-19 não altera DNA humano, confirmam estudos científicos',
    summary: 'Pesquisas recentes de universidades internacionais confirmam que as vacinas de mRNA não modificam o material genético das células.',
    category: 'Saúde',
    date: '2024-01-20T10:30:00Z',
    source: 'Instituto de Pesquisa Médica',
    status: 'true',
    readTime: 4
  },
  {
    id: '2',
    title: 'Imagem de "protesto" em Brasília foi manipulada digitalmente',
    summary: 'Análise técnica revela que foto viral nas redes sociais teve elementos adicionados através de edição digital.',
    category: 'Política',
    date: '2024-01-19T15:45:00Z',
    source: 'Agência Brasil',
    status: 'manipulated',
    readTime: 3
  },
  {
    id: '3',
    title: 'Informações sobre novo benefício do governo estão parcialmente corretas',
    summary: 'Programa existe, mas valores e critérios divulgados nas redes sociais não correspondem exatamente aos oficiais.',
    category: 'Economia',
    date: '2024-01-19T09:15:00Z',
    source: 'Ministério da Economia',
    status: 'partial',
    readTime: 5
  },
  {
    id: '4',
    title: 'Áudio atribuído a ministro é completamente falso',
    summary: 'Gravação que circula no WhatsApp foi criada artificialmente usando tecnologia deepfake.',
    category: 'Política',
    date: '2024-01-18T14:20:00Z',
    source: 'Assessoria de Imprensa',
    status: 'false',
    readTime: 2
  },
  {
    id: '5',
    title: 'Dados sobre desmatamento na Amazônia são baseados em metodologia científica',
    summary: 'Números divulgados por institutos de pesquisa seguem padrões internacionais de monitoramento por satélite.',
    category: 'Ambiente',
    date: '2024-01-18T11:00:00Z',
    source: 'INPE',
    status: 'true',
    readTime: 6
  },
  {
    id: '6',
    title: 'Vídeo de "miracle cure" para diabetes contém informações enganosas',
    summary: 'Produto promocionado não possui registro na ANVISA e promessas são inconsistentes com evidências médicas.',
    category: 'Saúde',
    date: '2024-01-17T16:30:00Z',
    source: 'ANVISA',
    status: 'false',
    readTime: 4
  }
];

// Mock submissions data
export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    type: 'LINK',
    content: 'https://example.com/suspicious-news-article',
    submittedAt: '2024-01-20T14:30:00Z',
    status: 'pending',
    submitterEmail: 'usuario@email.com'
  },
  {
    id: 'sub-2',
    type: 'TEXT',
    content: 'Recebi no WhatsApp que o governo vai cancelar todos os benefícios sociais. É verdade?',
    submittedAt: '2024-01-20T13:15:00Z',
    status: 'analyzing',
    submitterEmail: 'maria@email.com'
  },
  {
    id: 'sub-3',
    type: 'IMAGE',
    content: 'https://example.com/suspicious-image.jpg',
    submittedAt: '2024-01-19T18:45:00Z',
    status: 'completed',
    submitterEmail: 'joao@email.com'
  }
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Ana Silva',
    email: 'ana.silva@alethea.com.br',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b4?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u2',
    name: 'Carlos Santos',
    email: 'carlos.santos@alethea.com.br',
    role: 'fact-checker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u3',
    name: 'Beatriz Costa',
    email: 'beatriz.costa@alethea.com.br',
    role: 'fact-checker',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

// Mock learning tips data
export const mockLearningTips = [
  {
    id: 't1',
    title: 'Verifique a Fonte',
    description: 'Sempre confira se a informação vem de uma fonte confiável e reconhecida. Sites oficiais, jornais estabelecidos e instituições respeitáveis são mais confiáveis.',
    icon: '🔍',
    category: 'Básico'
  },
  {
    id: 't2',
    title: 'Analise as Imagens',
    description: 'Imagens podem ser manipuladas ou retiradas de contexto. Use ferramentas de busca reversa para verificar a origem e autenticidade.',
    icon: '📸',
    category: 'Avançado'
  },
  {
    id: 't3',
    title: 'Confronte com Outras Fontes',
    description: 'Informações verdadeiras geralmente são reportadas por múltiplas fontes confiáveis. Compare diferentes versões da mesma notícia.',
    icon: '📰',
    category: 'Básico'
  },
  {
    id: 't4',
    title: 'Desconfie de Títulos Sensacionalistas',
    description: 'Manchetes exageradas, com muitas exclamações ou palavras em maiúscula podem indicar conteúdo sensacionalista ou falso.',
    icon: '⚠️',
    category: 'Básico'
  },
  {
    id: 't5',
    title: 'Verifique Datas e Contexto',
    description: 'Notícias antigas podem ser compartilhadas como se fossem atuais. Sempre verifique quando a informação foi publicada.',
    icon: '📅',
    category: 'Intermediário'
  },
  {
    id: 't6',
    title: 'Cuidado com Links Suspeitos',
    description: 'Sites com URLs estranhas, muitos anúncios ou design questionável podem não ser confiáveis. Prefira fontes estabelecidas.',
    icon: '🔗',
    category: 'Básico'
  }
];

// Mock stats for dashboard
export const mockStats = {
  totalChecks: 1247,
  pendingChecks: 23,
  averageTime: '2.4h',
  completedToday: 15,
  verdictDistribution: {
    true: 45,
    false: 30,
    partial: 15,
    manipulated: 10
  }
};
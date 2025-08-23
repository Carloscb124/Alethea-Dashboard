import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { mockStats, mockSubmissions } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import VerificationBadge from '@/components/VerificationBadge';

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [recentSubmissions, setRecentSubmissions] = useState(mockSubmissions.slice(0, 5));

  const statCards = [
    {
      title: 'Total de Checagens',
      value: stats.totalChecks.toLocaleString(),
      icon: CheckCircle,
      color: 'text-verified-true',
      bgColor: 'bg-verified-true-bg'
    },
    {
      title: 'Checagens Pendentes',
      value: stats.pendingChecks.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Tempo Médio',
      value: stats.averageTime,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Concluídas Hoje',
      value: stats.completedToday.toString(),
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const verdictData = [
    { status: 'true', count: stats.verdictDistribution.true, label: 'Verdadeiro' },
    { status: 'false', count: stats.verdictDistribution.false, label: 'Falso' },
    { status: 'partial', count: stats.verdictDistribution.partial, label: 'Parcial' },
    { status: 'manipulated', count: stats.verdictDistribution.manipulated, label: 'Manipulado' }
  ];

  const total = verdictData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Painel de Controle
            </h1>
            <p className="text-muted-foreground">
              Visão geral das atividades de fact-checking
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Verdict Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Distribuição de Vereditos
                </CardTitle>
                <CardDescription>
                  Últimas 100 checagens realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verdictData.map((item) => {
                    const percentage = Math.round((item.count / total) * 100);
                    return (
                      <div key={item.status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <VerificationBadge status={item.status as any} />
                            <span className="text-sm text-muted-foreground">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {item.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === 'true' ? 'bg-verified-true' :
                              item.status === 'false' ? 'bg-verified-false' :
                              item.status === 'partial' ? 'bg-verified-partial' :
                              'bg-verified-manipulated'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Submissões Recentes
                </CardTitle>
                <CardDescription>
                  Últimos conteúdos enviados para verificação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div 
                      key={submission.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        submission.type === 'LINK' ? 'bg-blue-100 text-blue-700' :
                        submission.type === 'IMAGE' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {submission.type === 'LINK' ? '🔗' : 
                         submission.type === 'IMAGE' ? '📸' : '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {submission.content.length > 50 
                            ? `${submission.content.substring(0, 50)}...` 
                            : submission.content}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            submission.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {submission.status === 'pending' ? 'Pendente' :
                             submission.status === 'analyzing' ? 'Analisando' : 'Concluído'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(submission.submittedAt), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <FileText className="w-6 h-6 text-primary mb-2" />
                  <p className="font-medium text-foreground">Nova Checagem</p>
                  <p className="text-sm text-muted-foreground">Iniciar verificação manual</p>
                </button>
                <button className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <Calendar className="w-6 h-6 text-primary mb-2" />
                  <p className="font-medium text-foreground">Relatório Semanal</p>
                  <p className="text-sm text-muted-foreground">Gerar relatório de atividades</p>
                </button>
                <button className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <p className="font-medium text-foreground">Gerenciar Equipe</p>
                  <p className="text-sm text-muted-foreground">Adicionar fact-checkers</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
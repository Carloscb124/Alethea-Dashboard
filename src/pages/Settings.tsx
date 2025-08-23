import DashboardSidebar from '@/components/DashboardSidebar';
import { mockUsers } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Settings as SettingsIcon, Bell, Shield, Mail } from 'lucide-react';

const Settings = () => {
  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      'fact-checker': 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      admin: 'Administrador',
      'fact-checker': 'Fact-checker',
      viewer: 'Visualizador'
    };

    return (
      <Badge className={styles[role as keyof typeof styles]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Configurações
            </h1>
            <p className="text-muted-foreground">
              Gerencie usuários e preferências da plataforma
            </p>
          </div>

          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Membros da Equipe
                </CardTitle>
                <CardDescription>
                  Usuários com acesso ao dashboard de fact-checking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">
                      Notificações por E-mail
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas sobre novas submissões e atividades
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="urgent-notifications" className="text-base">
                      Notificações Urgentes
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas imediatos para conteúdo de alta prioridade
                    </p>
                  </div>
                  <Switch id="urgent-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-reports" className="text-base">
                      Relatórios Semanais
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receber resumo semanal das atividades de fact-checking
                    </p>
                  </div>
                  <Switch id="weekly-reports" />
                </div>
              </CardContent>
            </Card>

            {/* Platform Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Configurações da Plataforma
                </CardTitle>
                <CardDescription>
                  Ajustes gerais do sistema de fact-checking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-assign" className="text-base">
                      Atribuição Automática
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Distribuir automaticamente novas submissões para fact-checkers
                    </p>
                  </div>
                  <Switch id="auto-assign" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-submissions" className="text-base">
                      Submissões Públicas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que usuários anônimos enviem conteúdo para verificação
                    </p>
                  </div>
                  <Switch id="public-submissions" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-publish" className="text-base">
                      Publicação Automática
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Publicar verificações aprovadas automaticamente no feed público
                    </p>
                  </div>
                  <Switch id="auto-publish" />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança
                </CardTitle>
                <CardDescription>
                  Configurações de segurança e acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor" className="text-base">
                      Autenticação de Dois Fatores
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Exigir verificação adicional para acesso ao dashboard
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout" className="text-base">
                      Timeout de Sessão
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Desconectar automaticamente após período de inatividade
                    </p>
                  </div>
                  <Switch id="session-timeout" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="audit-log" className="text-base">
                      Log de Auditoria
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Registrar todas as ações realizadas no sistema
                    </p>
                  </div>
                  <Switch id="audit-log" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Informações de Contato
                </CardTitle>
                <CardDescription>
                  Canais oficiais para suporte e comunicação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Suporte Técnico:</span>
                    <span className="text-muted-foreground ml-2">suporte@alethea.com.br</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Equipe Editorial:</span>
                    <span className="text-muted-foreground ml-2">editorial@alethea.com.br</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Administrador:</span>
                    <span className="text-muted-foreground ml-2">admin@alethea.com.br</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
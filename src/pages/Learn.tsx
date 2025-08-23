import Navbar from '@/components/Navbar';
import { mockLearningTips } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Shield, AlertTriangle, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Learn = () => {
  const categoryColors = {
    'Básico': 'bg-green-100 text-green-800',
    'Intermediário': 'bg-yellow-100 text-yellow-800',
    'Avançado': 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Aprenda a Identificar Fake News
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Desenvolva habilidades essenciais para verificar informações e 
                combater a desinformação no mundo digital
              </p>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-hero text-white rounded-2xl p-8 mb-12">
              <div className="max-w-3xl mx-auto text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-blue-200" />
                <h2 className="text-2xl font-bold mb-3">
                  Por que a Verificação é Importante?
                </h2>
                <p className="text-blue-100 leading-relaxed">
                  A desinformação pode influenciar decisões importantes, afetar a saúde pública 
                  e prejudicar a democracia. Aprender a verificar informações é uma habilidade 
                  essencial para todo cidadão responsável.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">73%</p>
                <p className="text-sm text-muted-foreground">das pessoas já compartilharam fake news</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <Eye className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">6x</p>
                <p className="text-sm text-muted-foreground">mais rápido que fake news se espalha</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">30s</p>
                <p className="text-sm text-muted-foreground">para verificar básicamente uma informação</p>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Dicas Essenciais
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockLearningTips.map((tip) => (
                  <Card key={tip.id} className="hover:shadow-card-hover transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{tip.icon}</span>
                        <Badge 
                          variant="secondary" 
                          className={categoryColors[tip.category as keyof typeof categoryColors]}
                        >
                          {tip.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Steps */}
            <Card className="bg-accent border-accent-foreground/10">
              <CardHeader>
                <CardTitle className="text-xl text-accent-foreground">
                  Checklist Rápido de Verificação
                </CardTitle>
                <CardDescription className="text-accent-foreground/80">
                  Siga estes passos antes de compartilhar qualquer informação
                </CardDescription>
              </CardHeader>
              <CardContent className="text-accent-foreground/90">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Verifique a fonte</p>
                        <p className="text-sm text-accent-foreground/70">É um site confiável e conhecido?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Confira a data</p>
                        <p className="text-sm text-accent-foreground/70">A informação é atual ou foi retirada de contexto?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Busque outras fontes</p>
                        <p className="text-sm text-accent-foreground/70">Outros veículos estão reportando a mesma informação?</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Analise o conteúdo</p>
                        <p className="text-sm text-accent-foreground/70">O tom é sensacionalista ou emocional demais?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        5
                      </div>
                      <div>
                        <p className="font-medium">Verifique imagens</p>
                        <p className="text-sm text-accent-foreground/70">Use busca reversa para verificar origem das fotos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        6
                      </div>
                      <div>
                        <p className="font-medium">Na dúvida, não compartilhe</p>
                        <p className="text-sm text-accent-foreground/70">É melhor não compartilhar do que espalhar desinformação</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Encontrou Conteúdo Suspeito?
              </h3>
              <p className="text-muted-foreground mb-6">
                Envie para nossa equipe verificar e contribua para um ambiente digital mais confiável
              </p>
              <Button asChild className="btn-primary">
                <a href="/submit">
                  Enviar para Verificação
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
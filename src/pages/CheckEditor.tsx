import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import VerificationBadge from '@/components/VerificationBadge';
import { mockSubmissions, VerificationStatus } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Save, Send, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CheckEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [submission, setSubmission] = useState(mockSubmissions.find(s => s.id === id));
  const [analysis, setAnalysis] = useState('');
  const [verdict, setVerdict] = useState<VerificationStatus | ''>('');
  const [sources, setSources] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!submission) {
      toast({
        title: 'Submissão não encontrada',
        description: 'Redirecionando para a lista de submissões...',
        variant: 'destructive'
      });
      navigate('/dashboard/submissions');
    }
  }, [submission, navigate, toast]);

  const addSource = () => {
    setSources(prev => [...prev, '']);
  };

  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index));
  };

  const updateSource = (index: number, value: string) => {
    setSources(prev => prev.map((source, i) => i === index ? value : source));
  };

  const handleSave = async () => {
    if (!analysis.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha a análise.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Salvo!',
      description: 'Checagem salva como rascunho.'
    });
    
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!analysis.trim() || !verdict) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha a análise e o veredito.',
        variant: 'destructive'
      });
      return;
    }

    const validSources = sources.filter(s => s.trim());
    if (validSources.length === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, adicione pelo menos uma fonte.',
        variant: 'destructive'
      });
      return;
    }

    setPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Publicado!',
      description: 'Checagem publicada no feed público.'
    });
    
    setPublishing(false);
    navigate('/dashboard/submissions');
  };

  if (!submission) {
    return null;
  }

  const getContentPreview = () => {
    if (submission.type === 'LINK') {
      return (
        <div className="space-y-2">
          <a
            href={submission.content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline"
          >
            {submission.content} <ExternalLink className="w-4 h-4 ml-1" />
          </a>
          <p className="text-sm text-muted-foreground">
            Clique no link acima para visualizar o conteúdo
          </p>
        </div>
      );
    }

    if (submission.type === 'IMAGE') {
      return (
        <div className="space-y-2">
          <div className="w-full max-w-md bg-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Preview da Imagem</p>
            <p className="text-xs text-muted-foreground mt-1">
              {submission.content}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-foreground leading-relaxed">
          {submission.content}
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/submissions')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às Submissões
            </Button>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Editor de Checagem
            </h1>
            <p className="text-muted-foreground">
              ID: {submission.id} • Enviado{' '}
              {formatDistanceToNow(new Date(submission.submittedAt), {
                addSuffix: true,
                locale: ptBR
              })}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Content Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Conteúdo Submetido
                </CardTitle>
                <CardDescription>
                  Tipo: {submission.type} • 
                  {submission.submitterEmail ? ` E-mail: ${submission.submitterEmail}` : ' Anônimo'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getContentPreview()}
              </CardContent>
            </Card>

            {/* Analysis Form */}
            <Card>
              <CardHeader>
                <CardTitle>Análise e Veredito</CardTitle>
                <CardDescription>
                  Preencha a análise completa para publicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Analysis */}
                <div className="space-y-2">
                  <Label htmlFor="analysis">Análise Detalhada *</Label>
                  <Textarea
                    id="analysis"
                    placeholder="Descreva sua análise detalhada do conteúdo, metodologia utilizada, evidências encontradas..."
                    value={analysis}
                    onChange={(e) => setAnalysis(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                {/* Verdict */}
                <div className="space-y-2">
                  <Label>Veredito *</Label>
                  <Select value={verdict} onValueChange={(value: VerificationStatus) => setVerdict(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veredito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Verdadeiro</SelectItem>
                      <SelectItem value="false">Falso</SelectItem>
                      <SelectItem value="partial">Parcial</SelectItem>
                      <SelectItem value="manipulated">Manipulado</SelectItem>
                    </SelectContent>
                  </Select>
                  {verdict && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Preview:</span>
                      <VerificationBadge status={verdict} />
                    </div>
                  )}
                </div>

                {/* Sources */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Fontes *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSource}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {sources.map((source, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="https://fonte-confiavel.com/artigo"
                          value={source}
                          onChange={(e) => updateSource(index, e.target.value)}
                        />
                        {sources.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSource(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    disabled={saving || publishing}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Rascunho
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handlePublish}
                    className="btn-primary"
                    disabled={saving || publishing}
                  >
                    {publishing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publicar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckEditor;
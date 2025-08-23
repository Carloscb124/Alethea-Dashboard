import { useState } from 'react';
import Navbar from '@/components/Navbar';
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
import { Send, CheckCircle, Link as LinkIcon, Image, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Submit = () => {
  const [contentType, setContentType] = useState<'LINK' | 'IMAGE' | 'TEXT'>('LINK');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira o conteúdo a ser verificado.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock submission
    const submission = {
      id: `sub-${Date.now()}`,
      type: contentType,
      content,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      submitterEmail: email || undefined
    };
    
    console.log('New submission:', submission);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: 'Enviado com sucesso!',
      description: 'Recebemos sua submissão e ela será analisada em breve.'
    });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setContent('');
    setEmail('');
    setContentType('LINK');
  };

  const contentTypeInfo = {
    LINK: {
      icon: LinkIcon,
      title: 'Link/URL',
      description: 'Cole o link do conteúdo suspeito',
      placeholder: 'https://exemplo.com/artigo-suspeito'
    },
    IMAGE: {
      icon: Image,
      title: 'Imagem',
      description: 'Cole o link da imagem ou descreva-a',
      placeholder: 'https://exemplo.com/imagem.jpg ou descreva a imagem'
    },
    TEXT: {
      icon: Type,
      title: 'Texto',
      description: 'Cole ou digite o texto recebido',
      placeholder: 'Cole aqui o texto que recebeu...'
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-verified-true-bg rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-verified-true" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Enviado com Sucesso!
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Recebemos sua submissão e ela será analisada pela nossa equipe de 
                    fact-checkers. Você receberá uma resposta em até 48 horas.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={resetForm} variant="outline">
                      Enviar Outro Conteúdo
                    </Button>
                    <Button asChild className="btn-primary">
                      <a href="/">Voltar ao Início</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Enviar Conteúdo para Verificação
              </h1>
              <p className="text-muted-foreground">
                Recebeu algo suspeito? Envie para nossa equipe analisar
              </p>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Nova Submissão
                </CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para enviar conteúdo duvidoso
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Content Type Selection */}
                  <div className="space-y-3">
                    <Label>Tipo de Conteúdo</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.entries(contentTypeInfo).map(([type, info]) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setContentType(type as any)}
                          className={`p-4 rounded-lg border text-left transition-colors ${
                            contentType === type
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <info.icon className={`w-5 h-5 mb-2 ${
                            contentType === type ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <p className="font-medium text-sm">{info.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {info.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Input */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    {contentType === 'TEXT' ? (
                      <Textarea
                        id="content"
                        placeholder={contentTypeInfo[contentType].placeholder}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        required
                      />
                    ) : (
                      <Input
                        id="content"
                        type="url"
                        placeholder={contentTypeInfo[contentType].placeholder}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      />
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe seu e-mail se quiser receber o resultado da verificação
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar para Verificação
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info */}
            <div className="mt-8 p-6 bg-accent rounded-lg">
              <h3 className="font-semibold text-accent-foreground mb-2">
                Como funciona?
              </h3>
              <div className="text-sm text-accent-foreground/80 space-y-2">
                <p>1. Você envia o conteúdo suspeito</p>
                <p>2. Nossa equipe analisa a veracidade</p>
                <p>3. Publicamos o resultado verificado</p>
                <p>4. Se forneceu e-mail, você recebe a resposta</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Submit;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - any email/password combination works
    const mockUser = {
      id: 'u1',
      name: 'Ana Silva',
      email: email,
      role: 'fact-checker'
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    // Store in localStorage
    localStorage.setItem('alethea-token', mockToken);
    localStorage.setItem('alethea-user', JSON.stringify(mockUser));
    
    toast({
      title: 'Login realizado!',
      description: 'Bem-vindo ao dashboard Alethea.'
    });
    
    setLoading(false);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    setEmail('demo@alethea.com.br');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-white hover:bg-white/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Site
        </Button>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Dashboard Alethea</CardTitle>
            <CardDescription>
              Acesse o painel de fact-checking para parceiros
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Dashboard'
                )}
              </Button>
            </form>

            {/* Demo Login */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Para demonstração:
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
              >
                Usar Login Demo
              </Button>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <p className="text-xs text-accent-foreground text-center">
                Esta é uma versão de demonstração. Qualquer combinação de 
                e-mail e senha funcionará para acesso.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
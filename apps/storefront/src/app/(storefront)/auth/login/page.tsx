'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useLogin();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        if (data?.token) localStorage.setItem('sg_token', data.token);
        toast.success('Welcome back!');
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        router.push('/');
      },
      onError: () => {
        toast.error('Login failed', { description: 'Invalid email or password.' });
      },
    });
  };

  return (
    <div className="max-w-[400px] mx-auto mt-12 mb-24">
      <div className="bg-card border border-card-border rounded-md p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-center mb-2">Sign In</h1>
        <p className="text-center text-muted-foreground text-sm mb-8">Access your SourceGoods buyer account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5">Email address</label>
            <input
              type="email"
              required
              className="w-full border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-background"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold">Password</label>
              <Link href="/auth/login" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
            </div>
            <input
              type="password"
              required
              className="w-full border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-background"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-md font-bold text-lg hover:bg-primary/90 transition-transform active:scale-[0.98] mt-4"
          >
            {login.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          New to SourceGoods? <Link href="/auth/register" className="text-primary font-bold hover:underline">Join for free</Link>
        </div>
      </div>
    </div>
  );
}

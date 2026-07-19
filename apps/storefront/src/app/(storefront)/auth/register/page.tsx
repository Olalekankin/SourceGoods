'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const register = useRegister();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Weak password', { description: 'Password must be at least 8 characters long.' });
      return;
    }
    register.mutate({ data: { name, email, password } }, {
      onSuccess: (data) => {
        if (data?.token) localStorage.setItem('sg_token', data.token);
        toast.success('Account created', { description: 'Welcome to SourceGoods!' });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        router.push('/');
      },
      onError: () => {
        toast.error('Registration failed', { description: 'Could not create your account.' });
      },
    });
  };

  return (
    <div className="max-w-[400px] mx-auto mt-12 mb-24">
      <div className="bg-card border border-card-border rounded-md p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-center mb-2">Join SourceGoods</h1>
        <p className="text-center text-muted-foreground text-sm mb-8">Create your buyer account to access wholesale rates</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5">Full Name</label>
            <input
              type="text"
              required
              className="w-full border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-background"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
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
            <label className="block text-sm font-bold mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-background"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-md font-bold text-lg hover:bg-primary/90 transition-transform active:scale-[0.98] mt-4"
          >
            {register.isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

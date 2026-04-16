import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Car, ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'peminjam'>('peminjam');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) login(name.trim(), role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full gradient-success opacity-15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Kendaraan Dinas</h1>
            <p className="text-muted-foreground text-sm">Sistem Peminjaman Kendaraan Kantor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Masukkan nama anda"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Masuk Sebagai</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('peminjam')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition font-medium text-sm ${
                    role === 'peminjam'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Peminjam
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition font-medium text-sm ${
                    role === 'admin'
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-input text-muted-foreground hover:border-secondary/40'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-primary hover:opacity-90 transition"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

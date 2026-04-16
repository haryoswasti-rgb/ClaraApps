import { cars, getBookings } from "@/lib/data";
import { FileBarChart, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Report() {
  const bookings = getBookings();
  const approved = bookings.filter((b) => b.status === "approved");
  const rejected = bookings.filter((b) => b.status === "rejected");
  const pending = bookings.filter((b) => b.status === "pending");

  const carUsage = cars.map((car) => ({
    ...car,
    total: bookings.filter((b) => b.carId === car.id).length,
    approvedCount: approved.filter((b) => b.carId === car.id).length,
  }));

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Report Peminjaman</h1>
        <p className="text-muted-foreground text-sm mt-1">Ringkasan dan laporan peminjaman kendaraan dinas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard icon={FileBarChart} label="Total Peminjaman" value={bookings.length} color="bg-primary" />
        <SummaryCard icon={CheckCircle} label="Disetujui" value={approved.length} color="bg-success" />
        <SummaryCard icon={Clock} label="Menunggu" value={pending.length} color="bg-warning" />
        <SummaryCard icon={XCircle} label="Ditolak" value={rejected.length} color="bg-destructive" />
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-card-foreground text-lg">Penggunaan per Kendaraan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Kendaraan</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Plat</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Total Dialokasi</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Disetujui</th>
              </tr>
            </thead>
            <tbody>
              {carUsage.map((c) => (
                <tr key={c.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-card-foreground flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-12 h-8 rounded object-cover" />
                    {c.name}
                  </td>
                  <td className="p-3 text-muted-foreground">{c.type}</td>
                  <td className="p-3 text-muted-foreground">{c.total}</td>
                  <td className="p-3 text-muted-foreground">{c.approvedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-card-foreground text-lg">Riwayat Semua Peminjaman</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Peminjam</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tim</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Keperluan</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Mobil</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tanggal</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">Belum ada data</td></tr>
              ) : (
                bookings.map((b) => {
                  const car = cars.find((c) => c.id === b.carId);
                  return (
                    <tr key={b.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium text-card-foreground">{b.borrowerName}</td>
                      <td className="p-3 text-muted-foreground">{b.teamName}</td>
                      <td className="p-3 text-muted-foreground max-w-[150px] truncate">{b.keperluan}</td>
                      <td className="p-3 text-muted-foreground">{car?.name ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{b.startDate} — {b.endDate}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          b.status === "approved" ? "bg-success/10 text-success" :
                          b.status === "rejected" ? "bg-destructive/10 text-destructive" :
                          "bg-warning/10 text-warning"
                        }`}>
                          {b.status === "approved" ? "Disetujui" : b.status === "rejected" ? "Ditolak" : "Menunggu"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-card rounded-xl border p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

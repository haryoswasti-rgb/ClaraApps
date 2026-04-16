import { useState } from "react";
import { cars, getBookings, saveBooking, updateBookingStatus, updateBooking, type Booking } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Car, Pencil } from "lucide-react";
import AdminPasswordDialog from "@/components/AdminPasswordDialog";

export default function Peminjaman() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(getBookings());
  const [form, setForm] = useState({
    borrowerName: "",
    teamName: "",
    keperluan: "",
    startDate: "",
    endDate: "",
    startTime: "08:00",
    endTime: "17:00",
  });

  const [approvalDialog, setApprovalDialog] = useState<{ open: boolean; bookingId: string }>({ open: false, bookingId: "" });
  const [selectedCarId, setSelectedCarId] = useState("");

  const [editDialog, setEditDialog] = useState<{ open: boolean; booking: Booking | null }>({ open: false, booking: null });
  const [editForm, setEditForm] = useState({ borrowerName: "", teamName: "", keperluan: "", startDate: "", endDate: "", startTime: "", endTime: "" });

  const [editApprovalDialog, setEditApprovalDialog] = useState<{ open: boolean; booking: Booking | null }>({ open: false, booking: null });
  const [editApprovalCarId, setEditApprovalCarId] = useState("");
  const [editApprovalStatus, setEditApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending");

  // Admin password protection
  const [adminAuthDialog, setAdminAuthDialog] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState<(() => void) | null>(null);

  const requireAdmin = (action: () => void) => {
    setPendingAdminAction(() => action);
    setAdminAuthDialog(true);
  };

  const handleAdminVerified = () => {
    setAdminAuthDialog(false);
    pendingAdminAction?.();
    setPendingAdminAction(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.borrowerName || !form.teamName || !form.keperluan || !form.startDate || !form.endDate) {
      toast({ title: "Error", description: "Semua field harus diisi", variant: "destructive" });
      return;
    }
    const booking: Booking = {
      id: crypto.randomUUID(),
      ...form,
      carId: "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    saveBooking(booking);
    setBookings(getBookings());
    setForm({ borrowerName: "", teamName: "", keperluan: "", startDate: "", endDate: "", startTime: "08:00", endTime: "17:00" });
    toast({ title: "Berhasil", description: "Peminjaman berhasil diajukan" });
  };

  const handleApproveClick = (bookingId: string) => {
    setSelectedCarId("");
    setApprovalDialog({ open: true, bookingId });
  };

  const handleApproveConfirm = () => {
    if (!selectedCarId) {
      toast({ title: "Error", description: "Pilih mobil yang akan dialokasikan", variant: "destructive" });
      return;
    }
    updateBookingStatus(approvalDialog.bookingId, "approved", selectedCarId);
    setBookings(getBookings());
    setApprovalDialog({ open: false, bookingId: "" });
    toast({ title: "Disetujui", description: "Peminjaman telah disetujui dan mobil dialokasikan" });
  };

  const handleReject = (id: string) => {
    updateBookingStatus(id, "rejected");
    setBookings(getBookings());
    toast({ title: "Ditolak", description: "Peminjaman telah ditolak" });
  };

  const openEditForm = (b: Booking) => {
    setEditForm({ borrowerName: b.borrowerName, teamName: b.teamName, keperluan: b.keperluan, startDate: b.startDate, endDate: b.endDate, startTime: b.startTime, endTime: b.endTime });
    setEditDialog({ open: true, booking: b });
  };

  const handleEditFormSave = () => {
    if (!editDialog.booking) return;
    updateBooking(editDialog.booking.id, editForm);
    setBookings(getBookings());
    setEditDialog({ open: false, booking: null });
    toast({ title: "Berhasil", description: "Data peminjaman berhasil diperbarui" });
  };

  const openEditApproval = (b: Booking) => {
    setEditApprovalCarId(b.carId);
    setEditApprovalStatus(b.status);
    setEditApprovalDialog({ open: true, booking: b });
  };

  const handleEditApprovalSave = () => {
    if (!editApprovalDialog.booking) return;
    const carId = editApprovalStatus === "approved" ? editApprovalCarId : "";
    if (editApprovalStatus === "approved" && !carId) {
      toast({ title: "Error", description: "Pilih mobil yang akan dialokasikan", variant: "destructive" });
      return;
    }
    updateBooking(editApprovalDialog.booking.id, { status: editApprovalStatus, carId });
    setBookings(getBookings());
    setEditApprovalDialog({ open: false, booking: null });
    toast({ title: "Berhasil", description: "Status approval berhasil diperbarui" });
  };

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle className="w-4 h-4 text-success" />;
    if (s === "rejected") return <XCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-warning" />;
  };

  const statusLabel = (s: string) => {
    if (s === "approved") return "Disetujui";
    if (s === "rejected") return "Ditolak";
    return "Menunggu";
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Input Peminjaman Mobil</h1>
        <p className="text-muted-foreground text-sm mt-1">Ajukan peminjaman dan kelola persetujuan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-card border rounded-xl p-6 space-y-4 shadow-sm h-fit">
          <h2 className="font-semibold text-card-foreground text-lg">Form Peminjaman</h2>
          <div className="space-y-2">
            <Label>Nama Peminjam</Label>
            <Input value={form.borrowerName} onChange={(e) => setForm({ ...form, borrowerName: e.target.value })} placeholder="Nama lengkap" />
          </div>
          <div className="space-y-2">
            <Label>Nama Tim</Label>
            <Input value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} placeholder="Nama tim/bidang" />
          </div>
          <div className="space-y-2">
            <Label>Keperluan</Label>
            <Textarea value={form.keperluan} onChange={(e) => setForm({ ...form, keperluan: e.target.value })} placeholder="Jelaskan keperluan peminjaman" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Jam Mulai</Label>
              <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Jam Selesai</Label>
              <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <Button type="submit" className="w-full">Ajukan Peminjaman</Button>
        </form>

        <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-card-foreground text-lg">Daftar Peminjaman & Approval</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Peminjam</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Tim</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Keperluan</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Tanggal</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Jam</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Mobil</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-8 text-muted-foreground">Belum ada data peminjaman</td></tr>
                ) : (
                  bookings.map((b) => {
                    const car = cars.find((c) => c.id === b.carId);
                    return (
                      <tr key={b.id} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-3 font-medium text-card-foreground">{b.borrowerName}</td>
                        <td className="p-3 text-muted-foreground">{b.teamName}</td>
                        <td className="p-3 text-muted-foreground max-w-[150px] truncate">{b.keperluan}</td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{b.startDate} — {b.endDate}</td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{b.startTime} — {b.endTime}</td>
                        <td className="p-3 text-muted-foreground">
                          {car ? (
                            <span className="flex items-center gap-2">
                              <Car className="w-4 h-4" /> {car.name}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1.5">
                            {statusIcon(b.status)} {statusLabel(b.status)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {b.status === "pending" && (
                              <>
                                <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => requireAdmin(() => handleApproveClick(b.id))}>
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Setujui
                                </Button>
                                <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => requireAdmin(() => handleReject(b.id))}>
                                  <XCircle className="w-3.5 h-3.5 mr-1" /> Tolak
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => openEditForm(b)} title="Edit data">
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            {b.status !== "pending" && (
                              <Button size="sm" variant="ghost" onClick={() => requireAdmin(() => openEditApproval(b))} title="Edit approval">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
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

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Mobil untuk Dialokasikan</DialogTitle>
          </DialogHeader>
          <Select value={selectedCarId} onValueChange={setSelectedCarId}>
            <SelectTrigger><SelectValue placeholder="Pilih mobil" /></SelectTrigger>
            <SelectContent>
              {cars.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog({ open: false, bookingId: "" })}>Batal</Button>
            <Button onClick={handleApproveConfirm}>Setujui & Alokasi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Data Peminjaman</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nama Peminjam</Label><Input value={editForm.borrowerName} onChange={(e) => setEditForm({ ...editForm, borrowerName: e.target.value })} /></div>
            <div><Label>Nama Tim</Label><Input value={editForm.teamName} onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })} /></div>
            <div><Label>Keperluan</Label><Textarea value={editForm.keperluan} onChange={(e) => setEditForm({ ...editForm, keperluan: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tanggal Mulai</Label><Input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} /></div>
              <div><Label>Tanggal Selesai</Label><Input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Jam Mulai</Label><Input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} /></div>
              <div><Label>Jam Selesai</Label><Input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, booking: null })}>Batal</Button>
            <Button onClick={handleEditFormSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Approval Dialog */}
      <Dialog open={editApprovalDialog.open} onOpenChange={(open) => setEditApprovalDialog({ ...editApprovalDialog, open })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Status Approval</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Status</Label>
              <Select value={editApprovalStatus} onValueChange={(v) => setEditApprovalStatus(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editApprovalStatus === "approved" && (
              <div>
                <Label>Mobil</Label>
                <Select value={editApprovalCarId} onValueChange={setEditApprovalCarId}>
                  <SelectTrigger><SelectValue placeholder="Pilih mobil" /></SelectTrigger>
                  <SelectContent>
                    {cars.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditApprovalDialog({ open: false, booking: null })}>Batal</Button>
            <Button onClick={handleEditApprovalSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Password Dialog */}
      <AdminPasswordDialog
        open={adminAuthDialog}
        onOpenChange={(open) => { setAdminAuthDialog(open); if (!open) setPendingAdminAction(null); }}
        onSuccess={handleAdminVerified}
        title="Verifikasi Admin"
      />
    </div>
  );
}

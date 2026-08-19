import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Calendar, MapPin, QrCode, Plus, CheckCircle2 } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await apiFetch('/api/events');
    if (res.success) setEvents(res.data);
  };

  const handleRegister = async (eventId: string) => {
    try {
      const res = await apiFetch(`/api/events/${eventId}/register`, { method: 'POST' });
      if (res.success) {
        alert('Event registration successful! Digital QR Pass issued.');
        fetchEvents();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewTicket = async (eventId: string) => {
    try {
      const res = await apiFetch(`/api/events/${eventId}/ticket`);
      if (res.success) setSelectedTicket(res.data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Campus Events &amp; Digital Passes</h1>
          <p className="text-xs text-slate-500">Hackathons, keynotes, and workshops with instant QR code ticketing.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <Card key={ev.id} className="space-y-4">
            {ev.bannerUrl && (
              <img src={ev.bannerUrl} alt={ev.title} className="w-full h-40 object-cover rounded-lg" />
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="info">{ev.status}</Badge>
                <span className="text-xs font-semibold text-emerald-600">Seats: {ev.availableSeats}/{ev.maxSeats}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{ev.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{ev.description}</p>
              
              <div className="space-y-1 text-xs text-slate-500 pt-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Venue: {ev.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date: {new Date(ev.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {ev.isRegistered ? (
                <Button size="sm" variant="outline" leftIcon={<QrCode className="w-4 h-4" />} onClick={() => handleViewTicket(ev.id)}>
                  View QR Pass
                </Button>
              ) : (
                <Button size="sm" disabled={ev.availableSeats <= 0} onClick={() => handleRegister(ev.id)}>
                  {ev.availableSeats > 0 ? 'Register Now' : 'Event Full'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* QR Ticket Pass Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Digital QR Entry Pass">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedTicket?.event?.title}</p>
          {selectedTicket?.qrCodeDataUrl && (
            <img src={selectedTicket.qrCodeDataUrl} alt="QR Entry Pass" className="w-48 h-48 mx-auto border p-2 rounded-xl bg-white shadow-md" />
          )}
          <p className="text-xs font-mono text-brand-600 font-bold">{selectedTicket?.qrCodePass}</p>
          <p className="text-[11px] text-slate-400">Present this QR code at the event hall entrance for rapid scanning.</p>
        </div>
      </Modal>
    </div>
  );
};

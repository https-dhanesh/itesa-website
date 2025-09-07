import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Users, Calendar, Mail, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string;
  status: 'upcoming' | 'ongoing' | 'past';
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: 'Principal' | 'Head of Department' | 'Faculty Coordinator' | 'President' | 'Vice-President' | 'Lead' | 'Coordinator';
  image_url: string | null;
  domain: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  discord_url?: string | null;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const Admin = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [eventForm, setEventForm] = useState<{
    title: string;
    description: string;
    event_date: string;
    status: 'upcoming' | 'ongoing' | 'past';
    image_url: string;
  }>({
    title: '',
    description: '',
    event_date: '',
    status: 'upcoming',
    image_url: '',
  });

  const [memberForm, setMemberForm] = useState<{
    name: string;
    position: 'Principal' | 'Head of Department' | 'Faculty Coordinator' | 'President' | 'Vice-President' | 'Lead' | 'Coordinator';
    domain: string;
    image_url: string;
    linkedin_url: string;
    email: string;
    discord_url: string;
  }>({
    name: '',
    position: 'Lead',
    domain: '',
    image_url: '',
    linkedin_url: '',
    email: '',
    discord_url: '',
  });

  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    message: '',
  });

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [eventsResult, membersResult, contactsResult, subscribersResult] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('team_members').select('*'),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
      ]);

      if (eventsResult.error) throw eventsResult.error;
      if (membersResult.error) throw membersResult.error;
      if (contactsResult.error) throw contactsResult.error;
      if (subscribersResult.error) throw subscribersResult.error;

      setEvents(eventsResult.data || []);
      setTeamMembers((membersResult.data as TeamMember[]) || []);
      setContactSubmissions(contactsResult.data || []);
      setSubscribers(subscribersResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('events').insert([{...eventForm, image_url: eventForm.image_url || null }]);
      if (error) throw error;
      toast({ title: 'Success', description: 'Event created successfully' });
      setEventForm({ title: '', description: '', event_date: '', status: 'upcoming', image_url: '' });
      fetchAllData();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const { error } = await supabase.from('events').update({...eventForm, image_url: eventForm.image_url || null}).eq('id', editingEvent.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Event updated successfully' });
      setEventForm({ title: '', description: '', event_date: '', status: 'upcoming', image_url: '' });
      setEditingEvent(null);
      fetchAllData();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Event deleted successfully' });
      fetchAllData();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { name, position, domain, image_url, linkedin_url, email, discord_url } = memberForm;
      const memberData = {
        name,
        position,
        domain: domain || null,
        image_url: image_url || null,
        linkedin_url: linkedin_url || null,
        email: email || null,
        discord_url: discord_url || null,
      };
      const { error } = await supabase.from('team_members').insert([memberData]);
      if (error) throw error;
      toast({ title: 'Success', description: 'Team member added successfully' });
      setMemberForm({ name: '', position: 'Lead', domain: '', image_url: '', linkedin_url: '', email: '', discord_url: '' });
      fetchAllData();
    } catch (error) {
      console.error('Error creating member:', error);
      toast({ title: 'Error', description: 'Failed to add team member', variant: 'destructive' });
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const { name, position, domain, image_url, linkedin_url, email, discord_url } = memberForm;
      const memberData = {
        name,
        position,
        domain: domain || null,
        image_url: image_url || null,
        linkedin_url: linkedin_url || null,
        email: email || null,
        discord_url: discord_url || null,
      };
      const { error } = await supabase.from('team_members').update(memberData).eq('id', editingMember.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Team member updated successfully' });
      setMemberForm({ name: '', position: 'Lead', domain: '', image_url: '', linkedin_url: '', email: '', discord_url: '' });
      setEditingMember(null);
      fetchAllData();
    } catch (error) {
      console.error('Error updating member:', error);
      toast({ title: 'Error', description: 'Failed to update team member', variant: 'destructive' });
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Team member deleted successfully' });
      fetchAllData();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({ title: 'Error', description: 'Failed to delete team member', variant: 'destructive' });
    }
  };

  const startEditingEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      status: event.status,
      image_url: event.image_url || '',
    });
  };

  const startEditingMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      position: member.position,
      domain: member.domain || '',
      image_url: member.image_url || '',
      linkedin_url: member.linkedin_url || '',
      email: member.email || '',
      discord_url: member.discord_url || '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | ITESA DYPCOE</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
            Admin Dashboard
          </h1>

          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="events" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Messages</span>
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Newsletter</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
                  <CardDescription>
                    {editingEvent ? 'Update event details' : 'Add a new event to the calendar'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-title">Title</Label>
                        <Input id="event-title" value={eventForm.title} onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Event Date</Label>
                        <Input id="event-date" type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm(prev => ({ ...prev, event_date: e.target.value }))} required />
                      </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="event-image">Image URL</Label>
                        <Input id="event-image" value={eventForm.image_url} onChange={(e) => setEventForm(prev => ({ ...prev, image_url: e.target.value }))} placeholder="https://.../image.png" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-status">Status</Label>
                      <Select value={eventForm.status} onValueChange={(value: 'upcoming' | 'ongoing' | 'past') => setEventForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="past">Past</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea id="event-description" value={eventForm.description} onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))} rows={3} required />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit">{editingEvent ? 'Update Event' : 'Create Event'}</Button>
                      {editingEvent && (<Button type="button" variant="outline" onClick={() => { setEditingEvent(null); setEventForm({ title: '', description: '', event_date: '', status: 'upcoming', image_url: '' }); }}>Cancel</Button>)}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{event.title}</span>
                          <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'destructive' : 'secondary'}>{event.status}</Badge>
                        </CardTitle>
                        <CardDescription>{new Date(event.event_date).toLocaleDateString()} at {new Date(event.event_date).toLocaleTimeString()}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => startEditingEvent(event)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">{event.description}</p></CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
                  <CardDescription>{editingMember ? 'Update member details' : 'Add a new member to the team'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingMember ? handleUpdateMember : handleCreateMember} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="member-name">Name</Label>
                            <Input id="member-name" value={memberForm.name} onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="member-position">Position</Label>
                            <Select value={memberForm.position} onValueChange={(value: 'Principal' | 'Head of Department' | 'Faculty Coordinator' | 'President' | 'Vice-President' | 'Lead' | 'Coordinator') => setMemberForm(prev => ({ ...prev, position: value }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Principal">Principal</SelectItem>
                                    <SelectItem value="Head of Department">Head of Department</SelectItem>
                                    <SelectItem value="Faculty Coordinator">Faculty Coordinator</SelectItem>
                                    <SelectItem value="President">President</SelectItem>
                                    <SelectItem value="Vice-President">Vice-President</SelectItem>
                                    <SelectItem value="Lead">Lead</SelectItem>
                                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="member-image">Image URL</Label>
                        <Input id="member-image" value={memberForm.image_url} onChange={(e) => setMemberForm(prev => ({ ...prev, image_url: e.target.value }))} placeholder="https://.../photo.png" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="member-domain">Domain (Optional)</Label>
                        <Input id="member-domain" value={memberForm.domain} onChange={(e) => setMemberForm(prev => ({ ...prev, domain: e.target.value }))} placeholder="e.g., Technical, Marketing" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="member-linkedin">LinkedIn URL</Label>
                            <Input id="member-linkedin" value={memberForm.linkedin_url} onChange={(e) => setMemberForm(prev => ({ ...prev, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..."/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="member-discord">Discord Username or URL</Label>
                            <Input id="member-discord" value={memberForm.discord_url} onChange={(e) => setMemberForm(prev => ({ ...prev, discord_url: e.target.value }))} placeholder="username or https://..."/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="member-email">Email Address</Label>
                        <Input id="member-email" type="email" value={memberForm.email} onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))} placeholder="member@example.com"/>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit">{editingMember ? 'Update Member' : 'Add Member'}</Button>
                      {editingMember && (<Button type="button" variant="outline" onClick={() => { setEditingMember(null); setMemberForm({ name: '', position: 'Lead', domain: '', image_url: '', linkedin_url: '', email: '', discord_url: '' }); }}>Cancel</Button>)}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{member.name}</span>
                          <Badge variant="secondary">{member.position}</Badge>
                          {member.domain && <Badge variant="outline">{member.domain}</Badge>}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => startEditingMember(member)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteMember(member.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Submissions</CardTitle>
                  <CardDescription>Messages from the contact form</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {contactSubmissions.length > 0 ? (
                      contactSubmissions.map((submission) => (
                        <Card key={submission.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{submission.name}</CardTitle>
                            <CardDescription>{submission.email} • {new Date(submission.created_at).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent><p>{submission.message}</p></CardContent>
                        </Card>
                      ))
                    ) : (<p className="text-muted-foreground">No contact submissions yet.</p>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletter" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Newsletter</CardTitle>
                    <CardDescription>Send an email to all {subscribers.length} subscribers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast({ title: 'Feature Coming Soon', description: 'Newsletter functionality will be implemented with email service integration.' }); }}>
                      <div className="space-y-2">
                        <Label htmlFor="newsletter-subject">Subject</Label>
                        <Input id="newsletter-subject" value={newsletterForm.subject} onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))} placeholder="Newsletter subject" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newsletter-message">Message</Label>
                        <Textarea id="newsletter-message" value={newsletterForm.message} onChange={(e) => setNewsletterForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Newsletter content" rows={6} required />
                      </div>
                      <Button type="submit" className="w-full">Send Newsletter</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscribers</CardTitle>
                    <CardDescription>{subscribers.length} people subscribed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {subscribers.length > 0 ? (
                        subscribers.map((subscriber) => (
                          <div key={subscriber.id} className="flex justify-between items-center p-2 border rounded">
                            <span className="text-sm">{subscriber.email}</span>
                            <span className="text-xs text-muted-foreground">{new Date(subscriber.created_at).toLocaleDateString()}</span>
                          </div>
                        ))
                      ) : (<p className="text-muted-foreground">No subscribers yet.</p>)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
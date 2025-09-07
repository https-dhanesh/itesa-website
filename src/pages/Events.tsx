import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string;
  status: 'upcoming' | 'ongoing' | 'past';
  created_at: string;
}

const getEventStatus = (eventDateString: string): 'upcoming' | 'ongoing' | 'past' => {
  if (!eventDateString) return 'upcoming';

  const now = new Date();
  const eventDate = new Date(eventDateString);
  
  const eventDurationHours = 3;
  const eventEndDate = new Date(eventDate.getTime() + eventDurationHours * 60 * 60 * 1000);

  if (now > eventEndDate) {
    return 'past';
  } else if (now >= eventDate && now <= eventEndDate) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
};

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      const processedEvents = (data || []).map(event => ({
        ...event,
        status: getEventStatus(event.event_date),
      }));

      setUpcomingEvents(
        processedEvents.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      );
      setOngoingEvents(processedEvents.filter(e => e.status === 'ongoing'));
      setPastEvents(processedEvents.filter(e => e.status === 'past'));

    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Time not specified";
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {event.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge variant={
            event.status === 'upcoming' ? 'default' : 
            event.status === 'ongoing' ? 'destructive' : 
            'secondary'
          }>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(event.event_date)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{event.description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Our Events | ITESA DYPCOE</title>
        <meta 
          name="description" 
          content="Explore all upcoming, ongoing, and past events from the ITESA club at DYPCOE. Find details about our workshops, hackathons, seminars, and tech talks." 
        />
        <meta property="og:title" content="Our Events | ITESA DYPCOE" />
        <meta property="og:description" content="Explore all events from the ITESA club at DYPCOE." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
                  Our Events
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover upcoming workshops, hackathons, and community events organized by ITESA
                </p>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
                  <TabsTrigger value="ongoing">Ongoing ({ongoingEvents.length})</TabsTrigger>
                  <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
                    ) : (
                      <div className="col-span-full text-center py-12"><p className="text-muted-foreground text-lg">No upcoming events at the moment.</p></div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ongoing">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ongoingEvents.length > 0 ? (
                      ongoingEvents.map((event) => <EventCard key={event.id} event={event} />)
                    ) : (
                      <div className="col-span-full text-center py-12"><p className="text-muted-foreground text-lg">No ongoing events right now.</p></div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="past">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event) => <EventCard key={event.id} event={event} />)
                    ) : (
                      <div className="col-span-full text-center py-12"><p className="text-muted-foreground text-lg">No past events to display.</p></div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Events;
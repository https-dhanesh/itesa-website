import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ArrowRight, Clock, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string;
  location?: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Date TBD';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return 'Time TBD';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventsPreview = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'upcoming')
          .order('event_date', { ascending: true })
          .limit(3);

        if (error) throw error;
        
        setEvents(data || []);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-gradient-card border-border/50 rounded-lg p-4 animate-pulse">
      <div className="bg-muted h-48 rounded-md mb-4"></div>
      <div className="space-y-3">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Our Events</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Join us in our mission to innovate and transform through exciting events and workshops
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : error ? (
            <div className="col-span-full text-center text-destructive py-12">{error}</div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
                <p className="text-lg">No upcoming events right now. Check back soon!</p>
            </div>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="group bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elevated hover:scale-105">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={event.image_url || '/placeholder-image.jpg'}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                      Upcoming
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-primary-glow transition-colors duration-200">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-foreground/60 leading-relaxed h-16">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-foreground/70">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {formatDate(event.event_date)}
                  </div>
                  <div className="flex items-center text-sm text-foreground/70">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {formatTime(event.event_date)}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-foreground/70">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      {event.location}
                    </div>
                  )}
                  
                  <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10 group/btn">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-button hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-3"
          >
            View All Events
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
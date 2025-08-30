import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ArrowRight, Clock, MapPin } from 'lucide-react';
import hackathonImage from '@/assets/event-hackathon.jpg';
import workshopImage from '@/assets/event-workshop.jpg';
import seminarImage from '@/assets/event-seminar.jpg';

const EventsPreview = () => {
  const events = [
    {
      id: 1,
      title: "Innovation Hackathon 2024",
      description: "48-hour coding competition to build innovative solutions for real-world problems.",
      date: "March 15-17, 2024",
      time: "9:00 AM",
      location: "Tech Lab, Main Campus",
      image: hackathonImage,
      status: "upcoming"
    },
    {
      id: 2,
      title: "AI/ML Workshop Series",
      description: "Hands-on workshop covering machine learning fundamentals and practical applications.",
      date: "March 25, 2024",
      time: "2:00 PM",
      location: "Conference Hall A",
      image: workshopImage,
      status: "upcoming"
    },
    {
      id: 3,
      title: "Tech Industry Expert Talk",
      description: "Industry leaders share insights on emerging technologies and career opportunities.",
      date: "April 5, 2024",
      time: "4:00 PM",
      location: "Auditorium",
      image: seminarImage,
      status: "upcoming"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Our Events
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Join us in our mission to innovate and transform through exciting events and workshops
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event) => (
            <Card key={event.id} className="group bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elevated hover:scale-105">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                    {event.status}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary-glow transition-colors duration-200">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-foreground/60 leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-foreground/70">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {event.location}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-primary hover:bg-primary/10 group/btn"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Events Button */}
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
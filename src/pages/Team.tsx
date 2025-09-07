import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { Linkedin, Mail, MessageSquare } from 'lucide-react';

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

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const isDignitary = ['Principal', 'Head of Department', 'Faculty Coordinator'].includes(member.position);

  return (
    <Card className="bg-gray-800 hover:shadow-xl transition-all duration-300 h-full text-center border-border/50 flex flex-col p-6">
      <div className="mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/20 shadow-inner">
        {member.image_url ? (
          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-16 h-16 text-muted-foreground" />
        )}
      </div>
      <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
      <CardDescription className="text-primary text-base font-light">{member.position}</CardDescription>
      
      {!isDignitary && (
        <CardContent className="mt-4 p-0 flex-grow flex items-end justify-center">
          <div className="flex space-x-4">
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            )}
            {member.discord_url && (
              <a href={member.discord_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-6 w-6" />
              </a>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const Team = () => {
  const [dignitaries, setDignitaries] = useState<TeamMember[]>([]);
  const [president, setPresident] = useState<TeamMember | null>(null);
  const [vicePresidents, setVicePresidents] = useState<TeamMember[]>([]);
  const [teamsByDomain, setTeamsByDomain] = useState<Record<string, { leads: TeamMember[], coordinators: TeamMember[] }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from('team_members').select('*');
      if (error) throw error;
      const allMembers = (data as unknown as TeamMember[]) || [];

      const dignitariesList: TeamMember[] = [];
      const domainMembers: TeamMember[] = [];
      let tempPresident: TeamMember | null = null;
      let tempVPs: TeamMember[] = [];

      allMembers.forEach(member => {
        if (['Principal', 'Head of Department', 'Faculty Coordinator'].includes(member.position)) {
          dignitariesList.push(member);
        } else if (member.position === 'President') {
          tempPresident = member;
        } else if (member.position === 'Vice-President') {
          tempVPs.push(member);
        } else {
          domainMembers.push(member);
        }
      });

      const positionOrder = ['Principal', 'Head of Department', 'Faculty Coordinator'];
      setDignitaries(dignitariesList.sort((a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)));
      setPresident(tempPresident);
      setVicePresidents(tempVPs.sort((a, b) => a.name.localeCompare(b.name)));

      const groupedByDomain = domainMembers.reduce((acc, member) => {
        const domain = member.domain || 'General';
        if (!acc[domain]) {
          acc[domain] = { leads: [], coordinators: [] };
        }
        if (member.position === 'Lead') {
          acc[domain].leads.push(member);
        } else if (member.position === 'Coordinator') {
          acc[domain].coordinators.push(member);
        }
        return acc;
      }, {} as Record<string, { leads: TeamMember[], coordinators: TeamMember[] }>);

      setTeamsByDomain(groupedByDomain);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const hasAnyMembers = dignitaries.length > 0 || president || vicePresidents.length > 0 || Object.keys(teamsByDomain).length > 0;

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
        <title>Our Team | ITESA DYPCOE</title>
        <meta name="description" content="Meet the team behind the ITESA student club at DYPCOE, including our dignitaries and domain-specific teams." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <section className="py-10 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">Our Team</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Meet the passionate individuals who make ITESA a thriving community</p>
            </div>
          </section>

          {dignitaries.length > 0 && (
            <section className="py-8 bg-background">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-4xl mx-auto">
                  {dignitaries.map(member => (
                    <div key={member.id} className="w-full sm:w-1/2 md:w-1/3"><TeamMemberCard member={member} /></div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {(president || vicePresidents.length > 0) && (
            <section className="py-8 bg-muted/20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Core Team</h2>
                <div className="space-y-16">
                  {president && (
                    <div className="max-w-xs mx-auto">
                      <TeamMemberCard member={president} />
                    </div>
                  )}
                  {vicePresidents.length > 0 && (
                    <div className="max-w-xl mx-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {vicePresidents.map((member) => <TeamMemberCard key={member.id} member={member} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {Object.entries(teamsByDomain).map(([domain, team], index) => (
            <section key={domain} className={`py-20 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">{domain} Team</h2>
                
                {team.leads.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-8 mb-8">
                    {team.leads.map(member => (
                      <div key={member.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                        <TeamMemberCard member={member} />
                      </div>
                    ))}
                  </div>
                )}

                {team.coordinators.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-8">
                    {team.coordinators.map(member => (
                       <div key={member.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                        <TeamMemberCard member={member} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}

          {!loading && !hasAnyMembers && (
            <section className="py-16">
              <div className="container mx-auto px-4 text-center">
                <p className="text-muted-foreground text-lg">No team members found. Check back soon!</p>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Team;
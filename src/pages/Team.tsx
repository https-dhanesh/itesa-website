import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
  member_type: 'Dignitary' | 'Core' | 'Coordinator';
  domain: string | null;
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('member_type', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembersByType = (type: string) => {
    return members.filter(member => member.member_type === type);
  };

  const groupCoordinatorsByDomain = () => {
    const coordinators = filterMembersByType('Coordinator');
    const grouped = coordinators.reduce((acc, member) => {
      const domain = member.domain || 'General';
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(member);
      return acc;
    }, {} as Record<string, TeamMember[]>);
    
    return grouped;
  };

  const MemberCard = ({ member, size = 'default' }: { member: TeamMember; size?: 'default' | 'large' }) => (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${size === 'large' ? 'md:col-span-2' : ''}`}>
      <CardHeader className={`text-center ${size === 'large' ? 'pb-4' : 'pb-2'}`}>
        <div className={`mx-auto mb-4 ${size === 'large' ? 'w-32 h-32' : 'w-24 h-24'} rounded-full overflow-hidden bg-muted flex items-center justify-center`}>
          {member.image_url ? (
            <img
              src={member.image_url}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className={`${size === 'large' ? 'w-16 h-16' : 'w-12 h-12'} text-muted-foreground`} />
          )}
        </div>
        <CardTitle className={size === 'large' ? 'text-2xl' : 'text-lg'}>{member.name}</CardTitle>
        <CardDescription className={size === 'large' ? 'text-base' : 'text-sm'}>{member.position}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary">{member.member_type}</Badge>
          {member.domain && (
            <Badge variant="outline">{member.domain}</Badge>
          )}
        </div>
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

  const dignitaries = filterMembersByType('Dignitary');
  const coreTeam = filterMembersByType('Core');
  const coordinatorsByDomain = groupCoordinatorsByDomain();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
                Our Team
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate individuals who make ITESA a thriving community
              </p>
            </div>
          </div>
        </section>

        {/* Dignitaries */}
        {dignitaries.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Dignitaries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {dignitaries.map((member) => (
                  <MemberCard key={member.id} member={member} size="large" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Core Team */}
        {coreTeam.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Core Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreTeam.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Coordinators */}
        {Object.keys(coordinatorsByDomain).length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Coordinators</h2>
              <div className="space-y-12">
                {Object.entries(coordinatorsByDomain).map(([domain, domainMembers]) => (
                  <div key={domain}>
                    <h3 className="text-2xl font-semibold text-center mb-8">{domain}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {domainMembers.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {members.length === 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground text-lg">No team members found. Check back soon!</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Team;
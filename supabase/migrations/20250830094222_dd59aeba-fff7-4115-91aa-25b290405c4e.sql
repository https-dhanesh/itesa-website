
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'past');

CREATE TYPE public.member_type AS ENUM ('Dignitary', 'Core', 'Coordinator');

CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status event_status NOT NULL DEFAULT 'upcoming'
);

CREATE TABLE public.team_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    image_url TEXT,
    member_type member_type NOT NULL,
    domain TEXT
);

CREATE TABLE public.subscribers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT 
USING (true);

CREATE POLICY "Team members are viewable by everyone" 
ON public.team_members FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage events" 
ON public.events FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage team members" 
ON public.team_members FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view contact submissions" 
ON public.contact_submissions FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view subscribers" 
ON public.subscribers FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions FOR INSERT 
WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);


CREATE POLICY "Images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');
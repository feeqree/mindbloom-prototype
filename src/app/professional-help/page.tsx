
"use client";

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Phone, Globe, Users, MessageSquareText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type ProfessionalContact = {
  name: string;
  contactInfo?: string; // Can be a phone number or instruction like "Text XXXX to YYYY"
  website?: string;
  description: string;
  type: 'hotline' | 'resource' | 'online-platform';
  icon?: React.ReactNode;
  regionFocus?: string;
};

const professionalContacts: ProfessionalContact[] = [
  {
    name: 'Your Country\'s National Crisis Hotline (Example)',
    contactInfo: 'Search online for "[Your Country] crisis hotline"',
    description: 'Immediate support for individuals in distress. Many APAC countries have national helplines.',
    type: 'hotline',
    icon: <Phone className="mr-2 h-5 w-5 text-primary" />,
    regionFocus: 'Country-Specific (User to verify)',
  },
  {
    name: 'Befrienders Worldwide (International Network)',
    website: 'https://www.befrienders.org',
    description: 'A network of emotional support centers, some of which are in the APAC region. Check their website for local centers.',
    type: 'resource',
    icon: <Globe className="mr-2 h-5 w-5 text-primary" />,
    regionFocus: 'International (APAC presence varies)',
  },
  {
    name: 'Find a Therapist - [Your Country/City] (Example Portal)',
    website: 'Search "[Your Country/City] therapist directory"',
    description: 'Look for online directories or professional psychological association websites in your area to find qualified therapists.',
    type: 'resource',
    icon: <Users className="mr-2 h-5 w-5 text-primary" />,
    regionFocus: 'Country/City-Specific (User to research)',
  },
  {
    name: 'Regional Online Counseling Platform (Example)',
    website: 'Search for online therapy platforms available in your APAC country.',
    description: 'Several online platforms offer therapy services accessible across various APAC countries. Research options available and suitable for you.',
    type: 'online-platform',
    icon: <MessageSquareText className="mr-2 h-5 w-5 text-primary" />,
    regionFocus: 'APAC Region (Availability varies)',
  },
  {
    name: 'Youth Helpline - [Your Country] (Example)',
    contactInfo: 'Search online for "[Your Country] youth helpline"',
    description: 'Specialized support lines for young people facing mental health challenges.',
    type: 'hotline',
    icon: <Phone className="mr-2 h-5 w-5 text-primary" />,
    regionFocus: 'Country-Specific (User to verify)',
  },
];


export default function ProfessionalHelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <Card className="w-full max-w-3xl shadow-xl">
          <CardHeader className="text-center border-b pb-4">
            <CardTitle className="text-2xl md:text-3xl flex items-center justify-center">
                <Users className="mr-3 h-7 w-7 text-primary" />
                Find Professional Help (APAC Focus)
            </CardTitle>
            <CardDescription className="mt-2">
              Accessing mental health support is vital. Below are illustrative examples of resources.
              For the best support, please search for verified, local services in your specific country or region.
              If you are in immediate danger, contact your local emergency services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2 mb-6 p-4 border rounded-lg bg-card/50">
              <Label htmlFor="country-select" className="font-semibold">Resource Localization (Future Enhancement)</Label>
              <Select disabled>
                <SelectTrigger id="country-select">
                  <SelectValue placeholder="Select your country for localized resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sg">Singapore</SelectItem>
                  <SelectItem value="my">Malaysia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  {/* Add more example APAC countries */}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This feature is planned to provide tailored resources based on your location. For now, please use the general examples below and verify local services.
              </p>
            </div>

            {professionalContacts.map((contact, index) => (
              <Card key={index} className="bg-card/70 dark:bg-card/90">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    {contact.icon || (contact.type === 'hotline' ? <Phone className="mr-2 h-5 w-5 text-primary" /> : <Globe className="mr-2 h-5 w-5 text-primary" />)}
                    {contact.name}
                  </CardTitle>
                  {contact.regionFocus && <CardDescription className="text-xs mt-1">{contact.regionFocus}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2 text-sm">{contact.description}</p>
                  {contact.contactInfo && (
                    <p className="text-sm mb-1">
                      <strong>Contact:</strong> <a href={contact.contactInfo.startsWith('tel:') ? contact.contactInfo : undefined} className="text-primary hover:underline">{contact.contactInfo}</a>
                    </p>
                  )}
                  {contact.website && (
                    <p className="text-sm">
                      <strong>Website:</strong> <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{contact.website}</a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            <Alert variant="default" className="mt-8 bg-secondary/30 dark:bg-secondary/50 border-border">
              <AlertTitle className="font-semibold text-foreground/90">Important Disclaimer</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                This list provides examples and is for informational purposes only. It is not exhaustive.
                MindBloom is not affiliated with and does not endorse any specific service.
                Always verify resources and choose what is best for your situation. Information may change, so always check the provider's website for the most up-to-date details.
                Localizing these resources accurately for each APAC country is a planned enhancement.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <Button variant="outline" className="w-full max-w-3xl mt-8" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}

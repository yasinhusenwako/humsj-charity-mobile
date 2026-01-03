import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  BookOpen,
  Home,
  Utensils,
  Users,
  ArrowRight,
  Baby,
  Stethoscope,
  HandHeart,
} from "lucide-react";
import { Link } from "react-router-dom";
import educationImage from "@/assets/education-hope.jpg";
import unityImage from "@/assets/unity-hands.jpg";
import successImage from "@/assets/success-student.jpg";

const Causes = () => {
  const causes = [
    {
      id: 1,
      title: "Education Support",
      description:
        "Help students pay for tuition, books, and educational materials",
      image: educationImage,
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Community Housing",
      description: "Provide safe and affordable housing for students in need",
      image: unityImage,
      icon: Home,
    },
    {
      id: 3,
      title: "Food Security",
      description: "Ensure students have access to nutritious meals daily",
      image:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
      icon: Utensils,
    },
    {
      id: 4,
      title: "Orphan Aid",
      description:
        "Support orphaned students with essential care, education, and a brighter future",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      icon: Baby,
    },
    {
      id: 5,
      title: "Healthcare Support",
      description:
        "Provide medical care and health services for orphans and families in need",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      icon: Stethoscope,
    },
    {
      id: 6,
      title: "Emergency Relief",
      description:
        "Rapid assistance for orphans and families facing urgent crises",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
      icon: HandHeart,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-6">Our Causes</h1>
            <p className="text-xl opacity-90">
              Support orphans, students, and community members in need
            </p>
          </div>
        </div>
      </section>

      {/* Causes Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Active Campaigns
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a cause and make a direct impact on the lives of orphans,
              students, and families in need
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-2 sm:px-0">
            {causes.map((cause) => {
              const Icon = cause.icon;
              return (
                <Card
                  key={cause.id}
                  className="overflow-hidden shadow-medium hover:shadow-strong transition-all"
                >
                  <div className="relative h-48">
                    <img
                      src={cause.image}
                      alt={cause.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <CardTitle className="text-xl">{cause.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {cause.description}
                    </p>

                    <Link to="/auth">
                      <Button variant="hero" className="w-full">
                        Donate Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Why Support Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-muted">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <Heart className="w-12 h-12 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-primary">
                      Why Your Support Matters
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Every donation directly impacts orphans, students, and
                      families in our community. Your contribution helps:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Provide essential care and support for orphans</li>
                      <li>
                        • Keep students in school by covering tuition and
                        educational expenses
                      </li>
                      <li>
                        • Provide nutritious meals and healthcare for families
                        in need
                      </li>
                      <li>
                        • Ensure safe housing and shelter for those without
                        homes
                      </li>
                      <li>
                        • Build a stronger community through mutual support
                        (Takaful)
                      </li>
                      <li>
                        • Create opportunities for orphans and youth to succeed
                        and thrive
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-primary text-primary-foreground">
              <CardContent className="pt-8 pb-8">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  Can't Choose? Support All Causes
                </h3>
                <p className="mb-6 opacity-90">
                  Make a general donation and we'll allocate it where it's
                  needed most
                </p>
                <Link to="/donate">
                  <Button variant="charity" size="lg">
                    Make a General Donation
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Causes;

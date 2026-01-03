import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import patternImage from "@/assets/islamic-pattern.jpg";
import { useState } from "react";

const About = () => {
  const [showFullWhoWeAre, setShowFullWhoWeAre] = useState(false);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={patternImage}
            alt="Traditional Islamic geometric pattern and arabesque design - representing Muslim heritage and values"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            About HUMSJ Charity
          </h1>
          <p className="text-xl text-white/90 max-w-2xl animate-fade-in">
            Haramaya University Muslim Students' Jama'a - Building a Better
            Future Together
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                HUMSJ Charity Sector is the humanitarian arm of Haramaya
                University Muslim Students' Jama'a. We are a dedicated group of
                students and alumni committed to supporting orphans, students,
                and families facing financial and social challenges.
              </p>

              {/* Collapsible content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  showFullWhoWeAre ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Founded on the Islamic principles of charity (Sadaqah) and
                  community support (Takaful), we believe that every orphan,
                  student, and family member deserves the opportunity to thrive
                  regardless of their circumstances. Through monthly donations
                  and community involvement, we create a sustainable support
                  system that provides care, education, and hope for a brighter
                  future.
                </p>
              </div>

              {/* Read More/Less Button */}
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowFullWhoWeAre(!showFullWhoWeAre)}
                  className="flex items-center gap-2 text-primary hover:bg-primary/10"
                >
                  {showFullWhoWeAre ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Read Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Read More
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-medium">
                <CardContent className="pt-8 pb-8">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-primary">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground">
                    To provide sustainable financial support to Haramaya
                    University students and community members in need, ensuring
                    that financial barriers never stand in the way of
                    educational success, personal development, and community
                    well-being.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="pt-8 pb-8">
                  <Eye className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-primary">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground">
                    A thriving community where every student and community
                    member has equal access to education, support, and
                    opportunities to reach their full potential, creating a
                    ripple effect of positive change in society.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                <Heart className="w-8 h-8" />
                Our Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">
                    Compassion
                  </h4>
                  <p className="text-muted-foreground">
                    We lead with empathy and understanding, recognizing the
                    dignity of every student and community member.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">
                    Transparency
                  </h4>
                  <p className="text-muted-foreground">
                    We maintain complete openness in our operations and fund
                    management.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">
                    Community
                  </h4>
                  <p className="text-muted-foreground">
                    We believe in the power of collective action and mutual
                    support.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">
                    Excellence
                  </h4>
                  <p className="text-muted-foreground">
                    We strive for the highest standards in everything we do.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-primary text-primary-foreground shadow-strong">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <Users className="w-12 h-12 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-4">How We Work</h3>
                    <p className="mb-4 opacity-90">
                      Our charity sector operates on a monthly subscription
                      model where donors commit to contributing a minimum of 50
                      ETB per month. This sustainable approach allows us to:
                    </p>
                    <ul className="space-y-2 opacity-90">
                      <li>
                        • Provide consistent support to students and community
                        members throughout the year
                      </li>
                      <li>
                        • Plan and execute long-term assistance programs for
                        students and the community
                      </li>
                      <li>
                        • Build a reliable safety net for students and community
                        members facing unexpected challenges
                      </li>
                      <li>
                        • Create a transparent system where donors can track
                        their impact
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

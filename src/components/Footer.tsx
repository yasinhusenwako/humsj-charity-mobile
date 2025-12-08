import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">HUMSJ Charity</h3>
            <p className="text-sm opacity-90">
              Supporting Haramaya University students and the wider community
              through monthly donations and community care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-secondary transition-colors block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-secondary transition-colors block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/causes"
                  className="hover:text-secondary transition-colors block py-1"
                >
                  Our Causes
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="hover:text-secondary transition-colors block py-1"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-secondary transition-colors block py-1"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-3 md:mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span className="break-all">charity@humsj.edu.et</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>+251 25 553 0225</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="flex-shrink-0" />
                <span>Haramaya University</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-3 md:mb-4">Follow Us</h3>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-secondary transition-colors p-2 -m-2"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors p-2 -m-2"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors p-2 -m-2"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>
            &copy; {new Date().getFullYear()} HUMSJ Charity Sector. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

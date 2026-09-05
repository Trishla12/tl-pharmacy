import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-16">
      {/* Newsletter Section */}
      <div className="bg-primary py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="mb-6 opacity-90">Get health tips, exclusive offers and wellness updates delivered to your inbox</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg outline-none text-dark"
            />
            <button className="px-6 py-3 bg-dark text-light rounded-lg font-medium hover:opacity-90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Pill className="text-white" size={24} />
              </div>
              <div>
                <div className="font-bold text-lg">TL PHARMACY</div>
                <div className="text-xs text-secondary">Your Health, Our Priority</div>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Trusted online pharmacy providing authentic Allopathic, Generic, Ayurvedic and Wellness products with guaranteed quality.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-primary hover:text-secondary transition"><FaFacebook size={20} /></a>
              <a href="#" className="text-primary hover:text-secondary transition"><FaTwitter size={20} /></a>
              <a href="#" className="text-primary hover:text-secondary transition"><FaInstagram size={20} /></a>
              <a href="#" className="text-primary hover:text-secondary transition"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="opacity-80 hover:text-primary transition">About Us</Link></li>
              <li><Link to="/careers" className="opacity-80 hover:text-primary transition">Careers</Link></li>
              <li><Link to="/press" className="opacity-80 hover:text-primary transition">Press</Link></li>
              <li><Link to="/blog" className="opacity-80 hover:text-primary transition">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="opacity-80 hover:text-primary transition">FAQ</Link></li>
              <li><Link to="/contact" className="opacity-80 hover:text-primary transition">Contact Us</Link></li>
              <li><Link to="/shipping" className="opacity-80 hover:text-primary transition">Shipping Info</Link></li>
              <li><Link to="/returns" className="opacity-80 hover:text-primary transition">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold mb-4 text-white">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="opacity-80 hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="opacity-80 hover:text-primary transition">Terms & Conditions</Link></li>
              <li><Link to="/cookies" className="opacity-80 hover:text-primary transition">Cookie Policy</Link></li>
              <li><Link to="/disclaimer" className="opacity-80 hover:text-primary transition">Medical Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 items-start">
                <Mail size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:support@tlpharmacy.com" className="opacity-80 hover:text-primary transition">support@tlpharmacy.com</a>
              </li>
              <li className="flex gap-3 items-start">
                <Phone size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+919876543210" className="opacity-80 hover:text-primary transition">+91 9876543210</a>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="opacity-80">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary border-opacity-30 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-secondary">
            <div>&copy; {currentYear} TL Pharmacy. All rights reserved.</div>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link to="/privacy" className="hover:text-primary transition">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition">Terms</Link>
              <Link to="/sitemap" className="hover:text-primary transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
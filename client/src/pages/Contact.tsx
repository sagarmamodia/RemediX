import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-4">Contact Us</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Here's how you can reach us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Mail className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-bold text-text-main mb-2 text-lg">Email Us</h3>
            <a href="mailto:support@remedix.com" className="text-primary font-medium hover:underline">
              support@remedix.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Phone className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-bold text-text-main mb-2 text-lg">Call Us</h3>
            <a href="tel:+919876543210" className="text-primary font-medium hover:underline">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <MapPin className="text-primary h-8 w-8" />
            </div>
            <h3 className="font-bold text-text-main mb-2 text-lg">Visit Us</h3>
            <p className="text-text-muted">
              DCRUST, Murthal<br />
              Sonipat, Haryana 131039
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

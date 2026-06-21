import Link from 'next/link';
import { Mail, Smartphone, Calendar, Check, Truck, MapPin, Award, Users, Sparkles, Sprout, Bird } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Contact Us</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Get in touch with CUCU MUTUGI POULTRY for orders and support
        </p>
      </section>

      {/* Contact Information */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        {/* Main Contact Card */}
        <div className="bg-primary text-white p-12 rounded-xl mb-12 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Order Premium Chicks?</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-accent mb-3 flex items-center justify-center gap-2"><Mail className="h-6 w-6" /> Email</h3>
              <a href="mailto:cucumutugipoultry@gmail.com" className="text-xl hover:text-accent transition-colors">
                cucumutugipoultry@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-accent mb-3 flex items-center justify-center gap-2"><Smartphone className="h-6 w-6" /> Phone</h3>
              <div className="space-y-2">
                <a href="tel:0706972161" className="block text-xl hover:text-accent transition-colors">
                  0706972161
                </a>
                <a href="tel:0740662799" className="block text-xl hover:text-accent transition-colors">
                  0740662799
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Days & Service Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-light-green p-8 rounded-xl border-2 border-primary">
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2"><Calendar className="h-6 w-6" /> Marketing Days</h3>
            <p className="text-lg text-gray-700 mb-4">We operate on:</p>
            <div className="space-y-2 text-lg text-gray-800 font-semibold">
              <p className="flex items-center gap-2 justify-center"><Check className="h-5 w-5 text-primary" /> Wednesday</p>
              <p className="flex items-center gap-2 justify-center"><Check className="h-5 w-5 text-primary" /> Thursday</p>
            </div>
          </div>

          <div className="bg-light-gold p-8 rounded-xl border-2 border-accent">
            <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2"><Truck className="h-6 w-6" /> Delivery</h3>
            <p className="text-lg text-gray-700">
              <strong>FREE COUNTRYWIDE DELIVERY</strong> on all orders to ensure your chicks arrive safely and on time.
            </p>
          </div>
        </div>

        {/* Service Locations */}
        <div className="bg-white p-8 rounded-xl border-2 border-primary mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"><MapPin className="h-6 w-6" /> Service Locations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-gray-700">Embu</div>
            <div className="text-gray-700">Kirinyaga</div>
            <div className="text-gray-700">Meru</div>
            <div className="text-gray-700">Nyeri</div>
            <div className="text-gray-700">Tharaka Nithi</div>
            <div className="text-gray-700">Kitale</div>
            <div className="text-gray-700">Kitui</div>
            <div className="text-gray-700">Machakos</div>
            <div className="text-gray-700">Eldoret</div>
            <div className="text-gray-700">Rongo</div>
            <div className="text-gray-700">Bungoma</div>
            <div className="text-gray-700">Nairobi</div>
            <div className="text-gray-700">Naivasha</div>
            <div className="text-gray-700">Nakuru</div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-light-green p-12 rounded-xl border-2 border-primary mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Our Product Range</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-3">Pre-Vaccinated Improved Kienyeji Breeds</h3>
              <p className="text-gray-700 mb-3">Premium quality breeds including:</p>
              <ul className="grid grid-cols-2 gap-3 text-gray-700">
                <li>• KUROILER</li>
                <li>• KARI</li>
                <li>• SASSO</li>
                <li>• RAINBOW ROOSTER</li>
                <li>• KENBRO</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary mb-3">Broiler & Layer Chicks</h3>
              <p className="text-gray-700">Pre-vaccinated day-old chicks for both meat and egg production</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary mb-3">Various Ages</h3>
              <p className="text-gray-700">From day-old chicks up to one month old, available at multiple stages of development</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-primary rounded-xl p-6 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-primary mb-2">Quality Chicks</h3>
            <p className="text-gray-700 text-sm">Healthy, strong, and fully vaccinated chicks</p>
          </div>

          <div className="bg-white border-2 border-primary rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-primary mb-2">Expert Support</h3>
            <p className="text-gray-700 text-sm">Technical expertise and reliable customer service</p>
          </div>

          <div className="bg-white border-2 border-primary rounded-xl p-6 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-primary mb-2">Trusted Partner</h3>
            <p className="text-gray-700 text-sm">Your partner in building profitable poultry businesses</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="bg-accent text-charcoal p-12 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">CUCU MUTUGI POULTRY</h2>
          <p className="text-xl italic">
            "Growing Farmers, Building Prosperity" <Sprout className="h-5 w-5 inline text-green-700" /> <Bird className="h-5 w-5 inline text-primary" />
          </p>
        </div>

        {/* Follow Us Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Follow Us on Social Media</h2>
          <p className="text-gray-700 text-lg">Connect with us on your favorite platforms for updates, tips, and community engagement</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a
              href="https://www.threads.com/@cucu.mutugi.poultry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              Threads
            </a>
            <a
              href="https://x.com/KelvinM60040495"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-gray-900 text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              𝕏 X (Twitter)
            </a>
            <a
              href="https://www.facebook.com/cucumutugipoultry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/cucumutugipoultry/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 hover:bg-pink-600 text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@cucumutugipoultry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 hover:bg-black text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://chat.whatsapp.com/HCBJw4Dp5iV2CoAPS4MXaW"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://drive.google.com/drive/folders/12XyA9r8y7Uu6Xs8ZBPN-llwOS-wkpUgw?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center font-bold transition-colors"
            >
              Resources
            </a>
          </div>

          {/* More Details */}
          <Link href="/follow-us" className="block text-center">
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
              View All Social Media Links
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

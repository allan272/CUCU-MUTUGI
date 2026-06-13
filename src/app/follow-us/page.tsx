import Link from 'next/link';

export default function FollowUsPage() {
  const socialLinks = [
    {
      platform: "Threads",
      url: "https://www.threads.com/@cucu.mutugi.poultry",
      icon: "🧵",
      color: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
      description: "Follow us on Threads for latest updates"
    },
    {
      platform: "X (Twitter)",
      url: "https://x.com/KelvinM60040495",
      icon: "𝕏",
      color: "bg-black",
      hoverColor: "hover:bg-gray-900",
      description: "Connect with us on X for real-time updates"
    },
    {
      platform: "Facebook",
      url: "https://www.facebook.com/cucumutugipoultry",
      icon: "f",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      description: "Like our Facebook page for community engagement"
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/cucumutugipoultry/",
      icon: "📸",
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      description: "Follow our Instagram for farm updates and photos"
    },
    {
      platform: "TikTok",
      url: "https://www.tiktok.com/@cucumutugipoultry",
      icon: "🎵",
      color: "bg-gray-900",
      hoverColor: "hover:bg-black",
      description: "Watch our videos and poultry farming tips on TikTok"
    }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Follow Us</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Connect with CUCU MUTUGI POULTRY on social media and join our farming community
        </p>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        {/* Social Media Links */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">Social Media Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} ${social.hoverColor} text-white p-8 rounded-xl transition-all transform hover:scale-105 shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{social.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{social.platform}</h3>
                    <p className="text-sm opacity-90">{social.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* WhatsApp Group */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">WhatsApp Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Join WhatsApp Group */}
            <a
              href="https://chat.whatsapp.com/HCBJw4Dp5iV2CoAPS4MXaW"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white p-12 rounded-xl transition-all transform hover:scale-105 shadow-lg text-center"
            >
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-3xl font-bold mb-3">Join WhatsApp Group</h3>
              <p className="text-lg mb-4 opacity-90">
                Connect with other farmers, get instant support, and share experiences
              </p>
              <div className="bg-green-700 px-6 py-3 rounded-lg inline-block font-bold">
                Tap to Join Group
              </div>
            </a>

            {/* WhatsApp Support */}
            <div className="bg-light-green p-12 rounded-xl border-2 border-green-500">
              <div className="text-6xl mb-4 text-center">📱</div>
              <h3 className="text-2xl font-bold text-primary mb-4 text-center">WhatsApp Support</h3>
              <p className="text-gray-700 mb-6 text-center">
                Send us a message on WhatsApp for quick responses and technical support
              </p>
              <div className="space-y-3 text-center">
                <a
                  href="https://wa.me/254706972161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-bold transition-colors"
                >
                  Chat via WhatsApp: 0706972161
                </a>
                <a
                  href="https://wa.me/254740662799"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-bold transition-colors"
                >
                  Chat via WhatsApp: 0740662799
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Google Drive Resources */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">Resource Library</h2>
          <a
            href="https://drive.google.com/drive/folders/12XyA9r8y7Uu6Xs8ZBPN-llwOS-wkpUgw?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white p-12 rounded-xl transition-all transform hover:scale-105 shadow-lg block"
          >
            <div className="flex items-center gap-6">
              <div className="text-6xl">📂</div>
              <div>
                <h3 className="text-3xl font-bold mb-3">Google Drive Resources</h3>
                <p className="text-lg opacity-90 mb-4">
                  Access our complete library of poultry farming guides, images, videos, and educational materials
                </p>
                <div className="bg-blue-800 px-6 py-3 rounded-lg inline-block font-bold">
                  Open Google Drive
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Why Follow Us */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Why Follow CUCU MUTUGI POULTRY?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-light-green p-6 rounded-xl border-l-4 border-primary">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-primary mb-2">Educational Content</h3>
              <p className="text-gray-700">Learn poultry farming best practices and techniques</p>
            </div>
            <div className="bg-light-green p-6 rounded-xl border-l-4 border-primary">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="font-bold text-primary mb-2">Latest Updates</h3>
              <p className="text-gray-700">Get real-time news and product announcements</p>
            </div>
            <div className="bg-light-green p-6 rounded-xl border-l-4 border-primary">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-primary mb-2">Community Support</h3>
              <p className="text-gray-700">Connect with other farmers and share experiences</p>
            </div>
            <div className="bg-light-green p-6 rounded-xl border-l-4 border-primary">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-bold text-primary mb-2">Expert Advice</h3>
              <p className="text-gray-700">Get answers to your poultry farming questions</p>
            </div>
            <div className="bg-light-green p-6 rounded-xl border-l-4 border-primary">
              <div className="text-4xl mb-3">🎥</div>
              <h3 className="font-bold text-primary mb-2">Video Tutorials</h3>
              <p className="text-gray-700">Watch how-to videos and farm demonstrations</p>
            </div>
            <div className="bg-light-green p-6 rounded-xl border-l-4 border-primary">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold text-primary mb-2">Exclusive Offers</h3>
              <p className="text-gray-700">Get special deals and promotions for followers</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary text-white p-12 rounded-xl text-center border-l-4 border-accent">
          <h2 className="text-3xl font-bold mb-4 text-accent">Join Our Growing Community!</h2>
          <p className="text-lg mb-6">
            Follow us on all platforms to stay connected with CUCU MUTUGI POULTRY and never miss important updates
          </p>
          <p className="text-light-green font-semibold">
            Growing Farmers, Building Prosperity 🌱🐔
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center pt-12">
          <Link href="/contact" className="text-primary font-semibold hover:text-accent transition-colors">
            ← Back to Contact
          </Link>
        </div>
      </section>
    </div>
  );
}

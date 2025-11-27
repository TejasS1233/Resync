import Breadcrumbs from "../components/Breadcrumbs";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs />
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to Resync. We respect your privacy and are committed to protecting your
                personal data. This privacy policy explains how we collect, use, and safeguard your
                information when you use our goal tracking application.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Account Information</h3>
                <p className="text-gray-300 leading-relaxed">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Usage Data</h3>
                <p className="text-gray-300 leading-relaxed">
                  We collect information about how you use Resync:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Goals and habits you create</li>
                  <li>Progress tracking data</li>
                  <li>Daily notes and mood entries</li>
                  <li>Activity timestamps</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed">We use your data to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide and maintain the Resync service</li>
                <li>Sync your data across devices</li>
                <li>Generate statistics and visualizations</li>
                <li>Improve our application and user experience</li>
                <li>Send important service updates (if opted in)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Data Storage and Security</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data is stored securely using industry-standard encryption:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Passwords are hashed using bcrypt</li>
                <li>Data is transmitted over HTTPS</li>
                <li>Database hosted on secure MongoDB Atlas servers</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Guest Mode</h2>
              <p className="text-gray-300 leading-relaxed">
                When using Resync in guest mode, all data is stored locally in your browser's
                localStorage. We do not collect or store any information from guest users on our
                servers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Data Sharing</h2>
              <p className="text-gray-300 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. Your data
                is yours and yours alone.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Your Rights</h2>
              <p className="text-gray-300 leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Export your data</li>
                <li>Opt-out of communications</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                We use essential cookies to maintain your session and authentication. We do not use
                tracking or advertising cookies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about this privacy policy, please contact us at:
              </p>
              <p className="text-fuchsia-400">tejas.sidhwani@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

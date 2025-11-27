import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs />
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using Resync, you agree to be bound by these Terms of Service. If
                you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Description of Service</h2>
              <p className="text-gray-300 leading-relaxed">
                Resync is a goal tracking and habit management application that helps users:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Create and track goals with custom frequencies</li>
                <li>Monitor daily progress with calendar views and heatmaps</li>
                <li>Write daily notes with mood tracking</li>
                <li>Visualize statistics and progress</li>
                <li>Access data via web application or CLI tool</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">User Accounts</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Account Creation</h3>
                <p className="text-gray-300 leading-relaxed">
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Guest Mode</h3>
                <p className="text-gray-300 leading-relaxed">
                  You may use Resync in guest mode without creating an account. Guest data is stored
                  locally in your browser and is not backed up to our servers.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Acceptable Use</h2>
              <p className="text-gray-300 leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload malicious code or viruses</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Scrape or harvest data from the service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                Resync is open source software released under the ISC License. The source code is
                available on GitHub. While the code is open source, the Resync name and branding are
                protected.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Your Content</h2>
              <p className="text-gray-300 leading-relaxed">
                You retain all rights to the content you create in Resync (goals, notes, etc.). By
                using our service, you grant us the right to store and process your content to
                provide the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Service Availability</h2>
              <p className="text-gray-300 leading-relaxed">
                We strive to provide reliable service but cannot guarantee:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Uninterrupted access to the service</li>
                <li>Error-free operation</li>
                <li>That the service will meet your specific requirements</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-3">
                We may modify, suspend, or discontinue the service at any time with or without
                notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Data Backup</h2>
              <p className="text-gray-300 leading-relaxed">
                While we implement backup procedures, you are responsible for maintaining your own
                backups of important data. We recommend regularly exporting your data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                You may delete your account at any time. We reserve the right to suspend or
                terminate accounts that violate these terms or for any other reason at our
                discretion.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Disclaimer of Warranties</h2>
              <p className="text-gray-300 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESYNC SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE
                SERVICE.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of
                material changes by updating the "Last updated" date. Continued use of the service
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws,
                without regard to conflict of law provisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these terms, please contact:
              </p>
              <p className="text-fuchsia-400">tejas.sidhwani@gmail.com</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Open Source</h2>
              <p className="text-gray-300 leading-relaxed">
                Resync is open source software. You can view the source code, contribute, or report
                issues on GitHub:
              </p>
              <a
                href="https://github.com/TejasS1233/Resync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
              >
                github.com/TejasS1233/Resync
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { FileText, Download } from 'lucide-react';

/**
 * Terms & Policies Page
 * Displays terms, policies, and waiver information
 */
const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
          <div className="container-custom text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Policies</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Please review our terms, policies, and waiver before your visit
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="container-custom max-w-4xl">

            {/* Download Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 mb-12 border-2 border-primary-200">
              <div className="flex items-start gap-4">
                <FileText className="w-12 h-12 text-primary-600 flex-shrink-0" />
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Full Policies & Waiver Document
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Download our complete policies and waiver document. This includes all terms and conditions, safety guidelines, and liability waiver that must be acknowledged before your visit.
                  </p>
                  <a
                    href="/CK_Forest_Gardens_Policies.pdf"
                    download
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Information</h2>
                <p className="text-gray-600 mb-6">
                  By visiting CK Forest Gardens, you agree to comply with all our policies and procedures. Please read the full document carefully.
                </p>
              </div>

              {/* Important Points */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Safety First</h3>
                  <p className="text-gray-700 text-sm">
                    All visitors must follow safety guidelines and instructions from staff. Children must be supervised at all times.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Liability Waiver</h3>
                  <p className="text-gray-700 text-sm">
                    Visitors participate at their own risk. Please review the liability waiver in the full document.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Booking Terms</h3>
                  <p className="text-gray-700 text-sm">
                    Bookings require minimum numbers and advance payment. Cancellation policies apply as outlined in the document.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Code of Conduct</h3>
                  <p className="text-gray-700 text-sm">
                    Respect for nature, property, and other visitors is required. Please follow all posted rules and regulations.
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-primary-600 text-white rounded-xl p-6 mt-8">
                <h3 className="text-xl font-bold mb-3">Questions About Our Policies?</h3>
                <p className="mb-4">
                  If you have any questions about our terms, policies, or waiver, please contact us before your visit.
                </p>
                <a
                  href="https://wa.me/5927122534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  WhatsApp Us
                </a>
              </div>

              {/* PDF Viewer */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Preview Document</h3>
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    src="/CK_Forest_Gardens_Policies.pdf"
                    className="w-full h-[800px]"
                    title="CK Forest Gardens Policies and Waiver"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Having trouble viewing? <a href="/CK_Forest_Gardens_Policies.pdf" download className="text-primary-600 hover:underline">Download the PDF</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;

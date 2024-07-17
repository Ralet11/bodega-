import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-yellow-50 text-black p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Privacy Policy</h1>
      <p className="mb-6"><strong>Effective Date:</strong> [Date]</p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">1. Introduction</h2>
      <p className="mb-4">
        Bodega ("we," "our," or "the App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect the information we obtain from users of our application.
      </p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">2. Information We Collect</h2>
      <p className="mb-4">We collect the following types of information:</p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Personal Information:</strong> This may include your name, email address, phone number, etc.</li>
        <li><strong>Usage Information:</strong> Information about how you interact with our app, including usage and browsing data.</li>
        <li><strong>Device Information:</strong> Hardware model, operating system, unique device identifiers, etc.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">3. How We Use the Information</h2>
      <p className="mb-4">We use the collected information for the following purposes:</p>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and maintain our app.</li>
        <li>To improve and personalize the user experience.</li>
        <li>To communicate updates, news, and promotions related to our app.</li>
        <li>To monitor and analyze app usage and trends.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">4. Information Security</h2>
      <p className="mb-4">We take reasonable measures to protect users' personal information against loss, theft, and unauthorized use. This includes:</p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Password Encryption:</strong> User passwords are encrypted using the `bcrypt` algorithm to ensure their security.</li>
        <li><strong>Secure Storage:</strong> Sensitive personal information may be encrypted and securely stored on our servers.</li>
        <li><strong>Restricted Access:</strong> Access to personal information is limited to employees, contractors, and agents who need to know that information to process it on our behalf.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">5. Information Disclosure</h2>
      <p className="mb-4">We do not sell or share your personal information with third parties, except in the following circumstances:</p>
      <ul className="list-disc list-inside mb-4">
        <li>To comply with applicable laws, regulations, legal processes, or governmental requests.</li>
        <li>To protect the safety of our users, detect and prevent fraud, or address technical issues.</li>
        <li>With trusted service providers who assist us in operating our app.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">6. Changes to This Privacy Policy</h2>
      <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">7. Contact</h2>
      <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
      <p className="mb-4">KH Software Corp</p>
      <p className="mb-4">bodegastore@gmail.com</p>
    </div>
  );
};

export default PrivacyPolicy;


const PrivacyPolicy = () => {
  return (
    <div className="bg-yellow-50 text-black p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-yellow-700 mb-6 text-center">Bodega+ Privacy Policy</h1>
      <p className="mb-6"><strong>Effective Date:</strong> 07/17/24</p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">1. Introduction</h2>
      <p className="mb-4">
        Bodega+ ("we," "our," or "the App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect the information we obtain from users of our application.
      </p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">2. Information We Collect</h2>
      <p className="mb-4">We collect the following types of information:</p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Personal Information:</strong> This may include your name, email address, phone number, address, and payment information (if applicable).</li>
        <li><strong>Usage Information:</strong> Information about how you interact with our app, including usage and browsing data, purchase history, and preferences.</li>
        <li><strong>Device Information:</strong> Hardware model, operating system, unique device identifiers, mobile network information, and location data (if you grant permission).</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">3. How We Use the Information</h2>
      <p className="mb-4">We use the collected information for the following purposes:</p>
      <ul className="list-disc list-inside mb-4">
        <li>To log in, we ask for your name, email, and phone number to create and verify your account.</li>
        <li>Within the app, you need to set an address, and we request permission to access your location to provide location-based services such as store recommendations and delivery tracking.</li>
        <li>To provide and maintain our app, ensuring it functions correctly and efficiently, and processing transactions and orders made through the app.</li>
        <li>To improve and personalize the user experience, customizing content and recommendations based on your preferences and usage patterns, and enhancing app features and user interface.</li>
        <li>To communicate updates, news, and promotions related to our app, sending notifications about updates, new features, and promotional offers, and responding to customer inquiries and providing support.</li>
        <li>To monitor and analyze app usage and trends, conducting analytics to understand how users interact with the app, improving app performance, and resolving technical issues.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">4. Information Security</h2>
      <p className="mb-4">We take reasonable measures to protect users' personal information against loss, theft, and unauthorized use. This includes:</p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Password Encryption:</strong> User passwords are encrypted using the `bcrypt` algorithm to ensure their security.</li>
        <li><strong>Secure Storage:</strong> Sensitive personal information may be encrypted and securely stored on our servers.</li>
        <li><strong>Restricted Access:</strong> Access to personal information is limited to employees, contractors, and agents who need to know that information to process it on our behalf.</li>
        <li><strong>Data Retention:</strong> We retain personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy. Once no longer needed, data is securely deleted.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">5. Information Disclosure</h2>
      <p className="mb-4">We do not sell or share your personal information with third parties, except in the following circumstances:</p>
      <ul className="list-disc list-inside mb-4">
        <li>To comply with applicable laws, regulations, legal processes, or governmental requests.</li>
        <li>To protect the safety of our users, detect and prevent fraud, or address technical issues.</li>
        <li>With trusted service providers who assist us in operating our app, provided they agree to adhere to our data protection policies.</li>
        <li>In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">6. Children's Privacy</h2>
      <p className="mb-4">Our app is not intended for individuals under the age of 17, and we do not knowingly collect personal information from individuals under 17. If we become aware that we have inadvertently collected personal information from someone under 17, we will take steps to delete such information from our records.</p>

      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">7. Data Retention and Deletion Policy</h2>
      <p className="mb-4">We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. When your personal information is no longer needed, we will securely delete or anonymize it.</p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Retention Periods:</strong> Account Information is retained as long as your account is active or as needed to provide you with services. Transaction Data is retained for a reasonable period as required by law for accounting and tax purposes.</li>
        <li><strong>Deletion Procedures:</strong> Upon request, we will delete your personal information from our systems. This process may take up to 30 days to complete. Some information may be retained in backup copies for a limited period to comply with legal obligations.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">8. Data Deletion</h2>
      <p className="mb-4">
        You can delete your collected data and account by navigating to the options menu in the upper left corner on the home screen, then going to account settings and pressing "Delete Account."
      </p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">9. User Consent</h2>
      <p className="mb-4">
        The data collected will be shared with explicit user permission when accepting the terms and conditions and the privacy policy upon account creation, solely for the purpose of providing the app's services.
      </p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">10. Changes to This Privacy Policy</h2>
      <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this policy.</p>
      
      <h2 className="text-2xl font-semibold text-yellow-600 mb-2">11. Contact</h2>
      <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
      <p className="mb-4">KH Software Corp</p>
      <p className="mb-4">bodegastore@gmail.com</p>
    </div>
  );
};

export default PrivacyPolicy;
import React from 'react';
import PropTypes from 'prop-types';

export default function TermsModal({ show, preHandleClose }) {
  // Actualizamos el contenido de los términos con la nueva versión (fecha 26/02)
  const updatedTerms = `
Bodega+ Merchant Agreement

Effective Date: 26/02

Introduction
This Bodega+ Merchant Agreement (“Agreement”) is a legal contract between you (the “Merchant”) and Bodega+ (“the Platform”, “we”, or “us”). By registering as a Merchant on Bodega+ and using our services, you agree to the terms and conditions set forth in this Agreement. This Agreement is designed to be clear and understandable while covering important legal requirements. It outlines the rights and obligations of Merchants using the Bodega+ platform, including terms of service, payment, pricing, and termination.

Merchant Account and Eligibility
• Merchant Enrollment: To become a Merchant on Bodega+, you must create a merchant account and provide accurate business information, including a valid bank account for deposits. You represent that you are an authorized representative of the business and able to enter into this Agreement.
• Compliance: Merchants must comply with all applicable laws and regulations related to their products and services. This includes obtaining and maintaining any required licenses, permits, or certifications (for example, health permits for food service).
• Independent Business: Merchants are independent business owners. Nothing in this Agreement creates any employment, partnership, joint venture, or agency relationship between the Merchant and Bodega+. You are solely responsible for the operation of your business, including the products you sell and services you provide to customers.

Listing of Products and Pricing
• Accurate Product Information: Merchants must provide accurate descriptions, images, and details for each product or menu item listed on Bodega+. Misrepresentation of products or services is strictly prohibited.
• True Original Pricing: Merchants must list the real original price of their products or services. If you choose to offer a discount or promotion through Bodega+, the original price displayed must be the genuine price at which you normally sell the item, without inflation. For example, if a burger is normally sold at $20 and you offer a 10% discount, the listed original price should be $20 (not an inflated price like $25). This ensures pricing integrity and transparency for customers.
• Discounts and Promotions: Any discounted prices or special offers must be clearly identified as such. Merchants are responsible for ensuring that any claimed discounts are truthful and in compliance with applicable consumer protection laws. Bodega+ reserves the right to remove or correct listings that appear to use deceptive pricing practices.

Orders, Cancellations, and Refunds
• Order Fulfillment: When a customer places an order through Bodega+, the Merchant is responsible for promptly fulfilling the order as described in the listing. You should prepare and have the order ready by the estimated time provided to the customer.
• Cancellation by Merchant: If you are unable to fulfill an order (for example, due to an item being out of stock or an emergency), you must notify the customer and cancel the order through the Platform as soon as possible. Frequent or unjustified cancellations may harm the customer experience and could result in review of your account.
• Customer Cancellations and Refunds: Customers may cancel orders within the timeframe allowed by the Platform or request refunds for orders that have issues (such as missing items, incorrect items, or food quality problems). Bodega+ may, at its discretion, refund the customer on your behalf when an order is canceled or has documented issues.
• Merchant Cooperation: You agree to cooperate with and support good customer service practices. If Bodega+ notifies you of a customer refund request or complaint regarding an order, you should provide any required information about the order (for instance, confirming whether an order was prepared or picked up). In cases where a refund is issued to the customer due to a problem with the order that is attributable to your business (e.g., you failed to include an item or provided the wrong item), Bodega+ reserves the right to deduct the amount of such refund from your payout or invoice you for that amount.

Payouts and Financial Terms
• Payment Schedule: Bodega+ will remit payments to Merchants on a monthly basis. Payouts for all completed transactions (after deducting any Bodega+ fees or refunded amounts) are made on the 1st day of each month. For example, sales made in January will be paid out on the 1st of February. If the regular payout day falls on a weekend or bank holiday, the payment will be processed on the next business day.
• Payment Method: Payments are delivered via direct deposit to the bank account information provided by the Merchant during registration (or as updated by the Merchant in their account settings). It is the Merchant’s responsibility to ensure that bank account details are accurate and up-to-date. Bodega+ is not responsible for delays or failed payments caused by incorrect or outdated bank information provided by the Merchant.
• Transaction Fees and Deductions: If Bodega+ charges a service fee or commission on transactions (as separately disclosed to you), those fees will be deducted from the gross sales amount before the net payout is calculated. Additionally, any customer refunds or adjustments processed for the previous period may be deducted from the payout. A statement or report detailing your orders, sales, fees, and any refunds will be made available to you for each payout period.
• Taxes: Merchants are responsible for determining, collecting, and remitting any applicable taxes (such as sales tax, VAT, etc.) for the products and services they sell through Bodega+. Bodega+ may provide tools to display tax amounts or may collect taxes on your behalf if required by law, but you remain ultimately responsible for tax compliance. You agree to indemnify Bodega+ for any tax liabilities or penalties that arise from your failure to properly account for taxes on your sales.

Merchant Responsibilities and Conduct
• Quality of Service: You are fully responsible for the quality and safety of the products you sell through Bodega+. This includes ensuring food items are prepared hygienically and meet quality standards, or that any goods sold match their descriptions and are safe for use.
• Customer Service: While Bodega+ provides a platform for transactions, the customer’s experience with the product is largely in your hands. Merchants should strive to provide a positive experience — for example, including correct items, appropriate packaging, and any necessary utensils or condiments for food orders. If a customer has a concern or issue with an order, you are expected to address it professionally, either directly (if the platform allows merchant-customer communication for issue resolution) or through Bodega+ support.
• Prohibited Items: You may only sell products or services that are allowed by law and by Bodega+ policies. Any illegal items, regulated goods not permitted on the platform, or otherwise prohibited products must not be listed. Bodega+ reserves the right to remove any listing that violates its policies or the law, and to take appropriate action against the Merchant, including suspension or termination of the account, for serious violations.
• Data Privacy and Security: If in the course of using Bodega+ you have access to any customer personal information (for example, a customer’s name or delivery address for an order), you agree to use that information solely for the purpose of fulfilling the order or complying with your obligations under this Agreement. You must handle all personal data in compliance with applicable privacy laws and Bodega+’s Privacy Policy. Merchants should implement reasonable security measures to protect any personal data obtained through the platform and must notify Bodega+ promptly in the event of any data breach or security incident involving information collected via Bodega+.

Leave Anytime – Term and Termination
• Term of Agreement: This Agreement begins when you accept it (for instance, by clicking “I agree” or by electronically signing, or by using the platform as a merchant) and continues until terminated by either party as allowed below.
• Merchant’s Right to Terminate: Merchants may leave the platform and terminate this Agreement at any time, for any reason, without penalty. If you wish to stop using Bodega+, you can do so by providing notice to Bodega+ (for example, via an account dashboard setting or by written notification to merchant support). Termination will not affect any rights or obligations for orders that have already been placed or payments due before the termination date – those will still be processed under this Agreement.
• Bodega+ Right to Terminate or Suspend: Bodega+ may suspend or terminate your merchant account or this Agreement (i) if you are in breach of any terms of this Agreement or any policy of the platform, (ii) if you engage in fraudulent, misleading, or illegal activities, or (iii) if Bodega+ ceases operation of the platform or for any other reason in its discretion with reasonable notice to you. In non-urgent situations, we will attempt to provide prior notice (e.g., email notification) of termination or suspension. In cases of severe misconduct (such as fraud or sale of illegal goods), suspension or termination may be immediate.
• Effect of Termination: Upon termination of this Agreement, your merchant account will be deactivated, and you will no longer have access to merchant features on the platform. Any pending obligations, such as fulfilling outstanding orders placed before termination or paying any outstanding fees to Bodega+, survive the termination. Sections of this Agreement that by their nature should survive (such as indemnification, limitation of liability, and dispute resolution provisions) will remain in effect even after termination.

Intellectual Property
• License to Use Platform Materials: Bodega+ may provide you with certain materials, content, or tools to help advertise or facilitate your sales (for example, the use of Bodega+ logos, widgets, APIs, or other content). During the term of this Agreement, Bodega+ grants you a limited, revocable, non-exclusive, non-transferable license to use such materials only as needed to use the platform’s services and promote your presence on Bodega+. All such usage must comply with any guidelines we provide.
• Your Intellectual Property: You retain ownership of all intellectual property rights in the content you provide to Bodega+ (such as your business name, logos, product images, and descriptions). By providing this content, you grant Bodega+ a worldwide, royalty-free, sublicensable license to use, display, reproduce, and distribute your content on the platform and in marketing materials, solely for the purpose of operating and promoting the marketplace. For example, we might display your shop name and menu on our website or mobile app, or include your shop in promotional emails. This license ends when you remove the content from the platform or terminate your merchant account, but you agree that Bodega+ may retain archived copies for legal record-keeping and that Bodega+ is not required to scrub historical marketing materials that already include your content.
• Trademarks: Each party retains all rights to their own trademarks, service marks, and logos. Use of Bodega+’s name or logo by the Merchant in any public announcement or advertising (outside the provided platform tools) requires prior written consent from Bodega+. Likewise, Bodega+ will not use Merchant’s trademarks beyond what is permitted in this Agreement without authorization.

Liability, Disclaimer, and Indemnification
• Platform Provider Role: You understand and agree that Bodega+ is a technology platform that facilitates transactions between Merchants and customers. Bodega+ itself is not the seller of the products or services that you (the Merchant) provide; you are the seller. Bodega+ does not control the production, sale, or quality of any item that you offer. As such, Bodega+ is not responsible or liable for the products or services you provide, or for your fulfillment of orders. The Merchant assumes all responsibility for the obligations and liabilities related to the goods/services sold to customers.
• No Warranty by Bodega+: To the fullest extent allowed by law, Bodega+ disclaims any warranties, express or implied, regarding the platform’s availability, reliability, or fitness for a particular purpose. The platform is provided on an “as-is” and “as-available” basis. Bodega+ does not guarantee that the services will be error-free or uninterrupted. However, we will make reasonable efforts to maintain the reliability and accessibility of the platform.
• Merchant Indemnification: You agree to indemnify, defend, and hold harmless Bodega+, its affiliates, and their respective directors, officers, employees, and agents (collectively, the “Indemnified Parties”) from and against any and all claims, liabilities, losses, damages, judgments, or expenses (including reasonable attorneys’ fees) that arise out of or are related to:
   1. Your breach of this Agreement or any policy incorporated by reference.
   2. Your violation of any law or regulation in connection with your activities on Bodega+.
   3. Any actual or alleged infringement of third-party intellectual property or other rights by the products or content you provide.
   4. Your products, services, or business practices, including any harm to a customer resulting from products you sold (for example, foodborne illness, allergic reaction, defective merchandise, etc.).
If any such claim arises, Bodega+ will promptly notify you in writing of the claim and may assist in the defense (at your expense). You shall not settle any claim in a manner that imposes any liability or obligation on Bodega+ without our prior written consent.
• Limitation of Liability: To the extent permitted by law, neither party will be liable to the other for any indirect, incidental, special, consequential, or punitive damages (including lost profits or revenues, loss of business opportunity, or goodwill) arising out of or in connection with this Agreement or the use of the Bodega+ platform, even if advised of the possibility of such damages. Bodega+’s total cumulative liability for any claims arising from or related to this Agreement will not exceed the total fees received by Bodega+ from Merchant in the six (6) months immediately preceding the event giving rise to the claim. This limitation of liability does not apply to a party’s fraud, gross negligence, willful misconduct, or indemnification obligations.

General Provisions
• Changes to Agreement: Bodega+ may update or modify this Merchant Agreement from time to time. When we make changes, we will notify you by email or via the Merchant dashboard, and we will update the “Last Updated” date at the top of the Agreement. Changes will not be retroactive; they will become effective no sooner than 15 days after notification, unless the changes relate to new features or legal requirements which may become effective immediately. If you do not agree to the revised terms, you may terminate this Agreement as provided under the Termination section before the updated terms take effect. Continuing to use the platform as a Merchant after the effective date of changes constitutes your acceptance of those changes.
• Governing Law: This Agreement is governed by and will be construed in accordance with the laws of the State of Florida, USA, without regard to its conflict of laws principles. However, if you are in a different country or state, local mandatory consumer or commercial protection laws may apply if those laws require that they apply.
• Dispute Resolution: In the event of any dispute, claim, or controversy arising out of or relating to this Agreement or your use of the Bodega+ platform as a Merchant, the parties agree to first attempt to resolve the issue through good faith negotiations. If the dispute cannot be resolved informally, it shall be submitted to mediation or binding arbitration in accordance with the rules of the American Arbitration Association (AAA) in a mutually agreed location, or as otherwise required by law. Each party will bear its own costs of dispute resolution unless otherwise determined by the arbitrator or court. Nothing in this section prevents either party from seeking injunctive or equitable relief for urgent matters (for example, intellectual property infringement or unauthorized use of the platform) in a court of competent jurisdiction.
• No Waiver: If Bodega+ fails to enforce any provision of this Agreement or delays in enforcing it, this will not be considered a waiver of our rights. Any waiver of rights by Bodega+ must be in writing to be effective, and a waiver of one breach or default does not constitute a waiver of any subsequent breach or default.
• Severability: If any provision of this Agreement is found to be unlawful, void, or unenforceable by a court or tribunal of competent jurisdiction, that provision will be modified to the minimum extent necessary to make it enforceable (or severed if modification is not possible), and the remainder of this Agreement will remain in full force and effect.
• Entire Agreement: This Agreement (including any policies, guidelines, or additional terms incorporated by reference) constitutes the entire agreement between you and Bodega+ regarding the subject matter herein and supersedes any prior or contemporaneous agreements, understandings, or communications, whether written or oral.
• Assignment: You may not assign or transfer any of your rights or obligations under this Agreement without Bodega+’s prior written consent. Bodega+ may assign this Agreement or any of its rights/obligations to an affiliate or in connection with a merger, acquisition, sale of assets, or by operation of law.
• Notices: Notices under this Agreement will be provided in writing. Bodega+ will send notices to the contact email or address on your merchant account; you should send notices to Bodega+ at the contact information provided on our website (or as otherwise directed). Notices will be considered delivered and received: (i) if by email, on the day sent if no bounce-back is received; (ii) if by courier or mail, on the date of confirmed delivery.

By clicking “I Agree” or by using the Bodega+ platform as a Merchant, you acknowledge that you have read, understood, and agree to all of the terms and conditions of this Merchant Agreement. If you do not agree with these terms, you should not list your products or services on Bodega+. Remember that you can terminate your merchant account at any time without penalty, as described above.

------------------------------------------------------------
Bodega+ User Terms of Service

Introduction
Welcome to Bodega+! These User Terms of Service (“Terms”) are a legal agreement between you (referred to as “User,” “customer,” or “you”) and Bodega+ (“the Platform,” “we,” or “us”). By creating an account or using the Bodega+ website or app to browse or purchase products/services, you agree to these Terms. We have drafted these Terms to be user-friendly and clear while covering important legal protections and obligations. If you do not agree with any part of these Terms, please do not use the Bodega+ platform.
Bodega+ is an online marketplace that connects users with various local shops, restaurants, and service providers (“Merchants”). We facilitate your orders and communications with these Merchants. Please note that when you make a purchase through Bodega+, you are buying directly from the Merchant, not from Bodega+. Bodega+ acts as an intermediary and platform provider, not as the seller of the goods or services.

Accounts and Access
• Account Creation: In order to make purchases or use certain features on Bodega+, you may need to create a user account. When creating an account, you must provide accurate and complete information, including your name, a valid email address, and a secure password. You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account.
• Age Requirement: You must be at least 18 years old (or the age of majority in your jurisdiction) to use Bodega+ independently. If you are under 18, you may only use Bodega+ under the supervision of a parent or legal guardian who agrees to be bound by these Terms. Bodega+ is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13.
• User Responsibilities: You agree to use the Bodega+ platform only for lawful purposes. You will not engage in any behavior that could harm the platform, other users, or Merchants, such as posting abusive content, attempting to breach security, or committing fraud. Bodega+ reserves the right to suspend or terminate your account if you violate these Terms or engage in prohibited activities.

Placing Orders and Transactions
• Order Process: Bodega+ allows you to place orders for products or services offered by Merchants. When you place an order, Bodega+ will transmit your order details to the Merchant. Please review your order carefully before submitting, as you may not be able to change it once placed. Bodega+ will send you a confirmation once your order is accepted by the Merchant.
• Payment: By submitting an order, you agree to pay the total price for the order, including any applicable taxes, service fees, and delivery charges (if any). Bodega+ (or its third-party payment processor) will charge the payment method you provide at the time of order. Payment details (such as credit card information) must be accurate and you must have the right to use the payment method. We may facilitate a payment authorization at the time of order placement. Charges are typically processed immediately when the order is placed or as otherwise disclosed during checkout.
• Pricing and Merchant Responsibility: The prices for products and services displayed on Bodega+ are set by the Merchants. Merchants are required to list the genuine original prices and truthful discounts. Bodega+ is not responsible for price accuracy, but we do enforce policies with Merchants to prevent inflated pricing. If you believe a price or discount is misleading, please notify us.
• Order Fulfillment: The Merchant is responsible for preparing and fulfilling your order. Bodega+ does not produce, store, or inspect the items you purchase – we simply provide the platform to facilitate the transaction. Estimated preparation or delivery times provided are estimates and not guarantees.

Cancellations and Refund Policy
• User Cancellations: If you need to cancel an order, you should do so as soon as possible. Cancellation options depend on the status of the order. For example, if a restaurant has already started preparing food, cancellation may no longer be available. The Bodega+ app or website will indicate whether an order can be canceled. If successful, you will not be charged or will be refunded for that order.
• Merchant Cancellations: In some cases, a Merchant might cancel your order (for example, if an item is out of stock or the store cannot fulfill the order). If the Merchant cancels, you will be notified and you will receive a full refund for that order.
• Refunds for Order Issues: You have the right to request a refund or adjustment if there is an issue with your order. Situations that may qualify for a refund include, but are not limited to:
   • You did not receive the item or service you paid for (e.g., a delivery never arrived).
   • The order you received is incorrect or incomplete (missing items or wrong items).
   • The product was spoiled, damaged, or did not meet advertised quality standards.
In such cases, please contact Bodega+ customer support within a reasonable time (for example, within 48 hours of receiving the order) to report the issue. We may ask for evidence or details (such as a photo of the wrong item) to help process the refund request.
• Refund Process: If your refund request is approved, Bodega+ will issue the refund to your original payment method whenever possible. Refund processing times may vary depending on your bank or credit card issuer, but typically you can expect the refund to appear within 5–10 business days. If a refund cannot be returned to the original payment method (for instance, if the card has expired), alternative arrangements will be made to ensure you receive your funds.
• Partial Refunds and Adjustments: In some cases, you may receive a partial refund rather than a full refund. For example, if one item in a multi-item order was incorrect, Bodega+ might refund the value of that item rather than the entire order. Any delivery fees or tips may also be refunded or partially refunded depending on the situation (e.g., if nothing was delivered, delivery fees would be refunded in full).
• No Show or Uncollected Items: If you order for pickup and do not collect your order within a reasonable time, the Merchant may dispose of the order and you may not be entitled to a refund for perishable items. If you provided a delivery address incorrectly and the order could not be delivered, you may not receive a refund for that order. Bodega+ will review such cases on a case-by-case basis.

User Conduct and Usage of the Platform
• Prohibited Activities: When using Bodega+, you agree not to:
   • Violate any laws or regulations through your activities on the platform.
   • Use the platform for any fraudulent or unauthorized purpose (for example, using a stolen credit card, placing fake orders, or claiming false refunds).
   • Harass, threaten, or harm other users, merchants, or Bodega+ staff. This includes using abusive language or discrimination of any kind in communications.
   • Interfere with or disrupt the platform’s normal operation (for instance, by hacking, introducing viruses, or using any automated system to scrape data or perform actions on the site without permission).
   • Post or transmit any content that is illegal, offensive, or infringes on others’ rights (such as leaving a review with defamatory language or uploading images that you do not have the right to use).
• Reviews and Feedback: Bodega+ may allow you to leave reviews or ratings for merchants or their products. If you choose to do so, you must base your reviews on your genuine experience. Do not include offensive, false, or irrelevant content. We reserve the right to remove or edit reviews that violate our guidelines or policies, and repeatedly posting inappropriate content can lead to suspension of your account.
• Platform License: Bodega+ grants you a limited, non-exclusive, non-transferable, revocable license to use our app and website for their intended purpose – i.e., to browse and order from merchants. You agree not to duplicate, distribute, sell, or exploit any portion of the platform except as allowed by these Terms. Bodega+ retains all rights, title, and interest in and to the platform and its content.

Disclaimer of Liability for Merchant Offerings
Merchant Responsibility: All products and services made available to you via Bodega+ are sold by independent Merchants. Bodega+ is not responsible for the quality, safety, suitability, or fulfillment of the products or services provided by Merchants. We do not prepare, manufacture, or physically handle the items; that is done solely by the Merchant. The Merchant is solely responsible for any representations or warranties regarding their offerings, and for addressing any claims or issues you may have with their products.
No Endorsement: The inclusion of a Merchant or an item on Bodega+ does not mean we endorse or guarantee the Merchant or item. We provide information and customer reviews to help you make decisions, but you should use your own judgment. Any issues arising from consumption or use of a Merchant’s product (such as illness from food or a defective product) are issues to be resolved between you and the Merchant. Bodega+ will assist in facilitating communications or refunds as described in these Terms, but we are not the guarantor of the Merchant’s performance.
Service “As-Is”: Bodega+ strives to provide a reliable and high-quality platform, but we do not make any warranties about the platform’s operation or the content on it. To the fullest extent permitted by law, Bodega+ disclaims all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that the platform will be uninterrupted or error-free at all times, or that any particular product will be available or meet your expectations.

Limitation of Liability: To the extent permitted by law, Bodega+ (including our officers, directors, employees, and agents) will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the platform or the products purchased through the platform. This includes, for example, damages for loss of profits, goodwill, data, or other intangible losses, even if we have been advised of the possibility of such damages. If, notwithstanding the foregoing, Bodega+ is found liable to you for any claim or cause of action, you agree that the maximum amount of damages you can recover from us is limited to the greater of: (a) the total fees (if any) you have paid to Bodega+ for the relevant order(s) in the past six months, or (b) US $100. Some jurisdictions do not allow certain limitations of liability, so some of these limitations may not apply to you.

------------------------------------------------------------
Bodega+ Privacy Policy

Last Updated: February 26, 2025

Your privacy is important to Bodega+. This Privacy Policy explains what personal information we collect from users of the Bodega+ platform, how we use and share that information, and the rights you have regarding your data. We have drafted this policy in clear language to help you make informed decisions about your personal information. By using Bodega+, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our practices, please do not use the platform.

1. Information We Collect
• Personal Identifiers: When you create an account or place an order, we collect information such as your name, email address, phone number, and delivery address (if you are receiving deliveries). This information is needed to identify you, communicate with you, and fulfill your orders.
• Payment Information: If you make purchases on Bodega+, you will provide payment details such as your credit or debit card information. Bodega+ uses reputable third-party payment processors to handle payment transactions. We do not store your full credit card numbers or bank account numbers on our systems; however, we may store tokens or abbreviated information (e.g., last four digits of a card, expiration date) as provided by the payment processor for reference and transaction records.
• Order History: We maintain a record of the orders you place through Bodega+, including the items purchased, the Merchant, date and time of order, and order amounts. This helps us provide you with your order history, handle customer service inquiries, and make personalized recommendations or offers.
• Device and Usage Information: Like many online services, we automatically collect certain information about your device and how you interact with our platform. This may include:
   • Device Information: e.g., device type (phone, tablet, computer), operating system, and unique device identifiers.
   • Log Data: e.g., IP address, browser type, pages or screens viewed, and the dates/times of access.
   • Cookies and Similar Technologies: We use cookies, pixels, and similar technologies to remember your preferences, keep you logged in, and understand how you use our site/app so we can improve it.
• Location Information: If you use our mobile app or website for delivery orders, we may collect your precise location information with your consent to suggest local merchants or assist with delivery. You can control location services via your device settings.
• Communications: If you contact us (such as through customer support emails or chat) or if you communicate with merchants through our platform, we may collect and maintain records of those communications.
We do not knowingly collect personal information from children under 13.

2. How We Use Your Information
• To Provide Services: We use your personal and order information to process and fulfill your orders, communicate order status, and share necessary details with Merchants.
• Account Management: Your information is used to create and maintain your account, including authentication and sending security notices.
• Customer Support: We use your account and order details to address your inquiries and resolve issues.
• Improve and Personalize our Services: We analyze usage data to mejorar la experiencia, corregir errores y sugerir ofertas personalizadas.
• Marketing and Promotions: With your consent, we may send you promociones y ofertas especiales.
• Security and Fraud Prevention: Your data helps monitor and prevent fraudulent activity.
• Legal Obligations: We retain data as needed para cumplir obligaciones legales y responder a solicitudes legales.

3. How We Share Your Information
• With Merchants: Your order information (e.g., name, address) is shared with the Merchant to fulfill your order.
• With Delivery Service Providers: If delivery is required, your delivery details are compartidos con el proveedor de servicios de entrega.
• With Payment Processors: Your payment data is handled by third-party payment processors, under strict security standards.
• With Service Providers and Partners: Trusted third parties that ayudan a proveer y mejorar nuestros servicios.
• For Legal Reasons: We may disclose your data para cumplir con obligaciones legales o proteger nuestros derechos.
• Business Transfers: In caso de fusión o adquisición, your information may be transferred under similar protections.
• With Your Consent: We will only share additional data if you explicitly agree.

4. Data Security and Storage
We employ technical, administrative, and physical measures to protect your data. However, no method is 100% secure.
• Encryption: Data transmitted between your device and our servers is encrypted (HTTPS/TLS).
• Access Controls: Only authorized personnel have access a la información personal.
• Payment Security: We rely on PCI-compliant payment processors.
• Monitoring and Testing: Regular system checks y pruebas de seguridad.
• Breach Response: In the event of a breach, we notify affected users and take measures to mitigate risks.

5. Data Retention
We keep your personal data only as long as necessary for the purposes collected or as required by law.
• Account Information is retained while your account is active and for un período razonable tras la eliminación.
• Order Transactions are kept for record-keeping y cumplimiento legal.
• Marketing Preferences remain on a suppression list indefinitely.
• Backup and Archival: Data may persist in backups but will be deleted when no longer needed.

6. Your Rights and Choices
You have rights to access, correct, or delete your data, and to withdraw consent for data processing.
• Access and Portability: Request a copy of your personal information.
• Correction: Update inaccurate information via your account or by contacting us.
• Deletion: Request deletion of your data, keeping in mind legal obligaciones.
• Objection and Restriction: Ask us to limit the use of your data.
• Withdraw Consent: You can withdraw promotional consents en cualquier momento.
• Cookies & Tracking Choices: Adjust your browser settings to manage cookies.

7. Cookies and Tracking Technologies
We use cookies y tecnologías similares para mejorar la experiencia y analizar el uso de la plataforma.
• Essential Cookies: Necesarias para el funcionamiento básico.
• Functional Cookies: Recordar preferencias como idioma o ubicación.
• Analytics Cookies: Para analizar el tráfico y mejorar el servicio.
• Advertising Cookies: En caso de incluir publicidad, se usarán para ofrecer anuncios relevantes.
• Your Choices: Puedes ajustar la configuración de tu navegador para bloquear o eliminar cookies.
• Do Not Track: Actualmente no respondemos a señales de “Do Not Track”.

8. International Users
If you use Bodega+ outside of the U.S., your data will be transferred and processed in the United States and possibly other países, with las salvaguardas adecuadas.

9. Changes to this Privacy Policy
We may update this Privacy Policy. Significant changes will be notificadas mediante un aviso en el sitio o vía email, junto con la actualización de la fecha “Last Updated”.

10. Contact Us
If you have any questions or concerns regarding this Privacy Policy or your personal data, please contact us through our website. We will respond to your inquiries within a reasonable time frame.

By continuing to use Bodega+, you acknowledge that you have read, understood, and agree to this Privacy Policy. If anything is unclear, our team is here to help.

`;

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white w-full max-w-4xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-blue-400 p-2 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">
                Bodega+ Updated Terms (26/02)
              </h2>
            </div>
            <div className="p-2 overflow-auto max-h-[70vh]">
              {/* Se utiliza <pre> para conservar el formato original */}
              <pre className="whitespace-pre-wrap text-xs text-gray-700">
                {updatedTerms}
              </pre>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button
                onClick={preHandleClose}
                className="text-blue-500 hover:underline cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TermsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  preHandleClose: PropTypes.func.isRequired,
};

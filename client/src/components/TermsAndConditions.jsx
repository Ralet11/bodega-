/* import React from 'react';
import PropTypes from 'prop-types';

export default function TermsModal({ show, preHandleClose }) {
  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>

          <div className="bg-white w-full max-w-2xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-blue-400 p-2 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">Terms and Conditions</h2>
            </div>
            <div className="p-2 overflow-auto max-h-[70vh]">
              <div className="text-xs text-gray-700">
                <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
                <p className="mb-2">
                  We’re so happy you’re here, and we can't wait to deliver you food happiness, but before you use our Platform, please read these Terms of Use (the “Agreement”) carefully.
                </p>
                <h3 className="text-sm font-semibold mb-2">1. Fees Table</h3>
                <p className="mb-2">
                  The Fees set out in the table below correspond to specific Sales Channels. If the Merchant does not use a Sales Channel, the Merchant will not be charged the Fees for that Sales Channel. The Fees set out in this table may be varied by an order form that incorporates these terms and conditions, in which case the Fees in the order form override the Fees in this table.
                </p>
                <h3 className="text-sm font-semibold mb-2">Marketplace Fees (for orders delivered by Delivery People)</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>Marketplace Fee: 30%</li>
                  <li>Delivery Network Fee: $0</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">Merchant Managed Delivery Channel (MMDC) Fees</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>MMDC Fee: 15%</li>
                  <li>Delivery Fee: Determined by the Merchant, $0 for Customers with a Renewable Membership</li>
                  <li>Merchant Managed Return Fee: Determined by Portier</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">Webshop Online Ordering Fees</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>Webshop Online Ordering Fee: 2.5% plus $0.29</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">Pickup Fees</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>Pickup Fee: 6%</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">Add-On Fees</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>Add-On Fee: 30%</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">Alcohol Fees</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>Alcohol Service Fee: Flat fee determined by Portier, may vary</li>
                  <li>Return Fee: Charged to the Customer for returns of Alcohol Items</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">Device Fees</h3>
                <ul className="list-disc pl-5 mb-2">
                  <li>Device Fee: $4.99 - $8.99 per week, depending on device features</li>
                  <li>Damage Fee: Cost of repairing or replacing a Device</li>
                </ul>
                <hr className="my-2" />
                <p className="mb-2">
                  Bodega Holdings Inc. and its subsidiaries and affiliates (“Bodega,” “we,” “our,” or “us”) own and operate certain websites, including related subdomains; our mobile, tablet and other smart device applications; application program interfaces; in-store kiosks or other online services; other tools, technology and programs (collectively, the “Platform”) and all associated services (collectively, the “Services”); in each case, that reference and incorporate this Agreement. This Agreement does not cover or address certain end user services provided by our affiliate SCVNGR, Inc. d/b/a LevelUp (“LevelUp”) on behalf of its merchant clients; please see the LevelUp User Terms of Service for more information.
                </p>
                <p className="mb-2">
                  This Agreement constitutes a contract between you and us that governs your access and use of the Platform and Services. What does that mean? It means that by accessing and/or using the Platform or our Services, or by clicking a button or checking a box marked “I Agree” (or something similar), you agree to all the terms and conditions of this Agreement. If you do not agree, do not access and/or use the Platform or Services. As used in this Agreement, “you” means any visitor, user, or other person who accesses our Platform or Services, whether or not such person registered for an Account (as defined below). Unless otherwise agreed by Bodega in a separate written agreement with you or your authorized representative, the Platform is made available solely for your personal, non-commercial use.
                </p>
                <p className="mb-2">
                  IMPORTANT: PLEASE REVIEW THE “DISPUTE RESOLUTION” SECTION SET FORTH BELOW CAREFULLY, AS IT WILL REQUIRE YOU TO RESOLVE DISPUTES WITH BODEGA, NO MATTER WHEN ARISING OR ASSERTED, THROUGH BINDING INDIVIDUAL ARBITRATION (EXCEPT FOR YOUR CLAIMS OF SEXUAL ASSAULT OR SEXUAL HARASSMENT ARISING OUT OF YOUR USE OF THE PLATFORM OR SERVICES). YOU ACKNOWLEDGE AND AGREE THAT YOU AND BODEGA EACH WAIVE THE RIGHT TO A TRIAL BY JURY. IN ARBITRATION, THERE IS NO JUDGE OR JURY AND THERE IS MORE CIRCUMSCRIBED DISCOVERY AND APPELLATE REVIEW THAN THERE WOULD BE IN COURT. YOU ALSO WAIVE YOUR RIGHT TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING AGAINST BODEGA, WHETHER NOW PENDING OR FILED IN THE FUTURE. THERE ARE PROPOSED CLASS ACTIONS OR REPRESENTATIVE ACTION PROCEEDINGS PENDING AGAINST BODEGA, AND THIS AGREEMENT APPLIES TO THEM UNLESS YOU OPT OUT AS DESCRIBED IN THE “DISPUTE RESOLUTION” SECTION BELOW. BY ENTERING THIS AGREEMENT, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD, AND AGREE TO BE BOUND BY, ALL OF THE TERMS AND CONDITIONS OF THIS AGREEMENT AND HAVE TAKEN TIME TO CONSIDER THE CONSEQUENCES OF THIS IMPORTANT DECISION.
                </p>
                <p className="mb-2">
                  ABOUT BODEGA Bodega is a virtual marketplace Platform that connects hungry diners with third-party service providers, including local merchants and independent delivery service providers. You may order food through the Platform to be delivered from particular merchants, including their authorized licensees and franchisees, or other purveyors of food in cities throughout the United States and other territories where Bodega provides such Services (collectively, the “Merchants”).
                </p>
                <p className="mb-2">
                  Bodega is not a restaurant or food preparation entity. The Merchants available on our Platform operate independently of Bodega. Merchants are required to comply with federal, state, and local laws, rules, regulations, and standards pertaining to the preparation, sale, and marketing of food, including, without limitation, food preparation and safety and menu disclosure. Bodega is not liable or responsible for Merchants' food preparation or safety and does not verify their compliance with all applicable laws. In addition, Bodega does not guarantee the quality of what the Merchants sell, nor does it guarantee the services provided by them, including, without limitation, in those cases where they provide the delivery services or engage another third-party delivery service. Bodega does not independently verify, and is not liable for, representations made by Merchants regarding their food, including, without limitation, any menu- or Merchant-level descriptors, disclosures, photographs or images displayed through the Platform reflecting the food prepared by the Merchants and/or delivered by Delivery Partners (defined below). By accessing the Platform, you agree and acknowledge that Merchants are solely responsible for, and Bodega shall not be liable or responsible for, the services provided to you by any Merchant or any subcontractor of any Merchant, nor shall Bodega be responsible for any acts, omissions, errors or misrepresentations made by any Merchant or any subcontractor of any Merchant.
                </p>
                <p className="mb-2">
                  Bodega is not a delivery company or a common carrier. Some deliveries are provided by Bodega's network of independent delivery service providers (“Delivery Partners”). Delivery Partners are not actual agents, apparent agents, ostensible agents, or employees of Bodega in any way. Rather, Delivery Partners have entered into agreements with Bodega which require them to comply with all applicable federal, state, and local laws, rules and regulations, including, without limitation, traffic laws, requirements of the applicable motor vehicle agency, and applicable insurance requirements. By accessing the Platform, you agree and acknowledge that Delivery Partners are solely responsible for, and Bodega shall not be liable or responsible for, the delivery services provided to you by any Delivery Partner or any subcontractors of Delivery Partners, or any acts, omissions, errors or misrepresentations made by any Delivery Partner.
                </p>
                <p className="mb-2">
                  USING BODEGA
                  You may only create and hold one account on each of the separately branded properties on the Platforms (each, an “Account”) for your personal use. You may have another Account if you are using the Platform for business purposes, including as part of an enterprise Account, pursuant to a separate agreement with Bodega. In consideration of the use of the Platform and the Services, you agree that you are able to create a binding legal obligation with Bodega, and you also agree to: (a) provide true, accurate, current, and complete information about yourself, and (b) maintain and promptly update the personal information you provide to keep it true, accurate, current, and complete.
                </p>
                <p className="mb-2">
                  The Platform may permit you to use the Services without an Account or without logging in to your Account (e.g. on our in-store kiosks, through our assisted phone ordering feature, or as a guest with our group order feature). If you use the Service in this manner, we may create an Account for you based on the information you provide to us in connection with the transaction (e.g., your payment information, name, phone number, email address, and other transaction information). If you are a minor in the jurisdiction in which you reside (generally under the age of 18), you must have the permission of, and be directly supervised by, your parent or legal guardian to use the Platform, and your parent or legal guardian must read and agree to this Agreement on your behalf prior to your using the Platform. Notwithstanding the foregoing, you are not authorized to use the Platform or otherwise access the Services if you are under the age of 16. If you are using the Platform on behalf of an entity, organization, or company, you represent and warrant that you have the authority to bind that organization to this Agreement and you agree to be bound by this Agreement on behalf of that entity, organization, or company. If you provide any information that is untrue, inaccurate, not current or incomplete, including, without limitation, having an invalid or expired payment method on file, or if Bodega has reasonable grounds to suspect that any information you provide is untrue, inaccurate, not current or incomplete, or if we believe that you have breached this Agreement, Bodega has the right to immediately block your current or future use of the Platform and/or the Services (or any portion thereof) and/or terminate this Agreement with you. If your Account is terminated for any or no reason, you may forfeit any pending, current, or future account credits, Perks (defined below) or other promotional offers, and any other forms of unredeemed value in or associated with your Account without prior notice to you.
                </p>
                <p className="mb-2">
                  You are responsible for maintaining the confidentiality and security of your Account including your password and, if applicable, any password for Facebook, Google, or other third party login. You are also responsible for all activities or any other actions that occur under or that are taken in connection with your Account. You agree to: (a) immediately notify Bodega of any known or suspected unauthorized use(s) of your password or Account, or any known or suspected breach of security, including, without limitation, loss, theft, or unauthorized disclosure of your password or credit card information; and (b) ensure that you exit from your Account at the end of each session. Bodega will not be liable for any injury, loss, or damage of any kind arising from or relating to your failure to comply with (a) and/or (b) or for any acts or omissions by you or someone else who is using your Account and/or password.
                </p>
                <p className="mb-2">
                  OUR ALCOHOLIC BEVERAGES POLICY
                  Some jurisdictions permit the ordering and delivery of alcoholic beverages. In such jurisdictions, if you place an order that includes any alcoholic beverage, you represent and warrant that you are at least 21 years of age. Upon delivery or pickup, as applicable, you shall present a government-issued identification card evidencing your age, consistent with applicable legal requirements. The Delivery Partner may electronically scan the identification card of the individual receiving the order to confirm that the recipient is at least 21 years of age, and the delivery may be completed. You also agree that our Delivery Partners may withhold delivery of the alcoholic beverages if you or the recipient appears intoxicated when receiving delivery of such products. If you do not comply with these terms, you agree that the alcoholic beverage(s) will not be released to you, you may forfeit the cost of such beverages, and you may be responsible for restocking fees.
                </p>
                <p className="mb-2">
                  PAYMENT AND OUR CREDIT POLICY
                  Certain features of the Platform, including, without limitation, the placing or receipt of orders, may require you to make certain payments, including commissions or other fees. When paid by you, these payments are final and non-refundable, unless otherwise determined by Bodega. Bodega, in its sole discretion, may offer credits or refunds on a case-by-case basis, including, for example, in the event of an error with your order or in the amounts you were charged.
                </p>
                <p className="mb-2">
                  Bodega will charge, and you authorize Bodega to charge, the payment method you specify at the time of purchase. If you pay any amounts with a credit card, Bodega may seek pre-authorization of your credit card account prior to your purchase to verify that the credit card is valid and has credit available for your intended purchase. In the event Bodega advances payment for any of your orders placed via the Platform (e.g., if your corporate account has a line of credit), Bodega may separately send you invoices for payment of those advanced amounts. If you fail to pay such invoices within thirty (30) days of the date of such invoice (the “Payment Due Date”), you grant Bodega the right, but not the obligation, to charge the credit card you provide with your Account at any time after any Payment Due Date, unless prohibited by law.
                </p>
                <p className="mb-2">
                  Please note, you are unable to complete checkout with only gift card information. In all events, you are required to provide another form of payment to submit an order, even if this payment method is not charged. Additionally, if you are a campus user and you opt to pay for a purchase with your stored-value card, on certain campuses, (i) Bodega will charge such purchase to your stored-value card and will charge any applicable fees to either your credit card or other payment on file with us, and (ii) you agree that Bodega may be unable to refund a purchase to your stored-value card and may, in its discretion, provide a refund through an alternative method.
                </p>
                <p className="mb-2">
                  Bodega reserves the right to establish, remove, and/or revise prices, fees, taxes, and/or surcharges for any or all services or goods obtained through the use of the Services at any time and further reserves the right to consolidate or otherwise incorporate fees and/or surcharges into the prices listed for Merchant food and beverage items. You understand that the prices for menu items displayed through the Services may differ from the prices offered or published by Merchants for the same menu items, whether offered by the Merchant directly or on third-party websites. You also understand that such prices may not be the lowest prices at which the menu items are sold. Bodega’s white-label convenience menus source products from select third-party providers, including existing Merchants on the Bodega Platform. Prices may vary between the existing Merchant menu and the Bodega white-label convenience menu. For example, the same menu item may be available at both the existing merchant and Bodega’s white-label convenience, but the price on the existing merchant's menu may be higher than the price on Bodega’s white-label convenience menu.
                </p>
                <p className="mb-2">
                  For certain transactions, the subtotals shown at checkout are estimates that may be higher or lower than the total amount due. Regardless of the cause, Bodega reserves the right to charge the final price after checkout, including, without limitation, all applicable transaction taxes. Bodega may also, in its sole discretion, make Perks or other promotional offers with different features and different rates available to any or all of our users. Unless made available to you, these Perks and promotional offers will have no bearing on your obligation to pay the amounts charged. For more information on these offers, please see the “Perks” section below.
                </p>
                <p className="mb-2">
                  The provider of Services is set forth herein. If you are a California resident, in accordance with Cal. Civ. Code §1789.3, you may report complaints to the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs by contacting them in writing at 1625 North Market Blvd., Suite N 112 Sacramento, CA 95834, or by telephone at (800) 952-5210 or (916) 445-1254.
                </p>
                <p className="mb-2">
                  OUR MATERIALS AND LICENSE TO YOU
                  With the exception of Your Content (defined below), the Platform and everything on it, including, without limitation, text, photos, videos, graphics, and software (collectively, the "Materials"), are owned by or licensed to Bodega. The Platform and the Materials are protected by copyright, trademark, trade dress, domain name, patent, trade secret, international treaties, and/or other intellectual or proprietary rights and laws of the United States and other countries. Except as otherwise indicated on the Platform and except for the intellectual property of other companies that are displayed on the Platform, all intellectual property, such as trademarks, service marks, logos, trade dress, and trade names, are proprietary to Bodega, including, without limitation, GH; BODEGA; Bodega for Work; SEAMLESS; Bodega for Restaurants; Eat24; AllMenus; MenuPages; Yummy Rummy; and the Eat24.com, Bodega.com, and Seamless.com trade dress. Accordingly, you are not authorized to download, remove, transmit, alter, reproduce, modify, distribute, exploit, sell, lease, obscure, decompile, reverse engineer, or disassemble any content or any trademark or copyright notice from the Platform, including, without limitation, the Materials. If you do any of the aforementioned, Bodega will not be responsible in any way for any damage to your computer system or loss of data that results from such download. Please also be advised that Bodega enforces its intellectual property rights to the fullest extent of the law.
                </p>
                <p className="mb-2">
                  Subject to your compliance with this Agreement, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, and revocable license to access and use the Platform for your personal and noncommercial use, solely as expressly permitted by this Agreement and subject to all the terms and conditions of this Agreement, all applicable intellectual property laws, and any Additional Terms (as defined below) contained on the Platform. Any other use of the Platform is strictly prohibited. Nothing contained on the Platform and/or Materials should be interpreted as granting to you any license or right to use any of the Materials (other than as provided herein) and/or third-party proprietary content on the Platform without the express written permission of Bodega or the relevant third-party owner, as applicable. Any rights not expressly granted herein are reserved by Bodega and Bodega’s licensors.
                </p>
                <p className="mb-2">
                  YOUR CONTENT AND CONDUCT
                  I. Your Conduct
                  By accessing the Platform or the Services, you agree:
                  To comply with the Agreement and all applicable laws, rules, and regulations in connection with your use of the Platform and Services, including laws regarding online conduct and Your Content (as defined below).
                  Not to use the Platform or Services for any commercial or other purposes that are not expressly permitted by this Agreement or in a manner that falsely implies our endorsement, partnership, or otherwise misleads others as to your affiliation with us.
                  Not to access the Platform or Services using a third party's account/registration without the express consent of the Account holder and not to attempt to impersonate another user or person.
                  Not to avoid, bypass, remove, deactivate, impair, descramble, or attempt, through any means, to circumvent any technological measure implemented by Bodega to protect the Platform, or otherwise attempt to gain unauthorized access to any part of the Platform and/or any Service, other Account, computer system, and/or network connected to any Bodega server.
                  Not to use the Platform or Services in any manner that could damage, disable, overburden, and/or impair the Platform, any Bodega server, or the network(s) connected to any Bodega server, and/or interfere with any other party's use and enjoyment of the Platform.
                  Not to advertise to, or solicit, any user, Merchant, or other business to buy or sell any products or services, or use any information obtained from the Platform or the Services in order to contact, solicit, or advertise or sell to any user, Merchant, or other business, unless specifically authorized in writing by Bodega.
                  Not to deep-link to or frame the Platform and/or access the Platform manually and/or with any robot, spider, web crawler, extraction software, automated process, and/or device or other means to scrape, copy, and/or monitor any portion of the Platform and/or any Materials and/or other content on the Platform, unless specifically authorized in writing by Bodega.
                  Not to conduct any scraping, indexing, surveying, data mining, or any other kind of systematic retrieval of data or other content from the Platform.
                  Not to create or compile, directly or indirectly, any collection, compilation, database, or directory from the Platform or Materials.
                  Not to create Merchant reviews or blog entries for or with any commercial or other purpose or intent that does not in good faith comport with the purpose or spirit of the Platform.
                  Not to copy, publish, or redistribute any coupon or discount code or act in bad faith in an attempt to manipulate or gain an unintended commercial benefit from incentive offers.
                  Not to harass, annoy, intimidate, threaten, or engage in any behavior that Bodega finds objectionable to any Bodega employees, contractors, or agents engaged in providing any portion of the Services and not to engage in any other behavior that Bodega deems inappropriate when using the Platform or Services.
                  Not to engage in any criminal or tortious activity, including, without limitation, fraud, spamming (e.g., by email or instant message), sending viruses or other harmful files, harassment, stalking, copyright infringement, patent infringement, or theft of trade secrets or otherwise deleting the copyright or other proprietary rights notice from any of the Materials or from any portion of the Platform or the Services.
                  Not to rent, lease, redistribute, sell, sublicense, decompile, reverse engineer, disassemble, or otherwise reduce the Platform and/or the Materials, in whole or in part, to a human-perceivable form for any purpose, including, without limitation, to build a product and/or service competitive with the Platform and its Services.
                  Not to disrupt, interfere with, or otherwise harm or violate the security of the Platform, or any Services, system resources, accounts, passwords, servers, or networks connected to or accessible through the Platform or affiliated or linked sites (including, without limitation, those of our Merchant).
                  You agree to comply with the above conduct requirements and agree not assist or permit any person in engaging in any conduct that does not comply with the above conduct. In the event that Bodega believes that you have breached any of the above conduct requirements, Bodega reserves the right to suspend and/or permanently terminate your Account at our sole discretion. Further, you agree that the consequences of commercial use or republication of Your Content or Materials from the Platform or other violations of the foregoing proscriptions may be so serious and incalculable that monetary compensation may not be a sufficient or appropriate remedy, and that Bodega will be entitled to temporary and permanent injunctive relief to prohibit such use or activity without the need to prove damages.
                </p>
                <p className="mb-2">
                  II. Your Content
                  Bodega may provide you with interactive opportunities:
                  On the Platform, including features such as user ratings and reviews, saved favorites, liked items, and bookmarked Merchants.
                  On social media pages maintained by Bodega.
                  Through other communications with you, including through text (SMS) or multimedia (MMS) messages (collectively, "Interactive Areas").
                  You represent and warrant that you are the owner of and/or otherwise have the right to provide all information, comments, reviews, ratings, photographs, and/or other materials and/or content that you submit, upload, post, publish, and/or otherwise make available to Bodega through the Platform or otherwise in connection with your use of our Services, including, without limitation, information and materials provided or made available in connection with any Facebook, Google, or other third-party login ("Your Content").
                </p>
                <p className="mb-2">
                  III. Use of Your Content
                  You grant Bodega an irrevocable, transferable, paid-up, royalty-free, perpetual, non-exclusive worldwide sublicensable license to use, copy, display, publish, modify, remove, publicly perform, translate, create derivative works from, distribute, and/or otherwise use Your Content in all forms of media now known or hereafter invented for the purpose of operating, promoting, and improving our Site, business, products, and services, and developing new ones (collectively, the “Uses”). The Uses include, without limitation, use of your username and/or other user profile information, such as your ratings history and how long you have been a Bodega diner, to attribute Your Content to you on the Platform, including in Interactive Areas and other public areas on our Platform, or otherwise in connection with our Services. All Uses will be made without notification to and/or approval by you and without the requirement of payment to you or any other person or entity. Further, you hereby grant Bodega a royalty-free, perpetual, irrevocable, transferable, sublicensable, worldwide, nonexclusive license to incorporate and use any of your suggestions, input, or other feedback relating to the Platform or the Services (collectively, the “Feedback”) for any purpose without notice to, approval by, or compensation to you.
                </p>
                <p className="mb-2">
                  You further understand and agree that you may be exposed to third-party content that is inaccurate, objectionable, inappropriate for children, or otherwise unsuited to your purpose. Bodega and its parents, subsidiaries, affiliates, and each of their officers, directors, employees, successors, assigns, licensors, licensees, designees, business partners, contractors, agents, and representatives (collectively, the "Released Parties") will not be responsible for, and you hereby expressly release the Released Parties from any and all liability for the action of any and all third parties with respect to Your Content, or for any damages you allege to incur as a result of or relating to any third-party content.
                </p>
                <p className="mb-2">
                  IV. Conduct within Interactive Areas
                  By transmitting Your Content, you agree to follow the standards of conduct below, and any additional standards that may be stated on the Platform. We expect your cooperation in upholding our standards. You are responsible for all of Your Content. You agree that Your Content will not:
                  Be unlawful, harmful to adults or minors, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, profane, offensive, invasive of another's privacy, hateful, and/or racially, ethnically, and/or otherwise objectionable.
                  Have a commercial, political, or religious purpose.
                  Be false, misleading, and/or not written in good faith.
                  Infringe any patent, trademark, trade secret, copyright, right of privacy and/or publicity, and/or other proprietary rights of any person and/or entity.
                  Be illegal and/or promote illegal activity.
                  Contain confidential information belonging to a third party.
                  Contain unauthorized advertising and/or solicits users to a business other than those on the Platform.
                  Be intended to interrupt, destroy, or limit the functionality or integrity of any computer software, hardware, or Materials on the Platform or other websites.
                  We do our best to encourage civility and discourage disruptive communication on the Platform. We also do our best to discourage communications that incite others to violate our standards. Bodega may monitor any and all use of the Platform, including interactions between our users; however, we are under no obligation to do so. We may manage the Platform in a manner intended to protect our property and rights and to facilitate the proper functioning of the Platform. If any of Your Content or conduct on our Platform violates our standards, or any other terms of this Agreement; or interferes with other peoples' enjoyment of the Materials or our Platform or Services; or is inappropriate in our judgment; we reserve the right, in our sole discretion and without notice to you, (i) to change, delete or remove, in part or in full, any of Your Content, (ii) to terminate or suspend access to any Interactive Areas or any other part of our Platform, and/or (iii) to terminate or suspend your Account; in each case, with or without notice. Bodega will cooperate with local, state, and/or federal authorities to the extent required by applicable law in connection with Your Content.
                </p>
                <p className="mb-2">
                  V. Ratings and Reviews
                  The Platform and other Interactive Areas may allow you to rate (each, a “Rating”) and post reviews (each, a “Review”) of Merchants. Such Ratings and Reviews are considered Your Content and are governed by the terms and conditions of this Agreement. Ratings and Reviews are not endorsed by Bodega and do not represent the views of Bodega or of any affiliate or partner of Bodega. Bodega does not assume liability for Ratings and Reviews or for any claims, liabilities, or losses resulting from any Ratings and Reviews. We strive to maintain a high level of integrity with our Ratings and Reviews and other aspects of Your Content. Therefore, all Ratings and Reviews must comply with the following criteria, in addition to and without limiting other requirements applicable to Your Content as set forth in these Terms:
                  Before posting a Rating or Review, you must have had recent first-hand experience with the Merchant.
                  You may not have a proprietary or other affiliation with either the Merchant or any of its competitors.
                  You may not draw any legal conclusions regarding the Merchants' products, services, or conduct.
                  Your Review must otherwise comply with the terms of this Agreement as well as all applicable laws, rules, and regulations, including without limitation the Federal Trade Commission’s Guides Concerning the Use of Endorsements and Testimonials in Advertising.
                  You will not submit a Rating or Review in exchange for payment, free food or beverage items, or other benefits from any Merchant or third party.
                  Any Rating and/or Review that we determine, in our sole discretion, could diminish the integrity of the Ratings and Reviews, the Materials and/or the Platform may be removed or excluded by us without notice.
                </p>
                <p className="mb-2">
                  COMMUNICATIONS & TEXT MESSAGES
                  When you use the Services, or send emails, text messages, and other communications from your desktop or mobile device to us, you may be communicating with us electronically. You consent to receive communications from us or on our behalf electronically, such as e-mails, texts, mobile push notices, or notices and messages through the Services, and you agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing. You agree to keep your contact information, including email address, current. This subparagraph does not affect your statutory rights.
                </p>
                <p className="mb-2">
                  Your voluntary provision to Bodega of your cell phone number represents your consent that Bodega may contact you by telephone, SMS, or MMS messages at that phone number, and your consent to receiving such communications for transactional, operational, or informational purposes. When you provide your phone number to Bodega, you warrant that you are the current subscriber or authorized user of the relevant account. You understand and agree that such messages may be sent using automated technology. You may unsubscribe from receiving text messages from Bodega at any time. To revoke your consent to receiving SMS or MMS messages from Bodega, you agree to follow the unsubscribe procedures described below.
                </p>
                <p className="mb-2">
                  When placing orders through the Platform, you may receive order status messages from Bodega about each order. To unsubscribe from order-related messages, just reply "STOP" to the number sending the message. To resubscribe, text “START” to the same number from the phone number associated with your account. If you need assistance, text “HELP”. Please note that unsubscribing from one of the branded properties in our Platform will not automatically unsubscribe you from another separately branded property in our Platform. For example, if you unsubscribe from Bodega order-related messages, you may still receive order-related messages when you place an order through another Bodega platform, unless you also unsubscribe from that platform's order-related messages.
                </p>
                <p className="mb-2">
                  Additionally, you may receive messages from Bodega following receipt of a completed order soliciting feedback and/or other information relating to the order. You may unsubscribe from all such feedback messages by replying "STOP" to the number sending the feedback messages. To resubscribe, text "START" to the number sending the feedback messages using the phone number associated with your account. Please note that unsubscribing from such feedback texts will not prevent you from receiving texts from Bodega, the Merchant, or your delivery person regarding your order or its delivery unless you also text "STOP" to the number sending the order-related messages, and even in such event, you may still receive individual texts from the Merchant or your delivery person to enable successful delivery of your order.
                </p>
                <p className="mb-2">
                  You may also receive text messages in response to certain Customer Care requests. To unsubscribe from Customer Care messages, just reply to the message by texting “STOP” to the number sending the message.
                </p>
                <p className="mb-2">
                  If you unsubscribe from receiving text messages from Bodega through the process described above, you may continue to receive text messages for a short period while Bodega processes your request(s). If you change or deactivate the phone number you provided to Bodega, you have an affirmative obligation to immediately update your account information and the phone number(s) attached to your account to prevent us from inadvertently communicating with anyone who acquires any phone number(s) previously attributed to you, and any new phone number(s) you attach to your Account may receive Bodega’s standard SMS or MMS messages unless you also unsubscribe via the above procedures.
                </p>
                <p className="mb-2">
                  Standard data and message rates may apply for SMS and MMS alerts, whether you send or receive such messages. Please contact your mobile phone carrier for details. Your mobile phone carrier (e.g., T-Mobile, AT&T, Verizon, etc.) is not liable for delayed or undelivered messages. If you require assistance, please call our Customer Care team at 1-877-585-7878.
                </p>
                <p className="mb-2">
                  ADDITIONAL TERMS FOR MOBILE APPLICATIONS
                  We may make available software to access Bodega’s websites, technology platforms, and related online and mobile services via a mobile device (“Mobile Applications”). To use any Mobile Application, you must use a mobile device that is compatible with that Mobile Application. Bodega does not warrant that any Mobile Application will be compatible with your mobile device. You may use mobile data in connection with the Mobile Applications and may incur additional charges from your wireless provider for these services. You agree that you are solely responsible for any such charges. Bodega hereby grants you a non-exclusive, non-transferable, revocable license to use a compiled code copy of the Mobile Applications for one Account on a mobile device owned or leased solely by you, for your personal use. You acknowledge that Bodega may from time to time issue upgraded versions of the Mobile Applications, and may automatically electronically upgrade the version of any Mobile Applications that you are using on your mobile device. You consent to such automatic upgrading on your mobile device and agree to timely upgrade the Mobile Application in the event there is no automatic update. Please upgrade to the latest version of the Mobile Applications in order to view the most up-to-date information on the Platform regarding Merchants featured on the Mobile Applications. You further agree that the terms and conditions of this Agreement will apply to all upgrades to the Mobile Applications. Any third-party code that may be incorporated in the Mobile Applications is covered by the applicable open source or third-party license EULA, if any, authorizing use of such code. The foregoing license grant is not a sale of the Mobile Applications or any copy thereof, and Bodega or its third-party partners or suppliers retain all right, title, and interest in the Mobile Applications (and any copy thereof). Any attempt by you to transfer any of the rights, duties, or obligations hereunder, except as expressly provided for in this Agreement, is void. Bodega reserves all rights not expressly granted under this Agreement with respect to the Mobile Applications and otherwise. If any Mobile Application is being acquired on behalf of the United States Government, then the following provision applies: The Mobile Application will be deemed to be “commercial computer software” and “commercial computer software documentation,” respectively, pursuant to DFAR § 227.7202 and FAR § 12.212, as applicable. Any use, reproduction, release, performance, display, or disclosure of the Platform and any accompanying documentation by the U.S. Government will be governed solely by this Agreement and is prohibited except to the extent expressly permitted by this Agreement. The Mobile Applications originate in the United States and are subject to United States export laws and regulations. The Mobile Applications may not be exported or re-exported to certain countries or those persons or entities prohibited from receiving exports from the United States. In addition, the Mobile Applications may be subject to the import and export laws of other countries. You agree to comply with all United States and foreign laws related to use of the Mobile Applications and the Platform.
                </p>
                <p className="mb-2">
                  The following applies to any Mobile Application you acquire from the Apple App Store (“Apple-Sourced Software”): You acknowledge and agree that this Agreement is solely between you and Bodega, not Apple, Inc. (“Apple”) and that Apple has no responsibility for the Apple-Sourced Software or content thereof. Your use of the Apple-Sourced Software must comply with the App Store Terms of Service. You acknowledge that Apple has no obligation whatsoever to furnish any maintenance and support services with respect to the Apple-Sourced Software. In the event of any failure of the Apple-Sourced Software to conform to any applicable warranty, you may notify Apple, and Apple will refund to you the purchase price for the Apple-Sourced Software; to the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to the Apple-Sourced Software, and any other claims, losses, liabilities, damages, costs, or expenses attributable to any failure to conform to any warranty will be solely governed by this Agreement and any law applicable to Bodega as provider of the software. You acknowledge that Apple is not responsible for addressing any of your claims or those of any third party relating to the Apple-Sourced Software or your possession and/or use of the Apple-Sourced Software, including, but not limited to: (i) product liability claims; (ii) any claim that the Apple-Sourced Software fails to conform to any applicable legal or regulatory requirement; and (iii) claims arising under consumer protection, privacy, or similar legislation; and all such claims are governed solely by this Agreement and any law applicable to Bodega as provider of the software. You acknowledge that, in the event of any third-party claim that the Apple-Sourced Software or your possession and use of that Apple-Sourced Software infringes that third party’s intellectual property rights, Bodega, not Apple, will be solely responsible for the investigation, defense, settlement, and discharge of any such intellectual property infringement claim to the extent required by this Agreement. You and Bodega acknowledge and agree that Apple, and Apple’s subsidiaries, are third-party beneficiaries of this Agreement as it relates to your license of the Apple-Sourced Software, and that, upon your acceptance of the terms and conditions of this Agreement, Apple will have the right (and will be deemed to have accepted the right) to enforce this Agreement against you as a third-party beneficiary as it relates to your license of the Apple-Sourced Software.
                </p>
                <p className="mb-2">
                  The following applies to any Mobile Applications you acquire from the Google Play Store (“Google-Sourced Software”): (i) you acknowledge that the Agreement is solely between you and Bodega only, and not with Google, Inc. (“Google”); (ii) your use of Google-Sourced Software must comply with Google’s then-current Google Play Store Terms of Service; (iii) Google is only a provider of the Google Play Store where you obtained the Google-Sourced Software; (iv) Bodega, and not Google, is solely responsible for its Google-Sourced Software; (v) Google has no obligation or liability to you with respect to Google-Sourced Software or the Agreement;
                </p>
                <p className="mb-2">
                  DISCLAIMER
                  THE PLATFORM, THE SERVICES, THE MATERIALS, AND ALL OTHER CONTENT ON THE PLATFORM ARE PROVIDED "AS IS" AND “AS AVAILABLE” AND WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, UNLESS OTHERWISE SPECIFIED IN WRITING. TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, BODEGA DISCLAIMS, WITH RESPECT TO THE SERVICES, THE PLATFORM, THE MATERIALS AND ALL OTHER CONTENT ON THE PLATFORM, ALL WARRANTIES, EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING, BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. BODEGA DOES NOT REPRESENT OR WARRANT THAT THE PLATFORM, THE SERVICES, THE MATERIALS AND/OR THE OTHER CONTENT ON THE PLATFORM WILL BE SECURE, UNINTERRUPTED, AND/OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, AND/OR THAT THE PLATFORM, THE SERVICES, THE MATERIALS, AND/OR OTHER CONTENT ON THE PLATFORM ARE FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS. BODEGA DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE USE OR THE RESULTS OF THE USE OF THE PLATFORM, THE SERVICES, THE MATERIALS, AND/OR ANY OTHER CONTENT ON THE PLATFORM IN TERMS OF THEIR CORRECTNESS, ACCURACY, RELIABILITY, TIMELINESS, COMPLETENESS, CURRENTNESS, OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, THE SAFETY, QUALITY, AND/OR TIMING OF A DELIVERY ORDERED ON THE PLATFORM, AND/OR THE FOOD OR OTHER PRODUCTS DELIVERED. YOU (AND NOT BODEGA) ASSUME THE ENTIRE COST OF USING THE SITE. APPLICABLE LAW MAY NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO THE ABOVE EXCLUSION MAY NOT FULLY APPLY TO YOU.
                </p>
                <p className="mb-2">
                  BODEGA SHALL NOT BE LIABLE FOR DELAY OR FAILURE IN PERFORMANCE RESULTING FROM CAUSES BEYOND BODEGA'S REASONABLE CONTROL, INCLUDING, WITHOUT LIMITATION, DELAYS AND OTHER PROBLEMS INHERENT IN THE USE OF THE INTERNET AND ELECTRONIC COMMUNICATIONS. BODEGA IS NOT RESPONSIBLE FOR ANY DELAYS, DELIVERY FAILURES, OR OTHER DAMAGE RESULTING FROM SUCH PROBLEMS.
                </p>
                <p className="mb-2">
                  BODEGA RELIES UPON MERCHANTS TO PROVIDE ACCURATE ALLERGEN AND DIETARY INFORMATION AND GENERAL PRODUCT SAFETY. BODEGA DOES NOT REPRESENT OR WARRANT THAT THE INFORMATION ACCESSIBLE THROUGH THE SERVICE IS ACCURATE, COMPLETE, RELIABLE, CURRENT, OR ERROR-FREE, INCLUDING, WITHOUT LIMITATION, MENUS, NUTRITIONAL AND ALLERGEN INFORMATION, PHOTOS, FOOD QUALITY OR DESCRIPTIONS, PRICING, HOURS OF OPERATION, OR REVIEWS. ALL CONTENT IS PROVIDED FOR INFORMATIONAL PURPOSES ONLY. THE RELIANCE ON ANY INFORMATION PROVIDED THROUGH THE SERVICE IS SOLELY AT YOUR OWN RISK, INCLUDING, WITHOUT LIMITATION, NUTRITIONAL AND ALLERGEN INFORMATION.
                </p>
                <p className="mb-2">
                  LIMITATION OF LIABILITY
                  TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, IN NO EVENT SHALL BODEGA BE LIABLE TO YOU FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, OR ANY LOSS OR DAMAGES WHATSOEVER (INCLUDING PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF DATA, REVENUE, PROFITS, REPUTATION, USE, OR OTHER ECONOMIC ADVANTAGE), EVEN IF BODEGA HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, ARISING OUT OF A WARRANTY, CONTRACT, NEGLIGENCE, TORT, OR ANY OTHER ACTION OF ANY TYPE THAT IN ANY MANNER ARISES OUT OF OR IN CONNECTION WITH THE PLATFORM OR THE SERVICES PROVIDED ON OR THROUGH THE PLATFORM OR BY BODEGA.
                </p>
                <p className="mb-2">
                  BODEGA ASSUMES NO RESPONSIBILITY AND SHALL NOT BE LIABLE FOR ANY DAMAGES TO, OR VIRUSES THAT MAY INFECT, YOUR COMPUTER EQUIPMENT OR OTHER PROPERTY ON ACCOUNT OF YOUR ACCESS TO, USE OF, BROWSING OF, OR DOWNLOADING OF ANY MATERIAL FROM THE PLATFORM. BODEGA ASSUMES NO RESPONSIBILITY OR LIABILITY IN ANY MANNER ARISING OUT OF OR IN CONNECTION WITH ANY INFORMATION, CONTENT, PRODUCTS, SERVICES, OR MATERIAL AVAILABLE ON OR THROUGH THE PLATFORM, AS WELL AS ANY THIRD-PARTY WEBSITE PAGES OR ADDITIONAL WEBSITES LINKED TO THIS PLATFORM, FOR ANY ERROR, DEFAMATION, LIBEL, SLANDER, OMISSION, FALSEHOOD, OBSCENITY, PORNOGRAPHY, PROFANITY, DANGER, INACCURACY CONTAINED THEREIN, OR HARM TO PERSON OR PROPERTY CAUSED THEREBY. THESE LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.
                </p>
                <p className="mb-2">
                  IN NO EVENT SHALL BODEGA'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES AND CAUSES OF ACTION, WHETHER IN WARRANTY, CONTRACT, NEGLIGENCE, TORT OR ANY OTHER ACTION OF ANY TYPE EXCEED IN THE AGGREGATE (A) THE AMOUNT PAID BY YOU TO BODEGA OR A MERCHANT IN THE SIX (6) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO SUCH CLAIM, IF ANY, OR (B) $1,000 (WHICHEVER IS LESS). BECAUSE SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, IN SUCH JURISDICTIONS LIABILITY IS LIMITED TO THE GREATEST EXTENT PROVIDED BY LAW.
                </p>
                <p className="mb-2">
                  YOU AND BODEGA AGREE THAT THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY IN THIS AGREEMENT ARE MATERIAL, BARGAINED-FOR BASES OF THIS AGREEMENT, AND THAT THEY HAVE BEEN TAKEN INTO ACCOUNT IN DETERMINING THE CONSIDERATION TO BE GIVEN BY EACH PARTY UNDER THIS AGREEMENT AND IN THE DECISION BY EACH PARTY TO ENTER INTO THIS AGREEMENT. YOU AND BODEGA AGREE THAT THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY IN THIS AGREEMENT ARE FAIR AND REASONABLE. EXCEPT AS MAY BE OTHERWISE PROVIDED FOR IN THIS SECTION, YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY DAMAGE ARISING OUT OF YOUR USE OF THE SITE IS TO DISCONTINUE USING THE PLATFORM AND SERVICES, WHICH YOU MAY DO AT ANY TIME.
                </p>
                <p className="mb-2">
                  IMPORTANT NOTE TO NEW JERSEY CONSUMERS
                  IF YOU ARE A CONSUMER RESIDING IN NEW JERSEY, THE FOLLOWING PROVISIONS OF THIS AGREEMENT DO NOT APPLY TO YOU (AND DO NOT LIMIT ANY RIGHTS THAT YOU MAY HAVE) TO THE EXTENT THAT THEY ARE UNENFORCEABLE UNDER NEW JERSEY LAW: (A) THE DISCLAIMER OF LIABILITY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES OF ANY KIND (FOR EXAMPLE, TO THE EXTENT UNENFORCEABLE UNDER THE NEW JERSEY PUNITIVE DAMAGES ACT, NEW JERSEY PRODUCTS LIABILITY ACT, NEW JERSEY UNIFORM COMMERCIAL CODE, AND NEW JERSEY CONSUMER FRAUD ACT); (B) THE LIMITATION ON LIABILITY FOR LOST PROFITS OR LOSS OR MISUSE OF ANY DATA (FOR EXAMPLE, TO THE EXTENT UNENFORCEABLE UNDER THE NEW JERSEY IDENTITY THEFT PROTECTION ACT AND NEW JERSEY CONSUMER FRAUD ACT); (C) APPLICATION OF THE LIMITATIONS OF LIABILITY TO THE RECOVERY OF DAMAGES THAT ARISE UNDER CONTRACT AND TORT, INCLUDING, WITHOUT LIMITATION, NEGLIGENCE, STRICT LIABILITY, OR ANY OTHER THEORY (FOR EXAMPLE, TO THE EXTENT SUCH DAMAGES ARE RECOVERABLE BY A CONSUMER UNDER NEW JERSEY LAW, INCLUDING, WITHOUT LIMITATION, THE NEW JERSEY PRODUCTS LIABILITY ACT); AND (D) THE NEW YORK GOVERNING LAW PROVISION (FOR EXAMPLE, TO THE EXTENT THAT YOUR RIGHTS AS A CONSUMER RESIDING IN NEW JERSEY ARE REQUIRED TO BE GOVERNED BY NEW JERSEY LAW).
                </p>
                <p className="mb-2">
                  THIRD PARTY LINKS
                  The Platform may contain links to websites that are owned, controlled, developed, sponsored and/or maintained by third parties and which may be subject to additional terms and conditions ("Third Party Websites"). If you click on a link to a Third Party Website, Bodega will not warn you that you have left the Services or Platform or that you are subject to the terms and conditions of another website or third party service provider. Bodega does not review, monitor, operate and/or control the Third Party Websites and Bodega makes no guarantees, representations, and/or warranties as to, and shall have no liability for, the content, products or services available on or through and/or the functioning of the Third Party Websites. By providing access to Third Party Websites, Bodega is not recommending and/or otherwise endorsing the products and/or services provided by the sponsors and/or owners of those websites. Your access to and/or use of the Third Party Websites, including, without limitation, providing information, materials and/or other content to the Third Party Websites, is entirely at your own risk. Bodega reserves the right to discontinue links to any Third Party Websites at any time and for any reason, without notice.
                </p>
                <p className="mb-2">
                  ADDITIONAL TERMS
                  Your use of the Platform is subject to any and all additional terms, policies, rules, or guidelines applicable to the Services or certain features of the Platform that we may post or link to on the Platform (collectively, the "Additional Terms"), such as end-user license agreements, or other agreements or rules applicable to particular features, promotions, or content on the Platform, including, without limitation, the Google Maps/Google Earth Additional Terms of Service located at https://maps.google.com/help/terms_maps.html and the Google Privacy Policy located at https://www.google.com/intl/ALL/policies/privacy/index.html. All such Additional Terms are hereby incorporated into this Agreement by reference.
                </p>
                <p className="mb-2">
                  PERKS
                  By participating in perks, which includes all promotions, discounts, coupons or loyalty programs available on the Platform (collectively, “Perks”), you agree to this Agreement and the additional Perks Terms of Use.
                </p>
                <p className="mb-2">
                  Please note, we may also give you the option on the Platform to register with a specific Merchant’s promotional or loyalty programs that are not operated by or associated with Bodega or Perks. If you do register with the Merchant’s promotional or loyalty program, you understand that you may be required to agree to additional terms and conditions provided by the Merchant and/or you may be directed to a Third Party Website. You also understand that you will need to contact the Merchant separately if you have any questions regarding your participation in their promotional or loyalty program and/or cancellation of your account with them directly. Bodega does not own, operate or otherwise control such separate Merchant promotional or loyalty programs and therefore shall have no liability for those separate programs, including without limitation your participation therein.
                </p>
                <p className="mb-2">
                  BODEGA+
                  By purchasing or using a Bodega membership subscription service (including Bodega+), you agree to this Agreement and the additional Membership Terms of Use.
                </p>
                <p className="mb-2">
                  DONATE THE CHANGE
                  By electing to make a Donation (defined in the Donate the Change Terms of Use) and participating in the Bodega Donate the Change program, you agree to this Agreement and the additional Donate the Change Terms of Use.
                </p>
                <p className="mb-2">
                  GIFT CARDS
                  Bodega may provide you with the option to purchase e-gift cards in connection with your use of the Platform. The terms and conditions for e-gift card use are located at Bodega also makes physical gift cards available for purchase. The terms and conditions stated on the physical card apply.
                </p>
                <p className="mb-2">
                  PRIVACY POLICY
                  The terms and conditions of the Privacy Policy are incorporated into this Agreement by reference.
                </p>
                <p className="mb-2">
                  COPYRIGHT POLICY
                  Bodega respects the intellectual property of others, and we ask all of our users to do the same. If you believe that your copyrighted work has been copied and is accessible on the Platform or a website through which our Services may be accessed in a way that constitutes copyright infringement, please provide Bodega's Copyright Agent (as set forth below) with notification containing the following information required by the Digital Millennium Copyright Act, 17 U.S.C. §512 (“DMCA”):
                  A physical or electronic signature of a person authorized to act on behalf of the copyright owner of the work that allegedly has been infringed;
                  Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works allegedly have been infringed, then a representative list of such copyrighted works;
                  Identification of the material that is claimed to be infringing and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the allegedly infringing material, e.g., the specific web page address on the Platform;
                  Information reasonably sufficient to permit us to contact the party alleging infringement, including an email address;
                  A statement that the party alleging infringement has a good-faith belief that use of the copyrighted work in the manner complained of is not authorized by the copyright owner or its agent, or is not otherwise permitted under the law; and
                  A statement that the information in the notification is accurate, and under penalty of perjury, that the party alleging infringement is authorized to act on behalf of the copyright owner of the work that allegedly has been infringed.
                  Please send this notification to our copyright agent at: Bodega Holdings Inc., Attention: Copyright Agent, [Address].
                </p>
                <p className="mb-2">
                  UNDER FEDERAL LAW, IF YOU KNOWINGLY MISREPRESENT THAT ONLINE MATERIAL IS INFRINGING, YOU MAY BE SUBJECT TO CRIMINAL PROSECUTION FOR PERJURY AND CIVIL PENALTIES, INCLUDING MONETARY DAMAGES, COURT COSTS, AND ATTORNEYS’ FEES.
                  Please note that this procedure is exclusively for notifying Bodega and its affiliates that your copyrighted material has been infringed. The preceding requirements are intended to comply with Bodega’s rights and obligations under the DMCA, including 17 U.S.C. §512(c), but do not constitute legal advice. It may be advisable to contact an attorney regarding your rights and obligations under the DMCA and other applicable laws.
                </p>
                <p className="mb-2">
                  In accordance with the DMCA and other applicable law, Bodega has adopted a policy of terminating, in appropriate circumstances, users who are deemed to be repeat infringers. Bodega may also in its sole discretion limit access to the Platform, the Services and/or terminate the Accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
                </p>
                <p className="mb-2">
                  TERMINATION AND VIOLATIONS OF THE AGREEMENT
                  Your rights under this Agreement will terminate automatically without notice if you fail to comply with any term of this Agreement. Further, Bodega reserves the right, in its sole and absolute discretion, to modify, suspend, or discontinue at any time, with or without notice, the Platform and/or Services offered on or through the Platform (or any part thereof), including but not limited to the Platform's features, look and feel, and functional elements and related Services. We will have no liability whatsoever on account of any change to the Platform or any suspension or termination of your access to or use of the Platform. You may terminate this Agreement at any time by closing your Account, uninstalling all Mobile Application(s) (if applicable) and ceasing use of the Platform and Services provided herein.
                </p>
                <p className="mb-2">
                  Upon termination of this Agreement for any reason or no reason: (1) your access rights will terminate and you must immediately cease all use of the Platform and Services; and (2) any provision of this Agreement that contemplates or governs performance or observance subsequent to termination of this Agreement will survive the termination of this Agreement, including without limitation the following sections: (i) “Your Content and Conduct;” (ii) “Disclaimer;” (iii) “Limitation of Liability;” (iv) “Important Note to New Jersey Consumers;” (v) “Termination and Violations of this Agreement;” (vi) “Dispute Resolution;” (vii) “Indemnification” and (viii) “Waiver and Severability.”
                </p>
                <p className="mb-2">
                  Bodega reserves the right to seek all remedies available at law and in equity for violations of the Agreement, including, without limitation, the right to block access to the Platform and/or Services from a particular Account, device and/or IP address.
                  You may not assign or transfer this Agreement or your rights under this Agreement, in whole or in part, by operation of law or otherwise, without our prior written consent. We may assign this Agreement in whole or in part at any time to any entity without your notice or consent. Any purported assignment by you in violation of this section shall be null and void. This Agreement binds and inures to the benefit of each party and the party’s successors and permitted assigns.
                </p>
                <p className="mb-2">
                  INDEMNIFICATION
                  You agree to indemnify and hold harmless Bodega and its officers, directors, employees, agents, and affiliates (each, an "Indemnified Party") from and against any losses, liabilities, claims, actions, costs, damages, penalties, fines and expenses, including without limitation attorneys’ and experts’ fees and expenses, that may be incurred by an Indemnified Party arising out of or in connection with: (i) Bodega’s use of your User Content; (ii) your unauthorized use of the Services, (iii) your breach of this Agreement; (iv) your actual or alleged violation of any law, rule or regulation; (v) any third party’s access or use of the Services using your Bodega Account; or (vi) any dispute or issue between you and any third party, including without limitation any Delivery Partner or Merchant.
                </p>
                <p className="mb-2">
                  CHANGES TO THE AGREEMENT
                  We may change this Agreement from time to time and without prior notice to you. If we make a change to this Agreement, it will be effective as soon as we post it and the most current version of this Agreement will always be posted under the "Terms of Use" link available on our Platform ("Updated Terms"). In addition to posting the Updated Terms, we may elect to provide additional notice to you of the Updated Terms, such as by sending an email to you or providing a notice through the Platform and/or Services. You agree that you will review this Agreement periodically and check the “Effective” date in this Agreement to stay aware of any changes. By continuing to access and/or use the Platform and/or Services after we post Updated Terms, you agree to be bound by the Updated Terms, and if you do not agree to the Updated Terms, you will stop using the Platform and/or accessing the Services. Except as otherwise provided in the “Dispute Resolution” section, the Updated Terms will govern any disputes between you and Bodega, even if the dispute arises or involves facts dated before the “Effective” date of the Updated Terms.
                </p>
                <p className="mb-2">
                  GOVERNING LAW
                  Except for the “Dispute Resolution” section below, the terms, conditions, and policies contained in this Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to its choice or conflict of laws principles. The Federal Arbitration Act will govern the interpretation and enforcement of the “Dispute Resolution” section.
                </p>
                <p className="mb-2">
                  Also, regardless of any statute or law to the contrary (and to the fullest extent permitted by law), you must provide notice to Bodega, pursuant to the procedures in the “Dispute Resolution” section below, of any claim within one year of its accrual, or your claim will be waived and barred.
                  Venue
                  You and Bodega agree that to the extent any dispute, claim, or controversy is permitted to proceed in court (except for small claims court), it shall be brought and heard exclusively in the state and federal courts of New York County, New York.
                  The foregoing Governing Law and Venue provisions do not apply to the “Dispute Resolution” section, and we refer you to that section for the applicable provisions for such disputes.
                </p>
                <p className="mb-2">
                  DISPUTE RESOLUTION
                  PLEASE READ THIS “DISPUTE RESOLUTION” SECTION CAREFULLY. IT LIMITS THE WAYS YOU CAN SEEK RELIEF FROM BODEGA AND REQUIRES YOU TO ARBITRATE DISPUTES ON AN INDIVIDUAL BASIS. IN ARBITRATION, THERE IS NO JUDGE OR JURY AND THERE IS MORE CIRCUMSCRIBED DISCOVERY AND APPELLATE REVIEW THAN THERE IS IN COURT.
                </p>
                <p className="mb-2">
                  I. Informal Dispute Resolution Procedure
                  There might be instances when a Dispute (as defined below) arises between you and Bodega. In those instances, Bodega is committed to working with you to reach a reasonable resolution; however, we can only do this if we know about and understand each other’s concerns. Therefore, for any Dispute that arises between you and Bodega, both parties acknowledge and agree that they will first make a good faith effort to resolve it informally before initiating any formal dispute resolution proceeding in arbitration or otherwise. This includes first sending a written description of the Dispute to the other party. For any Dispute you initiate, you agree to send the written description of the Dispute along with the email address associated with your account to the following email address: disputeresolution@bodega.com. Your written description must be on an individual basis and also provide at least the following information: your name; a detailed description of the nature and basis of the Dispute, including any transaction details; and the specific relief sought and how it was calculated. Your written description must be personally signed by you. For any Dispute that Bodega raises, we will send our written description of the Dispute to the email address associated with your account.
                </p>
                <p className="mb-2">
                  You and Bodega then agree to negotiate in good faith about the Dispute. This might include an informal telephonic dispute resolution conference between you and Bodega if such a conference is requested by Bodega. If such an informal telephonic dispute resolution conference takes place, it shall be individualized such that a separate conference must be held each time either party intends to commence individual arbitration; multiple individuals initiating claims cannot participate in the same informal telephonic dispute resolution conference. If either party is represented by counsel, that party's counsel may participate in the informal telephonic dispute resolution conference, but the party also must appear at and participate in the conference. This should lead to resolution, but if for some reason the Dispute is not resolved satisfactorily within sixty (60) days after receipt of the complete written description of the Dispute, you and Bodega agree to the further dispute resolution provisions below.
                  To reiterate, this informal dispute resolution process is a prerequisite and condition precedent to commencing any formal dispute resolution proceeding. The parties agree that any relevant limitations period and filing fee or other deadlines will be tolled while the parties engage in this informal dispute resolution process. A court shall have the authority to enjoin the filing or prosecution of arbitrations based on a failure to comply with this Informal Dispute Resolution Procedure. A party may raise non-compliance with this Informal Dispute Resolution Procedure in court and/or in connection with the arbitration.
                </p>
                <p className="mb-2">
                  II. Mutual Arbitration Agreement
                  You and Bodega agree that all claims, disputes, or disagreements that may arise out of the interpretation or performance of this Agreement or payments by or to Bodega, or that in any way relate to your use of the Platform, the Materials, the Services, and/or other content on the Platform, your relationship with Bodega, or any other dispute with Bodega, (whether based in contract, tort, statute, fraud, misrepresentation, or any other legal theory) (each, a “Dispute”) shall be submitted exclusively to binding arbitration. Dispute shall have the broadest possible meaning. This includes claims that arose, were asserted, or involve facts occurring before the existence of this or any prior Agreement as well as claims that may arise after the termination of this Agreement. This Mutual Arbitration Agreement is intended to be broadly interpreted. Notwithstanding the foregoing in this Arbitration Agreement, where you allege claims of sexual harassment or sexual assault arising out of your use of the Platform or Services, you may elect to bring those claims in a court of competent jurisdiction. Bodega will honor your election to bring your sexual assault or sexual harassment claim in a court of competent jurisdiction or arbitration, but does not waive the enforceability of this Arbitration Agreement with respect to any other provision of this Arbitration Agreement or with respect to any other claim or Dispute.
                </p>
                <p className="mb-2">
                  Notwithstanding the foregoing, issues related to the scope, validity, and enforceability of this Arbitration Agreement are for a court to decide. Also, each party retains the right to (1) elect (at any time prior to the appointment of an arbitrator) to have any claims heard in small claims court on an individual basis for disputes and actions within the scope of such court’s jurisdiction, provided the proceeding remains in small claims court and is not removed or appealed to a court of general jurisdiction, and (2) seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of a party's copyrights, trademarks, trade secrets, patents, or other confidential or proprietary information or intellectual property rights. For clarity, this “Dispute Resolution” section does not alter, amend, or affect any of the rights or obligations of the parties to any Bodega Delivery Partner Agreement.
                </p>
                <p className="mb-2">
                  ARBITRATION MEANS THAT AN ARBITRATOR AND NOT A JUDGE OR JURY WILL DECIDE THE DISPUTE. RIGHTS TO PREHEARING EXCHANGE OF INFORMATION AND APPEALS MAY BE LIMITED IN ARBITRATION. YOU HEREBY ACKNOWLEDGE AND AGREE THAT YOU AND BODEGA ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY TO THE MAXIMUM EXTENT PERMITTED BY LAW.
                </p>
                <p className="mb-2">
                  III. Class Action and Collective Relief Waiver
                  YOU ACKNOWLEDGE AND AGREE THAT, TO THE MAXIMUM EXTENT ALLOWED BY LAW, EXCEPT AS SET OUT IN SECTION VII BELOW, THERE SHALL BE NO RIGHT OR AUTHORITY FOR ANY DISPUTE TO BE ARBITRATED OR LITIGATED ON A CLASS, JOINT, COLLECTIVE OR CONSOLIDATED BASIS OR IN A PURPORTED REPRESENTATIVE CAPACITY ON BEHALF OF THE GENERAL PUBLIC, OR AS A PRIVATE ATTORNEY GENERAL OR FOR PUBLIC INJUNCTIVE RELIEF. UNLESS BOTH YOU AND BODEGA OTHERWISE AGREE IN WRITING, THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON’S CLAIMS (EXCEPT AS SET OUT IN SECTION VII BELOW), AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF ANY CLASS, JOINT, COLLECTIVE OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY AWARD RELIEF (INCLUDING ANY DECLARATORY OR INJUNCTIVE RELIEF) ONLY IN FAVOR OF THE INDIVIDUAL PARTY SEEKING RELIEF AND ONLY TO THE EXTENT NECESSARY TO RESOLVE AN INDIVIDUAL PARTY’S CLAIM. THE ARBITRATOR MAY NOT AWARD RELIEF FOR OR AGAINST ANYONE WHO IS NOT A PARTY TO THE PROCEEDING.
                </p>
                <p className="mb-2">
                  THIS CLASS ACTION AND COLLECTIVE RELIEF WAIVER IS AN ESSENTIAL PART OF THIS “DISPUTE RESOLUTION” SECTION, AND IF IT IS DEEMED INVALID OR UNENFORCEABLE WITH RESPECT TO A PARTICULAR CLAIM OR DISPUTE, NEITHER YOU NOR BODEGA IS ENTITLED TO ARBITRATION OF SUCH CLAIM OR DISPUTE. NOTWITHSTANDING THE FOREGOING, IF A COURT DETERMINES THAT THE CLASS ACTION AND COLLECTIVE RELIEF WAIVER IS NOT ENFORCEABLE AS TO A PARTICULAR CLAIM OR REQUEST FOR RELIEF OR A REQUEST FOR PUBLIC INJUNCTIVE RELIEF AND ALL APPEALS FROM THAT DECISION HAVE BEEN EXHAUSTED (OR THE DECISION IS OTHERWISE FINAL), THEN THE PARTIES AGREE THAT THAT PARTICULAR CLAIM OR REQUEST FOR RELIEF MAY PROCEED IN COURT BUT SHALL BE STAYED PENDING ARBITRATION OF THE REMAINING CLAIMS AND REQUESTS FOR RELIEF.
                </p>
                <p className="mb-2">
                  WAIVER AND SEVERABILITY
                  Any waiver by Bodega of any term of this Agreement must be in writing. Except as otherwise provided in this Agreement (see “Dispute Resolution” section III), if any portion of this Agreement is found to be void, invalid, or otherwise unenforceable, then that portion shall be deemed to be severable and, if possible, modified or replaced by a valid, enforceable provision that matches the intent of the original provision as closely as possible. The remainder of this Agreement shall continue to be enforceable and valid according to the terms contained herein.
                </p>
                <p className="mb-2">
                  ENTIRE AGREEMENT
                  This Agreement, together with any amendments and any additional agreements you may enter into with Bodega in connection with the Platform and the Services hereunder, shall constitute the entire agreement between you and Bodega concerning the Platform, any orders placed through the Platform, and the Services hereunder.
                </p>
                <p className="mb-2">
                  CONTACT
                  If you have any questions regarding this Agreement or the Platform, please visit our "Help" page for answers and our contact information.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button onClick={preHandleClose} className="text-blue-500 hover:underline cursor-pointer text-xs">
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
  handleClose: PropTypes.func.isRequired,
}; */

import React from 'react';
import PropTypes from 'prop-types';

export default function TermsModal({ show, preHandleClose }) {
  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>

          <div className="bg-white w-full max-w-2xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-blue-400 p-2 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">Bodega+ Terms and Conditions for Shops and Restaurants</h2>
            </div>
            <div className="p-2 overflow-auto max-h-[70vh]">
              <div className="text-xs text-gray-700">
                <h2 className="text-lg font-semibold mb-2">Effective Date: 09/15/2024</h2>
                <p className="mb-2">
                  By signing up and using the services provided by Bodega+ (the "Platform"), the Partner (the "Shop/Restaurant") agrees to the following terms and conditions:
                </p>
                <h3 className="text-sm font-semibold mb-2">1. Introduction</h3>
                <p className="mb-2">
                  These Terms and Conditions ("Agreement") govern the use of Bodega+ services by the Shop/Restaurant. By creating an account and using the platform, the Partner agrees to be bound by these terms.
                </p>
                <h3 className="text-sm font-semibold mb-2">2. Services Provided by Bodega+</h3>
                <p className="mb-2">
                  Bodega+ offers a platform for shops and restaurants to:
                </p>
                <ul className="list-disc pl-5 mb-2">
                  <li>List products, menus, and services for customers to place Pick-Up, Discount (Order-In/Dine-In), and Delivery orders.</li>
                  <li>Promote their business through free marketing across social media platforms and within the app.</li>
                  <li>Access the Bodega+ dashboard for order management, sales analytics, and customer insights.</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">3. Fees</h3>
                <p className="mb-2">
                  Bodega+ will apply the following fees for orders processed through the platform:
                </p>
                <ul className="list-disc pl-5 mb-2">
                  <li>10% fee for Pick-Up and Discount (Order-In/Dine-In) orders.</li>
                  <li>20% fee for Delivery orders.</li>
                  <li>Fees for payment processing and other applicable costs will be deducted before the final payout to the Shop/Restaurant.</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">4. Payment Terms</h3>
                <p className="mb-2">
                  Payments for orders completed through Bodega+ will be transferred to the Shop/Restaurant’s designated bank account on a monthly basis, specifically on the first day of each month, minus the applicable fees and costs.
                </p>
                <p className="mb-2">
                  The Shop/Restaurant is responsible for providing accurate payment information and keeping it up to date.
                </p>
                <p className="mb-2">
                  Disputes or complaints may result in temporary withholding of payments until resolved.
                </p>
                <h3 className="text-sm font-semibold mb-2">5. Partner Responsibilities</h3>
                <p className="mb-2">
                  By agreeing to these terms, the Shop/Restaurant commits to:
                </p>
                <ul className="list-disc pl-5 mb-2">
                  <li>Keeping their menu, products, prices, and discount information accurate and up to date on the Bodega+ platform.</li>
                  <li>Fulfilling all orders received through the platform in a timely and professional manner.</li>
                  <li>Maintaining the quality of their products and services as listed on the platform.</li>
                  <li>Complying with all applicable local laws, regulations, and health and safety standards.</li>
                </ul>
                <h3 className="text-sm font-semibold mb-2">6. Use of Platform</h3>
                <p className="mb-2">
                  The Shop/Restaurant is granted a limited, non-exclusive license to use the platform for listing and selling their products.
                </p>
                <p className="mb-2">
                  The Shop/Restaurant agrees not to misuse the platform or engage in any activity that could harm Bodega+, its users, or other partners.
                </p>
                <p className="mb-2">
                  Violations of the platform’s policies or this Agreement may result in suspension or termination of the Partner’s account.
                </p>
                <p className="mb-2">
                  Bodega+ reserves the right to modify or discontinue any feature of the platform at its discretion.
                </p>
                <h3 className="text-sm font-semibold mb-2">7. Marketing and Promotions</h3>
                <p className="mb-2">
                  Bodega+ will provide free marketing support, including exposure on social media and within the app.
                </p>
                <p className="mb-2">
                  The Shop/Restaurant is responsible for managing their own promotions and discounts on the platform.
                </p>
                <p className="mb-2">
                  Bodega+ may feature selected promotions or offers but is not liable for the effectiveness of marketing efforts.
                </p>
                <h3 className="text-sm font-semibold mb-2">8. Customer Service and Dispute Resolution</h3>
                <p className="mb-2">
                  The Shop/Restaurant is responsible for addressing any customer complaints related to their products or services.
                </p>
                <p className="mb-2">
                  Bodega+ may assist in resolving disputes but is not liable for the quality or delivery of the Shop/Restaurant’s products.
                </p>
                <p className="mb-2">
                  In the event of unresolved disputes, Bodega+ may mediate but does not guarantee a resolution.
                </p>
                <h3 className="text-sm font-semibold mb-2">9. Termination of Service</h3>
                <p className="mb-2">
                  The Shop/Restaurant or Bodega+ may terminate this Agreement with 30 days’ notice.
                </p>
                <p className="mb-2">
                  Immediate termination may occur in the case of serious violations of the platform’s policies or fraudulent activities by the Shop/Restaurant.
                </p>
                <p className="mb-2">
                  Upon termination, the Shop/Restaurant must cease using the platform and return any Bodega+ materials or property.
                </p>
                <h3 className="text-sm font-semibold mb-2">10. Limitation of Liability</h3>
                <p className="mb-2">
                  Bodega+ is not responsible for any indirect, incidental, or consequential damages arising from the use of the platform.
                </p>
                <p className="mb-2">
                  The Shop/Restaurant agrees to indemnify and hold harmless Bodega+ from any claims or damages arising from their use of the platform or interactions with customers.
                </p>
                <p className="mb-2">
                  Bodega+ does not guarantee uninterrupted or error-free service and will not be liable for service disruptions.
                </p>
                <h3 className="text-sm font-semibold mb-2">11. Data Protection and Privacy</h3>
                <p className="mb-2">
                  Bodega+ will collect, use, and protect personal data in accordance with its Privacy Policy.
                </p>
                <p className="mb-2">
                  The Shop/Restaurant agrees to comply with applicable data protection laws and regulations.
                </p>
                <p className="mb-2">
                  Data shared with Bodega+ will be used solely for the purpose of providing services and will not be disclosed to third parties without consent, except as required by law.
                </p>
                <h3 className="text-sm font-semibold mb-2">12. Amendments to the Agreement</h3>
                <p className="mb-2">
                  Bodega+ reserves the right to modify these Terms and Conditions at any time. The Shop/Restaurant will be notified of any changes.
                </p>
                <p className="mb-2">
                  Continued use of the platform after notification of changes constitutes acceptance of the updated terms.
                </p>
                <h3 className="text-sm font-semibold mb-2">13. Governing Law</h3>
                <p className="mb-2">
                  This Agreement will be governed by and construed in accordance with the laws of Florida.
                </p>
                <p className="mb-2">
                  Any disputes arising from this Agreement will be resolved in the courts of the State of Florida.
                </p>
                <h3 className="text-sm font-semibold mb-2">14. Contact Information</h3>
                <p className="mb-2">
                  For any questions or concerns regarding this Agreement or the Bodega+ platform, please contact us through the email address provided.
                </p>
                <h3 className="text-sm font-semibold mb-2">15. Acceptance</h3>
                <p className="mb-2">
                  By signing up on the Bodega+ platform, the Shop/Restaurant acknowledges that they have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button onClick={preHandleClose} className="text-blue-500 hover:underline cursor-pointer text-xs">
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

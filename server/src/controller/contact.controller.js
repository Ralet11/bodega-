import { sendContactEmail } from "../functions/sencontactEmail.js";



export const sendEmailContact = async (req, res) => {
    const {name, email, phone, message} = req.body
    try {
        const result = await sendContactEmail(name, email, phone, message);
        if (result.success) {
          res.status(200).json({ success: true, message: 'Email sent successfully' });
        } else {
          res.status(500).json({ success: false, message: 'Error sending email' });
        }
      } catch (error) {
        console.error("Error in /api/send-contact-email:", error);
        res.status(500).json({ success: false, message: 'Error sending email' });
      }

 }

 export const sendContactAppMail = async (req, res) => {
  const {name, email, message} = req.body
  
  try {
    const result = await sendContactEmail(name, email, message);
    if (result.success) {
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Error sending email' });
    }
  } catch (error) {
    console.error("Error in /api/send-contact-email:", error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
 }
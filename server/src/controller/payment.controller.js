import stripe from 'stripe';
import getConnection from "../database.js";

export const tryIntent = async (req, res) => {
    const { finalPrice } = req.body;
    console.log(req.body)

    const secretKey = 'sk_test_51OJV6vCtqRjqS5chtpxR0cKFJLK8jf3WRVchpsfCFZx3JdiyPV0xcHZgYbaJ70XYsmdkssJpHiwdCmEun6X7mThj00IB3NQI0C';
    const stripeInstance = stripe(secretKey);

    try {
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: finalPrice,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            }
        });
  
        res.json({ clientSecret: paymentIntent.client_secret });
        
        
    } catch (e) {
        res.status(400).json({
            error: e.message
           
        });

        console.log(e.message)
    }
};


export const getPayMethods = async (req, res) => {
const conn = await getConnection()
try {
    const payMethods = await conn.query("SELECT * FROM pay_methods")
    res.status(200).json(payMethods)
} catch (error) {
    console.log(error.message)
}
}

export const addPayMethod = async (req, res) => {
    try {
      const { methods, client } = req.body.data;
      console.log(methods, client)
  
     
      if (!methods || !client) {
        return res.status(400).json({ success: false, message: 'Invalid request data' });
      }
  
      const pay_methods = JSON.stringify(methods);
  
      const conn = await getConnection();
  
      try {
       
        const updateQuery = `
          UPDATE clients
          SET pay_methods = ?
          WHERE id = ?;
        `;
  
        const response = await conn.query(updateQuery, [pay_methods, client]);
        res.status(200).json({ success: true, message: 'Pay method added successfully' });
      } catch (error) {
        console.error('Error updating pay method:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  export const removePayMethod = async (req, res) => {
    try {
        console.log()
        const { methodId, client } = req.body.data;
        const conn = await getConnection();

     
        const result = await conn.query("SELECT * FROM clients WHERE id = ?", [client]);
        const methods = JSON.parse(result[0].pay_methods);

       
        const updatedMethods = methods.filter((method) => method !== methodId);
        console.log(updatedMethods, "upmet")
        const response = await conn.query(`
            UPDATE clients
            SET pay_methods = ?
            WHERE id = ?;
        `, [JSON.stringify(updatedMethods), client]);

       
        res.status(200).send(updatedMethods);
    } catch (error) {
       
        console.error("Error removing pay method:", error);
        res.status(500).send("Internal Server Error");
    }
};

/* export const addKeys = async (req, res) => {

    const {}


}
 */
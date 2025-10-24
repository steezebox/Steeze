const { db } = require('../config/firebase');
const { verifyPayment } = require('../config/flutterwave');

exports.buyAurum = async (req, res) => {
  const { transactionId, userId } = req.body;

  try {
    const result = await verifyPayment(transactionId);

    if (result.status === 'success' && result.data.status === 'successful') {
      const amountPaid = result.data.amount; // in NGN
      const walletRef = db.collection('wallets').doc(userId);

      await walletRef.update({
        aurumBalance: admin.firestore.FieldValue.increment(amountPaid)
      });

      res.status(200).json({ message: `${amountPaid} Aurum added to wallet` });
    } else {
      res.status(403).json({ error: 'Payment not verified' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
};
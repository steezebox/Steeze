exports.spendAurum = async (req, res) => {
  const { viewerId, videoId } = req.body;

  try {
    const videoDoc = await db.collection('videos').doc(videoId).get();
    if (!videoDoc.exists) return res.status(404).json({ error: 'Video not found' });

    const { price, creatorId } = videoDoc.data();

    const viewerRef = db.collection('wallets').doc(viewerId);
    const creatorRef = db.collection('wallets').doc(creatorId);

    const viewerWallet = await viewerRef.get();
    if (!viewerWallet.exists) return res.status(404).json({ error: 'Viewer wallet not found' });

    const viewerBalance = viewerWallet.data().aurumBalance;
    if (viewerBalance < price) return res.status(403).json({ error: 'Insufficient Aurum' });

    await viewerRef.update({
      aurumBalance: admin.firestore.FieldValue.increment(-price)
    });

    await creatorRef.update({
      aurumBalance: admin.firestore.FieldValue.increment(price)
    });

    await db.collection('videos').doc(videoId).update({ isPaid: true });

    res.status(200).json({ message: 'Video unlocked', padlock: '🔓' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
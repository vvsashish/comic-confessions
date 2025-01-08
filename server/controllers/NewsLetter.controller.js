import Subscription from "../models/Subscription.model.js";
import sendSubscriptionEmail from "../utils/Mailer.js";

export async function checkNewsLetterSubscription(req, res) {
  const { email } = req.query;

  try {
    const subscription = await Subscription.findOne({ email });
    res.json({ isSubscribed: !!subscription });
  } catch (error) {
    res.json("Server error");
  }
}
export async function subscribeNewsLetter(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).send({ message: "Email is already subscribed" });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    sendSubscriptionEmail(email);
    res.status(200).send("Subscription successful");
  } catch (error) {
    next(error);
  }
}

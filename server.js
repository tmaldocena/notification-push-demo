const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Claves VAPID (Generarlas con web-push)
const publicVapidKey = "BEsp2Ohtz7PUul7D8s0LpwsG1HflEt6CxqgBOl8kz-NXOwPTA53p1UG2JzPmEKGCvsd7lGjEykR-hH50piOdEv4";
const privateVapidKey = "nXc9M_54FerqtFMoo1_eN_GJOPFa8xqEjyHVqpqoJmA";

webPush.setVapidDetails("mailto:tomasmaldocena@gmail.com", publicVapidKey, privateVapidKey);

// Almacenar suscripciones (temporalmente en memoria)
let subscriptions = [];

app.post("/register-subscription", (req, res) => {
  const subscription = req.body.subscription;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Suscripción registrada" });
});

app.post("/send-notification", async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    subscriptions.forEach(subscription =>
      webPush.sendNotification(subscription, payload)
    );
    res.json({ message: "Notificación enviada" });
  } catch (error) {
    console.error("Error al enviar la notificación", error);
    res.status(500).json({ error: "Error al enviar notificación" });
  }
});

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));

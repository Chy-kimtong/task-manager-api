// Require:
const postmark = require("postmark");

// Send an email:
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const sendWelcomeEmail = (email,name)=>{
  client.sendEmail({
    "From": "chy.kimtong19@kit.edu.kh",
    "To": email,
    "Subject": "Thanks for joining in!",
    "HtmlBody": `Welcome to the app, ${name}. Let me know how to get along with the app.`,
    // "TextBody": "Hello from Postmark!",
    "MessageStream": "broadcast"
  })
}

const sendCancelationEmail = (email,name)=>{
  client.sendEmail({
    "From": "chy.kimtong19@kit.edu.kh",
    "To": email,
    "Subject": "Sorry to see you go!",
    "HtmlBody": `Goodbye, ${name}. I hope to see you back sometimes soon`,
    // "TextBody": "Hello from Postmark!",
    "MessageStream": "broadcast"
  })
}
module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}
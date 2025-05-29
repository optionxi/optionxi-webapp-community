// src/lib/email.ts

import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

// Initialize the Brevo API client
const apiInstance = new TransactionalEmailsApi();

// Set the API key correctly
apiInstance.setApiKey(TransactionalEmailsApi.arguments, process.env.BREVO_API_KEY as string);

export async function sendinBlueMailNewRegistration(s_name: string, s_email: string): Promise<void> {
  console.log("Sending the welcome mail...");
  
  const sendSmtpEmail = new SendSmtpEmail();
  
  sendSmtpEmail.templateId = 5;
  sendSmtpEmail.sender = { name: "Benchmate App", email: "info@benchmateapp.com" };
  sendSmtpEmail.replyTo = { name: "Benchmate App", email: "benchmateapp@gmail.com" };
  sendSmtpEmail.to = [{ name: s_name, email: s_email }];
  sendSmtpEmail.params = { USERNAME: s_name };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Welcome mail successfully sent to", s_email);
    // console.log(data);
  } catch (error) {
    console.log("Error while sending transactional template in welcome");
    console.error(error);
  }
}

export async function sendinBlueMailError(appkey: string, errormessage: string): Promise<void> {
  console.log("Sending the error mail...");
  
  const sendSmtpEmail = new SendSmtpEmail();
  
  sendSmtpEmail.subject = "Error in sending mail";
  sendSmtpEmail.htmlContent = '<html><body><h1>Something went wrong while generating email</h1> <br><h3>Error: {{params.bodyMessage}} <br>Applicationkey: {{params.appkey}}</h3></body></html>';
  sendSmtpEmail.sender = { name: "Benchmate App", email: "info@benchmateapp.com" };
  sendSmtpEmail.replyTo = { name: "Btech Devz", email: "betchtraders18@gmail.com" };
  sendSmtpEmail.to = [{ name: "Jibin", email: "jibinvictorjohn191@gmail.com" }];
  sendSmtpEmail.params = { bodyMessage: errormessage, appkey: appkey };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Error mail sent successfully");
    // console.log(data);
  } catch (error) {
    console.log("Error while sending error mail");
    console.error(error);
  }
}
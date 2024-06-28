import transporter from "../../config/nodemailer";

export const sendEmployeeEmail = async (
  email: string,
  password: string,
  employeeId: string,
  default_email: string
) => {
  try {


    const mailOptions = {
        from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Employee Login Details",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMPLOYEE LOGIN CREDENTIALS </title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #007BFF;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .content h2 {
            margin: 0;
            color: #333;
        }
        .content p {
            margin: 20px 0;
            color: #777;
        }
        .btn {
            background-color: #007BFF;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
        }
        .footer {
            margin-top: 20px;
            padding: 10px;
            background-color: #f4f4f4;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EMPLOYEE LOGIN CREDENTIALS</h1>
        </div>
        <div class="content">
            <h2>Hello,</h2>
            <p>Congratulations you have been successfully onboarded, We look forward to working with you.</p>
            <p>This is your password:</p>
            <h1 style=" font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 32px; color: #black;">${password}</h1>
            <p> Use this is email ${default_email} to login</p>
            <p> This is your Employee ID: ${employeeId} </p>
        </div>
        <div class="footer" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
            <p>If you have any questions, please contact our support team.</p>
                      <p>To stop receiving these emails, you can <a href="#" target="_blank">unsubscribe</a> at any time.</p>
            <p>Edo Tech Park, Benin City, Edo state</p>
        </div>
    </div>
  


 
</body>
</html>
`,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log(`${info.messageId}`);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

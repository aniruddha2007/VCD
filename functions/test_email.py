import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

def send_email(subject, recipient_email, html_content, image_path=None):
    # Email configuration
    custom_email = "ani@aniruddhapandit.com"
    icloud_email = "aniruddha234@icloud.com"
    app_specific_password = "eydi-jadf-afru-gaed"
    smtp_server = 'smtp.mail.me.com'
    smtp_port = 587

    # Create message container
    msg = MIMEMultipart('related')
    msg['From'] = custom_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # Add HTML content to email
    msg.attach(MIMEText(html_content, 'html'))

    # Add image attachment if provided
    if image_path:
        with open(image_path, 'rb') as fp:
            img = MIMEImage(fp.read())
            img.add_header('Content-Disposition', 'attachment', filename=image_path)
            msg.attach(img)

    # Establish connection to SMTP server and send email
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(icloud_email, app_specific_password)
        server.sendmail(custom_email, recipient_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print("Error sending email:", str(e))

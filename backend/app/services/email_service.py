import boto3
from botocore.exceptions import ClientError

from app.configs.Environment import get_environment_variables


# Email service.
# it uses AWS SES to send emails when EMAIL_DRIVER env variable is equal to "ses"
# else, it mocks email sending printing messages on console
class EmailService:
    def __init__(self):
        _envs = get_environment_variables()

        self._sender_email = _envs.EMAIL_SENDER

        if _envs.EMAIL_DRIVER == "ses":
            self._service = _SesEmailService(
                self._sender_email,
                _envs.AWS_REGION,
                _envs.AWS_SES_ACCESS_KEY,
                _envs.AWS_SES_SECRET_KEY,
            )
        else:
            self._service = _LocalEmailService()

    def send_email(self, to_email: str, subject: str, message: str):
        try:
            response = self._service.send_email(to_email, subject, message)
            print(response)
            return response
        except ClientError as e:
            print(e)
            raise Exception(f"Email sending failed: {str(e)}")
        except Exception as e:
            print(e)


class _SesEmailService:
    def __init__(self, sender_email, region, access_key, secret):
        self._sender_email = sender_email
        self._client = boto3.client(
            "ses",
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret,
        )

    def send_email(self, to_email: str, subject: str, message: str):
        try:
            response = self._client.send_email(
                Source=self._sender_email,
                Destination={"ToAddresses": [to_email]},
                Message={
                    "Subject": {"Data": subject},
                    "Body": {"Text": {"Data": message}},
                },
            )
            return response
        except ClientError as e:
            raise Exception(f"Email sending failed: {str(e)}")


class _LocalEmailService:
    def send_email(self, to_email: str, subject: str, message: str):
        print("Email to: " + to_email)
        print("Subject: " + subject)
        print("Message: " + message)
        return {"status": "Local driver configured, email not sent"}

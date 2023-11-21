from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
import boto3

logger = Logger()


def handler(event: dict, context: LambdaContext):
    logger.info('Starting on_event()')
    logger.info({"event": event})
    logger.info({"context": context})

    if event['RequestType'] == 'Create' or event['RequestType'] == 'Update':
        set_iam_password_policy()
        logger.info('IAM password policy update completion.')
    elif event['RequestType'] == 'Delete':
        logger.info(
            'deletion of CloudFormation stack has no impact on current password policy')


def set_iam_password_policy():
    iam = boto3.client('iam')
    iam.update_account_password_policy(
        AllowUsersToChangePassword=True,
        HardExpiry=False,
        MinimumPasswordLength=9,
        MaxPasswordAge=90,
        PasswordReusePrevention=3,
        RequireLowercaseCharacters=True,
        RequireNumbers=True,
        RequireSymbols=True,
        RequireUppercaseCharacters=True,
    )

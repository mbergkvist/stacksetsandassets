import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  Capability,
  StackSet,
  StackSetStack,
  StackSetStackProps,
  StackSetTarget,
  StackSetTemplate,
} from 'cdk-stacksets';
import { Construct } from 'constructs';

export class MyStackSetStack extends StackSetStack {
  constructor(scope: Construct, id: string, props: StackSetStackProps = {}) {
    super(scope, id, props);

    // Uncomment this for the "local path error" with NodejsFunction
    // new NodejsFunction(this, 'MyNodejsFunction', {
    //   entry: './src/lambdas/MyNodejsFunction.ts',
    // });

    // Uncomment this for the "S3 key mismatch error" with PythonFunction
    // new PythonFunction(this, 'onEventHandlerFunction', {
    //   entry: './src/lambdas/iamPasswordPolicy',
    //   runtime: lambda.Runtime.PYTHON_3_11,
    // });
  }
}

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Assets', {
      bucketName: 'cdkstacket-asset-bucket-123',
    });

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:Get*', 's3:List*'],
        resources: [bucket.arnForObjects('*'), bucket.bucketArn],
        principals: [new iam.OrganizationPrincipal('o-abcd1234')],
      }),
    );

    const stackSetStack = new MyStackSetStack(this, 'MyStackSetStack', {
      assetBucket: bucket,
    });

    new StackSet(this, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['eu-central-1'],
        accounts: ['123456789012'],
      }),
      capabilities: [Capability.NAMED_IAM],
      template: StackSetTemplate.fromStackSetStack(stackSetStack),
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

new MyStack(app, 'cdk-stacksets-demo-dev', { env: devEnv });

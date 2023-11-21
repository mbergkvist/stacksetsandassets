# Stacksets and assets

> CDK application to reproduce current issues with stacksets and assets.

## Pre-requisites

```shell
npm ci
```

Uncomment either of the examples in [bin/stacksetsandassets.ts](./bin/stacksetsandassets.ts).

## NodejsFunction

> Incorrect asset path is picked up when running `cdk list`.

```shell
npm run cdk list
```

it fails with

```text
Error: Cannot find asset at /PROJECT_ROOT_PATH/cdk.out/PROJECT_ROOT_PATH
```

where the `PROJECT_ROOT_PATH` should not be appended to the path.

## RustFunction

> Using `RustFunction` yields the exact same error as with the `NodejsFunction` when running `npm run cdk list`.

An example is not included for now for brevity.

## PythonFunction

> The S3 key for the lambda code and the S3 key for the uploaded lambda does not match when running `npm run cdk synth -- --all -q`.

There are two templates generated: `cdk-stacksets-demo-dev.template.json` deploying the stackset, asset bucket, uploading assets etc, and `cdkstacksetsdemodevMyStackSetStackCD0A0BC9.stackset.template.json` which is the actual template deployed by the stackset.

The `cdk-stacksets-demo-dev.assets.json` file contains the following path for the `fdb58149f0cd9ec18f566cd0cb7fcdf8023f8747775ad32489d471dfed00b2c8` asset:

```shell
asset.fdb58149f0cd9ec18f566cd0cb7fcdf8023f8747775ad32489d471dfed00b2c8.e646b3d0494cbfe171374df02658b42fe2abef190e51597edc5390a8c9301170
```

and it's uploaded to S3 with the key `fdb58149f0cd9ec18f566cd0cb7fcdf8023f8747775ad32489d471dfed00b2c8.zip`, i.e. the first hash in the asset path.

However, the `Code::S3Key` for the `onEventHandlerFunction571E82BB` is `e646b3d0494cbfe171374df02658b42fe2abef190e51597edc5390a8c9301170.zip`, i.e. the second hash in the asset path.

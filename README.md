# Stacksets and NodejsFunction assets

This is an example application to deploy a NodejsFunction using a Stackset. When running it with

```shell
npm run cdk list
```

it fails with

```text
Error: Cannot find asset at /PROJECT_ROOT_PATH/cdk.out/PROJECT_ROOT_PATH
```

where the `PROJECT_ROOT_PATH` should not be appended to the path.

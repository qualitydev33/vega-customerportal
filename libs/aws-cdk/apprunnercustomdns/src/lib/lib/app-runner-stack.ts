import * as cdk from 'aws-cdk-lib';
import { CfnOutput, IgnoreMode, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as cdkawsapprunner from 'aws-cdk-lib/aws-apprunner';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

export class AppRunnerStack extends cdk.Stack {
    constructor(scope: Construct, id: string, serviceName: string, dockerfile: string, serviceArnExportName: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const appRunnerECRAccessRole = this.node.tryGetContext('appRunnerECRAccessRole') as string;

        Tags.of(scope).add('owner', 'Engineering');
        Tags.of(scope).add('environment', 'Development');
        Tags.of(scope).add('application', 'Gemini');
        Tags.of(scope).add('classification', 'Public');
        Tags.of(scope).add('creator', 'Mike G');
        Tags.of(scope).add('automation', 'AWS CDK');

        const imageAsset = new DockerImageAsset(this, 'gemini-portal-ui', {
            ignoreMode: IgnoreMode.DOCKER,
            file: dockerfile,
            directory: path.join(__dirname, '../../../../../../'),
        });

        const appRunner = new cdkawsapprunner.CfnService(this, 'gemini-portal-app-runner', {
            serviceName: serviceName,
            sourceConfiguration: {
                autoDeploymentsEnabled: true,
                imageRepository: { imageIdentifier: imageAsset.imageUri, imageRepositoryType: 'ECR', imageConfiguration: { port: '80' } },
                authenticationConfiguration: { accessRoleArn: appRunnerECRAccessRole },
            },
        });

        const appRunnerArnOutput = new CfnOutput(this, serviceArnExportName, {
            exportName: serviceArnExportName,
            value: appRunner.attrServiceArn,
            description: "The gemini customer portal app runner's service arn. Used for aws cli domain association",
        });
    }
}

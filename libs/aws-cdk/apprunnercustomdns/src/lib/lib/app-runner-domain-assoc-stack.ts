import * as cdk from 'aws-cdk-lib';
import { Duration, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RecordTarget } from 'aws-cdk-lib/aws-route53';
import {
    AppRunnerClient,
    AssociateCustomDomainCommand,
    CertificateValidationRecord,
    CustomDomain,
    DescribeCustomDomainsCommand,
    DescribeCustomDomainsCommandOutput,
} from '@aws-sdk/client-apprunner';

export class AppRunnerDomainAssocStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const domainName = this.node.tryGetContext('domain_name');
        const appRunnerArn = this.node.tryGetContext('app_runner_arn');
        const dnsAutomationRole = this.node.tryGetContext('dnsAutomationRole');
        const parentHostedZoneName = this.node.tryGetContext('parentHostedZoneName');

        /*
          Handle associating domain with app runner endpoint using aws sdk
        */

        const appRunnerClient = new AppRunnerClient({ region: 'us-west-2' });

        const associateCustomDomainCommand = new AssociateCustomDomainCommand({
            DomainName: domainName,
            ServiceArn: appRunnerArn,
            EnableWWWSubdomain: false,
        });

        const describeCustomDomainsCommand = new DescribeCustomDomainsCommand({
            ServiceArn: appRunnerArn,
        });

        let certRecords: CertificateValidationRecord[] | undefined = undefined;
        let describeCustomDomainResponse: DescribeCustomDomainsCommandOutput | undefined = undefined;
        let customDomain: CustomDomain | undefined = undefined;

        async function main() {
            describeCustomDomainResponse = await appRunnerClient.send(describeCustomDomainsCommand);
            customDomain = describeCustomDomainResponse.CustomDomains?.find((x) => x.DomainName === domainName);
            if (customDomain === undefined) {
                const resp = await appRunnerClient.send(associateCustomDomainCommand);
            }

            while (certRecords === undefined) {
                describeCustomDomainResponse = await appRunnerClient.send(describeCustomDomainsCommand);
                customDomain = describeCustomDomainResponse.CustomDomains?.find((x) => x.DomainName === domainName);
                certRecords = customDomain?.CertificateValidationRecords;

                // eslint-disable-next-line @typescript-eslint/no-empty-function
                sleep(10000).then(() => {});
            }
        }

        /*
          Build out route 53 based off of information returned from above
        */

        main().then(() => {
            Tags.of(scope).add('owner', 'Engineering');
            Tags.of(scope).add('environment', 'Development');
            Tags.of(scope).add('application', 'Gemini');
            Tags.of(scope).add('classification', 'Public');
            Tags.of(scope).add('creator', 'Mike G');
            Tags.of(scope).add('automation', 'AWS CDK');

            const subZone = new cdk.aws_route53.PublicHostedZone(this, 'Gemini-UI-SubZone', {
                zoneName: domainName,
            });

            const delegationRole = cdk.aws_iam.Role.fromRoleArn(this, 'Gemini-UI-DelegationRole', dnsAutomationRole);

            const crossAccountZoneDelegationRecord = new cdk.aws_route53.CrossAccountZoneDelegationRecord(this, 'Gemini-UI-AppRunner-delegate', {
                delegatedZone: subZone,
                parentHostedZoneName: parentHostedZoneName,
                delegationRole,
                ttl: Duration.seconds(300),
            });

            const cnameGeminiUIDNSRecord = new cdk.aws_route53.ARecord(this, `CnameGeminiUIDNSRecord`, {
                recordName: domainName,
                target: RecordTarget.fromAlias({
                    bind: () => ({
                        dnsName: describeCustomDomainResponse!.DNSTarget!,
                        hostedZoneId: 'Z02243383FTQ64HJ5772Q', //well known for app runner https://docs.aws.amazon.com/general/latest/gr/apprunner.html
                    }),
                }),
                zone: subZone,
            });

            const cnameGeminiUICertValidRecord1 = new cdk.aws_route53.CnameRecord(this, `CnameGeminiUICertValidRecord1`, {
                domainName: certRecords![0].Value!,
                recordName: certRecords![0].Name!,
                zone: subZone,
            });

            const cnameGeminiUICertValidRecord2 = new cdk.aws_route53.CnameRecord(this, `CnameGeminiUICertValidRecord2`, {
                domainName: certRecords![1].Value!,
                recordName: certRecords![1].Name!,
                zone: subZone,
            });
        });

        function sleep(time: number) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
    }
}

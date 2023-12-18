#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppRunnerStack } from '../lib/app-runner-stack';
import { AppRunnerDomainAssocStack } from '../lib/app-runner-domain-assoc-stack';

const app = new cdk.App();

const stackBuildTarget = process.env['STACK_NAME'];

switch (stackBuildTarget) {
    case 'CustomerPortalStack':
        new AppRunnerStack(app, 'CustomerPortalStack', 'gemini-customer-portal-ui', 'customerportal.Dockerfile', 'gemini-portal-app-runner-arn', {});
        break;
    case 'AdminPortalStack':
        new AppRunnerStack(app, 'AdminPortalStack', 'gemini-admin-ui', 'adminui.Dockerfile', 'admin-portal-app-runner-arn', {});
        break;
    case 'CustomerPortalDomainStack':
        new AppRunnerDomainAssocStack(app, 'CustomerPortalDomainStack', {});
        break;
    case 'AdminPortalDomainStack':
        new AppRunnerDomainAssocStack(app, 'AdminPortalDomainStack', {});
        break;
}

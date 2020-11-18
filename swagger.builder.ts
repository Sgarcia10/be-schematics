import { DocumentBuilder, SwaggerModule, OpenAPIObject, ApiTags } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app/app.module';
import * as pjson from './package.json';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

// Project's info
const TITLE = 'Rappi Pay example';
const DESCRIPTION = 'Rappi Pay API description';
const VERSION = pjson.version;
const HOST = 'services.dev-k8s.rappipay.com';
const BASE_PATH = 'rpp-schematics';

// Owner (path in ePub)
const GROUP = 'example'; // e.g. growth, core, basics, etc...
const COMPONENT = 'schematics'; // name of the solution e.g. kyc, parking, waiting-list
const DOMAIN = 'ms'; // [ms, or, api]

// ePub base url
const HUB_URL = 'https://epub.dev-k8s.rappipay.com/';

// Project's name in package.json
const API = pjson.name;

export class SwaggerBuilder {
  private static OPTIONS = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion(VERSION)
    .addBearerAuth()
    .build();

  static setup(app: INestApplication) {
    const document = SwaggerModule.createDocument(app, this.OPTIONS);
    SwaggerModule.setup('api', app, document);
  }

  static async createJson() {
    const app = await NestFactory.create(AppModule, {
      logger: false
    });
    const document = SwaggerModule.createDocument(app, this.OPTIONS);
    const { title, description, version } = this.OPTIONS.info;
    const swggerJson: SwaggerHubDef = {
      openapi: document.openapi,
      info: {
        title,
        description,
        version
      },
      host: HOST,
      basePath: BASE_PATH,
      paths: document.paths,
      components: { ...document.components },
      tags: [{ description: 'META-INFO', name: 'API' }],
      api: API,
      owner: this.buildOwner(GROUP, COMPONENT, DOMAIN),
      hubUrl: HUB_URL
    };
    const data = JSON.stringify(swggerJson, null, 2);
    fs.mkdirSync(path.resolve('dist'), { recursive: true });
    fs.writeFileSync(path.resolve('dist', 'swagger.json'), data);
  }

  static buildOwner(group: string, component: string, domain: string): string {
    return [group, component, domain].join('.');
  }
}

interface SwaggerHubDef {
  openapi: string;
  host: string;
  basePath: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  paths: Record<string, PathItemObject>;
  tags: Array<{ description?: string; name: string }>;
  api: string;
  owner: string;
  hubUrl: string;
  components?: any;
  securityDefinitions?: any;
}

SwaggerBuilder.createJson();

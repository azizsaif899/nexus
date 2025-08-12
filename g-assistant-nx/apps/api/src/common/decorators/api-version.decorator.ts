import { SetMetadata } from '@nestjs/common';

export const API_VERSION_KEY = 'apiVersion';
export const ApiVersion = (version: string) => SetMetadata(API_VERSION_KEY, version);

export const DEPRECATED_KEY = 'deprecated';
export const Deprecated = (deprecationDate?: string, alternativeEndpoint?: string) => 
  SetMetadata(DEPRECATED_KEY, { deprecationDate, alternativeEndpoint });

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
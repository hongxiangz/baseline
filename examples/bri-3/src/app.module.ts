import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './bri/auth/auth.module';
import { DidJwtAuthGuard } from './bri/auth/guards/didJwt.guard';
import { AuthzModule } from './bri/authz/authz.module';
import { AuthzGuard } from './bri/authz/guards/authz.guard';
import { CommunicationModule } from './bri/communication/communication.module';
import { SubjectModule } from './bri/identity/bpiSubjects/subjects.module';
import { IdentityModule } from './bri/identity/identity.module';
import { TransactionModule } from './bri/transactions/transactions.module';
import { WorkgroupsModule } from './bri/workgroup/workgroup.module';
import { ZeroKnowledgeProofModule } from './bri/zeroKnowledgeProof/zeroKnowledgeProof.module';
import { EncryptionModule } from './shared/encryption/encryption.module';
import { LoggingModule } from './shared/logging/logging.module';

@Module({
  imports: [
    IdentityModule,
    WorkgroupsModule,
    TransactionModule,
    CommunicationModule,
    ZeroKnowledgeProofModule,
    LoggingModule,
    EncryptionModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
    AuthzModule,
    SubjectModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: DidJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
  ],
})
export class AppModule {}

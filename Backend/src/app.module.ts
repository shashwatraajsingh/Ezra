import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentDetail } from './students/entities/student-detail.entity';

@Module({
  imports: [
    // ── 1. Config ──────────────────────────────────────────────────────────
    // Makes the .env file available globally; validates on startup.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── 2. Database ────────────────────────────────────────────────────────
    // forRootAsync lets us inject ConfigService so values come from .env,
    // not from hard-coded strings scattered across the codebase.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'secret'),
        database: config.get<string>('DB_NAME', 'ezra_db'),
        entities: [StudentDetail],
        migrations: ['dist/migrations/*.js'],
        synchronize: false, // Never true in production — use migrations.
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // ── 3. Feature modules ─────────────────────────────────────────────────
    TypeOrmModule.forFeature([StudentDetail]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

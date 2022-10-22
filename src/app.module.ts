import { Module } from "@nestjs/common"
import { UsersModule } from "./users/users.module"
import { RolesModule } from "./roles/roles.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SequelizeModule } from "@nestjs/sequelize"
import { getSequelizeConfig } from "./config/db.config"
import { AuthModule } from "./auth/auth.module"

@Module({
	imports: [
		ConfigModule.forRoot(),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getSequelizeConfig,
		}),
		UsersModule,
		RolesModule,
		AuthModule,
	],
})
export class AppModule {}

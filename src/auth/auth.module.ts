import { forwardRef, Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UsersModule } from "../users/users.module"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { getJwtConfig } from "../config/jwt.config"
import { JwtStrategy } from "./strategies/auth.strategy"
import { PassportModule } from "@nestjs/passport"

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		ConfigModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
		forwardRef(() => UsersModule),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}

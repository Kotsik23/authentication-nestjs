import { forwardRef, Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { SequelizeModule } from "@nestjs/sequelize"
import { User } from "./users.model"
import { UserRoles } from "../roles/user-roles.model"
import { RolesModule } from "../roles/roles.module"
import { Role } from "../roles/roles.model"
import { AuthModule } from "../auth/auth.module"

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [
		SequelizeModule.forFeature([User, UserRoles, Role]),
		RolesModule,
		forwardRef(() => AuthModule),
	],
	exports: [UsersService],
})
export class UsersModule {}

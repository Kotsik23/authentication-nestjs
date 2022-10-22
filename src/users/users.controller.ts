import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { User } from "./users.model"
import { ActionRoleDto } from "./dto/action-role.dto"
import { BanUserDto } from "./dto/ban-user.dto"
import { CheckRoles } from "../decorators/check-roles.decorator"
import { Auth } from "../auth/guards/auth.guard"

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(createUserDto)
	}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.usersService.getAllUsers()
	}

	@Get(":id")
	getUserById(@Param("id") id: string): Promise<User> {
		return this.usersService.getUserById(+id)
	}

	@Patch(":id")
	updateUser(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto
	): Promise<User> {
		return this.usersService.updateUser(+id, updateUserDto)
	}

	@Delete(":id")
	removeUser(@Param("id") id: string): Promise<number> {
		return this.usersService.removeUser(+id)
	}

	@Patch("role/:action")
	async actionRole(
		@Param("action") action: string,
		@Body() dto: ActionRoleDto
	): Promise<ActionRoleDto> {
		return await this.usersService.actionRole(action, dto)
	}

	@Auth()
	@CheckRoles("ADMIN")
	@Patch("ban/:userId")
	async ban(@Param("userId") userId: string, @Body() dto: BanUserDto): Promise<User> {
		return await this.usersService.ban(+userId, dto)
	}

	@Patch("unban/:userId")
	async unBan(@Param("userId") userId: string): Promise<User> {
		return await this.usersService.unBan(+userId)
	}
}

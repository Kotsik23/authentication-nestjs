import { Body, Controller, Get, Param, Post, ValidationPipe } from "@nestjs/common"
import { RolesService } from "./roles.service"
import { Role } from "./roles.model"
import { CreateRoleDto } from "./dto/create-role.dto"

@Controller("roles")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	getAllRoles(): Promise<Role[]> {
		return this.rolesService.getAllRoles()
	}

	@Get(":name")
	async getRoleByName(@Param("name") name: string): Promise<Role> {
		return await this.rolesService.getRoleByName(name)
	}

	@Post()
	async createRole(@Body(new ValidationPipe()) dto: CreateRoleDto): Promise<Role> {
		return await this.rolesService.createRole(dto)
	}
}

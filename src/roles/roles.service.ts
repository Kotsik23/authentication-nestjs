import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Role } from "./roles.model"
import { CreateRoleDto } from "./dto/create-role.dto"

@Injectable()
export class RolesService {
	constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {}

	async getAllRoles(): Promise<Role[]> {
		return await this.roleRepository.findAll()
	}

	async getRoleByName(name: string): Promise<Role> {
		const role = await this.roleRepository.findOne({
			where: { name: name.toUpperCase() },
		})

		if (!role) {
			throw new NotFoundException("This role doesn't exists")
		}

		return role
	}

	async createRole(dto: CreateRoleDto): Promise<Role> {
		const payload: CreateRoleDto = {
			name: dto.name.toUpperCase(),
		}

		const role = await this.roleRepository.findOne({ where: { name: payload.name } })

		if (role) {
			throw new BadRequestException("This role is already exists")
		}

		return await this.roleRepository.create(payload)
	}
}

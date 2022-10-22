import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { User } from "./users.model"
import { InjectModel } from "@nestjs/sequelize"
import { RolesService } from "../roles/roles.service"
import { ActionRoleDto } from "./dto/action-role.dto"
import { Role } from "../roles/roles.model"
import { ActionRolesEnum } from "../config/action-roles"
import { BanUserDto } from "./dto/ban-user.dto"

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User) private readonly userRepository: typeof User,
		private readonly roleService: RolesService
	) {}

	async createUser(dto: CreateUserDto): Promise<User> {
		const user = await this.userRepository.create(dto)
		const role = await this.roleService.getRoleByName("USER")
		await user.$set("roles", [role.id])

		user.roles = [role]
		return await user.save()
	}

	async getAllUsers(): Promise<User[]> {
		return await this.userRepository.findAll({
			include: {
				model: Role,
				attributes: ["id", "name"],
				through: {
					attributes: [],
				},
			},
		})
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findByPk(id, {
			include: {
				model: Role,
				attributes: ["id", "name"],
				through: {
					attributes: [],
				},
			},
		})

		if (!user) {
			throw new NotFoundException("Such user doesn't exists")
		}

		return user
	}

	async getUserByEmail(email: string): Promise<User> {
		return await this.userRepository.findOne({
			where: { email },
			include: { all: true },
		})
	}

	async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
		const user = await this.getUserById(id)

		return await user.update({
			...user,
			...dto,
		})
	}

	async removeUser(id: number): Promise<number> {
		return await this.userRepository.destroy({
			where: { id },
		})
	}

	async actionRole(action: string, dto: ActionRoleDto): Promise<ActionRoleDto> {
		const user = await this.userRepository.findByPk(dto.userId)
		const role = await this.roleService.getRoleByName(dto.name)

		if (user && role) {
			if (action.toLowerCase() === "add") {
				await user.$add("roles", [role.id])
			} else if (action.toLowerCase() === "remove") {
				await user.$remove("roles", [role.id])
			} else {
				throw new BadRequestException(
					`Incorrect action. Possible values: [${Object.values(ActionRolesEnum).join(
						", "
					)}]`
				)
			}
			return dto
		}

		throw new NotFoundException("User or role doesn't exists")
	}

	async ban(userId: number, dto: BanUserDto): Promise<User> {
		const user = await this.getUserById(userId)

		user.isBanned = true
		user.banReason = dto.banReason

		return await user.save()
	}

	async unBan(userId: number): Promise<User> {
		const user = await this.getUserById(userId)

		user.isBanned = false
		user.banReason = null

		return await user.save()
	}

	async setRefreshToken(userId: number, refreshToken: string): Promise<User> {
		const user = await this.getUserById(userId)

		user.refreshToken = refreshToken

		return await user.save()
	}

	async removeRefreshToken(userId: number): Promise<User> {
		const user = await this.getUserById(userId)

		user.refreshToken = null

		return await user.save()
	}
}

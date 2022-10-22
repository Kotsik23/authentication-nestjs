import { BelongsToMany, Column, Table, Model, DataType } from "sequelize-typescript"
import { Role } from "../roles/roles.model"
import { UserRoles } from "../roles/user-roles.model"

@Table({ tableName: "users" })
export class User extends Model<User> {
	@Column
	username: string

	@Column({ unique: true })
	email: string

	@Column
	password: string

	@Column({ defaultValue: false })
	isBanned: boolean

	@Column
	banReason: string

	@Column({ type: DataType.TEXT, allowNull: true })
	refreshToken: string

	@BelongsToMany(() => Role, () => UserRoles)
	roles: Role[]
}

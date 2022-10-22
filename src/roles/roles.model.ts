import { BelongsToMany, Column, Model, Table } from "sequelize-typescript"
import { User } from "../users/users.model"
import { UserRoles } from "./user-roles.model"

@Table({ tableName: "roles" })
export class Role extends Model<Role> {
	@Column
	name: string

	@BelongsToMany(() => User, () => UserRoles)
	users: User[]
}

import { Column, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "../users/users.model"
import { Role } from "./roles.model"

@Table({ tableName: "user_roles", timestamps: false })
export class UserRoles extends Model<UserRoles> {
	@ForeignKey(() => User)
	@Column
	userId: number

	@ForeignKey(() => Role)
	@Column
	roleId: number
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositoryTO } from '../../infrastructure/users.repository.to';

export class DeleteUserCommand {
  constructor(
    public id: string,
  ) {
  }

}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly usersRepositoryTO: UsersRepositoryTO
  ) {

  }

  async execute(command: DeleteUserCommand) {
    const deleteUser = await this.usersRepositoryTO.deleteUserById(command.id);
    return deleteUser;
  }
}

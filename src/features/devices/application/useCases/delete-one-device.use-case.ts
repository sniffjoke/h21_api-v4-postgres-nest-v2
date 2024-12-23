import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TokensService } from '../../../tokens/application/tokens.service';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { TokensRepository } from '../../../tokens/infrastructure/tokens.repository';

export class DeleteOneDeviceCommand {
  constructor(
    public bearerHeaderR: string,
    public deviceId: string
  ) {
  }

}

@CommandHandler(DeleteOneDeviceCommand)
export class DeleteOneDeviceUseCase
  implements ICommandHandler<DeleteOneDeviceCommand> {
  constructor(
    private readonly tokensService: TokensService,
    private readonly devicesRepository: DevicesRepository,
    private readonly tokensRepository: TokensRepository
  ) {

  }

  async execute(command: DeleteOneDeviceCommand) {
    const token = this.tokensService.getTokenFromCookie(command.bearerHeaderR);
    const validateToken: any = this.tokensService.validateRefreshToken(token);
    if (!validateToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const findToken = await this.tokensRepository.findToken({ deviceId: command.deviceId });
    if (validateToken._id !== findToken?.userId) {
      throw new ForbiddenException('Not your device');
    }
    const findSession = await this.devicesRepository.findDeviceByDeviceId({ deviceId: command.deviceId });
    await this.devicesRepository.deleteDeviceByDeviceId({ deviceId: command.deviceId });
    const updateTokensInfo = await this.tokensRepository.updateStatusTokensInDb({ deviceId: command.deviceId });
    if (!updateTokensInfo) {
      throw new UnauthorizedException('Unknown Error');
    }
    return updateTokensInfo;
  }
}

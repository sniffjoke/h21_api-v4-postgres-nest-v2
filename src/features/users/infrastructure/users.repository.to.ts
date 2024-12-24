import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, EmailConfirmationModel } from '../api/models/input/create-user.dto';
import { UserEntity } from '../domain/user.entity';
import { EmailConfirmationEntity } from '../domain/email-confirmation.entity';


@Injectable()
export class UsersRepositoryTO {
  constructor(
    @InjectRepository(UserEntity) private readonly uRepository: Repository<UserEntity>,
  ) {
  }

  async createUser(userData: CreateUserDto, emailConfirmationDto: EmailConfirmationModel) {
    const user = new UserEntity();
    user.login = userData.login;
    user.email = userData.email;
    user.password = userData.password;
    const newUser = await this.uRepository.save(user);

    const emailConfirmation = new EmailConfirmationEntity();
    emailConfirmation.userId = newUser.id;
    emailConfirmation.confirmationCode = emailConfirmationDto.confirmationCode as string;
    emailConfirmation.expirationDate = emailConfirmationDto.expirationDate as string;
    emailConfirmation.isConfirm = emailConfirmationDto.isConfirm;

    await this.uRepository.manager.save(emailConfirmation);

    return newUser;
  }


  // async updateUserByActivateEmail(userId: any) {
  //   const updateUserInfo = await this.dataSource.query(
  //     `
  //               UPDATE "emailConfirmation"
  //               SET "isConfirm" = true
  //               WHERE "userId" = $1
  //           `,
  //     [userId]);
  //   return updateUserInfo;
  // }
  //
  // async updateUserByResendEmail(userId: number, emailConfirmation: EmailConfirmationModel) {
  //   const updateUserInfo = await this.dataSource.query(
  //     `
  //               UPDATE "emailConfirmation"
  //               SET "expirationDate" = $2, "confirmationCode" = $3
  //               WHERE "userId" = $1
  //           `,
  //     [
  //       userId,
  //       emailConfirmation.expirationDate,
  //       emailConfirmation.confirmationCode,
  //     ]);
  //   return updateUserInfo;
  // }
  //
  async findUserById(id: string) {
    const findedUser = await this.uRepository.findOne(
      { where: { id } },
    );
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }
    return findedUser;
  }
  //
  // async findUserByIdOrNull(id: string) {
  //   const findedUser = await this.dataSource.query('SELECT * FROM users WHERE id = $1', [id]);
  //   if (!findedUser.length) {
  //     return null;
  //   } else return findedUser[0];
  // }
  //
  // async findUserByLogin(login: string) {
  //   const findedUser = await this.dataSource.query('SELECT * FROM users WHERE login = $1', [login]);
  //   if (!findedUser.length) {
  //     throw new UnauthorizedException('User not found');
  //   }
  //   return findedUser[0];
  // }
  //
  // async findUserByEmail(email: string) {
  //   const findedUser = await this.dataSource.query(
  //     `
  //               SELECT u."id", u."email", e."confirmationCode", e."isConfirm"
  //               FROM users u
  //               LEFT JOIN "emailConfirmation" e
  //               ON e."userId" = u."id"
  //               WHERE email = $1
  //           `,
  //     [email],
  //   );
  //   if (!findedUser.length) {
  //     throw new BadRequestException('Email not exists');
  //   }
  //   return findedUser[0];
  // }
  //
  // async findUserByCode(code: string) {
  //   const findedUser = await this.dataSource.query(
  //     `
  //               SELECT u."id", u."login", e."confirmationCode", e."isConfirm"
  //               FROM users u
  //               LEFT JOIN "emailConfirmation" e
  //               ON e."userId" = u."id"
  //               WHERE "confirmationCode" = $1
  //           `,
  //     [code]);
  //   if (!findedUser.length) {
  //     throw new BadRequestException('Code not found');
  //   }
  //   return findedUser[0];
  // }
  //
  async deleteUserById(id: string) {
    const findedUser = await this.findUserById(id);
    return await this.uRepository.delete(
      { id }
    );
  }
  //
  // async checkIsUserExists(login: string, email: string) {
  //   const findedUserByLogin = await this.dataSource.query(
  //     'SELECT * FROM users WHERE "login" = $1',
  //     [login],
  //   );
  //   if (findedUserByLogin.length) {
  //     throw new BadRequestException(
  //       'Login already exists',
  //     );
  //   }
  //   const findedUserByEmail = await this.dataSource.query(
  //     'SELECT * FROM users WHERE "email" = $1',
  //     [email],
  //   );
  //   if (findedUserByEmail.length) {
  //     throw new BadRequestException('Email already exists');
  //   }
  // }

}

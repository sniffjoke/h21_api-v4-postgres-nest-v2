    import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity('tokens')
export class TokenEntity {

    @PrimaryGeneratedColumn()
    id: string

    @PrimaryColumn()
    userId: string;

    @Column()
    deviceId: string;

//TODO iat
    @Column()
    refreshToken: string;

    @Column()
    blackList: boolean;

}

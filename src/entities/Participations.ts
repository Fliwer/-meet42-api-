import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, Index } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";


@Entity('participations')
@Unique(['user', 'event'])// un utilisateur ne peut s'intéresser qu'une seule fois au même événement

export class Participation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;


//@ManyToone (() => User, ...) : plusieurs participations peuvent pointer vers UN SEUL user
// onDelete: 'CASCADE' : si cet utilisateur est supprimé, ses participations le sont aussi, automatiquement
@ManyToOne(() => User, { onDelete: 'CASCADE' })
user!: User;

// même principe, côté événement
@Index()
@ManyToOne(() => Event, { onDelete: 'CASCADE' })
event!: Event;

@CreateDateColumn ({ type: 'timestamptz'})
created_at!: Date;

// " Je suis sur place" _ rempli seulment le jour J ; nullable ; jamais de coordonnées (RGPD )

@Column ({type: 'timestamptz',nullable: true})
present_at!: Date;
}
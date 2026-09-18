import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Check, Index } from "typeorm";
import { Event } from "./Event";

@Entity('groups')
// même décorateur que sur User (birth_date) — règle produit qui vit en base, pas juste dans le formulaire
@Check(`"max_participants" BETWEEN 4 AND 8`)
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index() // accélère "tous les groupes pour cet événement"
    @ManyToOne(() => Event, { onDelete: 'CASCADE' })
    event!: Event;

    @Column()
    name!: string;

    // la réponse de l'organisateur à la question d'accroche
    @Column({ nullable: true })
    description!: string;

    @Column()
    meeting_point!: string; // obligatoire par conception — pas de groupe sans point de rendez-vous

    @Column({ type: 'smallint', default: 6 })
    max_participants!: number; // défaut 6, plafond 8 (imposé par le @Check ci-dessus)

    @Column({ nullable: true })
    emblem_emoji!: string; // le "fanion" du groupe, pour se retrouver dans la foule

    @Column({ nullable: true })
    emblem_color!: string;
}

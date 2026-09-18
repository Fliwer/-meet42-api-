import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, Index, CreateDateColumn, Check } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity('group_members')
@Unique(['group', 'user']) // un membre ne rejoint pas deux fois le même groupe
// index unique PARTIEL : parmi les lignes "host", un seul par groupe — garanti par la base, pas par le code
@Index(['group'], { unique: true, where: `role = 'host'` })

// vérifie en base que "role" ne peut être QUE 'host' ou 'member' — deuxième protection, en plus du "default: 'member'"
@Check(`"role" IN ('host', 'member')`)
export class GroupMember {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // cette ligne de GroupMember appartient à CE groupe précis
    // onDelete: 'CASCADE' : si le groupe est supprimé, tous ses membres (lignes GroupMember) le sont aussi
    @ManyToOne(() => Group, { onDelete: 'CASCADE' })
    group!: Group;

    // cette même ligne appartient aussi à CET utilisateur précis
    @Index() // accélère "tous les groupes qu'un utilisateur a rejoints"
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user!: User;


    @Column({ default: 'member' }) // 'host' ou 'member' — l'hôte se lit ICI, nulle part ailleurs
    role!: string;

    @Column()
    intro!: string; // la phrase obligatoire pour rejoindre — NOT NULL, c'est voulu

    @Column({ type: 'timestamptz', nullable: true })
    confirmed_at!: Date; // confirmation de présence à J-1, nullable

    @CreateDateColumn({ type: 'timestamptz' })
    joined_at!: Date;
}

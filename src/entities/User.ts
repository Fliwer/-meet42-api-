import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users') // cette classe = la table "users" en base
export class User {
    @PrimaryGeneratedColumn('uuid') // id généré automatiquement par Postgres, en UUID plutôt qu'un nombre qui s'incrémente (pour ne pas laisser deviner le nombre d'utilisateurs)
    id!: string;

    @Column({ unique: true }) // deux comptes ne peuvent jamais partager le même email
    email!: string;

    @Column()
    password_hash!: string; // le hachage se fait dans le service d'inscription, AVANT de créer un User, jamais ici

    @Column()
    display_name!: string;

    @Column({ type: 'date' }) // 'date' précisé car le type TS "Date" gère aussi l'heure, alors qu'on ne veut que le jour
    birth_date!: Date;

    @Column({ nullable: true }) // nullable signifie facultatif à l'inscription
    bio!: string;

    @Column({ nullable: true })
    avatar_url!: string;

    @Column({ nullable: true })
    district!: string;

    @Column({ nullable: true })
    phone!: string;

    @Column({ type: 'enum', enum: ['femme', 'homme', 'autre'], nullable: true }) // liste fermée de valeurs ; facultatif car on informe, on ne filtre pas (DECISIONS.md)
    gender!: string;

    @Column({ type: 'timestamptz', nullable: true }) // date + fuseau horaire (Bruxelles change d'heure) ; vide = pas encore vérifié, remplie = vérifié depuis cette date
    verified_at!: Date;

    @CreateDateColumn() // remplie automatiquement par TypeORM à la création de la ligne
    created_at!: Date;

    @UpdateDateColumn() // remise à jour automatiquement à chaque modification de la ligne
    updated_at!: Date;
}

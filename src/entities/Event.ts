import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Unique, Index } from "typeorm";

@Entity('events') // cette classe = la table "events" en base
@Unique(['source', 'external_id']) // anti-doublon sur DEUX colonnes ensemble : rend l'ingestion(le processus qui va chercher les événements chez agenda.brussels et les enregistre dans notre base) rejouable (tu peux relancer ce script autant de fois que tu veux (tous les jours, ou juste pour tester), sans jamais créer de doublons.)
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    source!: string; // ex: "agenda-brussels"

    @Column()
    external_id!: string; // l'id de l'événement chez la source (ex: 5700026900)

    @Column({ unique: true })
    slug!: string; // URL publique indexable, générée par nous à l'ingestion

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ nullable: true })
    category!: string;

    @Index() // accélère les requêtes du type "événements après telle date"
    @Column({ type: 'timestamptz' })
    starts_at!: Date;

    @Column({ type: 'timestamptz', nullable: true })
    ends_at!: Date;

    @Column()
    venue_name!: string;

    @Column({ nullable: true })
    address!: string;

    @Column({ nullable: true })
    district!: string;

    @Column({ type: 'numeric', precision: 9, scale: 6 }) // précision ~10cm au sol, largement suffisant pour une carte
    latitude!: number;

    @Column({ type: 'numeric', precision: 9, scale: 6 })
    longitude!: number;

    @Column({ nullable: true })
    image_url!: string;

    @Column({ nullable: true })
    official_url!: string;

    @Column({ default: false })
    is_free!: boolean;

    @Column({ nullable: true })
    price_label!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;
}

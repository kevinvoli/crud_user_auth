import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Role } from "./role.entity";
import { Article } from "src/article/entities/article.entity";





@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "int",name: "id"})
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 180 })
  email: string;

  @Column("varchar", { name: "password", length: 255, select:true })
  password: string;

  @Column("varchar", { name: "nom", nullable: false, length: 255 })
  name: string | null;

  @Column("varchar", { name: "prenoms", nullable: false, length: 255 })
  prenoms: string | null;

  @Column("varchar", { name: "contacts", nullable: true, length: 50 })
  contacts: string | null;


  @Column({select:true})
  salt: string;

  @Column({default:false})
  isAdmin:boolean;

  // les role de lutilisateur 

  @OneToMany(()=> Article, (article)=> article.authorId)
  article: Article[]

  @ManyToOne(() => Role, (role) => role.users, { nullable: true, onDelete: 'SET NULL' })
  role: Role;

  @CreateDateColumn({type:'datetime',  name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type:'datetime', name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({type:'datetime', name: 'delected_at'})
  delectedAt:Date;

  @BeforeInsert()
private async hashPassword() {
this.password = await bcrypt.hash(this.password,this.salt);
}
async validatePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword).then(result => {
    console.log("resultar");
    
    return result
  }).catch(erreur=>{
    return erreur
  })
}

async passwordHash(password:string) {
  const passwords = await bcrypt.hash(password,this.salt);
  return passwords
}
}





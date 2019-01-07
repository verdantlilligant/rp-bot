import { GuildMember } from "discord.js";
import {
  BelongsToMany,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  HasMany,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  JSON,
  Model,
  STRING,
  TEXT
} from "sequelize";

import { Dict } from "../helpers/base";
import { ItemModel } from "../rooms/item";

import { sequelize } from "./connection";

/**
 * Database model corresponding to a Discord user
 * messages {Message[]}: a list of all the messages the user was was presnet in
 * sentMessages {Message[]}: a list of all the messages sent by this user
 * visitedLinks {Link[]}: a list of all the links this user has visited
 */
export class User extends Model {
  public static associations: {
    messages: BelongsToMany;
    sentMessages: HasMany;
    visitedLinks: BelongsToMany;
  };

  /** the Discord id of the corresponding user */
  public id: string;
  public inventory: Dict<ItemModel>;
  /** the display name of the corresponding Discord user */
  public name: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  public Messages: Message[];
  public addMessage: BelongsToManyAddAssociationMixin<Message, string>;
  public addMessages: BelongsToManyAddAssociationsMixin<Message, string>;
  public createMessage: BelongsToManyCreateAssociationMixin<Message>;
  public getMessages: BelongsToManyGetAssociationsMixin<Message>;
  public removeMessage: BelongsToManyRemoveAssociationMixin<Message, string>;
  public removeMessages: BelongsToManyRemoveAssociationsMixin<Message, string>;
  public setMessages: BelongsToManySetAssociationsMixin<Message, string>;

  public SentMessages: Message[];
  public addSentMessage: HasManyAddAssociationMixin<Message, string>;
  public addSentMessages: HasManyAddAssociationsMixin<Message, string>;
  public createSentMessage: HasManyCreateAssociationMixin<Message>;
  public getSentMessages: HasManyGetAssociationsMixin<Message>;
  public removeSentMessage: HasManyRemoveAssociationMixin<Message, string>;
  public removeSentMessages: HasManyRemoveAssociationsMixin<Message, string>;
  public setSentMessages: HasManySetAssociationsMixin<Message, string>;

  public visitedLinks: Link[];
  public addVisitedLink: BelongsToManyAddAssociationMixin<Link, string>;
  public addVisitedLinks: BelongsToManyAddAssociationsMixin<Link, string>;
  public countVisitedLinks: BelongsToManyCountAssociationsMixin;
  public createVisitedLink: BelongsToManyCreateAssociationMixin<Link>;
  public getVisitedLinks: BelongsToManyGetAssociationsMixin<Link>;
  public removeVisitedLink: BelongsToManyRemoveAssociationMixin<Link, string>;
  public removeVisitedLinks: BelongsToManyRemoveAssociationsMixin<Link, string>;
  public setVisitedLinks: BelongsToManySetAssociationsMixin<Link, string>;

  /**
   * Creates a User model from a Discord GuildMember
   * @param member the guild member corresponding to this User
   */
  public static async createFromMember(member: GuildMember):
                                       Promise<[User, boolean] | null> {

    if (!member.user.bot) {
      return User.findOrCreate({
        defaults: {
          name: member.displayName
        },
        where: {
          id: member.id
        }
      });
    } else {
      return null;
    }
  }
}

User.init({
  id: {
    primaryKey: true,
    type: STRING
  },
  inventory: {
    defaultValue: { },
    type: JSON
  },
  name: {
    allowNull: false,
    type: TEXT
  }
}, {
  sequelize
});

// tslint:disable-next-line:ordered-imports
import { Link } from "./link";
import { Message } from "./message";

User.hasMany(Message, {
  as: "SentMessages"
});

User.belongsToMany(Message, {
  through: "UserMessage"
});

User.belongsToMany(Link, {
  as: "visitedLinks",
  through: "Visitation"
});

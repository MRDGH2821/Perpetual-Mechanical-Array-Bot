import { Constants } from 'detritus-client';
import { RequestTypes } from 'detritus-client-rest';
import { Snowflake } from 'detritus-client/lib/constants';
import { ParsedArgs } from 'detritus-client/lib/interaction';
import { Member, User } from 'detritus-client/lib/structures';

export interface IEvent {
  event: Constants.ClientEvents | string;
  on?: boolean;
  once?: boolean;
  listener(payload?: any): any;
}

export interface AfterRoleCheck {
  exp: number;
  notes: string;
  role: Snowflake | string;
}
export interface GiveRoleArgs extends ParsedArgs {
  user?: Member;
  role?: Snowflake | string;
}

export interface TechArgs extends ParsedArgs {
  techs?: string;
}

export interface SimpleEmbed extends RequestTypes.CreateChannelMessageEmbed {}

export interface LeaderBoardArgs extends ParsedArgs {
  contestant?: User;
  category?: 'anemo-dmg-skill' | 'geo-dmg-skill' | 'electro-dmg-skill' | 'uni-dmg-n5';
  group_type?: 'solo' | 'open';
  score?: number;
  proof_link?: string;
}

export interface LeaderboardEntryOptions {
  elementCategory: 'anemo-dmg-skill' | 'geo-dmg-skill' | 'electro-dmg-skill' | 'uni-dmg-n5';
  proof: string;
  score: number;
  typeCategory: 'solo' | 'open';
  userID: User['id'];
}

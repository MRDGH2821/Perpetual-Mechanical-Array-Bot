import { ElementDamageCategories } from 'botTypes/types';
import { Constants } from 'detritus-client';
import { RequestTypes } from 'detritus-client-rest';
import { Snowflake } from 'detritus-client/lib/constants';
import { ParsedArgs } from 'detritus-client/lib/interaction';
import {
  Channel, InteractionEditOrRespond, Member, User,
} from 'detritus-client/lib/structures';
import { COLORS } from '../lib/Constants';

export interface BotEventOptions {
  event: Constants.ClientEvents | string;
  on?: boolean;
  once?: boolean;
  listener(...payload: any): any;
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

export interface SimpleEmbed extends RequestTypes.CreateChannelMessageEmbed {
  color: COLORS;
}

export interface LeaderBoardArgs extends ParsedArgs {
  contestant?: User;
  element_category?: ElementDamageCategories;
  type_category?: 'solo' | 'open';
  score?: number;
  proof_link?: string;
}

export interface EchoArgs extends ParsedArgs {
  channel?: Channel;
  text?: string;
  embed?: string;
  nadeko_json?: string;
}

export interface NadekoParseResult {
  content: RequestTypes.CreateMessage['content'] | InteractionEditOrRespond['content'];
  embeds: SimpleEmbed[];
}

export interface NadekoEmbed {
  title?: string;
  url?: string;
  description?: string;
  author?: {
    name?: 'string';
    icon_url?: 'string';
  };
  color?: string;
  footer?: {
    text?: string;
    icon_url?: string;
  };
  thumbnail?: string;
  image?: string;
  fields?: SimpleEmbed['fields'];
}
export interface NadekoContent {
  content?: string;
  embeds?: NadekoEmbed[];
}

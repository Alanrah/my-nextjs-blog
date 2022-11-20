import { IronSession } from 'iron-session';

export type ISession = IronSession & Record<string, any>;

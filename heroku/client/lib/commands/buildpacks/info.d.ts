import { Command } from '@heroku-cli/command';
export default class Info extends Command {
    static description: string;
    static args: {
        buildpack: import("@oclif/core/lib/interfaces/parser").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}

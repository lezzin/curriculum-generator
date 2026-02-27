export class UserConfig {
    constructor(
        public readonly id: string,
        public userId: string,
        public linkedin?: string,
        public github?: string,
        public portfolio?: string,
        public cellphone?: string,
    ) { }
}

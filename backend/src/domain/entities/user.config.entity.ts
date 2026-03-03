export class UserConfig {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public userId: string,
    public linkedin?: string,
    public github?: string,
    public portfolio?: string,
    public cellphone?: string,
  ) {}

  updateLinkedin(linkedin?: string) {
    this.linkedin = linkedin;
  }

  updateGithub(github?: string) {
    this.github = github;
  }

  updatePortfolio(portfolio?: string) {
    this.portfolio = portfolio;
  }

  updateCellphone(cellphone?: string) {
    this.cellphone = cellphone;
  }
}

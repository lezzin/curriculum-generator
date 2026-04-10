import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1775842198255 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);

        await queryRunner.query(`
            CREATE TYPE user_role AS ENUM ('user', 'admin');
        `);

        await queryRunner.query(`
            CREATE TYPE base_data_type AS ENUM ('resume', 'freelance-proposal');
        `);

        await queryRunner.query(`
            CREATE TYPE language AS ENUM ('PT', 'EN');
        `);

        await queryRunner.query(`
            CREATE TYPE selected_template AS ENUM ('default', 'classic', 'condensed');
        `);

        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR NOT NULL,
                email VARCHAR NOT NULL,
                picture VARCHAR NULL,
                password TEXT NULL,
                refresh_token TEXT NULL,
                role user_role NOT NULL DEFAULT 'user',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        await queryRunner.query(`
            CREATE TABLE users_providers (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                provider VARCHAR NOT NULL,
                provider_id VARCHAR NOT NULL,
                user_id UUID NOT NULL,
                CONSTRAINT fk_users_providers_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE users_config (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                linkedin_link TEXT NULL,
                github_link TEXT NULL,
                portfolio_link TEXT NULL,
                cellphone VARCHAR(15) NOT NULL,
                user_id UUID NOT NULL UNIQUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        await queryRunner.query(`
            CREATE TABLE users_base (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                description VARCHAR NOT NULL,
                type base_data_type NOT NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT users_base_user_type_unique UNIQUE (user_id, type)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE freelance_proposal (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                prompt VARCHAR NOT NULL,
                message TEXT NOT NULL,
                bid_amount INT NOT NULL,
                delivery_days INT NOT NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        await queryRunner.query(`
            CREATE TABLE resume (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                prompt VARCHAR NOT NULL,
                name VARCHAR NOT NULL,
                language language NOT NULL,
                role VARCHAR NOT NULL,
                summary VARCHAR NOT NULL,
                template selected_template NOT NULL,
                skills TEXT[] NOT NULL,
                experiences JSONB NOT NULL,
                projects JSONB NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS resume`);
        await queryRunner.query(`DROP TABLE IF EXISTS freelance_proposal`);
        await queryRunner.query(`DROP TABLE IF EXISTS users_base`);
        await queryRunner.query(`DROP TABLE IF EXISTS users_config`);
        await queryRunner.query(`DROP TABLE IF EXISTS users_providers`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);

        await queryRunner.query(`DROP TYPE IF EXISTS selected_template`);
        await queryRunner.query(`DROP TYPE IF EXISTS language`);
        await queryRunner.query(`DROP TYPE IF EXISTS base_data_type`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
    }
}

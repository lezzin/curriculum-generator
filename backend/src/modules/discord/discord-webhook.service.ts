import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DiscordWebhookService {
    private readonly logger = new Logger(DiscordWebhookService.name);
    private readonly webhookUrl: string | null;

    constructor(
        configService: ConfigService
    ) {
        this.webhookUrl = configService.get('DISCORD_WEBHOOK_URL') || null
    }

    async sendMessage(
        title: string,
        lines: string[]
    ): Promise<void> {
        if (!this.webhookUrl) {
            this.logger.error('Discord webhook URL is not set.');
            return;
        }

        try {
            const payload = {
                embeds: [
                    {
                        title,
                        color: 3447003,
                        description: lines.join('\n'),
                        timestamp: new Date().toISOString(),
                    },
                ],
            };

            await axios.post(this.webhookUrl, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            this.logger.error('Failed to send embed to Discord', error);
        }
    }
}

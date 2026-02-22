export const baseFreelance = {
    profile: {
        name: "Leandro Adrian",
        title: "Backend Developer | APIs, Microservices & Scalable Systems",
        location: "Brazil",
        positioning: `
Backend developer focused on building scalable APIs, SaaS platforms and high-performance systems.
Specialized in transforming slow or manual processes into automated and production-ready architectures.
Experience with digital products, subscription systems and payment integrations.
    `,
        market_focus: [
            "Startups",
            "Infoproduct creators",
            "Digital platforms",
            "SaaS products",
            "High-volume backend systems"
        ]
    },

    value_proposition: [
        "Build scalable REST APIs",
        "Design clean backend architectures",
        "Implement subscription and payment systems",
        "Optimize slow queries and heavy processes",
        "Refactor and modernize legacy systems",
        "Create production-ready SaaS backends"
    ],

    service_offerings: [
        "Backend development (Laravel / NestJS / Node.js)",
        "REST API design and implementation",
        "Stripe payment integration",
        "Subscription systems (monthly / yearly plans)",
        "Microservices architecture",
        "Queue systems (RabbitMQ / Redis)",
        "Database modeling and optimization",
        "Dockerized backend environments",
        "Fullstack applications (Vue.js)"
    ],

    technical_stack: {
        backend: ["PHP", "Laravel", "NestJS", "Node.js", "TypeScript", "CodeIgniter"],
        frontend: ["Vue.js", "Quasar", "Tailwind", "Bootstrap"],
        payments: ["Stripe", "Hotmart"],
        messaging: ["RabbitMQ", "Redis"],
        databases: ["MySQL", "PostgreSQL"],
        infrastructure: ["Docker", "Linux"],
        principles: ["Clean Architecture", "SOLID", "REST APIs", "Event-Driven Systems"]
    },

    business_domains: [
        "Financial systems",
        "EdTech",
        "Digital products",
        "Subscription SaaS",
        "Social platforms",
        "Productivity tools"
    ],

    freelance_projects: [
        {
            name: "Mentes em Flash",
            category: "E-commerce / Digital Product",
            tags: ["payment-integration", "hotmart", "digital-product", "fullstack"],
            problem: "Need for an independent platform to sell flashcards integrated with payment provider",
            solution: "Custom fullstack platform integrated with Hotmart for payment and affiliate management",
            stack: ["PHP", "CodeIgniter", "Vue.js", "MySQL"],
            business_model: "Digital product sales",
            delivery_scope: "Complete platform development"
        },

        {
            name: "Erupção das Letras",
            category: "Social Platform with Monetization",
            tags: ["stripe", "google-oauth", "marketplace", "social-network"],
            problem: "Create a platform where authors could publish, sell and receive financial support",
            solution: "Developed social platform with Stripe integration and Google authentication",
            stack: ["PHP", "CodeIgniter", "Stripe", "MySQL"],
            business_model: "Commission / direct sales",
            delivery_scope: "Complete platform development"
        },

        {
            name: "Chatbot - Mentes em Flash",
            category: "SaaS with Subscription Model",
            tags: ["saas", "subscription", "stripe", "recurring-payments"],
            problem: "Automate flashcard generation and implement recurring subscription model",
            solution: "Built chatbot system with monthly and yearly subscription using Stripe",
            stack: ["PHP", "CodeIgniter", "Vue.js", "Quasar", "Stripe", "MySQL"],
            business_model: "Recurring subscription (SaaS)",
            delivery_scope: "Complete SaaS application"
        },

        {
            name: "TaskFlow",
            category: "Productivity SaaS",
            tags: ["kanban", "saas", "task-manager", "firebase"],
            problem: "Improve task organization and planning",
            solution: "Kanban-based task manager with intelligent task suggestions",
            stack: ["Vue.js", "Firebase"],
            business_model: "SaaS",
            delivery_scope: "Web application"
        },

        {
            name: "Ferramentas para Devs",
            category: "Content Platform",
            tags: ["developer-tools", "admin-panel", "content-management"],
            problem: "Centralize useful development resources",
            solution: "Web platform with categorized resources and admin management",
            stack: ["Vue.js", "Quasar"],
            business_model: "Content platform",
            delivery_scope: "Web application"
        }
    ],

    corporate_experience: [
        {
            domain: "Financial Services",
            environment: "High-volume transactional system",
            highlights: [
                "Scaled asynchronous invoice processing to 100k+ invoices/day",
                "Reduced heavy report processing from 40 minutes to under 1 minute",
                "Implemented queue-based architecture using RabbitMQ and Redis",
                "Refactored NestJS microservices for maintainability"
            ],
            stack: ["Laravel", "NestJS", "RabbitMQ", "Redis", "PostgreSQL", "Docker"]
        }
    ],

    matching_rules: {
        prioritize_if_project_mentions: {
            stripe: ["Erupção das Letras", "Chatbot - Mentes em Flash"],
            subscription: ["Chatbot - Mentes em Flash"],
            saas: ["Chatbot - Mentes em Flash", "TaskFlow"],
            marketplace: ["Erupção das Letras"],
            hotmart: ["Mentes em Flash"],
            high_volume: ["Corporate Financial Experience"],
            async_processing: ["Corporate Financial Experience"]
        }
    },

    working_style: {
        communication: "Direct and technical",
        deadline_policy: "Realistic deadlines after scope alignment",
        delivery_standard: "Production-ready and maintainable code",
        approach: "Understand business logic before writing code"
    }
}
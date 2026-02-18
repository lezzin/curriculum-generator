export const baseResume = {
    name: "Leandro Adrian",
    role: "Backend Developer",
    location: "Brazil",
    seniority: "Backend Developer (Trainee / Junior)",
    summary:
        "Backend Developer with experience building scalable financial systems, asynchronous processing pipelines, and microservices. Strong focus on performance optimization, reliability, and business impact in high-volume environments.",

    core_competencies: [
        "Backend Architecture",
        "Asynchronous Processing",
        "Event-Driven Systems",
        "REST API Design",
        "Performance Optimization",
        "Queue Systems",
        "Microservices",
        "SQL Optimization",
        "System Refactoring",
        "Financial Systems"
    ],

    skills: {
        backend: [
            "PHP",
            "Laravel 11/12",
            "NestJS",
            "Node.js",
            "TypeScript",
            "CodeIgniter"
        ],
        architecture: [
            "Clean Architecture",
            "SOLID",
            "Microservices",
            "REST APIs",
            "Event-Driven Architecture"
        ],
        messaging: [
            "RabbitMQ",
            "Redis (Queues & Cache)",
            "Webhooks"
        ],
        databases: [
            "PostgreSQL",
            "MySQL",
            "Query Optimization",
            "Migrations"
        ],
        infrastructure: [
            "Docker",
            "Kubernetes (Pods, Services, CronJobs)",
            "Linux (Ubuntu)",
            "Git"
        ],
        storage: [
            "MinIO (Object Storage)"
        ],
        frontend: [
            "Vue.js",
            "Tailwind CSS",
            "Bootstrap"
        ]
    },

    achievements: [
        "Reduced report processing time by 97.5% (40 minutes → <1 minute)",
        "Built asynchronous billing system processing 100k+ invoices per day",
        "Eliminated DBA dependency for manual report exports",
        "Improved operational reliability in financial systems"
    ],

    experiences: [
        {
            title: "Backend Developer Trainee",
            company: "Ágil Empréstimos",
            period: "Apr 2025 - Present",
            environment: "High-volume financial services environment",
            technologies: [
                "Laravel",
                "NestJS",
                "RabbitMQ",
                "Redis",
                "PostgreSQL",
                "MinIO",
                "Docker"
            ],
            highlights: [
                "Designed and scaled asynchronous invoice processing system handling 100k+ invoices/day",
                "Migrated synchronous report generation to queue-based architecture",
                "Reduced processing time from 40 minutes to under 1 minute",
                "Refactored WhatsApp microservice using NestJS",
                "Maintained and improved legacy systems"
            ]
        }
    ],

    projects: [
        {
            name: "Asynchronous Invoice Dispatch System",
            impact: "Reduced operational risk and improved financial collection efficiency",
            scale: "100k+ invoices/day",
            architecture: "Queue-based, event-driven processing",
            technologies: ["Laravel", "RabbitMQ", "Redis", "MinIO"]
        },
        {
            name: "Async Report Processing API",
            impact: "97.5% performance improvement",
            architecture: "Redis queues + streaming file generation",
            technologies: ["Laravel", "Redis", "MinIO"]
        },
        {
            name: "WhatsApp Microservice Refactor",
            impact: "Enabled non-technical team to manage templates",
            architecture: "Microservice + external API integration",
            technologies: ["NestJS", "TypeScript", "Redis"]
        }
    ]
}

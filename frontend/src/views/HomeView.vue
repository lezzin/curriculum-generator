<template>
  <div class="text-black pt-[68px] dark:text-zinc-50 bg-gray-50 dark:bg-zinc-950 overflow-x-hidden relative z-10">
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0" style="
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%);
        "
        :style="isDark ? 'background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);' : ''">
      </div>

      <div class="absolute rounded-full blur-[80px] opacity-25 w-[600px] h-[400px] bg-[#22c55e] -top-24 -right-24">
      </div>

      <div class="absolute rounded-full blur-[80px] opacity-15 w-[400px] h-[300px] bg-[#86efac] top-48 -left-12"></div>
    </div>

    <section
      class="max-w-5xl min-h-screen mx-auto grid grid-cols-1 md:grid-cols-2 place-items-center gap-24 px-4 md:px-0">
      <div class="relative z-10 max-w-[560px] text-center lg:text-left">
        <div
          class="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-700 dark:text-green-400 text-[0.8rem] font-medium px-[14px] py-[6px] rounded-full mb-6 tracking-[0.01em]">
          <span class="w-[7px] h-[7px] bg-green-500 rounded-full animate-pulse"></span>
          Otimizado para sistemas ATS
        </div>

        <h1
          class="lp-font text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter m-0 mb-5 text-zinc-900 dark:text-zinc-50">
          Um currículo base.<br />
          <span class="text-green-700 dark:text-green-500">Infinitas candidaturas.</span>
        </h1>

        <p class="text-md leading-relaxed text-gray-500 dark:text-zinc-400 mb-8">
          Cadastre seu perfil profissional uma vez e gere currículos personalizados para cada vaga — adaptados à
          descrição do trabalho e otimizados para passar pelos filtros ATS.
        </p>

        <div class="flex items-center gap-4 mb-12 flex-wrap justify-center lg:justify-start">
          <BaseButton size="lg" as="router-link" :to="{ name: 'Profile' }"
            class="!inline-flex !items-center !gap-2 !bg-green-700 dark:!bg-green-600 !text-white !border-0 !font-semibold !tracking-[-0.01em] hover:!bg-green-800 dark:hover:!bg-green-500 hover:!-translate-y-px hover:!shadow-[0_8px_24px_rgba(22,163,74,0.3)] !transition-all !duration-200">
            Criar meu currículo base
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </BaseButton>
          <a href="#como-funciona"
            class="text-gray-700 dark:text-zinc-300 text-[0.95rem] font-medium no-underline inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-green-700 dark:hover:text-green-400">
            Ver como funciona
          </a>
        </div>
      </div>

      <div class="relative z-10 hidden lg:flex items-center ms-20">
        <div
          class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] relative w-[220px] flex-shrink-0 animate-[float_4s_ease-in-out_infinite]">
          <div
            class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0a0e14] dark:bg-zinc-50 text-white dark:text-zinc-900 text-[0.6rem] font-semibold px-2.5 py-[3px] rounded-full whitespace-nowrap tracking-[0.03em]">
            Currículo Base
          </div>
          <div class="flex gap-3 items-center mb-4">
            <div class="w-9 h-9 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex-shrink-0"></div>
            <div class="flex-1 flex flex-col gap-1.5">
              <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[85%]"></div>
              <div class="h-1.5 rounded-full bg-green-200/50 dark:bg-green-900/30 w-[65%]"></div>
            </div>
          </div>
          <div class="mb-3.5">
            <div class="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-gray-400 mb-2">
              Resumo Profissional
            </div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-full mb-1"></div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[85%] mb-1"></div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[65%]"></div>
          </div>
          <div>
            <div class="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-gray-400 mb-2">Habilidades</div>
            <div class="flex flex-wrap gap-1">
              <span
                class="text-[0.6rem] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-[7px] py-[2px] rounded-full font-medium">Vue.js</span>
              <span
                class="text-[0.6rem] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-[7px] py-[2px] rounded-full font-medium">TypeScript</span>
              <span
                class="text-[0.6rem] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-[7px] py-[2px] rounded-full font-medium">Node.js</span>
              <span
                class="text-[0.6rem] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-[7px] py-[2px] rounded-full font-medium">+12</span>
            </div>
          </div>
        </div>

        <div class="w-[120px] flex-shrink-0">
          <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
            <path d="M10 40 L60 40 L60 10 L110 10" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4 3"
              opacity="0.6" />
            <path d="M60 40 L110 70" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
            <circle cx="110" cy="10" r="3" fill="#22c55e" opacity="0.8" />
            <circle cx="110" cy="70" r="3" fill="#22c55e" opacity="0.8" />
          </svg>
        </div>

        <div class="flex flex-col gap-3">
          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] w-[180px] animate-[float_4s_ease-in-out_infinite]">
            <div
              class="text-[0.65rem] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2 py-[2px] rounded-full mb-2.5 inline-block">
              Vaga Frontend
            </div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[65%] mb-1"></div>
            <div class="h-1.5 rounded-full bg-green-300/40 dark:bg-green-800/30 w-[85%] mb-1"></div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[45%]"></div>
            <div class="flex items-center gap-1.5 mt-2.5 text-[0.6rem] font-semibold text-gray-500 dark:text-zinc-400">
              <span>ATS</span>
              <div class="flex-1 h-[5px] bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-green-700 rounded-full" style="width: 92%"></div>
              </div>
              <span>92%</span>
            </div>
          </div>
          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] w-[180px] animate-[float_4s_ease-in-out_infinite_0.8s]">
            <div
              class="text-[0.65rem] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2 py-[2px] rounded-full mb-2.5 inline-block">
              Vaga Backend
            </div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[65%] mb-1"></div>
            <div class="h-1.5 rounded-full bg-green-300/40 dark:bg-green-800/30 w-[85%] mb-1"></div>
            <div class="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 w-[45%]"></div>
            <div class="flex items-center gap-1.5 mt-2.5 text-[0.6rem] font-semibold text-gray-500 dark:text-zinc-400">
              <span>ATS</span>
              <div class="flex-1 h-[5px] bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-green-700 rounded-full" style="width: 87%"></div>
              </div>
              <span>87%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="como-funciona"
      class="px-8 lg:px-24 py-28 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
      <div class="max-w-[900px] mx-auto">
        <div class="text-center mb-16">
          <p class="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-green-700 dark:text-green-500 mb-3">
            Processo simples</p>
          <h2
            class="lp-font text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold tracking-[-0.03em] text-[#0a0e14] dark:text-zinc-50 mb-4">
            Como funciona
          </h2>
          <p class="text-gray-500 dark:text-zinc-400 text-base font-light">Do seu perfil ao currículo ideal em poucos
            passos</p>
        </div>

        <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-0">
          <div class="flex-1 flex flex-col items-center text-center">
            <div class="lp-font text-[0.75rem] font-extrabold text-green-400 tracking-[0.05em] mb-3">01</div>
            <div
              class="w-14 h-14 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 class="lp-font text-base font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.01em]">Cadastre
              seu perfil base</h3>
            <p class="text-[0.875rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
              Adicione seu resumo profissional, experiências, habilidades e projetos. Isso é feito uma única vez e serve
              de base para todos os currículos.
            </p>
          </div>

          <div class="flex items-center justify-center lg:mt-[35px] flex-shrink-0 w-10 lg:w-[60px]">
            <div class="w-full h-px lg:block hidden" style="
                background: repeating-linear-gradient(90deg, #22c55e 0, #22c55e 4px, transparent 4px, transparent 10px);
                opacity: 0.5;
              "></div>
            <div class="h-10 w-px lg:hidden" style="
                background: repeating-linear-gradient(
                  180deg,
                  #22c55e 0,
                  #22c55e 4px,
                  transparent 4px,
                  transparent 10px
                );
                opacity: 0.5;
              "></div>
          </div>

          <div class="flex-1 flex flex-col items-center text-center">
            <div class="lp-font text-[0.75rem] font-extrabold text-green-400 tracking-[0.05em] mb-3">02</div>
            <div
              class="w-14 h-14 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <h3 class="lp-font text-base font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.01em]">Cole a
              descrição da vaga</h3>
            <p class="text-[0.875rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
              Copie e cole a descrição da vaga que você deseja se candidatar. Nossa IA analisa os requisitos e
              palavras-chave importantes para o ATS.
            </p>
          </div>

          <div class="flex items-center justify-center lg:mt-[35px] flex-shrink-0 w-10 lg:w-[60px]">
            <div class="w-full h-px lg:block hidden" style="
                background: repeating-linear-gradient(90deg, #22c55e 0, #22c55e 4px, transparent 4px, transparent 10px);
                opacity: 0.5;
              "></div>
            <div class="h-10 w-px lg:hidden" style="
                background: repeating-linear-gradient(
                  180deg,
                  #22c55e 0,
                  #22c55e 4px,
                  transparent 4px,
                  transparent 10px
                );
                opacity: 0.5;
              "></div>
          </div>

          <div class="flex-1 flex flex-col items-center text-center">
            <div class="lp-font text-[0.75rem] font-extrabold text-green-400 tracking-[0.05em] mb-3">03</div>
            <div
              class="w-14 h-14 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 class="lp-font text-base font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.01em]">
              Receba seu currículo otimizado
            </h3>
            <p class="text-[0.875rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
              A IA gera um currículo personalizado, reorganizando e adaptando seu perfil para maximizar a
              compatibilidade com a vaga e os filtros ATS.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-8 lg:px-24 py-28 bg-[#fafaf9] dark:bg-zinc-950">
      <div class="max-w-[900px] mx-auto">
        <div class="text-center mb-16">
          <p class="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-green-700 dark:text-green-500 mb-3">Por
            que usar</p>
          <h2
            class="lp-font text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold tracking-[-0.03em] text-[#0a0e14] dark:text-zinc-50">
            Tudo o que você precisa para se destacar
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[20px] p-8 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div
                class="w-[52px] h-[52px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[14px] flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 class="lp-font text-[1.1rem] font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.02em]">
                Otimização ATS inteligente
              </h3>
              <p class="text-[0.9rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
                Currículos que passam pelos sistemas de rastreamento de candidatos (ATS) com taxa de compatibilidade
                elevada, garantindo que seu currículo seja visto por recrutadores.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-6">
              <div class="flex flex-col gap-3">
                <div class="text-[0.8rem] font-semibold text-gray-700 dark:text-zinc-300">Compatibilidade ATS</div>
                <div class="h-2.5 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-green-300 via-green-400 to-green-700 rounded-full flex items-center justify-end pr-1"
                    style="width: 91%">
                    <span class="text-[0.6rem] font-bold text-white">91%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[20px] p-8 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5">
            <div
              class="w-[52px] h-[52px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[14px] flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 class="lp-font text-[1.1rem] font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.02em]">Geração
              em segundos</h3>
            <p class="text-[0.9rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
              Sem perder tempo formatando manualmente. A IA gera seu currículo personalizado em instantes.
            </p>
          </div>

          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[20px] p-8 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5">
            <div
              class="w-[52px] h-[52px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[14px] flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <h3 class="lp-font text-[1.1rem] font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.02em]">
              Perfil base centralizado
            </h3>
            <p class="text-[0.9rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
              Cadastre suas informações uma vez. A IA adapta e reordena o conteúdo para cada vaga específica.
            </p>
          </div>

          <div
            class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[20px] p-8 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 lg:col-span-2">
            <div
              class="w-[52px] h-[52px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[14px] flex items-center justify-center text-green-700 dark:text-green-400 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 class="lp-font text-[1.1rem] font-bold text-[#0a0e14] dark:text-zinc-50 mb-2 tracking-[-0.02em]">
              Foco nos keywords da vaga
            </h3>
            <p class="text-[0.9rem] text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
              A IA identifica as palavras-chave e competências da descrição da vaga e as incorpora naturalmente no
              currículo.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative px-8 lg:px-24 py-28 text-center overflow-hidden bg-[#0a0e14] dark:bg-black">
      <div class="absolute inset-0 z-0">
        <div
          class="absolute w-[600px] h-[400px] bg-green-500 rounded-full blur-[120px] opacity-[0.12] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        </div>
      </div>
      <div class="relative z-10 max-w-[600px] mx-auto">
        <h2 class="lp-font text-[clamp(2rem,4vw,3rem)] font-extrabold text-white tracking-[-0.03em] mb-4">
          Pronto para candidaturas mais inteligentes?
        </h2>
        <p class="text-gray-400 text-base mb-10 font-light">
          Cadastre seu perfil base hoje e gere currículos otimizados para cada oportunidade.
        </p>
        <BaseButton size="lg" as="router-link" :to="{ name: 'ResumeGenerate' }"
          class="!inline-flex !items-center !gap-2 !bg-green-400 dark:!bg-green-500 !text-[#0a0e14] !border-0 !font-bold !tracking-[-0.01em] hover:!bg-green-700 hover:!text-white hover:!-translate-y-0.5 hover:!shadow-[0_12px_32px_rgba(34,197,94,0.25)] !transition-all !duration-200">
          Começar gratuitamente
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../components/ui/BaseButton.vue';
import { useTheme } from '../composables/useTheme';
const { isDark } = useTheme();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

.lp-font {
  font-family: 'Bricolage_Grotesque', sans-serif;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}
</style>

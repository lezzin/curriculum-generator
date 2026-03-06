import type { RouteRecordRaw } from 'vue-router';
import ResumeGeneratorView from '../views/resume/ResumeGeneratorView.vue';
import ResumeHistoryView from '../views/resume/ResumeHistoryView.vue';
import FreelanceView from '../views/freelance/FreelanceView.vue';
import FreelanceHistoryView from '../views/freelance/FreelanceHistoryView.vue';
import ProfileView from '../views/auth/ProfileView.vue';
import ReportView from '../views/report/ReportView.vue';
import ReportSolicitationView from '../views/report/ReportSolicitationView.vue';

export const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
      },
    ],
  },

  {
    path: '/resume',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'generate',
        name: 'ResumeGenerate',
        component: ResumeGeneratorView,
      },
      {
        path: 'history',
        name: 'ResumeHistory',
        component: ResumeHistoryView,
      },
    ],
  },

  {
    path: '/freelance/proposal',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'generate',
        name: 'FreelanceProposalGenerate',
        component: FreelanceView,
      },
      {
        path: 'history',
        name: 'FreelanceProposalHistory',
        component: FreelanceHistoryView,
      },
    ],
  },

  {
    path: '/report',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'HomeReport',
        component: ReportView,
      },
      {
        path: 'solicitation',
        name: 'ReportSolicitation',
        component: ReportSolicitationView,
      },
    ],
  },
];

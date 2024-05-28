const PATH = {
  root: '/list-account',
  auth: {
    login: '/auth/login',
    forgotPassword: '/auth/forgot-password',
    sendLinkConfirm: '/auth/send-link-confirm',
    resetPassword: '/auth/reset-password',
  },
  organization: {
    list: '/list-organization',
    create: '/create-organization',
    edit: (id: string) => `/edit-organization/${id}`,
  },
  address: {
    list: '/list-address',
    create: '/create-address',
    edit: (id: string) => `/edit-address/${id}`,
  },
  category: {
    list: '/list-category',
    create: '/create-category',
    edit: (id: string) => `/edit-category/${id}`,
  },
  coordinator: {
    list: '/list-coordinator',
    create: '/create-coordinator',
    edit: (id: string) => `/edit-coordinator/${id}`,
  },
  notification: {
    list: '/list-notification',
    create: '/create-notification',
    edit: (id: string) => `/edit-notification/${id}`,
  },
  question: {
    list: '/list-question',
    create: '/create-question',
    edit: (id: string) => `/edit-question/${id}`,
  },
  account: {
    list: '/list-account',
    create: '/create-account',
    edit: (id: string) => `/edit-account/${id}`,
  },
  recruitment: {
    list: {
      prepare: '/list-recruitment/prepare',
      public: '/list-recruitment/public',
      finish: '/list-recruitment/finish',
    },
    detail: {
      prepare: (id: string) => `/detail-recruitment/${id}/prepare`,
      public: (id: string) => `/detail-recruitment/${id}/public`,
      finish: (id: string) => `/detail-recruitment/${id}/finish`,
    },
    edit: {
      prepare: (id: string) => `/detail-recruitment/${id}/prepare/edit`,
    },
  },
  registrant: {
    list: '/list-registrant',
    edit: (id: string) => `/edit-registrant/${id}`,
  },
  event: {
    list: {
      prepare: '/list-event/prepare',
      public: '/list-event/public',
      finish: '/list-event/finish',
    },
    detail: {
      prepare: (id: string) => `/detail-event/${id}/prepare`,
      public: (id: string) => `/detail-event/${id}/public`,
      finish: (id: string) => `/detail-event/${id}/finish`,
    },
    edit: {
      prepare: (id: string) => `/detail-event/${id}/prepare/edit`,
    },
  },
}

export default PATH

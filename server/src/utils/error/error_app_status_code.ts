export const Client = {
  notFoundAuthorization: 'notFoundAuthorization',
  methodNotAllowed: 'notFoundAuthorization',
  notFound: 'notFound',
  invalidToken: 'invalidToken',
  invalidRequest: 'invalidRequest',
} as const

export const Server = {
  unexpected: 'unexpected',
} as const

export const AppErrorCode = {
  Client,
  Server,
}

export type ValuesOf<T> = T[keyof T]
export type AppErrorCodeType = ValuesOf<typeof Client> | ValuesOf<typeof Server>

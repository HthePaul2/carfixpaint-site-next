import type { Access, FieldAccess } from 'payload'

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const publicReadActiveServices: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    active: {
      equals: true,
    },
  }
}

export const publicReadApprovedReviews: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    approved: {
      equals: true,
    },
  }
}

export const publicReadPublishedFaqs: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    published: {
      equals: true,
    },
  }
}

export const contactRequestAuthenticatedRead: Access = ({ req: { user } }) => Boolean(user)

export const contactRequestAdminDelete: Access = ({ req: { user } }) => user?.role === 'admin'

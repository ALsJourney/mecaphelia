export const homePath = () => "/";

export const ticketsPath = () => "/tickets" as const;

export const ticketPath = (ticketId: string) =>
  `${ticketsPath()}/${ticketId}` as const;

export const ticketEditPath = (ticketId: string) =>
  `${ticketPath(ticketId)}/edit`;

export const signUpPath = () => "/sign-up" as const;

export const signInPath = () => "/sign-in" as const;

export const passwordResetPath = () => "/password-forgot" as const;

export const accountProfilePath = () => "/account/profile" as const;
export const accountPasswordPath = () => "/account/password" as const;

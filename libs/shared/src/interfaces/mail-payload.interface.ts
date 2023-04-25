export interface IMailPayload {
  template: string;
  payload: {
    emails: [string];
    data: {
      firstName: string;
      lastName: string;
    };
    subject: string;
  };
}

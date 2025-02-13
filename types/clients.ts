export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership: string;
  accountType: string;
  profilePicture: string;
  classes: Class[];
  membershipTab: MembershipTab;
  detailsTab: DetailsTab;
}

export interface Class {
  date: string;
  time: string;
  classTitle: string;
  facility: string;
}

export interface MembershipTab {
  // properties
}

export interface DetailsTab {
  // properties
}
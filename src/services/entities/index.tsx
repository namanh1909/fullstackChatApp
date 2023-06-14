export type RootStackParamsList = {
  Login: undefined;
  Splash: undefined;
  Home: undefined;
  Auth: undefined;
  UnAuth: undefined;
  Mention: undefined;
  RoomChat: undefined;
};

export type user = {
  id: string;
  name: string;
  photoURL: string;
};

export type RoomChat = {
  name: string;
  members: Array<user>;
};

export type MessageType = {
  id: string;
  typeName: string;
};

export type userType = {
  data: {
    id: string;
    name: string;
    photoURL: string;
  };
  id: string;
};

export type dataType = {
  member: Array<user>;
  name: string;
};

export type ChatRoom = {
  id: string;
  data: dataType;
};

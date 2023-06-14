
export const userSchema = {
    name: "Users",
    embedded: true,
    properties: {
        id: "string",
        name: "string",
        photoURL: "string"
    },
}

export const typeMessageSchema = {
    name: "Type",
    embedded: true,
    properties: {
        id: "int",
        name: "string",
    },
    embedded: true,

}

export const ChatRoomSchema = {
    name: "ChatRoom",
    primary_key: "id",
    properties: {
        id: "string",
        name: "string",
        members: { type: "list", objectType: "Users" },
        messages: "Message[]",
    },
}

export const mentionsSchema = {
    name: "Mentions",
    primary_key: "id",
    properties: {
        id: "string",
        mentioned: 'Users',
        messages: 'string',
        nameGroup: 'string',
        roomChatID: 'string',
        mentions: 'Users[]'
    }
}

export const messageSchema = {
    name: "Message",
    primary_key: "id",
    properties: {
        id: "string",
        sender: "Users",
        type: "Type",
        time: "int",
        content: "string"
    }
}
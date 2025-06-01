export interface IListWork {
    works: {
        title: string
        imagePatch: string
        linkPatch: string
    }
    error?: string | null

}

export interface IUserData {
    email: string
    error: string | null

}

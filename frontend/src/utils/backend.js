export const page_limit = 10
export const book_limit = 20
export const waitBeforeUpdatePage = 500




export function loginBackend(username, password) {
    const payload = JSON.stringify({
        "username": username,
        "password": password,
    })
    return fetch(`${process.env.REACT_APP_BACKEND}/login`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("login res", response)
        return response.json()
    }).catch(e => console.log(e))

}


export function getAllUsers(uid) {
    const payload = JSON.stringify({
        "uid": uid,
    })
    return fetch(`${process.env.REACT_APP_BACKEND}/users`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("login res", response)
        return response.json()
    }).catch(e => console.log(e))

}

export function createNewUser(username, password, is_admin) {
    const payload = JSON.stringify({
        "username": username,
        "password": password,
        "is_admin": is_admin
    })
    return fetch(`${process.env.REACT_APP_BACKEND}/users/create`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("login res", response)
        return response.json()
    }).catch(e => console.log(e))

}



export function deleteUser(uid) {
    const payload = JSON.stringify({
        "uid": uid
    })
    return fetch(`${process.env.REACT_APP_BACKEND}/users/delete`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("login res", response)
        return response.json()
    }).catch(e => console.log(e))

}




export const getBooksFromBackend = (lastBookId, uid, book_limit) => {
    const payload = JSON.stringify({
        "start_book_id": lastBookId,
        "limit": book_limit,
        "user_id": uid
    })
    // console.log("get books payload", payload)
    return fetch(`${process.env.REACT_APP_BACKEND}/books`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("get books res", response)
        if (response) return response.json()
        else return []

    }).catch(e => console.log(e))

}

export const getCurrentBooksFromBackend = (lastBookId, uid, book_limit) => {
    const payload = JSON.stringify({
        "last_id": lastBookId,
        "limit": book_limit,
        "user_id": uid
    })
    // console.log("get books payload", payload)
    return fetch(`${process.env.REACT_APP_BACKEND}/books/current`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("get books res", response)
        if (response) return response.json()
        else return []

    }).catch(e => console.log(e))

}


export const getBookById = (book_id, uid) => {
    const payload = JSON.stringify({
        "user_id": uid
    })

    return fetch(`${process.env.REACT_APP_BACKEND}/book/${book_id}`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("get books res", response)
        if (response) return response.json()
        else return []

    }).catch(e => console.log(e))
}



export const getBookPages = (book_id, uid, page_no, limit = page_limit) => {
    const payload = JSON.stringify({
        "limit": limit,
        "uid": uid
    })

    return fetch(`${process.env.REACT_APP_BACKEND}/book/${book_id}/${page_no}`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("get books res", response)
        if (response) return response.json()
        else return []

    }).catch(e => console.log(e))
}



export const setProgressOnBackend = async (book_id, progress, uid) => {
    const payload = JSON.stringify({
        "user_id": uid,
        "book_id": book_id,
        "progress": progress
    })

    return fetch(`${process.env.REACT_APP_BACKEND}/user/progress`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then(async (response) => {

        if (response) {
            const j = await response.json()
            console.log("set progress", j)
            return j
        }
        else return []

    }).catch(e => console.log(e))
}

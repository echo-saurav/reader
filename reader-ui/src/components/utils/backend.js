
import { API } from "./Variables";

export const page_limit = 5
export const book_limit = 20

export const signIn = (username, password) => {
    const payload = JSON.stringify({
        "username": username,
        "password": password
    })
    // console.log("login payload", payload)
    return fetch(`${API}/signin`, {
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
export const login = (username, password) => {
    const payload = JSON.stringify({
        "username": username,
        "password": password
    })
    // console.log("login payload", payload)
    return fetch(`${API}/login`, {
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

export const setProgressToBackend = (book_id, uid, progress) => {
    if (!(book_id && uid && progress)) return

    const payload = JSON.stringify({
        "user_id": uid,
        "progress": progress,
        "book_id": book_id
    })

    return fetch(`${API}/user/progress`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {

        return response.json()
    }).catch(e => console.log(e))

}


export const getBooksFromBackend = (book_id, uid) => {
    const payload = JSON.stringify({
        "start_book_id": book_id,
        "limit": book_limit,
        "user_id": uid
    })
    // console.log("get books payload", payload)
    return fetch(`${API}/books`, {
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

export const getBookFromBackend = (book_id, uid) => {
    const payload = JSON.stringify({
        "book_id": book_id,
        "user_id": uid
    })
    // console.log("get book payload", payload)
    return fetch(`${API}/book/${book_id}`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("get book res", response)
        return response.json()
    }).catch(e => console.log(e))

}

export const getPageFromBackend = (book_id, page_no, limit = page_limit) => {
    const payload = JSON.stringify({
        "page_no": page_no,
        "book_id": book_id,
        "limit": limit
    })
    console.log("get page payload", payload)
    return fetch(`${API}/book/${book_id}/${page_no}`, {
        method: "POST",
        body: payload,
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("get page res", response)
        return response.json()
    }).catch(e => console.log(e))
}

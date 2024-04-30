export const page_limit = 10
export const book_limit = 20
export const waitBeforeUpdatePage= 500


export function getTest() {
    return fetch(`${process.env.REACT_APP_BACKEND}/test`, {
        method: "GET",
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



export const getBookPages = (book_id, uid, page_no, limit=page_limit) => {
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


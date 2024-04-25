
export  function getTest(){
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

export const getBooksFromBackend = (lastBookId, uid,book_limit) => {
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


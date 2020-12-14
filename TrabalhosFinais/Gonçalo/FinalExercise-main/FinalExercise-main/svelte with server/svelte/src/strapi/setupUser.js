function setupUser(response) {
    const {jwt} = response.data
    const {username} = response.data.user
    const user = {username,jwt}

    localStorage.setItem('user', JSON.stringify(user))

}

export default setupUser
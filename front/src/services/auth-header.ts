export default function authHeader() {
    let storedUser:any = localStorage.getItem('user')
    let user = JSON.parse(storedUser)
    if (user && user.JWT) {
        return { Authorization: 'Bearer ' + user.JWT };
    } else {
        return { Authorization: '' };
    }
}